import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { 
  Info, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../../components/ui/select';
import { 
  Crop, 
  FilterType, 
  PollinationStatus, 
  getStatusColor,
  getScoreColor
} from './models/PollinationModel';

interface CropsViewProps {
  crops: Crop[];
  filter: FilterType;
  currentWeek: number;
  currentYear: number;
  onFilterChange: (filter: FilterType) => void;
  onSelectPlant: (plant: Crop) => void;
}

const CropsView: React.FC<CropsViewProps> = ({
  crops,
  filter,
  currentWeek,
  currentYear,
  onFilterChange,
  onSelectPlant
}) => {
  const isCurrentlyBlooming = (plant: Crop) => {
    return (
      plant.pollination.bloomPeriod.year === currentYear &&
      plant.pollination.bloomPeriod.estimatedStartWeek <= currentWeek &&
      plant.pollination.bloomPeriod.estimatedEndWeek >= currentWeek
    );
  };
  
  const getStatusIcon = (status: PollinationStatus) => {
    switch(status) {
      case 'optimal':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'adequate':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'insufficient':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Crops ({crops.length})</h2>
        <Select value={filter} onValueChange={(value) => onFilterChange(value as FilterType)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter crops" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Crops</SelectItem>
            <SelectItem value="blooming">Currently Blooming</SelectItem>
            <SelectItem value="optimal">Optimal Pollination</SelectItem>
            <SelectItem value="adequate">Adequate Pollination</SelectItem>
            <SelectItem value="insufficient">Insufficient Pollination</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {crops.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No crops match the current filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {crops.map((plant) => (
            <Card key={plant.product_item_uuid} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-lg">{plant.name}</h3>
                      <p className="text-sm text-gray-500">
                        {plant.family} • {plant.quantity} plants
                      </p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(plant.pollination.status as PollinationStatus)} text-white`}
                    >
                      {plant.pollination.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-1 mb-3">
                    {plant.pollination.pollinators.slice(0, 3).map((pollinator, idx) => (
                      <Badge key={idx} variant="secondary" className="capitalize">
                        {pollinator}
                      </Badge>
                    ))}
                    {plant.pollination.pollinators.length > 3 && (
                      <Badge variant="outline">+{plant.pollination.pollinators.length - 3}</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Bloom Period:</span>
                      <span className="font-medium">
                        Weeks {plant.pollination.bloomPeriod.estimatedStartWeek}-{plant.pollination.bloomPeriod.estimatedEndWeek}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Pollination Score:</span>
                      <span className={`font-bold ${getScoreColor(plant.pollination.score)}`}>
                        {plant.pollination.score}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Pollination Needs:</span>
                      <span className="capitalize font-medium">
                        {plant.pollination.needs}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex border-t">
                  {isCurrentlyBlooming(plant) && (
                    <div className="flex items-center justify-center flex-1 py-2 px-3 bg-green-50 text-green-600 text-sm border-r">
                      <Sparkles className="h-4 w-4 mr-1" /> Blooming
                    </div>
                  )}
                  
                  {plant.pollination.recommendations.length > 0 && (
                    <div className="flex items-center justify-center flex-1 py-2 px-3 bg-amber-50 text-amber-600 text-sm">
                      <AlertTriangle className="h-4 w-4 mr-1" /> Needs attention
                    </div>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    className="flex-1 rounded-none"
                    onClick={() => onSelectPlant(plant)}
                  >
                    <Info className="h-4 w-4 mr-1" /> Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CropsView;