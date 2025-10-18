# TransitScore 3D - Architecture Documentation

## System Overview

TransitScore 3D is a Next.js application that provides development impact analysis for California sites using network-based accessibility calculations, environmental impact metrics, and AI-powered recommendations.

---

## Technology Stack

### Frontend Framework
- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- Client-side and server-side rendering

### State Management
- React hooks (useState, useEffect, useContext)
- ThemeContext for dark/light mode
- Session storage for wizard data

### Mapping & Visualization
- **Leaflet** - 2D interactive maps
- **deck.gl** - 3D building visualization
- **CARTO** - Basemap tiles (Voyager style)
- **GeoJSON** - Isochrone polygon rendering

### PDF Generation
- **jsPDF** - Core PDF library
- **jspdf-autotable** - Table formatting
- Client-side generation (no server processing)

---

## External APIs

### Geocoding
- **Service**: Nominatim (OpenStreetMap)
- **Purpose**: Convert addresses to coordinates
- **Endpoint**: `/api/geocode`
- **Rate Limit**: Respectful usage (1 req/sec recommended)

### Amenity Data
- **Service**: Overpass API (OpenStreetMap)
- **Purpose**: Fetch nearby points of interest
- **Endpoint**: `/api/amenities`
- **Timeout**: 25 seconds
- **Radius**: 1500m search area

### Network Analysis
- **Service**: OpenRouteService
- **Purpose**: Calculate street network-based isochrones
- **Endpoint**: `/api/isochrone`
- **Modes**: foot-walking, cycling-regular
- **Free Tier**: 2000 requests/day

### AI Recommendations
- **Service**: Anthropic Claude
- **Model**: claude-3-5-sonnet-20241022
- **Purpose**: Generate density recommendations
- **Endpoint**: `/api/analyze`
- **Fallback**: Rule-based recommendations if API fails

### Database
- **Service**: Supabase (PostgreSQL)
- **Purpose**: Analytics logging, amenity caching, user subscriptions
- **Client**: @supabase/supabase-js
- **Security**: Row Level Security (RLS) enabled

### Payments (Paid Version)
- **Service**: Stripe
- **Purpose**: Subscription billing
- **Mode**: Recurring monthly
- **Webhooks**: Real-time subscription updates

---

## Application Flow

### Analysis Flow
```
1. User enters address
   ↓
2. /api/geocode → Get coordinates
   ↓
3. /api/amenities → Fetch nearby POIs
   ↓
4. /api/isochrone (walk) → Network accessibility
   ↓
5. /api/isochrone (bike) → Network accessibility
   ↓
6. /api/analyze → AI recommendations + scores
   ↓
7. Render map + dashboard
   ↓
8. Log to Supabase
```

### Wizard Flow
```
1. User clicks "Launch Setup Wizard"
   ↓
2. Step 1: Enter address
   ↓
3. Step 2: Configure building
   ↓
4. Step 3: Select TDM programs
   ↓
5. Store in sessionStorage
   ↓
6. Redirect to main page
   ↓
7. Auto-load wizard configuration
   ↓
8. Trigger full analysis
```

### Scenario Planning Flow
```
1. User switches to Scenario tab
   ↓
2. Configure building characteristics
   ↓
3. Select TDM programs
   ↓
4. Real-time VMT/GHG calculations
   ↓
5. Display impact metrics
   ↓
6. Show climate equivalents
```

---

## Component Architecture

### Page Components
- `app/page.tsx` - Main application page
- `app/wizard/page.tsx` - Analysis wizard
- `app/auth/page.tsx` - Authentication (paid version)
- `app/subscribe/page.tsx` - Subscription checkout (paid version)

### Feature Components
- `AddressSearch.tsx` - Address input and analysis trigger
- `MapView.tsx` - 2D Leaflet map with isochrones
- `ThreeDView.tsx` - 3D deck.gl building visualization
- `ScoreDashboard.tsx` - Metrics display and PDF export
- `AnalysisWizard.tsx` - 3-step guided setup
- `ScenarioPlanner.tsx` - Scenario configuration
- `BuildingInput.tsx` - Building characteristics form
- `TDMSelector.tsx` - TDM program selection
- `ImpactMetrics.tsx` - VMT/GHG display

### Utility Components
- `Auth.tsx` - Authentication UI (paid version)
- `DrawablePolygon.tsx` - Polygon drawing tool

### Context Providers
- `ThemeContext.tsx` - Dark/light mode management

---

## API Routes

### Analysis Routes
- `GET /api/geocode?address={address}` - Address geocoding
- `GET /api/amenities?lat={lat}&lng={lng}` - Fetch amenities
- `GET /api/isochrone?lat={lat}&lng={lng}&mode={mode}` - Network isochrones
- `POST /api/analyze` - AI analysis and scoring

### Payment Routes (Paid Version)
- `POST /api/create-checkout-session` - Create Stripe checkout
- `POST /api/webhook` - Handle Stripe webhooks

---

## Data Models

### Analysis Result
```typescript
{
  scores: {
    walkability: number (0-100)
    bikeability: number (0-100)
    transit: number (0-100)
    density: number (0-100)
    sustainability: number (0-100)
  }
  recommendation: string
  suggestedUnits: number
  reasoning: string[]
}
```

### Amenity
```typescript
{
  id: string
  name: string
  type: string
  category: string
  lat: number
  lng: number
  distance: number (meters)
}
```

### Building Characteristics
```typescript
{
  floors: number
  totalSqFt: number
  units: number
  parkingSpaces: number
  buildingType: 'residential' | 'mixed-use' | 'commercial'
  affordableHousingPercent: number
}
```

### TDM Program
```typescript
{
  id: string
  name: string
  description: string
  vmtReduction: number (percentage)
  category: 'infrastructure' | 'pricing' | 'programs' | 'policy'
  enabled: boolean
}
```

---

## Security

### Free Version
- Public API routes
- Row Level Security on Supabase tables
- No sensitive user data stored
- Environment variables secured in Vercel

### Paid Version
- Middleware authentication check
- Supabase Auth (email/password)
- JWT session management
- Stripe PCI compliance
- Webhook signature verification
- RLS policies on user data

---

## Performance Optimizations

### Caching
- Amenity data cached in Supabase (24 hours)
- Network isochrones cached in memory
- Static page generation where possible

### Code Splitting
- Dynamic imports for map components (no SSR)
- Lazy loading for heavy libraries
- Tree shaking enabled

### Build Optimization
- TypeScript strict mode
- Minimized bundle size
- Compressed assets
- CDN delivery via Vercel Edge Network

---

## Extensibility

### Adding New TDM Programs
Edit `lib/tdmCalculations.ts`:
```typescript
export const TDM_PROGRAMS: TDMProgram[] = [
  {
    id: 'new-program',
    name: 'Program Name',
    description: 'Description',
    vmtReduction: 5.0,
    category: 'infrastructure',
    enabled: false
  },
  // ... existing programs
]
```

### Adding New Amenity Categories
Edit `lib/utils.ts`:
```typescript
export const AMENITY_CATEGORIES = {
  newCategory: {
    name: 'Category Name',
    color: '#HEX_COLOR',
    icon: '🎯',
    types: ['type1', 'type2']
  },
  // ... existing categories
}
```

### Adding New Calculations
Create new files in `lib/` directory following existing patterns:
- Export calculation functions
- Include TypeScript interfaces
- Add comprehensive comments
- Follow CARB methodology where applicable

---

This architecture documentation serves as an ongoing reference for developers.

