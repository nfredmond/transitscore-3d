# Network Analysis Setup Guide

## Problem: Network-based Isochrones Not Working

If you're seeing **"~ Radius estimate"** in the map legend instead of **"✓ Network-based"**, it means the OpenRouteService (ORS) API is not working.

### Why It's Not Working

The OpenRouteService API key included in the code is either:
- Invalid or expired
- Rate-limited (free tier limits)
- Access denied

### Solution: Get a Free ORS API Key

Follow these steps to enable true network-based accessibility analysis:

#### Step 1: Sign Up for OpenRouteService

1. Go to: https://openrouteservice.org/dev/#/signup
2. Create a free account
3. Confirm your email

#### Step 2: Get Your API Key

1. Log in to your ORS account
2. Go to your dashboard
3. Click "Request a Token" or "Get API Key"
4. Copy your API key (it looks like: `5b3ce359...`)

#### Step 3: Add to Your Project

Create or update `.env.local` in your project root:

```bash
# OpenRouteService API Key for network-based isochrones
OPENROUTE_SERVICE_API_KEY=your_api_key_here

# Your existing environment variables
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
ANTHROPIC_API_KEY=...
```

#### Step 4: Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### Verify It's Working

1. Open your app at http://localhost:3000
2. Search for any California address
3. Look at the legend in the bottom-right of the map
4. You should now see: **"✓ Network-based"** instead of **"~ Radius estimate"**

### What's the Difference?

**Radius Estimate (Fallback):**
- Simple circles based on straight-line distance
- 5 min = 400m radius
- 10 min = 800m radius  
- 15 min = 1200m radius

**Network-Based (ORS API):**
- Uses actual street network and routing
- Accounts for one-way streets, barriers, bridges
- Shows true walkable/bikeable areas
- Much more accurate for urban planning

### Free Tier Limits

OpenRouteService free tier includes:
- 2,000 requests per day
- 40 requests per minute
- Perfect for development and testing

### Alternative: Use Mapbox Isochrone API

If you prefer, you can switch to Mapbox Isochrone API:

1. Sign up at: https://www.mapbox.com/
2. Get your access token
3. Update `app/api/isochrone/route.ts` to use Mapbox API instead

### Troubleshooting

**Still seeing "Radius estimate"?**

1. Check your `.env.local` file exists in project root
2. Verify the API key is correct (no extra spaces)
3. Restart the dev server
4. Clear browser cache
5. Check the terminal console for error messages

**API Key Not Working?**

1. Verify your email with OpenRouteService
2. Check if your account is activated
3. Generate a new API key if needed
4. Check rate limits haven't been exceeded

### Need Help?

- ORS Documentation: https://openrouteservice.org/dev/#/api-docs
- ORS Forum: https://ask.openrouteservice.org/
- Create an issue on the project GitHub

---

**Note:** The app will automatically fall back to radius estimates if the ORS API fails. This ensures the app always works, even without network-based analysis.

