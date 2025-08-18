# Parcel-Zone Matrix View Prototype

## Overview
A new innovative view mode for the Crop Planner that displays parcels and zones in a matrix format with timeline visualization. This view complements the existing Gantt and Calendar views by providing a clear hierarchical structure of parcels → zones → crops.

## Key Features

### 1. Matrix Layout
- **Rows**: Parcels with expandable zones
- **Columns**: Time periods (weeks, months, or seasons)
- **Cells**: Crop timelines with phase visualization

### 2. View Modes
- **Week View**: 52-week detailed timeline with individual week columns
- **Month View**: 12-month overview with crop blocks
- **Season View**: 4-season summary with phase indicators

### 3. Interactive Elements
- **Expandable/Collapsible Sections**: 
  - Parcels can be expanded to show zones
  - Zones can be expanded to show individual crops
  - Bulk expand/collapse controls

- **Crop Details Modal**: Click on any crop to see detailed information
- **Search & Filter**: Real-time filtering by crop name or family
- **Occupancy Indicators**: Visual feedback on zone utilization

### 4. Visual Design
- **Color-coded Phases**:
  - Green: Sowing/Seeding phase
  - Blue: Culture/Growing phase
  - Orange: Harvest phase
  
- **Crop Family Colors**: Each crop displays its family-specific color
- **Occupancy Rate**: Shows percentage of time each zone is occupied

## Component Structure

```
ParcelZoneMatrix/
├── ParcelZoneMatrix.tsx      # Main container component
├── components/
│   ├── TimelineHeader.tsx    # Timeline header (weeks/months/seasons)
│   ├── ParcelSection.tsx     # Parcel row with stats and controls
│   ├── ZoneRow.tsx           # Zone row with crop management
│   ├── CropTimeline.tsx      # Individual crop timeline visualization
│   └── CropDetailsModal.tsx  # Crop detail popup
├── types.ts                  # TypeScript interfaces
├── mockData.ts              # Sample data for demonstration
└── index.ts                 # Export file
```

## Data Structure

### Parcel
- UUID, name, dimensions
- Contains multiple zones
- Area calculation

### Zone
- UUID, name, position within parcel
- Contains multiple crops
- Occupancy tracking

### Crop
- Complete lifecycle data (sow, culture, harvest weeks)
- Family, variety, quantity
- Color coding based on family

## Usage in Main Application

To integrate this view into the main GardenFlow application:

1. **Import the component** into the CropPlanner
2. **Add view mode selector** alongside Gantt and Calendar options
3. **Connect to Redux store** for state management
4. **Use real API data** instead of mock data
5. **Add to TopBarFilter** view mode buttons

### Integration Points
```tsx
// In CropPlanner.tsx
import ParcelZoneMatrixView from './views/ParcelZoneMatrixView';

// In view selector
{view === 'matrix' && <ParcelZoneMatrixView crops={filteredCrops} loading={loading} />}
```

## Benefits Over Existing Views

1. **Spatial Organization**: Clear hierarchy of parcels and zones
2. **Occupancy Visualization**: See which zones are underutilized
3. **Compact Display**: Multiple crops per zone in a single row
4. **Scalability**: Handles many parcels/zones efficiently
5. **Flexibility**: Three timeline modes for different planning needs

## Future Enhancements

1. **Drag & Drop**: Move crops between zones
2. **Conflict Detection**: Highlight rotation conflicts
3. **Export Options**: PDF/Excel export with matrix layout
4. **Performance Optimization**: Virtual scrolling for large datasets
5. **Companion Planting**: Show compatibility indicators
6. **Weather Integration**: Overlay weather data on timeline
7. **Multi-year View**: Extend timeline across years

## Development Notes

- Built with React and TypeScript
- Uses Tailwind CSS for styling
- Fully responsive design considerations
- Optimized for performance with React.memo and useMemo
- Follows existing GardenFlow design patterns

## Testing

Access the prototype at: http://localhost:5174/parcel-zone-matrix

Test scenarios:
1. Expand/collapse parcels and zones
2. Switch between view modes (week/month/season)
3. Search for specific crops
4. Filter by plant family
5. Click crops to view details
6. Toggle empty zones visibility