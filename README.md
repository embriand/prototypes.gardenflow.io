# GardenFlow Prototypes Management

A standalone React application for managing and testing GardenFlow prototypes in isolation.

## Overview

This app provides an isolated environment for testing and developing GardenFlow prototypes, separated from the main application to improve performance and maintain clean code separation.

## Features

- **Isolated Testing Environment**: Test prototypes without affecting main app performance
- **Component Migration**: Easy migration path for moving prototypes from main app
- **Performance Optimization**: Removes heavy prototype components from main app bundle
- **Clean Architecture**: Separate routing and state management for prototypes

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# The app will be available at http://localhost:5174
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── components/          # Shared components
│   └── Layout.tsx      # Main layout component
├── pages/              # Page components
│   └── Home.tsx        # Home/dashboard page
├── prototypes/         # Individual prototype folders
│   ├── _template/      # Template for new prototypes
│   │   ├── index.ts
│   │   ├── PrototypeTemplate.tsx
│   │   ├── types.ts
│   │   └── README.md
│   └── enhanced-parcel-zone-crops/
│       ├── index.ts
│       ├── EnhancedParcelZoneCrops.tsx
│       ├── types.ts
│       ├── mockData.ts
│       └── README.md
├── utils/              # Utility functions
│   └── performanceUtils.ts
├── App.tsx            # Main app component with routing
├── main.tsx           # App entry point
└── index.css          # Global styles
```

## Adding New Prototypes

### Quick Setup
1. **Copy Template**: `cp -r src/prototypes/_template src/prototypes/your-prototype-name`
2. **Rename Component**: Update file names and imports
3. **Add Route**: Add to `src/App.tsx`
4. **Update Home Page**: Add to prototypes list in `src/pages/Home.tsx`
5. **Add Performance Tracking**: Add entry to `performance.json`

### Detailed Example
```bash
# 1. Copy template
cp -r src/prototypes/_template src/prototypes/my-new-prototype

# 2. Rename main component file
mv src/prototypes/my-new-prototype/PrototypeTemplate.tsx src/prototypes/my-new-prototype/MyNewPrototype.tsx
```

```tsx
// 3. Update index.ts
export { default } from './MyNewPrototype';

// 4. Add route in App.tsx
import MyNewPrototype from './prototypes/my-new-prototype'
<Route path="/my-new-prototype" element={<MyNewPrototype />} />

// 5. Update Home.tsx prototypes array
{
  id: 'my-new-prototype',
  title: 'My New Prototype',
  path: '/my-new-prototype',
  description: 'Description of my prototype',
  status: 'development',
  lastModified: '2025-01-28',
  category: 'ui',
  size: 'medium',
  technologies: ['React', 'TypeScript'],
  complexity: 'medium'
}
```

## Migration Process

When migrating a prototype from the main app:

1. Copy the component to `src/prototypes/`
2. Update any imports (especially shared utilities)
3. Test functionality in isolation
4. Update main app to remove the prototype
5. Verify main app performance improvement

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Port Configuration

The prototypes app runs on port **5174** to avoid conflicts with:
- Main GardenFlow app (typically 5173)
- API server (typically 3000)
- Other development servers

## Current Prototypes

### Enhanced Parcel-Zone-Crops
- **Path**: `/enhanced-parcel-zone-crops`
- **Status**: Active
- **Description**: Comprehensive parcel and zone management with advanced crop planning
- **Features**: Interactive canvas, hierarchical object management, status indicators

## Benefits

1. **Performance**: Main app loads faster without heavy prototype components
2. **Development**: Test prototypes in isolation without side effects
3. **Deployment**: Can deploy prototypes separately for testing
4. **Maintenance**: Easier to manage experimental features

## Development Guidelines

- Keep prototypes self-contained with minimal external dependencies
- Use consistent naming conventions
- Document any special requirements or dependencies
- Test prototypes thoroughly before integration decisions
- Keep the main app clean by removing confirmed prototypes

## Next Steps

After validating a prototype in this environment:
1. Decide whether to integrate into main app or keep separate
2. If integrating, ensure proper testing and optimization
3. If keeping separate, consider this as the permanent home
4. Remove from main app to improve performance