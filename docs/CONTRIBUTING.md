# Contributing to TransitScore 3D

## Welcome!

Thank you for your interest in contributing to TransitScore 3D. This document provides guidelines for contributing to the project.

---

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

---

## How to Contribute

### Reporting Bugs
1. Check if the bug has already been reported in Issues
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser/OS information

### Suggesting Features
1. Check existing issues and discussions
2. Create a new issue with:
   - Clear use case
   - Expected behavior
   - Potential implementation approach
   - Benefits to users

### Contributing Code

#### Setup
1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

#### Development
1. Make your changes
2. Test locally: `npm run dev`
3. Ensure TypeScript compiles: `npm run build`
4. Follow existing code style
5. Add comments for complex logic

#### Pull Request
1. Push to your fork
2. Create PR against `main` branch
3. Include:
   - Description of changes
   - Screenshots if UI changes
   - Related issue numbers
4. Wait for review

---

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow existing file structure
- Use meaningful variable names
- Add JSDoc comments for functions
- Keep components focused and reusable

### Component Guidelines
- Use functional components with hooks
- Implement proper TypeScript interfaces
- Handle loading and error states
- Support dark mode
- Make responsive

### API Guidelines
- Include comprehensive error handling
- Return appropriate HTTP status codes
- Add request validation
- Log errors for debugging
- Document in docs/API.md

---

## Testing

### Manual Testing
- Test on multiple browsers
- Check mobile responsiveness
- Verify dark mode
- Test error scenarios
- Validate calculations

### Areas to Test
- Address geocoding (various California locations)
- Network isochrone generation
- Walk vs bike mode switching
- Scenario planning calculations
- PDF export functionality
- TDM program selection
- VMT/GHG calculations

---

## Documentation

When adding features, update:
- `docs/FEATURES.md` - Feature descriptions
- `docs/API.md` - API changes
- `docs/USER_GUIDE.md` - User-facing instructions
- `docs/ARCHITECTURE.md` - Technical changes
- `CHANGELOG.md` - Notable changes
- `README.md` - If necessary

---

## Calculation Methodology

When modifying VMT/GHG calculations:
- Follow CARB (California Air Resources Board) guidelines
- Document sources and assumptions
- Include comments explaining methodology
- Add references to research papers
- Ensure defensibility for planning submissions

---

## Questions?

- Open an issue for discussion
- Review existing documentation in `docs/`
- Check the README for setup instructions

---

Thank you for contributing to TransitScore 3D!

