import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export interface AnalyzedSite {
  id?: string
  address: string
  lat: number
  lng: number
  walkability_score: number | null
  transit_score: number | null
  amenity_count: number | null
  created_at?: string
}

export interface AmenityCache {
  id?: string
  lat: number
  lng: number
  amenity_type: string
  amenities: any
  cached_at?: string
}

export async function logAnalyzedSite(site: AnalyzedSite) {
  if (!supabase) {
    console.warn('Supabase not configured')
    return null
  }
  
  const { data, error } = await supabase
    .from('analyzed_sites')
    .insert([site])
    .select()
  
  if (error) {
    console.error('Error logging site:', error)
    return null
  }
  
  return data
}

export async function getCachedAmenities(lat: number, lng: number, type: string) {
  if (!supabase) {
    return null
  }
  
  const { data, error } = await supabase
    .from('amenity_cache')
    .select('*')
    .eq('lat', lat)
    .eq('lng', lng)
    .eq('amenity_type', type)
    .gte('cached_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .single()
  
  if (error) {
    return null
  }
  
  return data
}

export async function cacheAmenities(lat: number, lng: number, type: string, amenities: any) {
  if (!supabase) {
    return null
  }
  
  const { data, error } = await supabase
    .from('amenity_cache')
    .insert([{ lat, lng, amenity_type: type, amenities }])
    .select()
  
  if (error) {
    console.error('Error caching amenities:', error)
    return null
  }
  
  return data
}

