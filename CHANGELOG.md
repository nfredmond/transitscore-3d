# Changelog

All notable changes to TransitScore 3D will be documented in this file.

## [Unreleased]

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

