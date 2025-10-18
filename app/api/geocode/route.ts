import { NextRequest, NextResponse } from 'next/server'
import cache, { TTL, generateCacheKey } from '@/lib/cache'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const address = searchParams.get('address')

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 })
  }

  try {
    // Check cache first
    const cacheKey = generateCacheKey('geocode', { address: address.toLowerCase().trim() })
    const cached = cache.get(cacheKey)
    
    if (cached) {
      return NextResponse.json(cached)
    }

    // Use Nominatim (OpenStreetMap) for geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(address)}&` +
        `format=json&` +
        `countrycodes=us&` +
        `limit=5`,
      {
        headers: {
          'User-Agent': 'TransitScore3D/1.0'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Geocoding failed')
    }

    const data = await response.json()

    if (data.length === 0) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    // Filter for California results
    const californiaResults = data.filter((result: any) => {
      const displayName = result.display_name.toLowerCase()
      return displayName.includes('california')
    })

    if (californiaResults.length === 0) {
      return NextResponse.json(
        { error: 'Please enter a California address' },
        { status: 400 }
      )
    }

    const result = californiaResults[0]

    const responseData = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      address: result.display_name,
      city: 'Sacramento'
    }

    // Cache the result
    cache.set(cacheKey, responseData, TTL.GEOCODE)

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Geocoding error:', error)
    return NextResponse.json(
      { error: 'Failed to geocode address' },
      { status: 500 }
    )
  }
}

