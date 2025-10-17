import { NextRequest, NextResponse } from 'next/server'
import { calculateDistance } from '@/lib/utils'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = parseFloat(searchParams.get('lat') || '')
  const lng = parseFloat(searchParams.get('lng') || '')

  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'Latitude and longitude are required' },
      { status: 400 }
    )
  }

  try {
    // Define search radius in meters
    const radius = 1500 // 1.5km to cover all walk times

    // Overpass API query for various amenities
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["public_transport"="stop_position"](around:${radius},${lat},${lng});
        node["highway"="bus_stop"](around:${radius},${lat},${lng});
        node["railway"="station"](around:${radius},${lat},${lng});
        node["railway"="light_rail"](around:${radius},${lat},${lng});
        node["amenity"="restaurant"](around:${radius},${lat},${lng});
        node["amenity"="cafe"](around:${radius},${lat},${lng});
        node["amenity"="fast_food"](around:${radius},${lat},${lng});
        node["shop"="supermarket"](around:${radius},${lat},${lng});
        node["shop"="convenience"](around:${radius},${lat},${lng});
        node["amenity"="school"](around:${radius},${lat},${lng});
        node["amenity"="kindergarten"](around:${radius},${lat},${lng});
        node["leisure"="park"](around:${radius},${lat},${lng});
        node["leisure"="playground"](around:${radius},${lat},${lng});
        node["amenity"="pharmacy"](around:${radius},${lat},${lng});
        node["amenity"="hospital"](around:${radius},${lat},${lng});
      );
      out body;
    `

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: overpassQuery,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    if (!response.ok) {
      throw new Error('Overpass API request failed')
    }

    const data = await response.json()

    // Process and categorize amenities
    const amenities = data.elements.map((element: any) => {
      const distance = calculateDistance(lat, lng, element.lat, element.lon)
      
      let category = 'other'
      let type = 'unknown'

      // Categorize based on tags
      if (element.tags.highway === 'bus_stop' || element.tags.public_transport) {
        category = 'transit'
        type = 'bus_stop'
      } else if (element.tags.railway) {
        category = 'transit'
        type = 'light_rail'
      } else if (element.tags.amenity === 'restaurant' || element.tags.amenity === 'cafe' || element.tags.amenity === 'fast_food') {
        category = 'food'
        type = element.tags.amenity
      } else if (element.tags.shop === 'supermarket' || element.tags.shop === 'convenience') {
        category = 'shopping'
        type = element.tags.shop
      } else if (element.tags.amenity === 'school' || element.tags.amenity === 'kindergarten') {
        category = 'education'
        type = element.tags.amenity
      } else if (element.tags.leisure === 'park' || element.tags.leisure === 'playground') {
        category = 'parks'
        type = element.tags.leisure
      } else if (element.tags.amenity === 'pharmacy' || element.tags.amenity === 'hospital') {
        category = 'health'
        type = element.tags.amenity
      }

      return {
        id: element.id.toString(),
        name: element.tags.name || `${type.replace('_', ' ')}`,
        type,
        category,
        lat: element.lat,
        lng: element.lon,
        distance: Math.round(distance)
      }
    })

    // Sort by distance
    amenities.sort((a: any, b: any) => a.distance - b.distance)

    return NextResponse.json({
      amenities,
      count: amenities.length
    })
  } catch (error) {
    console.error('Amenities fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch amenities' },
      { status: 500 }
    )
  }
}

