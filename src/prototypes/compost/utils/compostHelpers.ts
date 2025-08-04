// File: components/compost/utils/compostHelpers.ts
import { CompostBox, CompostData } from '../data/compostInitialData';

// Define interfaces for dashboard metrics
export interface MaterialTypeDistribution {
  name: string;
  value: number;
}

export interface MaturityDistribution {
  name: string;
  value: number;
}

export interface DashboardMetrics {
  totalBoxes: number;
  boxesNeedingAction: number;
  averageTemperature: number;
  compostMaturityDistribution: MaturityDistribution[];
  materialTypes: MaterialTypeDistribution[];
  boxes: CompostBox[];
}

// Check if data structure is valid
export const isDataUpToDate = (data: CompostData | null | undefined): boolean => {
  return !!data && !!data.boxes && Array.isArray(data.boxes) && 
         !!data.sites && Array.isArray(data.sites);
};

// Get color for moisture level
export const getMoistureColor = (moisture: string): string => {
  switch (moisture) {
    case 'sec': return 'text-amber-500';
    case 'optimal': return 'text-green-500';
    case 'humide': return 'text-blue-500';
    default: return 'text-gray-500';
  }
};

// Get color for status
export const getStatusColor = (status: string): string => {
  if (status.includes('nouveau') || status.includes('semaine')) {
    return 'bg-yellow-100 text-yellow-800';
  } else if (status.includes('1-mois')) {
    return 'bg-blue-100 text-blue-800';
  } else if (status.includes('2-mois') || status.includes('3-mois')) {
    return 'bg-green-100 text-green-800';
  } else if (status.includes('4-mois') || status.includes('5-mois')) {
    return 'bg-emerald-100 text-emerald-800';
  } else if (status.includes('6-mois')) {
    return 'bg-purple-100 text-purple-800';
  }
  return 'bg-gray-100 text-gray-800';
};

// Get color based on temperature
export const getTemperatureIndicator = (temp: number): string => {
  if (temp < 40) return 'text-blue-500'; // Too cold
  if (temp > 65) return 'text-red-500';  // Too hot
  return 'text-green-500'; // Optimal
};

// Format date to French locale
export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
};

// Calculate days since last turned
export const getDaysSinceLastTurned = (lastTurnedDate: string): number => {
  const lastTurned = new Date(lastTurnedDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - lastTurned.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Determine if box needs attention
export const needsAction = (box: CompostBox): boolean => {
  const daysSinceLastTurn = getDaysSinceLastTurned(box.lastTurned);
  
  if (box.fillLevel > 90 && box.status !== "6-mois") return true; // Almost full but not mature
  if (box.temperature > 60) return true; // Too hot
  if (box.temperature < 40 && box.status !== "nouveau") return true; // Too cold for established compost
  if (box.moisture === "sec") return true; // Too dry
  if (box.moisture === "humide" && daysSinceLastTurn > 7) return true; // Too wet for a while
  if (daysSinceLastTurn > 14 && box.status !== "6-mois") return true; // Not turned in over 2 weeks
  
  return false;
};

// Calculate all dashboard metrics
export const calculateDashboardMetrics = (boxes: CompostBox[]): DashboardMetrics => {
  if (!boxes.length) {
    return {
      totalBoxes: 0,
      boxesNeedingAction: 0,
      averageTemperature: 0,
      compostMaturityDistribution: [],
      materialTypes: [],
      boxes: []
    };
  }

  // Calculate metrics
  const totalBoxes = boxes.length;
  const boxesNeedingAction = boxes.filter(box => needsAction(box)).length;
  const avgTemp = boxes.reduce((sum, box) => sum + box.temperature, 0) / totalBoxes || 0;
  
  // Get maturity distribution
  const statuses = ['nouveau', '1-semaine', '2-semaines', '1-mois', '2-mois', '3-mois', '4-mois', '5-mois', '6-mois'];
  const maturityDistribution = statuses.map(status => ({
    name: status,
    value: boxes.filter(box => box.status === status).length
  })).filter(item => item.value > 0);
  
  // Get material types distribution
  const allMaterials = boxes.flatMap(box => box.materials);
  const materialCounts: Record<string, number> = allMaterials.reduce((acc: Record<string, number>, material) => {
    acc[material] = (acc[material] || 0) + 1;
    return acc;
  }, {});
  
  const materialTypes = Object.entries(materialCounts)
    .map(([name, count]) => ({ name, value: count }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 materials
  
  return {
    totalBoxes,
    boxesNeedingAction,
    averageTemperature: avgTemp,
    compostMaturityDistribution: maturityDistribution,
    materialTypes,
    boxes
  };
};