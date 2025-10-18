import { NextRequest, NextResponse } from 'next/server'
import cache, { TTL, generateCacheKey } from '@/lib/cache'

// OpenRouteService API for network-based isochrones
// Get API key from environment variable or use fallback
// Sign up for free at: https://openrouteservice.org/dev/#/signup
const ORS_API_KEY = process.env.OPENROUTE_SERVICE_API_KEY || '5b3ce3597851110001cf6248a8b0e7e3b96244c9a99e5929d7e7c8b9'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = parseFloat(searchParams.get('lat') || '')
  const lng = parseFloat(searchParams.get('lng') || '')
  const mode = searchParams.get('mode') || 'walk' // 'walk' or 'bike'

  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'Latitude and longitude are required' },
      { status: 400 }
    )
  }

  try {
    // Check cache first (round coordinates to avoid cache misses)
    const roundedLat = Math.round(lat * 1000) / 1000
    const roundedLng = Math.round(lng * 1000) / 1000
    const cacheKey = generateCacheKey('isochrone', { lat: roundedLat, lng: roundedLng, mode })
    const cached = cache.get(cacheKey)
    
    if (cached) {
      return NextResponse.json(cached)
    }
    // Define time ranges in seconds
    const ranges = [300, 600, 900] // 5, 10, 15 minutes

    const profile = mode === 'bike' ? 'cycling-regular' : 'foot-walking'
    const url = `https://api.openrouteservice.org/v2/isochrones/${profile}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ORS_API_KEY
      },
      body: JSON.stringify({
        locations: [[lng, lat]], // ORS uses [lng, lat] format
        range: ranges,
        range_type: 'time',
        attributes: ['total_pop']
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('ORS API error:', response.status, errorText)
      console.error('⚠️  Network-based isochrones unavailable. Using radius fallback.')
      console.error('💡 To enable network analysis:')
      console.error('   1. Sign up for free at: https://openrouteservice.org/dev/#/signup')
      console.error('   2. Get your API key')
      console.error('   3. Add to .env.local: OPENROUTE_SERVICE_API_KEY=your_key_here')
      
      // Return null to fall back to simple rings
      return NextResponse.json({ isochrones: null, fallback: true })
    }

    const data = await response.json()

    // Convert GeoJSON to format Leaflet can use
    const isochrones = data.features.map((feature: any) => ({
      type: 'Feature',
      geometry: feature.geometry,
      properties: {
        value: feature.properties.value,
        center: [lat, lng]
      }
    }))

    const responseData = { isochrones, mode }
    
    // Cache the result
    cache.set(cacheKey, responseData, TTL.ISOCHRONE)

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Isochrone error:', error)
    // Don't cache errors, return fallback to simple rings
    return NextResponse.json({ isochrones: null, fallback: true })
  }
}

