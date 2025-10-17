'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { AMENITY_CATEGORIES } from '@/lib/utils'

interface MapViewProps {
  coordinates: { lat: number; lng: number }
  address: string
  amenities: any[]
}

export default function MapView({ coordinates, address, amenities }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current).setView(
        [coordinates.lat, coordinates.lng],
        15
      )

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapRef.current)
    }

    const map = mapRef.current

    // Clear existing layers
    map.eachLayer((layer) => {
      if (layer instanceof L.Circle || layer instanceof L.Marker) {
        map.removeLayer(layer)
      }
    })

    // Add walkability rings
    const rings = [
      { radius: 400, color: '#10B981', label: '5 min walk' },
      { radius: 800, color: '#FFB81C', label: '10 min walk' },
      { radius: 1200, color: '#0067B1', label: '15 min walk' }
    ]

    rings.forEach((ring) => {
      L.circle([coordinates.lat, coordinates.lng], {
        radius: ring.radius,
        color: ring.color,
        fillColor: ring.color,
        fillOpacity: 0.1,
        weight: 2
      }).addTo(map).bindPopup(ring.label)
    })

    // Add main location marker
    const mainIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: #EF4444; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    })

    L.marker([coordinates.lat, coordinates.lng], { icon: mainIcon })
      .addTo(map)
      .bindPopup(`<strong>Site Location</strong><br>${address}`)

    // Add amenity markers
    const categoryIcons: any = {
      transit: '🚌',
      food: '🍽️',
      shopping: '🛒',
      education: '🎓',
      parks: '🌳',
      health: '⚕️'
    }

    amenities.forEach((amenity) => {
      const category = AMENITY_CATEGORIES[amenity.category as keyof typeof AMENITY_CATEGORIES]
      const icon = categoryIcons[amenity.category] || '📍'
      const color = category?.color || '#6B7280'

      const amenityIcon = L.divIcon({
        className: 'custom-amenity-marker',
        html: `<div style="background-color: ${color}; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">${icon}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })

      L.marker([amenity.lat, amenity.lng], { icon: amenityIcon })
        .addTo(map)
        .bindPopup(`
          <strong>${amenity.name}</strong><br>
          Type: ${amenity.type.replace('_', ' ')}<br>
          Distance: ${amenity.distance}m
        `)
    })

    // Center map
    map.setView([coordinates.lat, coordinates.lng], 15)

    return () => {
      // Cleanup
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [coordinates, address, amenities])

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 max-w-xs z-[1000]">
        <h3 className="font-semibold text-sm mb-2">Legend</h3>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white"></div>
            <span>Site Location</span>
          </div>
          {Object.entries(AMENITY_CATEGORIES).map(([key, cat]) => (
            <div key={key} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded-full border-2 border-white text-center text-[10px]"
                style={{ backgroundColor: cat.color }}
              >
                {cat.icon}
              </div>
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t">
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-1 bg-green-500"></div>
              <span>5 min (400m)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-1 bg-yellow-500"></div>
              <span>10 min (800m)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-1 bg-blue-600"></div>
              <span>15 min (1200m)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

