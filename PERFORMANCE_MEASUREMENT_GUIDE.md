# Performance Measurement Guide

This guide explains how to measure real performance improvements when migrating prototypes.

## Quick Start

### 1. Measure Before Migration
```bash
# Before removing component from main app
node scripts/measure-performance.js --phase=before --migration=enhanced-parcel-zone-crops
```

### 2. Remove Component from Main App
- Remove the component from the main app
- Remove from routes
- Remove from lazy loading
- Clean up imports

### 3. Measure After Migration  
```bash
# After removing component from main app
node scripts/measure-performance.js --phase=after --migration=enhanced-parcel-zone-crops
```

### 4. View Results
```bash
# Display improvement results
node scripts/measure-performance.js --results --migration=enhanced-parcel-zone-crops
```

## Available Commands

### Baseline Measurement
```bash
# Measure baseline performance (both apps)
node scripts/measure-performance.js --baseline
```

### Migration Measurements
```bash
# Before removing prototype
node scripts/measure-performance.js --phase=before --migration=<prototype-id>

# After removing prototype  
node scripts/measure-performance.js --phase=after --migration=<prototype-id>

# View results
node scripts/measure-performance.js --results --migration=<prototype-id>
```

## What Gets Measured

### Bundle Size
- **Total bundle size** (MB)
- **JavaScript files** (MB)
- **CSS files** (MB)
- **Asset files** (MB)

### Load Time Performance
- **First Contentful Paint** (ms)
- **Largest Contentful Paint** (ms)  
- **Time to Interactive** (ms)

### Lighthouse Scores
- **Performance** (0-100)
- **Accessibility** (0-100)
- **Best Practices** (0-100)
- **SEO** (0-100)

### Memory Usage
- **Heap Used** (MB)
- **Heap Total** (MB)

## Real Example Workflow

### For Enhanced Parcel Zone Crops:

```bash
# 1. Measure main app BEFORE removing component
cd ../app.gardenflow.io
npm run build  # Make sure it builds
cd ../prototypes
node scripts/measure-performance.js --phase=before --migration=enhanced-parcel-zone-crops

# 2. Remove component from main app:
# - Remove from App.tsx routes
# - Remove from App.lazy.tsx
# - Remove the component file
# - Remove any unused imports

# 3. Measure main app AFTER removing component
node scripts/measure-performance.js --phase=after --migration=enhanced-parcel-zone-crops

# 4. View the results
node scripts/measure-performance.js --results --migration=enhanced-parcel-zone-crops
```

## Understanding Results

### Positive Improvements (Good)
- **Bundle Size**: `-X MB (-Y%)` = Smaller bundle
- **Load Time**: `-X ms (-Y%)` = Faster loading  
- **Memory**: `-X MB (-Y%)` = Less memory usage

### Performance Data Updates UI

The home page automatically loads performance data from `/public/performance.json` and displays:
- Real bundle size reduction percentages
- Actual load time improvements
- Memory usage improvements
- Performance insights based on measurements

## Adding New Prototypes

### 1. Add to performance.json
```json
{
  "id": "my-new-prototype",
  "name": "My New Prototype",
  "timestamp": "2025-01-28T00:00:00Z",
  "status": "migrated",
  "component": {
    "path": "src/components/my-new-prototype.tsx",
    "size": null,
    "dependencies": ["react", "other-deps"],
    "complexity": "medium",
    "category": "ui"
  },
  "before": { /* will be filled by measurement */ },
  "after": { /* will be filled by measurement */ },
  "improvements": { /* will be calculated */ }
}
```

### 2. Run measurements
```bash
node scripts/measure-performance.js --phase=before --migration=my-new-prototype
# ... remove from main app ...
node scripts/measure-performance.js --phase=after --migration=my-new-prototype
```

## Prerequisites

### Required Tools
- **Node.js** 18+
- **Lighthouse** (auto-installed)
- **du** command (Unix/macOS)
- **find** command (Unix/macOS)

### Apps Must Be Running
- Main app: `http://localhost:5173`
- Prototypes app: `http://localhost:5174`

## Troubleshooting

### "Command not found" errors
```bash
# Install lighthouse globally
npm install -g lighthouse

# Ensure main app builds successfully
cd ../app.gardenflow.io && npm run build

# Ensure prototypes app builds
npm run build
```

### No performance data showing in UI
1. Check `/public/performance.json` exists
2. Verify JSON is valid
3. Run at least one migration measurement
4. Refresh the browser

### Bundle size shows as null
1. Ensure `dist/` folder exists after build
2. Check file permissions
3. Verify `du` command works: `du -sh dist/`

## Files Overview

- `performance.json` - Raw performance data
- `public/performance.json` - Web-accessible performance data  
- `scripts/measure-performance.js` - Measurement script
- `src/utils/performanceUtils.ts` - UI utilities
- `PERFORMANCE_MEASUREMENT_GUIDE.md` - This guide

## Next Steps

1. **Measure Current State**: Run baseline measurements
2. **Migrate First Prototype**: Complete enhanced-parcel-zone-crops migration
3. **Track Improvements**: Use real data in the UI
4. **Plan Next Migrations**: Based on performance impact data