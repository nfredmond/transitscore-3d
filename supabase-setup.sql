-- TransitScore 3D Database Schema
-- Run this in your Supabase SQL Editor

-- Store searched sites for analytics
CREATE TABLE IF NOT EXISTS analyzed_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address TEXT NOT NULL,
  lat FLOAT NOT NULL,
  lng FLOAT NOT NULL,
  walkability_score INT,
  transit_score INT,
  amenity_count INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Cache amenity data to reduce API calls
CREATE TABLE IF NOT EXISTS amenity_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lat FLOAT NOT NULL,
  lng FLOAT NOT NULL,
  amenity_type TEXT NOT NULL,
  amenities JSONB,
  cached_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_analyzed_sites_coords ON analyzed_sites(lat, lng);
CREATE INDEX IF NOT EXISTS idx_amenity_cache_coords ON amenity_cache(lat, lng);
CREATE INDEX IF NOT EXISTS idx_amenity_cache_type ON amenity_cache(amenity_type);
CREATE INDEX IF NOT EXISTS idx_amenity_cache_cached_at ON amenity_cache(cached_at);

-- Enable Row Level Security (RLS)
ALTER TABLE analyzed_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenity_cache ENABLE ROW LEVEL SECURITY;

-- Create policies for public read/write (adjust as needed for production)
CREATE POLICY "Enable read access for all users" ON analyzed_sites FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON analyzed_sites FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read access for all users" ON amenity_cache FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON amenity_cache FOR INSERT WITH CHECK (true);

