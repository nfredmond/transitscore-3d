# Network-Based Accessibility Analysis

## Overview

TransitScore 3D uses true street-network routing for accessibility analysis, not simple radius circles. This provides professional-grade accuracy for urban planning decisions.

## How It Works

The application uses the OpenRouteService (ORS) API to calculate isochrones - areas reachable within specific time thresholds using actual street networks.

### Network-Based vs Radius Fallback

**Network-Based (Recommended):**
- Uses actual street network and routing algorithms
- Accounts for one-way streets, barriers, bridges, and terrain
- Shows true walkable/bikeable areas based on real paths
- Provides accurate accessibility for CEQA/NEPA compliance
- Professional-grade urban planning analysis

**Radius Fallback (Automatic):**
- Simple circles based on straight-line distance
- Walk: 400m (5 min), 800m (10 min), 1200m (15 min)
- Bike: 1000m (5 min), 2000m (10 min), 3000m (15 min)
- Used automatically when ORS API is unavailable
- Ensures the app always works

## Setup Instructions

### Local Development

1. **Sign up for free ORS account**:
   - Visit: https://openrouteservice.org/dev/#/signup
   - Create account and verify email
   - Free tier: 2,000 requests/day, 40 requests/minute

2. **Get your API key**:
   - Log in to ORS dashboard
   - Click "Request a Token"
   - Copy your API key

3. **Add to `.env.local`**:
   ```bash
   # OpenRouteService API Key for network-based isochrones
   OPENROUTE_SERVICE_API_KEY=your_api_key_here
   ```

4. **Restart dev server**:
   ```bash
   npm run dev
   ```

### Production Deployment

#### Using Vercel CLI:
```bash
# Add to production
echo "your_api_key" | vercel env add OPENROUTE_SERVICE_API_KEY production

# Add to preview
echo "your_api_key" | vercel env add OPENROUTE_SERVICE_API_KEY preview

# Add to development
echo "your_api_key" | vercel env add OPENROUTE_SERVICE_API_KEY development

# Redeploy
vercel deploy --prod
```

#### Using Vercel Dashboard:
1. Go to: Project Settings → Environment Variables
2. Add new variable:
   - **Name**: `OPENROUTE_SERVICE_API_KEY`
   - **Value**: Your ORS API key
   - **Environments**: Production, Preview, Development
3. Redeploy your application

## Verification

### Check if Network Analysis is Working:

1. **In the App**:
   - Search for any California address
   - Look at the map legend (bottom-right)
   - Should show: "✓ Network-based"
   - Map should display irregular polygon shapes

2. **Via API** (Development):
   ```bash
   curl "http://localhost:3000/api/isochrone?lat=38.58047&lng=-121.53023&mode=walk"
   ```
   - Should return GeoJSON with polygon coordinates
   - NOT: `{"isochrones":null,"fallback":true}`

3. **Via API** (Production):
   ```bash
   curl "https://your-site.vercel.app/api/isochrone?lat=38.58047&lng=-121.53023&mode=walk"
   ```
   - Should return ~2-3KB of GeoJSON data

## Troubleshooting

### "~ Radius estimate" Still Showing

**Possible causes:**
1. API key not set in environment
2. API key is invalid
3. ORS account not activated
4. Rate limit exceeded
5. Server not restarted after adding key

**Solutions:**
1. Verify `.env.local` exists with correct key
2. Check console for ORS API error messages
3. Verify ORS account is activated
4. Wait if rate-limited (resets hourly/daily)
5. Restart dev server or redeploy

### API Errors in Console

If you see errors like:
```
ORS API error: 403 {"error": "Access to this API has been disallowed"}
```

This means:
- API key is invalid/expired
- Account not verified
- Rate limit exceeded

**Solution**: Get a new API key from ORS dashboard

### Rate Limiting

ORS Free Tier Limits:
- **Daily**: 2,000 requests
- **Per Minute**: 40 requests
- **Per Request**: Up to 10 isochrones

Our app requests:
- 2 API calls per address (walk + bike)
- Each returns 3 isochrones (5, 10, 15 min)
- Cached for 12 hours to minimize API usage

## Alternative APIs

If ORS doesn't work for you, alternatives include:

### Mapbox Isochrone API
- Sign up: https://www.mapbox.com/
- Free tier: 100,000 requests/month
- Modify `app/api/isochrone/route.ts` to use Mapbox endpoint

### Google Maps Directions API
- Requires paid account
- More expensive but very reliable
- Would require significant code changes

### TravelTime API
- Sign up: https://www.traveltimeplatform.com/
- Specialized in isochrones
- Good free tier

## Technical Details

### API Endpoint
```
POST https://api.openrouteservice.org/v2/isochrones/{profile}
```

Profiles:
- `foot-walking` - Pedestrian routing
- `cycling-regular` - Bicycle routing

### Request Format
```json
{
  "locations": [[-121.530, 38.580]],
  "range": [300, 600, 900],
  "range_type": "time"
}
```

### Response Format
```json
{
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [...]
      },
      "properties": {
        "value": 300
      }
    }
  ]
}
```

### Caching
Network isochrones are cached for **12 hours** to:
- Reduce API usage
- Improve performance
- Avoid rate limits
- Speed up repeat searches

See `lib/cache.ts` for implementation details.

## Benefits

### For Users:
- More accurate accessibility estimates
- Professional-grade analysis
- Better planning decisions
- CEQA/NEPA compliance

### For Developers:
- Free API (2,000 req/day)
- Simple REST API
- GeoJSON standard format
- Well-documented

## Resources

- **ORS Documentation**: https://openrouteservice.org/dev/#/api-docs
- **ORS Forum**: https://ask.openrouteservice.org/
- **API Reference**: https://openrouteservice.org/dev/#/api-docs/v2/isochrones
- **Sign Up**: https://openrouteservice.org/dev/#/signup

---

**The app gracefully falls back to radius estimates if network analysis is unavailable, ensuring it always works.**

