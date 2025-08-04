import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '../../../components/ui/toggle-group';
import { CalendarDays, Calendar, CalendarRange } from 'lucide-react';
import { ViewMode } from './models/pollinationModel';

interface ViewModeSelectorProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({ mode, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-500">View:</span>
      <ToggleGroup type="single" value={mode} onValueChange={(value) => onChange(value as ViewMode)}>
        <ToggleGroupItem value="week" aria-label="Week view">
          <CalendarDays className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Week</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="month" aria-label="Month view">
          <Calendar className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Month</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="year" aria-label="Year view">
          <CalendarRange className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Year</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default ViewModeSelector;