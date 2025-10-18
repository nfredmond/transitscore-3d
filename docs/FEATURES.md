# TransitScore 3D - Features Documentation

## Overview

TransitScore 3D is a professional development impact analyzer for California sites, providing network-based accessibility analysis, VMT/GHG calculations, and comprehensive scenario planning.

---

## Core Analysis Features

### Network-Based Accessibility Analysis
- **True Street Network Analysis** using OpenRouteService API
- Calculates reachable areas following actual walkable/bikeable routes
- Shows organic accessibility polygons (not simple radius circles)
- Accounts for barriers like freeways, rivers, and terrain
- Separate analysis for walking and biking modes

### Dual-Mode Analysis
- **Walk Mode**: 5/10/15 minute walking isochrones
- **Bike Mode**: 5/10/15 minute biking isochrones  
- Both calculated automatically during analysis
- Toggle between modes to compare accessibility
- Network shapes update dynamically

### Scoring Metrics
- **Walkability Score** (0-100): Based on amenity variety, quantity, and proximity
- **Bikeability Score** (0-100): Based on cycling infrastructure and bike-accessible amenities
- **Transit Score** (0-100): Based on transit stop proximity and availability
- **Density Potential**: AI-generated recommendation for units
- **Sustainability Score**: Combined multimodal transportation score

---

## Amenity Detection

### Categories (7 Total)
1. **Transit**: Bus stops, light rail, train stations, ferry terminals
2. **Bikeways**: Bike lanes, paths, parking, share stations
3. **Food & Dining**: Restaurants, cafes, bars, fast food
4. **Shopping**: Supermarkets, convenience stores, malls
5. **Education**: Schools, colleges, universities, libraries
6. **Parks & Recreation**: Parks, playgrounds, sports centers
7. **Healthcare**: Hospitals, clinics, pharmacies

### Data Source
- OpenStreetMap via Overpass API
- Real-time amenity data
- Comprehensive coverage across California
- Distance calculations for each amenity

---

## Scenario Planning

### Building Characteristics Input
- Building type (Residential, Mixed-Use, Commercial)
- Number of floors (1-12)
- Total square footage
- Number of units
- Parking spaces (auto-calculates ratio)
- Affordable housing percentage
- Estimated population calculation

### Transportation Demand Management (TDM) Programs
14 evidence-based programs across 4 categories:

**Infrastructure** (4 programs):
- Secure Bike Parking & Lockers (-3.5% VMT)
- On-Site Bike Share Station (-2.5% VMT)
- EV Charging Stations (-1.0% VMT)
- Car Share Program (-4.0% VMT)

**Pricing & Incentives** (3 programs):
- Unbundled Parking (-5.0% VMT)
- Transit Pass Subsidy (-6.5% VMT)
- Parking Cash-Out (-4.5% VMT)

**Programs & Services** (4 programs):
- Carpool/Vanpool Program (-3.0% VMT)
- Telecommute Support (-4.0% VMT)
- Guaranteed Ride Home (-2.0% VMT)
- Flexible Work Hours (-2.5% VMT)

**Policy & Design** (3 programs):
- Reduced Parking Ratio (-7.0% VMT)
- Transit-Oriented Design (-5.5% VMT)
- Complete Streets Features (-3.5% VMT)

### Site Context Bonus
High walkability/bikeability scores amplify TDM program effectiveness by up to 25%

---

## Environmental Impact Calculations

### VMT Analysis
**Methodology**: California Air Resources Board (CARB) guidelines

**Baseline**: 20.8 miles per capita per day (California statewide average)

**Reduction Factors**:
- Walkability: Up to 30% reduction
- Bikeability: Up to 15% reduction
- Transit access: Up to 25% reduction
- TDM programs: Varies by program (cumulative)

**Metrics Calculated**:
- Daily VMT per capita
- Total daily VMT
- Annual VMT
- VMT reduction percentage vs baseline

### GHG Emissions Analysis
**Conversion Factors**:
- 0.89 lbs CO2e per vehicle mile
- 2.5 people per household (California average)
- 4.6 metric tons CO2e per car per year
- 48 lbs CO2 absorbed per tree per year

**Metrics Calculated**:
- Daily GHG emissions (kg CO2e)
- Annual GHG emissions (metric tons CO2e)
- GHG reduction percentage
- Climate equivalents (cars removed, trees planted)

---

## User Interfaces

### Quick Analysis Mode
Simple address search with immediate results:
1. Enter California address
2. Watch multi-step loading progress (Geocoding → Amenities → Isochrones → AI)
3. View scores, map, and recommendations
4. Optionally configure scenario

