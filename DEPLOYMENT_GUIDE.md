# TransitScore 3D - Deployment Guide

## ✅ Completed Steps

1. ✅ **GitHub Repository Created**: https://github.com/nfredmond/transitscore-3d
2. ✅ **Vercel Deployment**: Successfully deployed to production
3. ✅ **Production URL**: https://transitscore-3d-mzpdddmkf-green-dot-transportation-solutions.vercel.app

## 🔧 Required Configuration Steps

### 1. Set up Supabase Database

Your Supabase project URL: `https://zbqvffskikofsxjlmyod.supabase.co`

#### Run the Database Schema

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/zbqvffskikofsxjlmyod
2. Navigate to the SQL Editor
3. Run the SQL from `supabase-setup.sql` file in your repository:

```sql
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

-- Create policies for public read/write
CREATE POLICY "Enable read access for all users" ON analyzed_sites FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON analyzed_sites FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read access for all users" ON amenity_cache FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON amenity_cache FOR INSERT WITH CHECK (true);
```

### 2. Configure Vercel Environment Variables

1. Go to Vercel Dashboard: https://vercel.com/green-dot-transportation-solutions/transitscore-3d/settings/environment-variables

2. Add the following environment variables:

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL` = `https://zbqvffskikofsxjlmyod.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Get this from Supabase Dashboard → Settings → API
- `ANTHROPIC_API_KEY` = Your Claude API key from https://console.anthropic.com/

3. After adding environment variables, redeploy the application:
```bash
vercel redeploy --prod
```

### 3. Get Your API Keys

#### Supabase Anon Key:
1. Go to: https://supabase.com/dashboard/project/zbqvffskikofsxjlmyod/settings/api
2. Copy the `anon` `public` key
3. Add it to Vercel environment variables

#### Anthropic API Key:
1. Go to: https://console.anthropic.com/
2. Navigate to API Keys
3. Create a new key or use an existing one
4. Add it to Vercel environment variables

## 🚀 Testing the Application

Once environment variables are set:

1. Visit: https://transitscore-3d.vercel.app (or your custom domain)
2. Try these Sacramento addresses:
   - `1400 K St, Sacramento, CA`
   - `1500 Capitol Ave, Sacramento, CA`
   - `2000 L St, Sacramento, CA`

3. The app should:
   - Geocode the address
   - Display an interactive map with walkability rings
   - Show nearby amenities (transit, food, parks, etc.)
   - Display AI-powered density recommendations
   - Show scoring metrics
   - Allow switching to 3D building view

## 📊 Features Overview

### Interactive Map (2D View)
- Walkability rings (5min, 10min, 15min)
- Amenity markers categorized by type
- Transit stops, restaurants, parks, schools, etc.
- Click markers for details

### 3D Building View
- Adjust building height (2-4 stories)
- See buildable envelope with setbacks
- Sacramento zoning-compliant visualization

### AI Analysis
- Claude-powered density recommendations
- Walkability score (0-100)
- Transit access score (0-100)
- Sustainability score
- Density potential

### Data Persistence
- Analysis results logged to Supabase
- Amenity data cached for performance
- Analytics on site searches

## 🛠️ Local Development

To run locally:

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## 📦 Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Leaflet + OpenStreetMap
- **3D**: deck.gl
- **Database**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude
- **Geocoding**: Nominatim (OpenStreetMap)
- **Amenity Data**: Overpass API (OpenStreetMap)
- **Hosting**: Vercel

## 🔗 Links

- **GitHub**: https://github.com/nfredmond/transitscore-3d
- **Vercel Dashboard**: https://vercel.com/green-dot-transportation-solutions/transitscore-3d
- **Supabase Dashboard**: https://supabase.com/dashboard/project/zbqvffskikofsxjlmyod
- **Production URL**: https://transitscore-3d.vercel.app

## 🎯 Next Steps (Optional)

1. **Custom Domain**: Add a custom domain in Vercel settings
2. **Analytics**: Set up Vercel Analytics or Google Analytics
3. **Performance**: Enable Vercel Speed Insights
4. **Monitoring**: Set up error tracking (Sentry)
5. **API Rate Limiting**: Implement rate limiting for Overpass API calls
6. **PDF Export**: Complete the "Export Analysis" feature
7. **Share Links**: Implement shareable analysis links

## 🐛 Troubleshooting

### Map not loading
- Check that environment variables are set correctly
- Verify Leaflet CSS is loading
- Check browser console for errors

### Amenity data not showing
- Overpass API may be rate-limited (wait a few minutes)
- Check network tab for API errors
- Try a different address

### AI recommendations not working
- Verify ANTHROPIC_API_KEY is set correctly
- Check API key has sufficient credits
- Review Vercel function logs

### Supabase errors
- Verify tables were created correctly
- Check RLS policies are enabled
- Confirm API keys are correct

## 📝 Notes

- The app is fully functional without Supabase (caching will be disabled)
- All external APIs used are free (except Anthropic Claude)
- OpenStreetMap data is provided by volunteers
- Respect API rate limits and terms of service

