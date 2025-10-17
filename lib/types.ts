export interface Coordinates {
  lat: number
  lng: number
}

export interface Amenity {
  id: string
  name: string
  type: string
  category: string
  lat: number
  lng: number
  distance?: number
}

export interface Scores {
  walkability: number
  transit: number
  density: number
  sustainability: number
}

export interface GeocodingResult {
  lat: number
  lng: number
  address: string
  city: string
}

export interface AnalysisResult {
  scores: Scores
  recommendation: string
  suggestedUnits: number
  reasoning: string[]
}

