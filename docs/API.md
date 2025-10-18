# TransitScore 3D - API Documentation

## API Routes

All API routes are serverless functions deployed on Vercel.

---

## Geocoding

### Endpoint
```
GET /api/geocode
```

### Parameters
- `address` (string, required): California address to geocode

### Response
```json
{
  "lat": 38.5810509,
  "lng": -121.522734,
  "address": "1075 W Capitol Ave, West Sacramento, CA 95691",
  "city": "Sacramento"
}
```

### Errors
- `400`: Address is required
- `404`: Address not found
- `400`: Address not in California

### Example
```
/api/geocode?address=1400%20K%20St%2C%20Sacramento%2C%20CA
```

---

## Amenities

### Endpoint
```
GET /api/amenities
```

### Parameters
- `lat` (number, required): Latitude
- `lng` (number, required): Longitude

### Response
```json
{
  "amenities": [
    {
      "id": "123456",
      "name": "Bus Stop",
      "type": "bus_stop",
      "category": "transit",
      "lat": 38.5812,
      "lng": -121.5228,
      "distance": 150
    }
  ],
  "count": 42
}
```

### Categories
- `transit` - Bus stops, rail stations, ferry terminals
- `bikeway` - Bike infrastructure
- `food` - Restaurants, cafes, bars
- `shopping` - Stores, supermarkets
- `education` - Schools, libraries
- `parks` - Parks, recreation
- `health` - Healthcare facilities

### Errors
- `400`: Lat/lng required
- `500`: Overpass API failed

---

## Isochrone (Network Analysis)

### Endpoint
```
GET /api/isochrone
```

### Parameters
- `lat` (number, required): Latitude
- `lng` (number, required): Longitude
- `mode` (string, required): 'walk' or 'bike'

### Response
```json
{
  "isochrones": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-121.522, 38.581], ...]]
      },
      "properties": {
        "value": 300,
        "center": [38.581, -121.522]
      }
    }
  ],
  "mode": "walk"
}
```

### Time Values
- `300` - 5 minutes
- `600` - 10 minutes
- `900` - 15 minutes

### Fallback
Returns `{ "isochrones": null, "fallback": true }` if network analysis unavailable

---

## Analysis

### Endpoint
```
POST /api/analyze
```

### Request Body
```json
{
  "address": "1400 K St, Sacramento, CA",
  "lat": 38.5810509,
  "lng": -121.522734,
  "amenities": [...]
}
```

### Response
```json
{
  "scores": {
    "walkability": 85,
    "bikeability": 72,
    "transit": 68,
    "density": 75,
    "sustainability": 75
  },
  "recommendation": "This site supports high-density development...",
  "suggestedUnits": 35,
  "recommendedHeight": 4,
  "reasoning": [
    "Excellent walkability score indicates strong pedestrian infrastructure",
    "Good bike facilities support active transportation",
    "Transit access enables car-free living for many residents"
  ]
}
```

### AI Model
- Uses Anthropic Claude 3.5 Sonnet
- Analyzes site context and amenities
- Provides evidence-based recommendations
- Falls back to rule-based logic if AI unavailable

### Errors
- `400`: Missing required fields
- `500`: Analysis failed

---

## Payment Routes (Paid Version Only)

### Create Checkout Session
```
POST /api/create-checkout-session
```

**Request**:
```json
{
  "email": "user@example.com",
  "userId": "uuid"
}
```

**Response**:
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

### Webhook
```
POST /api/webhook
```

Handles Stripe webhook events:
- `checkout.session.completed`
- `customer.subscription.updated`  
- `customer.subscription.deleted`

Requires valid Stripe signature in headers.

---

## Rate Limits

### External APIs

**Nominatim (Geocoding)**:
- Limit: 1 request per second
- Usage: Respectful, not rate limited in practice

**Overpass API (Amenities)**:
- Timeout: 25 seconds per query
- May rate-limit under heavy load
- Retry after a few minutes if failed

**OpenRouteService (Isochrones)**:
- Free tier: 2000 requests/day
- 40 requests/minute
- Fallback to radius if exceeded

**Anthropic (AI)**:
- Based on your API plan
- Fallback logic if unavailable

---

## Error Handling

All API routes include comprehensive error handling:
- Try-catch blocks
- Descriptive error messages
- Appropriate HTTP status codes
- Console logging for debugging
- Graceful fallbacks where applicable

---

## Security

### Public Routes
All analysis routes are public (no authentication required on free version)

### Protected Routes (Paid Version)
- Middleware checks authentication
- Validates active subscription
- Returns 401/403 for unauthorized access

### Environment Variables
All API keys stored securely in Vercel environment variables:
- Never exposed to client
- Not committed to repository
- Rotatable without code changes

---

This API documentation serves as an ongoing reference for developers.

