import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Pollinator } from './models/PollinationModel';

interface PollinatorsViewProps {
  pollinators: Record<string, Pollinator>;
}

const PollinatorsView: React.FC<PollinatorsViewProps> = ({ pollinators }) => {
  const getPopulationColor = (population: string) => {
    switch (population.toLowerCase()) {
      case 'high':
        return 'text-green-600';
      case 'moderate':
        return 'text-blue-600';
      case 'low':
        return 'text-amber-600';
      default:
        return 'text-gray-600';
    }
  };
  
  const getTrendIcon = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'increasing':
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'decreasing':
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      case 'fluctuating':
        return <ArrowUpDown className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };
  
  const getActivityLevel = (level: string) => {
    switch (level.toLowerCase()) {
      case 'very high':
      case 'high':
        return 'bg-green-500';
      case 'moderate':
        return 'bg-blue-500';
      case 'low':
      case 'very low':
        return 'bg-amber-500';
      default:
        return 'bg-gray-300';
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Pollinators</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(pollinators).map(([name, pollinator]) => (
          <Card key={name}>
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span className="capitalize">{name}</span>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${getPopulationColor(pollinator.population)}`}>
                    {pollinator.population}
                  </span>
                  <div className="flex items-center">
                    {getTrendIcon(pollinator.trend)}
                    <span className="text-xs ml-1 capitalize">{pollinator.trend}</span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Activity by time of day */}
              <div>
                <h3 className="text-sm font-medium mb-2">Activity by Time of Day</h3>
                <div className="space-y-2">
                  {Object.entries(pollinator.activity).map(([time, level]) => (
                    <div key={time} className="flex items-center">
                      <div className="w-24 text-sm capitalize">{time}</div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getActivityLevel(level)}`}
                          style={{ 
                            width: level.toLowerCase() === 'very high' ? '100%' :
                                   level.toLowerCase() === 'high' ? '80%' :
                                   level.toLowerCase() === 'moderate' ? '60%' :
                                   level.toLowerCase() === 'low' ? '30%' : '10%'
                          }}
                        ></div>
                      </div>
                      <div className="w-20 text-right text-xs capitalize">{level}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Favored Plants */}
              <div>
                <h3 className="text-sm font-medium mb-2">Favored Plants</h3>
                <div className="flex flex-wrap gap-1">
                  {pollinator.favoredPlants.map((plant, idx) => (
                    <Badge key={idx} variant="secondary">{plant}</Badge>
                  ))}
                </div>
              </div>
              
              {/* Attraction Plants */}
              <div>
                <h3 className="text-sm font-medium mb-2">Attraction Plants</h3>
                <div className="flex flex-wrap gap-1">
                  {pollinator.attractionPlants.map((plant, idx) => (
                    <Badge key={idx} variant="outline" className="capitalize">{plant}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PollinatorsView;