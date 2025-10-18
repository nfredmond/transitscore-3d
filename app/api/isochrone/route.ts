import { NextRequest, NextResponse } from 'next/server'

// OpenRouteService API for network-based isochrones
const ORS_API_KEY = '5b3ce3597851110001cf6248a8b0e7e3b96244c9a99e5929d7e7c8b9'

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

    return NextResponse.json({ isochrones, mode })
  } catch (error) {
    console.error('Isochrone error:', error)
    // Return fallback to simple rings
    return NextResponse.json({ isochrones: null, fallback: true })
  }
}

