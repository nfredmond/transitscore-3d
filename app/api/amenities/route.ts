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

    // Enhanced Overpass API query with comprehensive transit and bikeway coverage
    const overpassQuery = `
      [out:json][timeout:30];
      (
        /* Transit - All types including small systems */
        node["public_transport"="stop_position"](around:${radius},${lat},${lng});
        node["public_transport"="platform"](around:${radius},${lat},${lng});
        node["public_transport"="station"](around:${radius},${lat},${lng});
        node["highway"="bus_stop"](around:${radius},${lat},${lng});
        node["amenity"="bus_station"](around:${radius},${lat},${lng});
        node["railway"="station"](around:${radius},${lat},${lng});
        node["railway"="halt"](around:${radius},${lat},${lng});
        node["railway"="tram_stop"](around:${radius},${lat},${lng});
        node["railway"="light_rail"](around:${radius},${lat},${lng});
        node["railway"="subway_entrance"](around:${radius},${lat},${lng});
        node["amenity"="ferry_terminal"](around:${radius},${lat},${lng});
        
        /* Bikeways and Cycling Infrastructure */
        way["highway"="cycleway"](around:${radius},${lat},${lng});
        way["cycleway"](around:${radius},${lat},${lng});
        way["bicycle"="designated"](around:${radius},${lat},${lng});
        node["amenity"="bicycle_parking"](around:${radius},${lat},${lng});
        node["amenity"="bicycle_rental"](around:${radius},${lat},${lng});
        
        /* Food & Dining */
        node["amenity"="restaurant"](around:${radius},${lat},${lng});
        node["amenity"="cafe"](around:${radius},${lat},${lng});
        node["amenity"="fast_food"](around:${radius},${lat},${lng});
        node["amenity"="bar"](around:${radius},${lat},${lng});
        node["amenity"="pub"](around:${radius},${lat},${lng});
        
        /* Shopping */
        node["shop"="supermarket"](around:${radius},${lat},${lng});
        node["shop"="convenience"](around:${radius},${lat},${lng});
        node["shop"="mall"](around:${radius},${lat},${lng});
        node["shop"](around:${radius},${lat},${lng});
        
        /* Education */
        node["amenity"="school"](around:${radius},${lat},${lng});
        node["amenity"="kindergarten"](around:${radius},${lat},${lng});
        node["amenity"="college"](around:${radius},${lat},${lng});
        node["amenity"="university"](around:${radius},${lat},${lng});
        node["amenity"="library"](around:${radius},${lat},${lng});
        
        /* Parks & Recreation */
        node["leisure"="park"](around:${radius},${lat},${lng});
        node["leisure"="playground"](around:${radius},${lat},${lng});
        node["leisure"="sports_centre"](around:${radius},${lat},${lng});
        node["leisure"="pitch"](around:${radius},${lat},${lng});
        
        /* Healthcare */
        node["amenity"="pharmacy"](around:${radius},${lat},${lng});
        node["amenity"="hospital"](around:${radius},${lat},${lng});
        node["amenity"="clinic"](around:${radius},${lat},${lng});
        node["amenity"="doctors"](around:${radius},${lat},${lng});
      );
      out body;
      >;
      out skel qt;
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

