# TransitScore 3D

A Sacramento development site analyzer that provides AI-powered density recommendations, walkability scores, and 3D building visualizations.

## Features

- 🗺️ **Interactive Maps** - View sites with walkability rings and nearby amenities
- 🏢 **3D Building Visualization** - Preview buildable envelopes with adjustable heights
- 🤖 **AI-Powered Analysis** - Get intelligent density recommendations using Claude AI
- 📊 **Comprehensive Scoring** - Walkability, transit access, and sustainability metrics
- 🚌 **Transit & Amenity Data** - Real-time data from OpenStreetMap

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Maps**: Leaflet, OpenStreetMap
- **3D**: deck.gl
- **AI**: Anthropic Claude API
- **Data**: Nominatim (geocoding), Overpass API (amenities)

## Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase account
- Anthropic API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/transitscore-3d.git
cd transitscore-3d
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

4. Set up Supabase database:

Run the following SQL in your Supabase SQL editor:

```sql
-- Store searched sites for analytics
CREATE TABLE analyzed_sites (
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
CREATE TABLE amenity_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lat FLOAT NOT NULL,
  lng FLOAT NOT NULL,
  amenity_type TEXT NOT NULL,
  amenities JSONB,
  cached_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_analyzed_sites_coords ON analyzed_sites(lat, lng);
CREATE INDEX idx_amenity_cache_coords ON amenity_cache(lat, lng);
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a Sacramento address in the search bar
2. View the interactive map with walkability rings and amenity markers
3. Switch to 3D view to see building massing options
4. Review AI-generated density recommendations and scores

## Deployment

The app is designed to be deployed on Vercel:

```bash
npm run build
```

Deploy to Vercel and set environment variables in the dashboard.

## API Endpoints

- `/api/geocode` - Convert address to coordinates
- `/api/amenities` - Fetch nearby amenities from Overpass API
- `/api/analyze` - AI-powered density recommendation using Claude

## License

MIT

## Acknowledgments

- OpenStreetMap contributors for map data
- Overpass API for amenity data
- Anthropic for Claude AI

