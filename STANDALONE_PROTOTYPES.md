# Standalone Prototypes

These prototypes run as separate Vite applications and need to be started individually.

## Available Standalone Prototypes

### 1. Calendar Rendement (Mixed Prototype)
**Location:** `prototypes/calendar-rendement/`
**Description:** Mixed prototype containing calendar, productivity, and map visualizations
**Start Command:**
```bash
cd prototypes/calendar-rendement
npm install
npm run dev
```
**URL:** http://localhost:5173/

### 2. Culture Calendar (Extracted Calendar)
**Location:** `prototypes/culture-calendar/`
**Description:** Standalone calendar prototype extracted from calendar-rendement
**Features:**
- GardenCalendar: Detailed daily calendar with 200+ plant suggestions
- PlantingCalendar: Annual timeline view of planting/harvesting periods
- Complete planting data for all 12 months

**Start Command:**
```bash
cd prototypes/culture-calendar
npm install
npm run dev
```
**URL:** http://localhost:5173/

## Running Multiple Prototypes

To run multiple standalone prototypes simultaneously, use different ports:

```bash
# Terminal 1 - Culture Calendar
cd prototypes/culture-calendar
npm run dev

# Terminal 2 - Calendar Rendement (will use port 5174 automatically)
cd prototypes/calendar-rendement
npm run dev
```

## Integration Note

These prototypes are currently standalone and not integrated into the main prototypes panel at http://localhost:5175. They can be integrated later if needed by:
1. Moving components to `prototypes/src/prototypes/`
2. Adding routing in the main App.tsx
3. Including in the prototypes list in Home.tsx