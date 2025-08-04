import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { GardenStats } from './models/PollinationModel';
import { 
  LineChart, 
  Flower2, 
  AlertTriangle,
  ActivityIcon,
    Sprout
} from 'lucide-react';

interface StatsOverviewProps {
  stats: GardenStats;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const getPollinationScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-blue-600';
    return 'text-red-600';
  };
  
  const statCards = [
    {
      title: 'Pollination Score',
      value: `${stats.pollinationScore}%`,
      icon: <LineChart className="h-5 w-5 text-blue-500" />,
      color: getPollinationScoreColor(stats.pollinationScore)
    },
    {
      title: 'Pollinator Diversity',
      value: stats.pollinatorDiversity,
      icon: <Flower2 className="h-5 w-5 text-purple-500" />,
      color: 'text-purple-600'
    },
    {
      title: 'Blooming Crops',
      value: stats.activeBloomingCrops,
      icon: <Sprout className="h-5 w-5 text-green-500" />,
      color: 'text-green-600'
    },
    {
      title: 'High-Need Crops at Risk',
      value: `${stats.highNeedCropsAtRisk} of ${stats.highNeedCrops}`,
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      color: stats.highNeedCropsAtRisk > 0 ? 'text-amber-600' : 'text-green-600'
    },
    {
      title: 'Companion Planting',
      value: `${stats.companionPlantingScore}%`,
      icon: <ActivityIcon className="h-5 w-5 text-teal-500" />,
      color: 'text-teal-600'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((card, index) => (
        <Card key={index}>
          <CardContent className="p-4 flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mb-2">
              {card.icon}
            </div>
            <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;