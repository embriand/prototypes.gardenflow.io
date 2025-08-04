// File: components/compost/CompostDashboard.tsx
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, PieChart as RechartsPieChart, 
  Pie, Cell 
} from 'recharts';
import { Calendar } from 'lucide-react';

import { 
  Card, CardHeader, CardTitle, CardContent, CardFooter
} from './ui/Card';

import { getTemperatureIndicator } from './utils/compostHelpers';
import { CompostBox } from './data/compostInitialData';

interface MaterialType {
  name: string;
  value: number;
}

interface MaturityDistribution {
  name: string;
  value: number;
}

interface DashboardMetrics {
  totalBoxes: number;
  boxesNeedingAction: number;
  averageTemperature: number;
  compostMaturityDistribution: MaturityDistribution[];
  materialTypes: MaterialType[];
  boxes: CompostBox[];
  minTemperature?: number;
  maxTemperature?: number;
}

interface CompostDashboardProps {
  metrics: DashboardMetrics;
}

interface FillLevelItem {
  name: string;
  value: number;
}

interface MoistureItem {
  name: string;
  value: number;
}

const CompostDashboard: React.FC<CompostDashboardProps> = ({ metrics }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Calculate fill level distribution for pie chart
  const getFillLevelDistribution = (boxes: CompostBox[]): FillLevelItem[] => {
    if (!boxes || !boxes.length) return [];
    
    const low = boxes.filter(box => box.fillLevel <= 30).length;
    const medium = boxes.filter(box => box.fillLevel > 30 && box.fillLevel <= 70).length;
    const high = boxes.filter(box => box.fillLevel > 70).length;
    
    return [
      { name: '0-30%', value: low },
      { name: '31-70%', value: medium },
      { name: '71-100%', value: high }
    ].filter(item => item.value > 0);
  };
  
  const fillLevelDistribution = getFillLevelDistribution(metrics.boxes);

  // Calculate moisture distribution
  const getMoistureDistribution = (boxes: CompostBox[]): MoistureItem[] => {
    if (!boxes || !boxes.length) return [];
    
    const dry = boxes.filter(box => box.moisture === 'sec').length;
    const optimal = boxes.filter(box => box.moisture === 'optimal').length;
    const wet = boxes.filter(box => box.moisture === 'humide').length;
    
    return [
      { name: 'Sec', value: dry },
      { name: 'Optimal', value: optimal },
      { name: 'Humide', value: wet }
    ].filter(item => item.value > 0);
  };
  
  const moistureDistribution = getMoistureDistribution(metrics.boxes);
  
  if (!metrics) return <div>Chargement des données...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Bacs de Compost</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="text-4xl font-bold">{metrics.totalBoxes}</div>
            <p className="text-gray-500">Nombre total de bacs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Bacs nécessitant action</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="text-4xl font-bold text-orange-500">
              {metrics.boxesNeedingAction}
            </div>
            <p className="text-gray-500">Besoin d'attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Température moyenne</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className={`text-4xl font-bold ${getTemperatureIndicator(metrics.averageTemperature)}`}>
              {metrics.averageTemperature.toFixed(1)}°C
            </div>
            <p className="text-gray-500">Tous les bacs</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Distribution des stades de maturité</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {metrics.compostMaturityDistribution && metrics.compostMaturityDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={metrics.compostMaturityDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }: { name: string; percent: number }) => 
                      `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {metrics.compostMaturityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} bacs`, 'Quantité']} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Pas de données disponibles
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top 5 des matériaux utilisés</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {metrics.materialTypes && metrics.materialTypes.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metrics.materialTypes}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" name="Occurrences" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Pas de données disponibles
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Health metrics section */}
      <Card>
        <CardHeader>
          <CardTitle>Santé du Compost</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Fill level distribution */}
            <div>
              <h3 className="text-sm font-medium mb-3">Niveaux de remplissage</h3>
              {fillLevelDistribution && fillLevelDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={120}>
                  <RechartsPieChart>
                    <Pie
                      data={fillLevelDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={50}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label
                    >
                      {fillLevelDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#FFBB28', '#00C49F', '#0088FE'][index % 3]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-24 text-gray-500 text-sm">
                  Pas de données
                </div>
              )}
            </div>

            {/* Moisture distribution */}
            <div>
              <h3 className="text-sm font-medium mb-3">Niveaux d'humidité</h3>
              {moistureDistribution && moistureDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={120}>
                  <RechartsPieChart>
                    <Pie
                      data={moistureDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={50}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label
                    >
                      {moistureDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`}
                          fill={entry.name === 'Sec' ? '#FFBB28' : entry.name === 'Optimal' ? '#00C49F' : '#0088FE'}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-24 text-gray-500 text-sm">
                  Pas de données
                </div>
              )}
            </div>

            {/* Temperature range */}
            <div>
              <h3 className="text-sm font-medium mb-3">Plage de températures</h3>
              <div className="flex flex-col justify-center items-center h-32">
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold">
                    <span className="text-blue-500">{metrics.minTemperature || 0}°</span>
                    <span className="text-gray-400 mx-1">-</span>
                    <span className="text-red-500">{metrics.maxTemperature || 0}°</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Température min/max</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Tasks Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tâches à venir</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            Aucune tâche planifiée à venir
          </div>
        </CardContent>
        <CardFooter>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded w-full justify-center">
            <Calendar className="w-4 h-4" />
            Planifier une nouvelle tâche
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CompostDashboard;