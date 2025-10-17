'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import AddressSearch from '@/components/AddressSearch'
import ScoreDashboard from '@/components/ScoreDashboard'
import { MapPin } from 'lucide-react'

// Dynamically import map components with no SSR to avoid window issues
const MapView = dynamic(() => import('@/components/MapView'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading map...</div>
})

const ThreeDView = dynamic(() => import('@/components/ThreeDView'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading 3D view...</div>
})

export default function Home() {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [address, setAddress] = useState<string>('')
  const [amenities, setAmenities] = useState<any[]>([])
  const [scores, setScores] = useState<{
    walkability: number
    transit: number
    density: number
    sustainability: number
  } | null>(null)
  const [recommendation, setRecommendation] = useState<string>('')
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d')
  const [buildingHeight, setBuildingHeight] = useState<number>(35)

  const handleAddressSelect = (data: {
    lat: number
    lng: number
    address: string
    amenities: any[]
    scores: any
    recommendation: string
  }) => {
    setCoordinates({ lat: data.lat, lng: data.lng })
    setAddress(data.address)
    setAmenities(data.amenities)
    setScores(data.scores)
    setRecommendation(data.recommendation)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-sacramento-blue p-2 rounded-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  TransitScore <span className="text-sacramento-gold">3D</span>
                </h1>
                <p className="text-sm text-gray-600">Sacramento Development Site Analyzer</p>
              </div>
            </div>
            {coordinates && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('2d')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === '2d'
                      ? 'bg-sacramento-blue text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  2D Map
                </button>
                <button
                  onClick={() => setViewMode('3d')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === '3d'
                      ? 'bg-sacramento-blue text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  3D View
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <AddressSearch onAddressSelect={handleAddressSelect} />
        </div>

        {/* Content Grid */}
        {coordinates ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map/3D View - Takes up 2 columns */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: '600px' }}>
              {viewMode === '2d' ? (
                <MapView
                  coordinates={coordinates}
                  address={address}
                  amenities={amenities}
                />
              ) : (
                <ThreeDView
                  coordinates={coordinates}
                  buildingHeight={buildingHeight}
                  onHeightChange={setBuildingHeight}
                />
              )}
            </div>

            {/* Dashboard - Takes up 1 column */}
            <div className="lg:col-span-1">
              <ScoreDashboard
                scores={scores}
                recommendation={recommendation}
                address={address}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Start Your Site Analysis
            </h2>
            <p className="text-gray-500">
              Enter a Sacramento address above to analyze its development potential
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-gray-600 text-sm">
        <p>TransitScore 3D • Sacramento Development Site Analyzer</p>
        <p className="mt-1">Powered by OpenStreetMap, Overpass API, and Claude AI</p>
      </footer>
    </div>
  )
}

