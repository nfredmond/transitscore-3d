// Network-based walkability analysis using OpenRouteService Isochrone API
// This calculates actual walkable areas based on street networks, not simple radius

export interface IsochroneOptions {
  lat: number
  lng: number
  times: number[] // in seconds
  profile?: 'foot-walking' | 'cycling-regular'
}

export interface IsochroneResponse {
  type: string
  features: Array<{
    type: string
    geometry: {
      coordinates: number[][][]
      type: string
    }
    properties: {
      value: number
    }
  }>
}

// Using OpenRouteService free API for network-based isochrones
const ORS_API_KEY = '5b3ce3597851110001cf6248a8b0e7e3b96244c9a99e5929d7e7c8b9' // Public demo key
const ORS_BASE_URL = 'https://api.openrouteservice.org/v2/isochrones'

export async function getWalkingIsochrones(
  lat: number,
  lng: number,
  times: number[] = [300, 600, 900] // 5, 10, 15 minutes in seconds
): Promise<IsochroneResponse | null> {
  try {
    const url = `${ORS_BASE_URL}/foot-walking`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ORS_API_KEY
      },
      body: JSON.stringify({
        locations: [[lng, lat]], // Note: ORS uses [lng, lat] order
        range: times,
        range_type: 'time'
      })
    })

    if (!response.ok) {
      console.warn('Isochrone API failed, falling back to simple radius')
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching isochrones:', error)
    return null
  }
}

export async function getCyclingIsochrones(
  lat: number,
  lng: number,
  times: number[] = [300, 600, 900]
): Promise<IsochroneResponse | null> {
  try {
    const url = `${ORS_BASE_URL}/cycling-regular`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ORS_API_KEY
      },
      body: JSON.stringify({
        locations: [[lng, lat]],
        range: times,
        range_type: 'time'
      })
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching cycling isochrones:', error)
    return null
  }
}

// Calculate if a point is within a network-based isochrone polygon
export function isPointInIsochrone(
  point: [number, number],
  isochrone: IsochroneResponse,
  timeLimit: number
): boolean {
  if (!isochrone || !isochrone.features) return false

  const feature = isochrone.features.find(f => f.properties.value === timeLimit)
  if (!feature) return false

  const polygon = feature.geometry.coordinates[0]
  return pointInPolygon(point, polygon)
}

// Ray casting algorithm for point-in-polygon test
function pointInPolygon(point: [number, number], polygon: number[][]): boolean {
  const [x, y] = point
  let inside = false

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]
    const [xj, yj] = polygon[j]

    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
    
    if (intersect) inside = !inside
  }

  return inside
}

