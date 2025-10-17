'use client'

import { useState } from 'react'
import { Search, Loader2, AlertCircle } from 'lucide-react'

interface AddressSearchProps {
  onAddressSelect: (data: {
    lat: number
    lng: number
    address: string
    amenities: any[]
    scores: any
    recommendation: string
  }) => void
}

export default function AddressSearch({ onAddressSelect }: AddressSearchProps) {
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address.trim()) return

    setLoading(true)
    setError('')

    try {
      // Step 1: Geocode the address
      const geocodeRes = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`)
      if (!geocodeRes.ok) {
        const errorData = await geocodeRes.json()
        throw new Error(errorData.error || 'Failed to geocode address')
      }
      const geocodeData = await geocodeRes.json()

      // Step 2: Fetch nearby amenities
      const amenitiesRes = await fetch(
        `/api/amenities?lat=${geocodeData.lat}&lng=${geocodeData.lng}`
      )
      if (!amenitiesRes.ok) {
        throw new Error('Failed to fetch amenities')
      }
      const amenitiesData = await amenitiesRes.json()

      // Step 3: Get AI analysis
      const analysisRes = await fetch('/api/analyze', {
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

      // Pass all data to parent
      onAddressSelect({
        lat: geocodeData.lat,
        lng: geocodeData.lng,
        address: geocodeData.address,
        amenities: amenitiesData.amenities,
        scores: analysisData.scores,
        recommendation: analysisData.recommendation
      })
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter Sacramento address (e.g., 1400 K St, Sacramento, CA)"
            className="w-full pl-12 pr-32 py-4 rounded-xl border-2 border-gray-200 focus:border-sacramento-blue focus:outline-none text-lg transition-colors shadow-sm"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !address.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-sacramento-blue text-white px-6 py-2 rounded-lg font-medium hover:bg-sacramento-darkblue disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
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

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick suggestions */}
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="text-sm text-gray-600">Try:</span>
        {[
          '1400 K St, Sacramento, CA',
          '1500 Capitol Ave, Sacramento, CA',
          '2000 L St, Sacramento, CA'
        ].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setAddress(suggestion)}
            className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}

