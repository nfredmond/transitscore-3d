# TransitScore 3D

A professional California development site analyzer providing network-based accessibility analysis, environmental impact calculations, and comprehensive scenario planning.

## Features

- 🗺️ **Network-Based Analysis** - True street network accessibility (not simple radius circles)
- 🚶🚴 **Walk & Bike Modes** - Separate analysis for pedestrian and cycling accessibility
- 🏢 **Scenario Planning** - Configure building characteristics and TDM programs
- 📊 **VMT/GHG Calculations** - CARB-compliant environmental impact analysis
- 🤖 **AI Recommendations** - Context-aware density suggestions using Claude AI
- 📄 **Professional Reports** - Export comprehensive PDF analysis
- 🌙 **Dark Mode** - Full dark theme support
- 💰 **Two Tiers** - Free version with Venmo donations, Pro version with $20/month subscriptions

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

## Quick Start

### Option 1: Quick Analysis
1. Enter any California address
2. Click "Analyze Site"
3. View network-based accessibility and scores
4. Toggle between walk and bike modes

### Option 2: Comprehensive Planning (Wizard)
1. Click "Launch Setup Wizard"
2. Enter address (Step 1/3)
3. Configure building characteristics (Step 2/3)
4. Select TDM programs (Step 3/3)
5. Get complete impact analysis with VMT/GHG calculations

## Documentation

- **User Guide**: `docs/USER_GUIDE.md` - How to use the application
- **Features**: `docs/FEATURES.md` - Complete feature list
- **Architecture**: `docs/ARCHITECTURE.md` - Technical architecture
- **Deployment**: `docs/DEPLOYMENT.md` - Deployment instructions
- **API**: `docs/API.md` - API reference

## Deployment

The app is designed to be deployed on Vercel:

```bash
npm run build
```

Deploy to Vercel and set environment variables in the dashboard.

## Versions

### Free Version
- No authentication required
- All analysis features included
- Venmo donations: @Nathaniel-Redmond
- URL: https://transitscore-3d.vercel.app

### Pro Version  
- Requires authentication
- $20/month Stripe subscription
- Priority support
- Commercial licensing
- Same analysis features as free

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Acknowledgments

- OpenStreetMap contributors for map data
- CARTO for basemap tiles
- OpenRouteService for network routing
- Anthropic for Claude AI
- California Air Resources Board for VMT methodology

