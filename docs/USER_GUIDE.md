# TransitScore 3D - User Guide

## Getting Started

TransitScore 3D analyzes California development sites to provide walkability, bikeability, and transit scores along with environmental impact calculations.

---

## Quick Analysis

### Basic Steps
1. Enter a California address in the search bar
2. Click "Analyze Site" button
3. Wait 5-10 seconds for analysis to complete
4. View results in map and dashboard

### What You'll See
- Interactive map with network-based accessibility areas
- Amenity markers showing nearby services
- Scores for walkability, bikeability, transit, and sustainability
- AI-powered density recommendations

---

## Analysis Wizard

For comprehensive project planning, use the Setup Wizard:

### Access
Click "🧙 Launch Setup Wizard" button below the search bar

### Step 1: Address
- Enter the site address
- Use suggested examples or enter custom address
- Must be within California

### Step 2: Building Characteristics
- Select building type (Residential, Mixed-Use, Commercial)
- Set number of floors (1-12)
- Enter total square footage
- Specify number of units
- Set parking spaces
- Adjust affordable housing percentage

### Step 3: TDM Programs
- Browse programs by category
- Select applicable programs
- See real-time VMT reduction
- View cumulative impact

### Complete
Click "Analyze Development" to run comprehensive analysis with your configuration

---

## Walk vs Bike Mode

### Toggle Between Modes
Use the Walk 🚶 / Bike 🚴 toggle in the header

### Walk Mode
- Shows 5/10/15 minute walking accessibility
- Based on pedestrian network (sidewalks, paths)
- Displays walkability score
- Smaller reachable areas

### Bike Mode  
- Shows 5/10/15 minute biking accessibility
- Based on cycling network (bike lanes, low-traffic streets)
- Displays bikeability score
- Larger reachable areas

### Network-Based vs Radius
- **Network-based** (preferred): Follows actual street network, shows realistic accessibility
- **Radius estimate** (fallback): Simple circles if network API unavailable
- Legend indicates which method is active

---

## Dashboard Modes

### Scores Tab
- View all performance metrics
- Read AI-powered recommendation
- See amenity count and distribution
- Export analysis as PDF

### Scenario Tab
- Configure building characteristics
- Select TDM programs
- View VMT/GHG impact
- See climate equivalents (cars/trees)
- Review sustainability rating

---

## Understanding Scores

### Walkability Score (0-100)
- **Excellent (80-100)**: Outstanding pedestrian access, daily needs within walk
- **Good (60-79)**: Strong walkability, most amenities accessible
- **Fair (40-59)**: Moderate access, some amenities within reach
- **Poor (0-39)**: Limited walkability, car-dependent

### Bikeability Score (0-100)
- **Excellent (80-100)**: Extensive bike infrastructure, highly bikeable
- **Good (60-79)**: Good cycling facilities, safe bike access
- **Fair (40-59)**: Some bike infrastructure, moderate cycling conditions
- **Poor (0-39)**: Limited bike facilities, challenging for cyclists

### Transit Score (0-100)
- **Excellent (80-100)**: Multiple transit options nearby, frequent service
- **Good (60-79)**: Good transit access, regular service
- **Fair (40-59)**: Some transit available, may require transfers
- **Poor (0-39)**: Limited transit, infrequent service

---

## Environmental Impact Metrics

### VMT (Vehicle Miles Traveled)
- **Daily VMT per Capita**: Average miles driven per person per day
- **Annual VMT**: Total miles driven by all residents per year
- **Reduction**: Percentage below California baseline (20.8 mi/capita/day)

### GHG (Greenhouse Gas Emissions)
- **Annual CO2e**: Total emissions in metric tons per year
- **Reduction**: Percentage below baseline
- **Cars Removed**: Equivalent number of cars off the road
- **Trees Planted**: Equivalent carbon absorption

---

## TDM Programs

### Categories

**Infrastructure**: Physical facilities that enable alternatives to driving
- Bike parking, car share spaces, EV charging

**Pricing & Incentives**: Financial programs that discourage driving
- Unbundled parking, transit subsidies, parking cash-out

**Programs & Services**: Organizational support for alternative travel
- Carpool matching, telecommute support, flexible hours

**Policy & Design**: Site design and regulations that reduce VMT
- Reduced parking ratios, transit-oriented design, complete streets

### Effectiveness
- Each program shows its VMT reduction percentage
- Programs are cumulative
- Site context bonus amplifies effectiveness (up to +25%)
- Based on published research and CARB guidelines

---

## Exporting Results

### PDF Export
1. Click "Export Analysis as PDF" button in dashboard
2. PDF automatically downloads
3. Includes all scores, recommendations, and amenities
4. If scenario configured, includes 2nd page with VMT/GHG analysis

### Filename Format
`TransitScore_[Address]_[Date].pdf`

### Report Contents
- Site information
- Performance scores with visual indicators
- AI recommendation
- Amenity summary table
- Building characteristics (if configured)
- VMT/GHG analysis (if configured)
- Selected TDM programs (if configured)

---

## Map Features

### Interactive Elements
- Click amenity markers for details
- Click accessibility areas for time information
- Drag to pan
- Scroll to zoom
- Click fullscreen button for immersive view

### Legend
- Site location (red marker)
- Amenity categories with color coding
- Accessibility time rings
- Network-based indicator

### Dark Mode
- Toggle with moon/sun icon in header
- Applies to entire application
- Persists across sessions

---

## Tips for Best Results

### Address Input
- Include city and state for best results
- Use full street addresses
- Works for any California location

### Network Analysis
- Network-based isochrones may take 1-2 seconds
- Requires internet connection to OpenRouteService
- Falls back to radius circles if unavailable

### Scenario Planning
- Realistic building configurations yield better insights
- Select TDM programs you can actually implement
- Higher walk/bike scores amplify TDM effectiveness

### PDF Exports
- Configure scenario before exporting for comprehensive report
- Exports reflect current dashboard state
- Can export multiple scenarios for comparison

---

## Troubleshooting

### "Failed to fetch amenities"
- Overpass API may be rate-limited (wait a few minutes)
- Try a different address
- Check internet connection

### Scores seem low
- Rural areas naturally have lower scores
- Consider bike mode for better accessibility
- Review nearby amenities in legend

### PDF export not working
- Check browser allows downloads
- Disable popup blockers
- Try a different browser

---

This user guide provides ongoing reference for using TransitScore 3D effectively.

