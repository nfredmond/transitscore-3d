'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import AddressSearch from '@/components/AddressSearch'
import ScoreDashboard from '@/components/ScoreDashboard'
import ScenarioPlanner from '@/components/ScenarioPlanner'
import { MapPin, Moon, Sun, LayoutGrid } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

// Dynamically import map components with no SSR to avoid window issues
const MapView = dynamic(() => import('@/components/MapView'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full dark:text-white">Loading map...</div>
})

const ThreeDView = dynamic(() => import('@/components/ThreeDView'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full dark:text-white">Loading 3D view...</div>
})

// Default location: West Sacramento Community Center
const DEFAULT_LOCATION = {
  lat: 38.580467,
  lng: -121.530234,
  address: 'West Sacramento Community Center, 1075 W Capitol Ave, West Sacramento, CA 95691'
}

export default function Home() {
  const { theme, toggleTheme } = useTheme()
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [address, setAddress] = useState<string>('')
  const [amenities, setAmenities] = useState<any[]>([])
  const [walkIsochrones, setWalkIsochrones] = useState<any>(null)
  const [bikeIsochrones, setBikeIsochrones] = useState<any>(null)
  const [scores, setScores] = useState<{
    walkability: number
    bikeability: number
    transit: number
    density: number
    sustainability: number
  } | null>(null)
  const [recommendation, setRecommendation] = useState<string>('')
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d')
  const [travelMode, setTravelMode] = useState<'walk' | 'bike'>('walk')
  const [dashboardMode, setDashboardMode] = useState<'scores' | 'scenario'>('scores')
  const [buildingHeight, setBuildingHeight] = useState<number>(35)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)

  // Set default location on mount
  useEffect(() => {
    setCoordinates({ lat: DEFAULT_LOCATION.lat, lng: DEFAULT_LOCATION.lng })
    setAddress(DEFAULT_LOCATION.address)
  }, [])

  const handleAddressSelect = (data: {
    lat: number
    lng: number
    address: string
    amenities: any[]
    scores: any
    recommendation: string
    walkIsochrones?: any
    bikeIsochrones?: any
  }) => {
    setCoordinates({ lat: data.lat, lng: data.lng })
    setAddress(data.address)
    setAmenities(data.amenities)
    setScores(data.scores)
    setRecommendation(data.recommendation)
    setWalkIsochrones(data.walkIsochrones)
    setBikeIsochrones(data.bikeIsochrones)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-sacramento-blue p-2 rounded-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  TransitScore <span className="text-sacramento-gold">3D</span>
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">California Development Site Analyzer</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                )}
              </button>
              
              {coordinates && (
                <>
                  {/* Walk/Bike Mode Toggle */}
                  <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setTravelMode('walk')}
                      className={`px-3 py-1.5 rounded-md font-medium text-sm transition-colors ${
                        travelMode === 'walk'
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      🚶 Walk
                    </button>
                    <button
                      onClick={() => setTravelMode('bike')}
                      className={`px-3 py-1.5 rounded-md font-medium text-sm transition-colors ${
                        travelMode === 'bike'
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      🚴 Bike
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setViewMode('2d')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      viewMode === '2d'
                        ? 'bg-sacramento-blue text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    2D Map
                  </button>
                  <button
                    onClick={() => setViewMode('3d')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      viewMode === '3d'
                        ? 'bg-sacramento-blue text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    3D View
                  </button>
                </>
              )}
            </div>
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
          <div className={`grid grid-cols-1 ${isFullscreen ? '' : 'lg:grid-cols-3'} gap-6`}>
            {/* Map/3D View - Takes up 2 columns or fullscreen */}
            <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'lg:col-span-2'} bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all`} style={{ height: isFullscreen ? '100vh' : '600px' }}>
              {viewMode === '2d' ? (
                <MapView
                  coordinates={coordinates}
                  address={address}
                  amenities={amenities}
                  travelMode={travelMode}
                  walkIsochrones={walkIsochrones}
                  bikeIsochrones={bikeIsochrones}
                  isFullscreen={isFullscreen}
                  onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
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
            {!isFullscreen && (
              <div className="lg:col-span-1 space-y-4">
                {/* Dashboard Mode Toggle */}
                <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md">
                  <button
                    onClick={() => setDashboardMode('scores')}
                    className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                      dashboardMode === 'scores'
                        ? 'bg-sacramento-blue text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    📊 Scores
                  </button>
                  <button
                    onClick={() => setDashboardMode('scenario')}
                    className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                      dashboardMode === 'scenario'
                        ? 'bg-sacramento-blue text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    🏗️ Scenario
                  </button>
                </div>

                {/* Conditional Dashboard Content */}
                {dashboardMode === 'scores' ? (
                  <ScoreDashboard
                    scores={scores}
                    recommendation={recommendation}
                    address={address}
                    coordinates={coordinates}
                    amenities={amenities}
                    travelMode={travelMode}
                  />
                ) : (
                  scores && (
                    <ScenarioPlanner
                      walkabilityScore={scores.walkability}
                      bikeabilityScore={scores.bikeability}
                      transitScore={scores.transit}
                      travelMode={travelMode}
                    />
                  )
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <MapPin className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Welcome to TransitScore 3D
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Analyzing West Sacramento Community Center location
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Enter any California address above to analyze its development potential
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-gray-600 dark:text-gray-400 text-sm transition-colors">
        <p>TransitScore 3D • California Development Site Analyzer</p>
        <p className="mt-1">Powered by OpenStreetMap, Overpass API, and Claude AI</p>
        <div className="mt-4">
          <a
            href="https://venmo.com/u/Nathaniel-Redmond"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-6 py-2 bg-[#008CFF] hover:bg-[#0074CC] text-white rounded-lg font-medium transition-colors shadow-md"
          >
            <span>💙</span>
            <span>Support this free tool - Donate via Venmo</span>
          </a>
          <p className="text-xs mt-2 text-gray-500 dark:text-gray-500">
            This tool is free to use. Support helps keep it running!
          </p>
        </div>
      </footer>
    </div>
  )
}

