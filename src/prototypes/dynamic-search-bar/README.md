# Dynamic Search Bar Prototype

An AI-powered intelligent search interface with dynamic suggestions and interactive canvas functionality.

## Features

- **Dynamic Search**: Real-time filtering with intelligent suggestions
- **Drag & Drop**: Interactive drag and drop functionality for items
- **Circular Layouts**: Beautiful circular property and action layouts
- **Context Menus**: Right-click context menus for item management
- **Property Panels**: Detailed property panels with real-time updates
- **Multi-Category Support**: Support for trees, fruits, vegetables, and furniture
- **Notifications**: Visual notification system with animations
- **Responsive Design**: Fully responsive design with smooth transitions

## Components

### Main Component
- `DynamicSearchBar.tsx` - Main component with search and canvas functionality

### Sub-components
- `CircularLayoutActions` - Circular action menu layout
- `CircularLayoutProperties` - Circular property display layout

### Data Management
- `mockData.ts` - Sample data for testing
- `types.ts` - TypeScript interfaces and types

## Usage

```tsx
import DynamicSearchBar from './DynamicSearchBar';

function App() {
  return <DynamicSearchBar />;
}
```

## Key Interactions

1. **Search**: Type in the search bar to filter items
2. **Drag & Drop**: Drag items from search results to the canvas
3. **Selection**: Click items to select and view properties
4. **Context Menu**: Right-click items for action menu
5. **Movement**: Drag selected items to reposition them
6. **Deletion**: Use delete button or context menu to remove items

## Technical Details

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom gradients
- **Icons**: Lucide React icon library
- **State Management**: React hooks (useState, useRef, useEffect)
- **Performance**: React.memo for optimization

## Dependencies

- React 18+
- TypeScript
- Tailwind CSS
- Lucide React

## Migration Notes

Migrated from main GardenFlow app on 2025-08-03. Original location:
`/src/components/prototypes/dynamicSearchBar/DynamicSearchBar.tsx`

Component size: ~13.5 kB
Dependencies: Fully self-contained with Lucide React icons
Category: Tools prototype