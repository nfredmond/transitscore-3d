'use client'

import { useEffect, useRef } from 'react'
import { DeckGL } from '@deck.gl/react'
import { Map } from 'react-map-gl'
import { PolygonLayer } from '@deck.gl/layers'
import 'mapbox-gl/dist/mapbox-gl.css'

interface ThreeDViewProps {
  coordinates: { lat: number; lng: number }
  buildingHeight: number
  onHeightChange: (height: number) => void
}

export default function ThreeDView({
  coordinates,
  buildingHeight,
  onHeightChange
}: ThreeDViewProps) {
  const INITIAL_VIEW_STATE = {
    longitude: coordinates.lng,
    latitude: coordinates.lat,
    zoom: 18,
    pitch: 45,
    bearing: 0
  }

  // Generate building footprint (simplified rectangular lot)
  const lotWidth = 0.0002 // ~22m
  const lotDepth = 0.0003 // ~33m

  // Calculate setbacks (in degrees, approximate)
  const frontSetback = 0.000045 // ~5m
  const sideSetback = 0.000015 // ~1.5m
  const rearSetback = 0.00003 // ~3m

  // Building footprint with setbacks
  const buildingFootprint = [
    [
      [coordinates.lng - lotWidth / 2 + sideSetback, coordinates.lat - lotDepth / 2 + frontSetback],
      [coordinates.lng + lotWidth / 2 - sideSetback, coordinates.lat - lotDepth / 2 + frontSetback],
      [coordinates.lng + lotWidth / 2 - sideSetback, coordinates.lat + lotDepth / 2 - rearSetback],
      [coordinates.lng - lotWidth / 2 + sideSetback, coordinates.lat + lotDepth / 2 - rearSetback]
    ]
  ]

  // Lot boundary
  const lotBoundary = [
    [
      [coordinates.lng - lotWidth / 2, coordinates.lat - lotDepth / 2],
      [coordinates.lng + lotWidth / 2, coordinates.lat - lotDepth / 2],
      [coordinates.lng + lotWidth / 2, coordinates.lat + lotDepth / 2],
      [coordinates.lng - lotWidth / 2, coordinates.lat + lotDepth / 2]
    ]
  ]

  const layers = [
    new PolygonLayer({
      id: 'lot-boundary',
      data: [{ polygon: lotBoundary, color: [200, 200, 200, 100] }],
      getPolygon: (d: any) => d.polygon,
      getFillColor: (d: any) => d.color,
      getLineColor: [100, 100, 100],
      getLineWidth: 2,
      lineWidthMinPixels: 1,
      pickable: true,
      extruded: false
    }),
    new PolygonLayer({
      id: 'building',
      data: [{ polygon: buildingFootprint, height: buildingHeight }],
      getPolygon: (d: any) => d.polygon,
      getElevation: (d: any) => d.height,
      getFillColor: [67, 179, 255, 200],
      getLineColor: [50, 50, 200],
      getLineWidth: 2,
      lineWidthMinPixels: 2,
      extruded: true,
      wireframe: true,
      pickable: true
    })
  ]

  const heightOptions = [
    { label: '2 Story', value: 25, description: '~25ft' },
    { label: '3 Story', value: 35, description: '~35ft' },
    { label: '4 Story', value: 45, description: '~45ft' }
  ]

  return (
    <div className="relative w-full h-full">
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
      >
        <Map
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          mapboxAccessToken="not-needed"
        />
      </DeckGL>

      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs z-10">
        <h3 className="font-semibold text-gray-900 mb-3">Building Configuration</h3>
        
        {/* Height Selector */}
        <div className="space-y-2">
          <label className="text-sm text-gray-600 font-medium">Building Height</label>
          <div className="space-y-2">
            {heightOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onHeightChange(option.value)}
                className={`w-full px-4 py-2 rounded-lg text-left transition-colors ${
                  buildingHeight === option.value
                    ? 'bg-sacramento-blue text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{option.label}</span>
                  <span className="text-sm opacity-75">{option.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs space-y-1 text-gray-600">
            <p><strong>Setbacks Applied:</strong></p>
            <p>• Front: 15ft</p>
            <p>• Sides: 5ft</p>
            <p>• Rear: 10ft</p>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-gray-700">
          <strong>Tip:</strong> Drag to rotate, scroll to zoom
        </div>
      </div>

      {/* Stats Box */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-10">
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Current Height:</span>
            <span className="font-semibold text-gray-900">{buildingHeight}ft</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Stories:</span>
            <span className="font-semibold text-gray-900">
              {buildingHeight === 25 ? '2' : buildingHeight === 35 ? '3' : '4'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Buildable Area:</span>
            <span className="font-semibold text-gray-900">~550 sqft</span>
          </div>
        </div>
      </div>
    </div>
  )
}

