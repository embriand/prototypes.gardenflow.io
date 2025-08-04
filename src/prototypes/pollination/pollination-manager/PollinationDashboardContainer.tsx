import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import {
  PollinationData,
  getCurrentWeekNumber,
  getCurrentYear,
  getGardenStatsForDate,
  getWeeksInMonth,
  Crop,
  GardenStats,
  WeekRange,
  ViewMode,
  FilterType,
  TabValue
} from './models/PollinationModel';

// Import all the subcomponents
import TimeNavigator from './TimeNavigator';
import StatsOverview from './StatsOverview';
import CropsView from './CropsView';
import BloomCalendar from './BloomCalendar';
import PollinatorsView from './PollinatorsView';
import CompanionsView from './CompanionsView';
import PlantDetailModal from './PlantDetailModal';
import ViewModeSelector from './ViewModeSelector';

const PollinationDashboardContainer: React.FC = () => {
  // Time state
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentWeek, setCurrentWeek] = useState<number>(getCurrentWeekNumber());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(getCurrentYear());
  
  // UI state
  const [selectedTab, setSelectedTab] = useState<TabValue>('crops');
  const [selectedPlant, setSelectedPlant] = useState<Crop | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  
  // Calculate which weeks to show based on view mode
  const getWeekRange = (): WeekRange => {
    if (viewMode === 'week') {
      // Show a few weeks before and after the current week
      return { start: Math.max(1, currentWeek - 5), end: Math.min(52, currentWeek + 5) };
    } else if (viewMode === 'month') {
      // Show all weeks in the current month
      const weeksInMonth = getWeeksInMonth(currentMonth, currentYear);
      return { start: weeksInMonth[0], end: weeksInMonth[weeksInMonth.length - 1] };
    } else {
      // Show all weeks in year
      return { start: 1, end: 52 };
    }
  };
  
  // Get garden stats for the selected time period
  const stats: GardenStats = getGardenStatsForDate(PollinationData.crops, currentWeek, currentYear);
  
  // Set up time navigation handlers
  const handleViewModeChange = (mode: ViewMode): void => {
    setViewMode(mode);
  };
  
  const handleWeekChange = (week: number): void => {
    setCurrentWeek(week);
  };
  
  const handleMonthChange = (month: number): void => {
    setCurrentMonth(month);
    
    // Update week to first week in the month
    const weeksInMonth = getWeeksInMonth(month, currentYear);
    setCurrentWeek(weeksInMonth[0]);
  };
  
  const handleYearChange = (year: number): void => {
    setCurrentYear(year);
  };
  
  // Get crops filtered by selected time period
  const getFilteredCrops = (): Crop[] => {
    let filtered = [...PollinationData.crops];
    
    // Filter by year
    filtered = filtered.filter(crop => crop.pollination.bloomPeriod.year === currentYear);
    
    // Filter by month if in month view
    if (viewMode === 'month') {
      const weeksInMonth = getWeeksInMonth(currentMonth, currentYear);
      filtered = filtered.filter(crop => {
        // Check if bloom period overlaps with any week in the month
        return crop.pollination.bloomPeriod.estimatedStartWeek <= weeksInMonth[weeksInMonth.length - 1] &&
               crop.pollination.bloomPeriod.estimatedEndWeek >= weeksInMonth[0];
      });
    }
    
    // Apply filter type
    if (filter !== 'all') {
      if (filter === 'blooming') {
        filtered = filtered.filter(crop => 
          crop.pollination.bloomPeriod.estimatedStartWeek <= currentWeek && 
          crop.pollination.bloomPeriod.estimatedEndWeek >= currentWeek
        );
      } else {
        filtered = filtered.filter(crop => crop.pollination.status === filter);
      }
    }
    
    return filtered;
  };
  
  const filteredCrops: Crop[] = getFilteredCrops();
  const weekRange: WeekRange = getWeekRange();

  return (
    <div className="flex flex-col gap-4 w-full p-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold">Suivi pollinisation</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <ViewModeSelector mode={viewMode} onChange={handleViewModeChange} />
          <TimeNavigator
            currentWeek={currentWeek}
            currentYear={currentYear}
            currentMonth={currentMonth}
            onWeekChange={handleWeekChange}
            onMonthChange={handleMonthChange}
            onYearChange={handleYearChange}
            viewMode={viewMode}
          />
        </div>
      </div>
      
      {/* Garden Statistics */}
      <StatsOverview stats={stats} />
      
      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={(value: string) => setSelectedTab(value as TabValue)} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="crops">Crops</TabsTrigger>
          <TabsTrigger value="bloom-calendar">Bloom Calendar</TabsTrigger>
          <TabsTrigger value="pollinators">Pollinators</TabsTrigger>
          <TabsTrigger value="companions">Companion Plants</TabsTrigger>
        </TabsList>
        
        <TabsContent value="crops">
          <CropsView 
            crops={filteredCrops} 
            filter={filter} 
            onFilterChange={setFilter} 
            onSelectPlant={setSelectedPlant}
            currentWeek={currentWeek}
            currentYear={currentYear}
          />
        </TabsContent>
        
        <TabsContent value="bloom-calendar">
          <BloomCalendar 
            crops={filteredCrops} 
            currentWeek={currentWeek} 
            currentYear={currentYear}
            weekRange={weekRange}
          />
        </TabsContent>
        
        <TabsContent value="pollinators">
          <PollinatorsView pollinators={PollinationData.pollinators} />
        </TabsContent>
        
        <TabsContent value="companions">
          <CompanionsView companionPlants={PollinationData.companionPlants} />
        </TabsContent>
      </Tabs>
      
      {/* Plant Detail Modal */}
      {selectedPlant && (
        <PlantDetailModal plant={selectedPlant} onClose={() => setSelectedPlant(null)} />
      )}
      </div>
    );
};

export default PollinationDashboardContainer;