### Analysis Wizard
Guided 3-step comprehensive planning:
1. **Step 1**: Enter address
2. **Step 2**: Configure building characteristics
3. **Step 3**: Select TDM programs
4. Get complete analysis with pre-configured scenarios

### Dashboard Modes
- **Scores Tab**: View walk/bike/transit scores and AI recommendations
- **Scenario Tab**: Configure development and see VMT/GHG impact

### Scenario Management
- **Save Scenarios**: Store up to 3 scenarios with custom names
- **Compare Scenarios**: Side-by-side comparison with delta indicators
- **Persistent Storage**: Scenarios saved to browser localStorage
- **Visual Deltas**: Color-coded changes (green improvements, red regressions)

---

## Visualization

### 2D Map View
- CARTO Voyager basemap (professional cartography)
- Network-based isochrone polygons
- Amenity markers (color-coded by category)
- Interactive legend
- Fullscreen capability
- Walk/bike mode toggle

### 3D Building View
- deck.gl visualization
- Adjustable building heights (2-4 stories)
- Sacramento zoning setbacks applied
- Interactive controls

---

## AI-Powered Recommendations

### Claude Integration
- Anthropic Claude 3.5 Sonnet model
- Context-aware density suggestions
- Considers walkability, bikeability, transit scores
- Provides reasoning for recommendations
- Fallback logic if API unavailable

---

## PDF Export

### Report Contents
**Page 1: Site Analysis**
- Site information and coordinates
- Performance scores with progress bars
- AI-powered recommendation
- Nearby amenities table

**Page 2: Scenario Analysis** (when configured)
- Building characteristics
- VMT analysis (baseline vs with TDM)
- GHG emissions comparison
- Selected TDM programs
- Climate impact equivalents

---

## Performance & Reliability

### Caching System
- **In-memory caching** with TTL (Time To Live)
- **Geocoding cache**: 24 hours
- **Amenity cache**: 6 hours  
- **Isochrone cache**: 12 hours
- **AI analysis cache**: 1 hour
- Reduces API calls and improves response times by 60-70%

### Error Handling
- **Global error boundaries** catch application errors
- **Component-level boundaries** for isolated error recovery
- **Auto-retry logic** with exponential backoff (1s, 2s, 3s delays)
- **Graceful degradation** (e.g., radius fallback when network analysis unavailable)
- **Enhanced error messages** with actionable retry buttons

### Rate Limiting
- **Middleware protection**: 30 requests per minute per IP
- **Rate limit headers**: X-RateLimit-Limit, X-RateLimit-Remaining
- **429 responses** with retry-after information
- Prevents API abuse and ensures fair usage

### Loading States
- **Multi-step progress indicators** show current operation
- **Skeleton screens** during initial load
- **Smooth animations** for state transitions
- **Percentage-based progress** for user feedback

---

## Technical Specifications

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript (strict mode with downlevelIteration)
- Tailwind CSS with custom animations
- Dark/light mode support

### Maps & 3D
- Leaflet for 2D maps
- deck.gl for 3D visualization
- OpenStreetMap tiles via CARTO

### APIs Integrated
- Nominatim (geocoding)
- Overpass API (amenity data)
- OpenRouteService (network isochrones)
- Anthropic Claude (AI recommendations)
- Supabase (database)

### Database (Supabase)
- `analyzed_sites` - Site analysis logs
- `amenity_cache` - Performance optimization
- `subscriptions` - Pro version user subscriptions (paid version only)

---

## Calculation Methodology

### Walkability Score
- Count-based: 50 points for 20+ amenities
- Diversity-based: 50 points for 7+ categories
- Total: 0-100 scale

### Bikeability Score
- Infrastructure-based: 40 points for 10+ bike facilities
- Accessibility-based: 60 points for amenities within 2km by bike
- Total: 0-100 scale

### Transit Score
- Proximity-based: Higher scores for closer stops
- Quantity-based: More stops = higher score
- Weighted by distance (<400m highest weight)

### Sustainability Score
- Average of walkability, bikeability, and transit scores
- Indicates overall multimodal transportation potential

---

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers

---

## Performance

- Build time: ~35-50 seconds
- Bundle size: 224 KB First Load JS
- API response: <3 seconds for complete analysis
- Network isochrone: 1-2 seconds per mode
- PDF generation: Instant (client-side)

---

This documentation provides an evergreen reference for developers working on TransitScore 3D.

