# Documentation Structure Guide

## Current Organization

TransitScore 3D maintains clean, evergreen documentation with no temporal references.

### Root Files (3)
```
/
├── README.md           # Project overview and quick start
├── CHANGELOG.md        # Version history
├── STATUS.md           # Current features and deployment status
└── DOCUMENTATION.md    # This navigation guide
```

### Documentation Folder (9 files)
```
docs/
├── README.md             # Documentation index
├── USER_GUIDE.md         # End-user guide
├── FEATURES.md           # Complete feature list
├── ARCHITECTURE.md       # System architecture
├── API.md                # API reference
├── DEPLOYMENT.md         # Deployment instructions
├── NETWORK_ANALYSIS.md   # Network routing setup
├── PAID_VERSION.md       # Paid version configuration
└── CONTRIBUTING.md       # Contribution guidelines
```

## Documentation Principles

### Evergreen
- No "final", "complete", "v1.1.0" in titles
- Version history only in CHANGELOG.md
- Always current, always accurate

### Organized
- Clear separation: root vs docs/
- Single purpose per file
- Cross-referenced properly

### Complete
- All features documented
- Code examples included
- Troubleshooting guidance
- Updated with releases

## Quick Reference

| Need | Read |
|------|------|
| Install | README.md |
| Use app | docs/USER_GUIDE.md |
| Features | docs/FEATURES.md |
| Deploy | docs/DEPLOYMENT.md |
| Network setup | docs/NETWORK_ANALYSIS.md |
| Paid version | docs/PAID_VERSION.md |
| API | docs/API.md |
| Contribute | docs/CONTRIBUTING.md |
| Architecture | docs/ARCHITECTURE.md |
| Versions | CHANGELOG.md |
| Status | STATUS.md |

## Maintenance

### When adding features:
1. Update CHANGELOG.md (Unreleased section)
2. Update relevant docs (FEATURES, USER_GUIDE, etc.)
3. Update STATUS.md if needed

### When releasing:
1. Move Unreleased to new version in CHANGELOG
2. Update STATUS.md deployment info
3. Other docs stay evergreen (no version references)

---

**All documentation is version-agnostic and continuously maintained.**

