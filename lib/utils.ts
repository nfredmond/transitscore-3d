export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lng2 - lng1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Distance in meters
}

export function calculateWalkabilityScore(amenities: any[]): number {
  // Score based on variety and quantity of amenities
  const categoryCount = new Set(amenities.map(a => a.category)).size
  const totalCount = amenities.length
  
  // Base score on count (max 50 points for 20+ amenities)
  const countScore = Math.min(50, (totalCount / 20) * 50)
  
  // Diversity score (max 50 points for 6+ categories)
  const diversityScore = Math.min(50, (categoryCount / 6) * 50)
  
  return Math.round(countScore + diversityScore)
}

export function calculateTransitScore(amenities: any[]): number {
  const transitAmenities = amenities.filter(
    a => a.category === 'transit' || a.type === 'bus_stop' || a.type === 'light_rail'
  )
  
  if (transitAmenities.length === 0) return 0
  
  // Score based on proximity and quantity
  const closeTransit = transitAmenities.filter(a => (a.distance || 0) < 400).length
  const mediumTransit = transitAmenities.filter(a => (a.distance || 0) >= 400 && (a.distance || 0) < 800).length
  
  const proximityScore = closeTransit * 15 + mediumTransit * 10
  const quantityScore = Math.min(30, transitAmenities.length * 5)
  
  return Math.min(100, Math.round(proximityScore + quantityScore))
}

export function formatAddress(address: string): string {
  return address.split(',').slice(0, 3).join(',')
}

export const AMENITY_CATEGORIES = {
  transit: {
    name: 'Transit',
    color: '#0067B1',
    icon: '🚌',
    types: ['bus_stop', 'light_rail', 'station']
  },
  food: {
    name: 'Food & Dining',
    color: '#FFB81C',
    icon: '🍽️',
    types: ['restaurant', 'cafe', 'fast_food', 'bar']
  },
  shopping: {
    name: 'Shopping',
    color: '#10B981',
    icon: '🛒',
    types: ['supermarket', 'convenience', 'mall', 'shop']
  },
  education: {
    name: 'Education',
    color: '#8B5CF6',
    icon: '🎓',
    types: ['school', 'university', 'college', 'kindergarten']
  },
  parks: {
    name: 'Parks & Recreation',
    color: '#22C55E',
    icon: '🌳',
    types: ['park', 'playground', 'pitch', 'sports_centre']
  },
  health: {
    name: 'Healthcare',
    color: '#EF4444',
    icon: '⚕️',
    types: ['hospital', 'clinic', 'doctors', 'pharmacy']
  }
}

