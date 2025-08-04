import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip';
import { Crop, WeekRange, getStatusColor, PollinationStatus } from './models/PollinationModel';

interface BloomCalendarProps {
  crops: Crop[];
  currentWeek: number;
  currentYear: number;
  weekRange: WeekRange;
}

const BloomCalendar: React.FC<BloomCalendarProps> = ({
  crops,
  currentWeek,
  currentYear,
  weekRange
}) => {
  // Generate array of weeks to display
  const weeks = Array.from(
    { length: weekRange.end - weekRange.start + 1 },
    (_, i) => weekRange.start + i
  );
  
  // Sort crops by family and name for better grouping
  const sortedCrops = [...crops].sort((a, b) => {
    if (a.family === b.family) {
      return a.name.localeCompare(b.name);
    }
    return a.family.localeCompare(b.family);
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bloom Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-2">
          <div className="min-w-max">
            {/* Calendar header (weeks) */}
            <div className="flex items-center">
              <div className="w-40 flex-shrink-0 p-2 font-medium">Plant</div>
              {weeks.map((week) => (
                <div 
                  key={week} 
                  className={`w-8 flex-shrink-0 text-center text-xs py-1 font-medium ${
                    week === currentWeek ? 'bg-blue-100 text-blue-800 rounded' : ''
                  }`}
                >
                  {week}
                </div>
              ))}
            </div>
            
            {/* Plants rows */}
            {sortedCrops.map((plant) => (
              <div key={plant.product_item_uuid} className="flex items-center border-t">
                <div className="w-40 flex-shrink-0 p-2">
                  <div className="flex items-center">
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(plant.pollination.status as PollinationStatus)} mr-2 w-2 h-2 p-0 rounded-full`} 
                    />
                    <div>
                      <div className="font-medium">{plant.name}</div>
                      <div className="text-xs text-gray-500">{plant.family}</div>
                    </div>
                  </div>
                </div>
                
                {/* Week cells */}
                {weeks.map((week) => {
                  const isInBloomPeriod = 
                    plant.pollination.bloomPeriod.year === currentYear &&
                    plant.pollination.bloomPeriod.estimatedStartWeek <= week &&
                    plant.pollination.bloomPeriod.estimatedEndWeek >= week;
                  
                  // Get pollinator activity for this week if available
                  const activity = plant.pollination.pollinatorActivity[week.toString()];
                  
                  // Determine cell style based on bloom state and pollinator activity
                  let cellStyle = 'w-8 flex-shrink-0 h-8 border-r border-b';
                  
                  if (isInBloomPeriod) {
                    // Cell is in bloom period
                    if (activity) {
                      // We have activity data
                      const activityLevel = parseFloat(activity.level);
                      
                      if (activity.forecast === 'high') {
                        cellStyle += ' bg-green-300';
                      } else if (activity.forecast === 'moderate') {
                        cellStyle += ' bg-blue-200';
                      } else {
                        cellStyle += ' bg-amber-100';
                      }
                    } else {
                      // No activity data, just show as blooming
                      cellStyle += ' bg-gray-200';
                    }
                  } else {
                    // Not blooming this week
                    cellStyle += ' bg-white';
                  }
                  
                  return (
                    <TooltipProvider key={week}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={cellStyle}></div>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <div className="text-sm">
                            <strong>{plant.name}</strong> - Week {week}
                            {isInBloomPeriod ? (
                              <>
                                <div>Blooming</div>
                                {activity && (
                                  <div>
                                    Pollinator activity: <span className="capitalize">{activity.forecast}</span> ({Math.round(parseFloat(activity.level) * 100)}%)
                                  </div>
                                )}
                              </>
                            ) : (
                              <div>Not blooming</div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-300 mr-2"></div>
            <span className="text-sm">High pollinator activity</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-200 mr-2"></div>
            <span className="text-sm">Moderate pollinator activity</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-amber-100 mr-2"></div>
            <span className="text-sm">Low pollinator activity</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 mr-2"></div>
            <span className="text-sm">Blooming (no data)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BloomCalendar;