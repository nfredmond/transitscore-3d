import { NextRequest, NextResponse } from 'next/server'
import { calculateDistance } from '@/lib/utils'
import cache, { TTL, generateCacheKey } from '@/lib/cache'

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
    // Check cache first (round coordinates to avoid cache misses for minor differences)
    const roundedLat = Math.round(lat * 1000) / 1000
    const roundedLng = Math.round(lng * 1000) / 1000
    const cacheKey = generateCacheKey('amenities', { lat: roundedLat, lng: roundedLng })
    const cached = cache.get(cacheKey)
    
    if (cached) {
      return NextResponse.json(cached)
    }

    // Define search radius in meters
    const radius = 1500 // 1.5km to cover all walk times

    // Optimized Overpass API query - split into focused searches to avoid timeout
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["highway"="bus_stop"](around:${radius},${lat},${lng});
        node["public_transport"](around:${radius},${lat},${lng});
        node["railway"](around:${radius},${lat},${lng});
        node["amenity"="bus_station"](around:${radius},${lat},${lng});
        node["amenity"="bicycle_parking"](around:${radius},${lat},${lng});
        node["amenity"="bicycle_rental"](around:${radius},${lat},${lng});
        node["amenity"~"restaurant|cafe|fast_food|bar|pub"](around:${radius},${lat},${lng});
        node["shop"~"supermarket|convenience|mall"](around:${radius},${lat},${lng});
        node["amenity"~"school|kindergarten|college|university|library"](around:${radius},${lat},${lng});
        node["leisure"~"park|playground|sports_centre|pitch"](around:${radius},${lat},${lng});
        node["amenity"~"pharmacy|hospital|clinic|doctors"](around:${radius},${lat},${lng});
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
      console.error('Overpass API error:', response.status, response.statusText)
      throw new Error(`Overpass API request failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data || !data.elements) {
      console.error('Invalid Overpass response:', data)
      throw new Error('Invalid response from Overpass API')
    }

    // Process and categorize amenities with enhanced detection
    const amenities = data.elements
      .filter((element: any) => element.lat && element.lon) // Only include elements with coordinates
      .map((element: any) => {
      const distance = calculateDistance(lat, lng, element.lat, element.lon)
      
      let category = 'other'
      let type = 'unknown'

      // Enhanced categorization logic
      // Transit - All types
      if (element.tags.public_transport || element.tags.highway === 'bus_stop' || 
          element.tags.amenity === 'bus_station' || element.tags.amenity === 'ferry_terminal') {
        category = 'transit'
        type = element.tags.public_transport || 'bus_stop'
      } else if (element.tags.railway) {
        category = 'transit'
        type = element.tags.railway === 'station' ? 'train_station' : 'light_rail'
      } 
      // Bikeways
      else if (element.tags.highway === 'cycleway' || element.tags.cycleway || 
               element.tags.bicycle === 'designated' || element.tags.amenity === 'bicycle_parking' ||
               element.tags.amenity === 'bicycle_rental') {
        category = 'bikeway'
        type = element.tags.amenity || 'bike_lane'
      }
      // Food & Dining
      else if (['restaurant', 'cafe', 'fast_food', 'bar', 'pub'].includes(element.tags.amenity)) {
        category = 'food'
        type = element.tags.amenity
      }
      // Shopping
      else if (element.tags.shop) {
        category = 'shopping'
        type = element.tags.shop
      }
      // Education
      else if (['school', 'kindergarten', 'college', 'university', 'library'].includes(element.tags.amenity)) {
        category = 'education'
        type = element.tags.amenity
      }
      // Parks & Recreation
      else if (['park', 'playground', 'sports_centre', 'pitch'].includes(element.tags.leisure)) {
        category = 'parks'
        type = element.tags.leisure
      }
      // Healthcare
      else if (['pharmacy', 'hospital', 'clinic', 'doctors'].includes(element.tags.amenity)) {
        category = 'health'
        type = element.tags.amenity
      }

      return {
        id: element.id.toString(),
        name: element.tags.name || element.tags.operator || `${type.replace('_', ' ')}`,
        type,
        category,
        lat: element.lat,
        lng: element.lon,
        distance: Math.round(distance)
      }
    })
    .filter((amenity: any) => amenity.category !== 'other') // Remove uncategorized items

    // Sort by distance
    amenities.sort((a: any, b: any) => a.distance - b.distance)

    const responseData = {
      amenities,
      count: amenities.length
    }

    // Cache the result
    cache.set(cacheKey, responseData, TTL.AMENITIES)

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Amenities fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch amenities' },
      { status: 500 }
    )
  }
}

