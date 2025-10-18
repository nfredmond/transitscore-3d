'use client'

import { useState } from 'react'
import { Search, Loader2, AlertCircle } from 'lucide-react'
import LoadingProgress from './LoadingProgress'

interface AddressSearchProps {
  onAddressSelect: (data: {
    lat: number
    lng: number
    address: string
    amenities: any[]
    scores: any
    recommendation: string
    walkIsochrones?: any
    bikeIsochrones?: any
  }) => void
}

const LOADING_STEPS = [
  { id: 'geocode', label: 'Geocoding address...', duration: 1000 },
  { id: 'amenities', label: 'Fetching nearby amenities...', duration: 2000 },
  { id: 'isochrones', label: 'Calculating network accessibility...', duration: 3000 },
  { id: 'analysis', label: 'Generating AI recommendations...', duration: 2000 }
]

export default function AddressSearch({ onAddressSelect }: AddressSearchProps) {
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  const MAX_RETRIES = 2

  const fetchWithRetry = async (url: string, options: RequestInit = {}, retries = 0): Promise<Response> => {
    try {
      const response = await fetch(url, options)
      
      // If rate limited, show specific error
      if (response.status === 429) {
        const data = await response.json()
        throw new Error(`Rate limit exceeded. Please wait ${data.retryAfter || 60} seconds and try again.`)
      }
      
      // If server error, retry
      if (response.status >= 500 && retries < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (retries + 1))) // Exponential backoff
        return fetchWithRetry(url, options, retries + 1)
      }
      
      return response
    } catch (err) {
      // Network error, retry
      if (retries < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (retries + 1))) // Exponential backoff
        return fetchWithRetry(url, options, retries + 1)
      }
      throw err
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address.trim()) return

    setLoading(true)
    setCurrentStep(0)
    setError('')

    try {
      // Step 1: Geocode the address
      setCurrentStep(0)
      const geocodeRes = await fetchWithRetry(`/api/geocode?address=${encodeURIComponent(address)}`)
      if (!geocodeRes.ok) {
        const errorData = await geocodeRes.json()
        throw new Error(errorData.error || 'Failed to geocode address')
      }
      const geocodeData = await geocodeRes.json()

      // Step 2: Fetch nearby amenities
      setCurrentStep(1)
      const amenitiesRes = await fetchWithRetry(
        `/api/amenities?lat=${geocodeData.lat}&lng=${geocodeData.lng}`
      )
      if (!amenitiesRes.ok) {
        throw new Error('Failed to fetch amenities')
      }
      const amenitiesData = await amenitiesRes.json()

      // Step 3: Fetch isochrones (parallel for better performance)
      setCurrentStep(2)
      const [walkIsoRes, bikeIsoRes] = await Promise.all([
        fetchWithRetry(`/api/isochrone?lat=${geocodeData.lat}&lng=${geocodeData.lng}&mode=walk`),
        fetchWithRetry(`/api/isochrone?lat=${geocodeData.lat}&lng=${geocodeData.lng}&mode=bike`)
      ])
      
      const walkIsoData = await (walkIsoRes.ok ? walkIsoRes.json() : Promise.resolve({ isochrones: null }))
      const bikeIsoData = await (bikeIsoRes.ok ? bikeIsoRes.json() : Promise.resolve({ isochrones: null }))
      
      // Debug logging for isochrone data
      if (process.env.NODE_ENV === 'development') {
        console.log('Walk isochrones:', walkIsoData)
        console.log('Bike isochrones:', bikeIsoData)
      }

      // Step 4: Get AI analysis
      setCurrentStep(3)
      const analysisRes = await fetchWithRetry('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: geocodeData.address,
          lat: geocodeData.lat,
          lng: geocodeData.lng,
          amenities: amenitiesData.amenities
        })
      })
      if (!analysisRes.ok) {
        throw new Error('Failed to analyze site')
      }
      const analysisData = await analysisRes.json()

      // Complete!
      setCurrentStep(4)

      // Pass all data to parent including isochrones
      // Pass the full data object so MapView can handle both formats
      onAddressSelect({
        lat: geocodeData.lat,
        lng: geocodeData.lng,
        address: geocodeData.address,
        amenities: amenitiesData.amenities,
        scores: analysisData.scores,
        recommendation: analysisData.recommendation,
        walkIsochrones: walkIsoData,  // Pass full object { isochrones: [...], mode: 'walk' }
        bikeIsochrones: bikeIsoData   // Pass full object { isochrones: [...], mode: 'bike' }
      })
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
      setCurrentStep(0)
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter California address (e.g., 1075 W Capitol Ave, West Sacramento, CA)"
            className="w-full pl-12 pr-32 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-sacramento-blue dark:focus:border-sacramento-gold focus:outline-none text-lg transition-colors shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !address.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-sacramento-blue text-white px-6 py-2 rounded-lg font-medium hover:bg-sacramento-darkblue hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center space-x-2 animate-pulse-subtle"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <span>Analyze Site</span>
            )}
          </button>
        </div>
      </form>

      {/* Loading Progress */}
      {loading && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-sacramento-blue dark:border-sacramento-gold">
          <LoadingProgress steps={LOADING_STEPS} currentStep={currentStep} />
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start space-x-2 text-red-700 dark:text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Error</p>
              <p className="text-sm mt-1">{error}</p>
              {retryCount < MAX_RETRIES && !error.includes('Rate limit') && (
                <button
                  onClick={(e) => {
                    setRetryCount(retryCount + 1)
                    handleSearch(e as any)
                  }}
                  className="mt-2 text-sm font-medium underline hover:no-underline"
                >
                  Try again
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick suggestions */}
      {!loading && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Try:</span>
          {[
            '1075 W Capitol Ave, West Sacramento, CA',
            '1400 K St, Sacramento, CA',
            'City Hall, San Francisco, CA',
            'Santa Monica Pier, Santa Monica, CA'
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setAddress(suggestion)}
              className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-gray-700 dark:text-gray-200 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

