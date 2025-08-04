import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { getMonthName, getWeekDateRange, ViewMode } from './models/pollinationModel';

interface TimeNavigatorProps {
  currentWeek: number;
  currentMonth: number;
  currentYear: number;
  viewMode: ViewMode;
  onWeekChange: (week: number) => void;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

const TimeNavigator: React.FC<TimeNavigatorProps> = ({
  currentWeek,
  currentMonth,
  currentYear,
  viewMode,
  onWeekChange,
  onMonthChange,
  onYearChange
}) => {
  // Helper for navigating back/forward
  const navigate = (direction: 'prev' | 'next') => {
    const increment = direction === 'next' ? 1 : -1;
    
    if (viewMode === 'week') {
      const newWeek = currentWeek + increment;
      if (newWeek >= 1 && newWeek <= 52) {
        onWeekChange(newWeek);
      }
    } else if (viewMode === 'month') {
      const newMonth = currentMonth + increment;
      if (newMonth >= 0 && newMonth <= 11) {
        onMonthChange(newMonth);
      } else {
        // Go to previous/next year and adjust month
        const newYear = currentYear + (newMonth < 0 ? -1 : 1);
        onYearChange(newYear);
        onMonthChange(newMonth < 0 ? 11 : 0);
      }
    } else {
      // Year view
      onYearChange(currentYear + increment);
    }
  };
  
  // Generate labels based on view mode
  const getTimeLabel = () => {
    if (viewMode === 'week') {
      return `Week ${currentWeek}: ${getWeekDateRange(currentWeek, currentYear)}`;
    } else if (viewMode === 'month') {
      return `${getMonthName(currentMonth)} ${currentYear}`;
    } else {
      return `${currentYear}`;
    }
  };
  
  // Generate dropdown options for direct selection
  const renderDropdown = () => {
    if (viewMode === 'week') {
      // Week dropdown
      return (
        <Select
          value={currentWeek.toString()}
          onValueChange={(value) => onWeekChange(parseInt(value))}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Week" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 52 }, (_, i) => i + 1).map((week) => (
              <SelectItem key={week} value={week.toString()}>
                Week {week}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    } else if (viewMode === 'month') {
      // Month dropdown
      return (
        <Select
          value={currentMonth.toString()}
          onValueChange={(value) => onMonthChange(parseInt(value))}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => i).map((month) => (
              <SelectItem key={month} value={month.toString()}>
                {getMonthName(month)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    } else {
      // Year dropdown (show ±5 years around current)
      const years = Array.from(
        { length: 11 },
        (_, i) => currentYear - 5 + i
      );
      
      return (
        <Select
          value={currentYear.toString()}
          onValueChange={(value) => onYearChange(parseInt(value))}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate('prev')}
        aria-label="Previous"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center space-x-2">
        <span className="text-sm whitespace-nowrap">{getTimeLabel()}</span>
        {renderDropdown()}
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate('next')}
        aria-label="Next"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TimeNavigator;