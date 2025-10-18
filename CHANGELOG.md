# Changelog

All notable changes to TransitScore 3D will be documented in this file.

## [1.1.0] - 2025-10-18

### Added - User Experience
- 📊 **Multi-step loading progress** - Visual progress indicator showing geocoding, amenity fetching, network analysis, and AI generation steps
- 💀 **Skeleton loading screens** - Smooth loading states for maps and dashboards
- 🎨 **Enhanced animations** - Stagger animations for cards, hover effects, and smooth transitions throughout
- 📱 **Mobile-first responsive design** - Optimized layout for mobile devices with touch-friendly 44px minimum button sizes
- 📐 **Compact mobile header** - Responsive header with abbreviated labels on small screens

### Added - Features
- 🔄 **Scenario Comparison** - Save up to 3 scenarios and compare them side-by-side with delta indicators
- 💾 **Scenario Persistence** - Scenarios saved to localStorage with timestamps
- 🔄 **Auto-retry with backoff** - Automatic retry for failed requests with exponential backoff
- 🛡️ **Error boundaries** - Global and component-level error handling with retry options
- ⚠️ **Enhanced error messages** - Specific error messages for rate limiting, network failures, and API errors

### Added - Performance & Reliability
- 💾 **In-memory caching** - TTL-based caching for geocoding (24h), amenities (6h), isochrones (12h), and AI (1h)
- 🚦 **Rate limiting middleware** - 30 requests per minute limit with retry-after headers
- 🔧 **Request deduplication** - Prevents duplicate parallel API calls
- ⚡ **Parallel isochrone fetching** - Walk and bike isochrones fetched simultaneously
- 🔄 **Cache hit indicators** - Development mode logging for cache performance

### Added - Accessibility & Polish
- ♿ **Focus indicators** - Visible focus states for keyboard navigation
- 🎯 **ARIA labels** - Comprehensive aria-label attributes on interactive elements
- 🌈 **Improved color contrast** - Enhanced dark mode with WCAG AA compliance
- 📜 **Smooth scrolling** - Browser-wide smooth scroll behavior
- ✨ **Custom scrollbars** - Themed scrollbars for light and dark modes

### Technical
- Created `LoadingProgress` component with step tracking
- Created `SkeletonLoader` components for loading states
- Created `ErrorBoundary` and `ComponentErrorBoundary` for error handling
- Created `ScenarioComparison` modal component
- Created `lib/cache.ts` with TTL-based memory cache
- Created `middleware.ts` for rate limiting
- Added retry logic to `AddressSearch` component
- Enhanced `app/globals.css` with animation keyframes and utility classes
- Updated all API routes with caching support

## [1.0.0] - Previous Release

### Added
- Network-based isochrone analysis using OpenRouteService
- Walk and bike mode toggle with separate accessibility calculations
- Analysis Wizard with 3-step guided flow
- 14 TDM (Transportation Demand Management) programs
- VMT (Vehicle Miles Traveled) calculations based on CARB methodology
- GHG (Greenhouse Gas) emissions analysis
- Climate impact equivalents (cars removed, trees planted)
- Scenario planning mode with building characteristics input
- Professional 2-page PDF export with impact metrics
- Dark mode throughout entire application
- CARTO Voyager basemap
- Fullscreen map option
- Enhanced transit and bikeway detection
- Bikeability scoring system
- Join Pro button for paid tier
- Venmo donation integration (@Nathaniel-Redmond)
- Comprehensive evergreen documentation in docs/ folder

### Changed
- Expanded from Sacramento-only to California-wide coverage
- Improved from radius circles to network-based accessibility polygons
- Enhanced Overpass API queries for better amenity detection
- Wizard button moved below search bar for better layout
- Consolidated documentation into organized docs/ directory

### Technical
- Upgraded to Next.js 14 App Router
- Implemented TypeScript strict mode
- Added middleware for paid version authentication
- Integrated Stripe for subscription billing
- Created dual-branch deployment strategy (main for free, paid-version for pro)

---

This changelog uses [Keep a Changelog](https://keepachangelog.com/) format and follows [Semantic Versioning](https://semver.org/).

