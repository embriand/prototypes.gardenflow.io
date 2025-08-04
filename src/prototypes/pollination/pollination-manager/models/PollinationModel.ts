// src/models/PollinationModel.ts
// Enhanced data model for the pollination dashboard with consistent types

// Define the base types
export type PollinationStatus = 'optimal' | 'adequate' | 'insufficient';
export type PollinatorForecast = 'high' | 'moderate' | 'low';
export type ViewMode = 'week' | 'month' | 'year';
export type FilterType = 'all' | 'optimal' | 'adequate' | 'insufficient' | 'blooming';
export type TabValue = 'crops' | 'bloom-calendar' | 'pollinators' | 'companions';

// Define the WeekRange interface (missing in original but referenced in components)
export interface WeekRange {
  start: number;
  end: number;
}

// Define the GardenStats interface
export interface GardenStats {
  pollinationScore: number;
  pollinatorDiversity: number;
  companionPlantingScore: number;
  highNeedCrops: number;
  highNeedCropsAtRisk: number;
  currentWeek: number;
  currentYear: number;
  activeBloomingCrops: number;
}

// Define the PollinatorActivity interface
export interface PollinatorActivity {
  level: string;
  forecast: PollinatorForecast;
}

// Define the Pollinizer interface
export interface Pollinizer {
  name: string;
  distance: string;
  inRange: boolean;
  bloomOverlap: boolean;
  effectivenessScore: number;
}

// Define the Location interface
export interface Location {
  parcel: string;
  zone: string;
}

// Define the BloomPeriod interface
export interface BloomPeriod {
  estimatedStartWeek: number;
  estimatedEndWeek: number;
  year: number;
}

// Define the Pollination interface
export interface Pollination {
  type: string;
  method: string;
  selfFertile: boolean;
  needs: string;
  pollinators: string[];
  bloomPeriod: BloomPeriod;
  potentialPollinizers: Pollinizer[];
  pollinatorActivity: Record<string, PollinatorActivity>;
  status: PollinationStatus;
  score: number;
  recommendations: string[];
}

// Define the Plant interface (was called Crop in the original model)
export interface Crop {
  product_item_uuid: string;
  name: string;
  family: string;
  category: string;
  quantity: number;
  location: Location;
  pollination: Pollination;
}

// Define the Pollinator interface
export interface Pollinator {
  population: string;
  trend: string;
  activity: {
    morning: string;
    midday: string;
    afternoon: string;
    evening: string;
  };
  favoredPlants: string[];
  attractionPlants: string[];
}

// Define the CompanionPlant interface
export interface CompanionPlant {
  name: string;
  benefits: string;
  compatibleWith: string[];
  plantingRecommendation: string;
}

// Define the main data structure
export interface PollinationDataType {
  crops: Crop[];
  pollinators: Record<string, Pollinator>;
  companionPlants: CompanionPlant[];
  gardenStats: GardenStats;
}

// Mock data for the pollination model
export const PollinationData: PollinationDataType = {
  crops: [
    {
      product_item_uuid: "ee2a593a-3938-4fe1-a067-dfe7c250f9a2",
      name: "Carotte",
      family: "Apiacées",
      category: "vegetable",
      quantity: 24,
      location: {
        parcel: "Vegetable Plot",
        zone: "Root Vegetables"
      },
      pollination: {
        type: "entomophilous",
        method: "self and cross-pollination",
        selfFertile: true,
        needs: "medium",
        pollinators: ["bees", "wasps", "flies", "beetles"],
        bloomPeriod: {
          estimatedStartWeek: 19,
          estimatedEndWeek: 23,
          year: 2025
        },
        potentialPollinizers: [],
        pollinatorActivity: {
          "19": { level: "0.16", forecast: "low" },
          "20": { level: "0.67", forecast: "moderate" },
          "21": { level: "0.98", forecast: "high" },
          "22": { level: "0.65", forecast: "moderate" },
          "23": { level: "0.35", forecast: "low" }
        },
        status: "adequate",
        score: 60,
        recommendations: []
      }
    },
    {
      product_item_uuid: "c7a58109-65f4-4c35-9960-6a0802d909b5",
      name: "Pastèque",
      family: "Cucurbitacées",
      category: "fruit",
      quantity: 5,
      location: {
        parcel: "P2",
        zone: "Z21"
      },
      pollination: {
        type: "entomophilous",
        method: "cross-pollination",
        selfFertile: false,
        needs: "high", 
        pollinators: ["bees", "squash bees"],
        bloomPeriod: {
          estimatedStartWeek: 13,
          estimatedEndWeek: 15,
          year: 2025
        },
        potentialPollinizers: [],
        pollinatorActivity: {
          "13": { level: "0.40", forecast: "low" },
          "14": { level: "1.00", forecast: "high" },
          "15": { level: "0.35", forecast: "low" }
        },
        status: "insufficient",
        score: 0,
        recommendations: [
          "Plant companion flowers to attract more pollinators",
          "Plant compatible pollinizers like other watermelon varieties within 100 meters",
          "Increase variety diversity for better cross-pollination"
        ]
      }
    },
    {
      product_item_uuid: "d109b761-c934-4226-a1cc-7ba2e0a925ef",
      name: "Pommier",
      family: "Rosacées",
      category: "tree",
      quantity: 1,
      location: {
        parcel: "P22",
        zone: "P22Z1"
      },
      pollination: {
        type: "entomophilous",
        method: "cross-pollination",
        selfFertile: false,
        needs: "high",
        pollinators: ["bees", "bumblebees", "hover flies"],
        bloomPeriod: {
          estimatedStartWeek: 12,
          estimatedEndWeek: 14,
          year: 2025
        },
        potentialPollinizers: [
          {
            name: "Fuji",
            distance: "0.00",
            inRange: true,
            bloomOverlap: true,
            effectivenessScore: 100
          }
        ],
        pollinatorActivity: {
          "12": { level: "0.44", forecast: "moderate" },
          "13": { level: "1.00", forecast: "high" },
          "14": { level: "0.38", forecast: "low" }
        },
        status: "optimal",
        score: 100,
        recommendations: []
      }
    },
    {
      product_item_uuid: "49f10f54-ae10-49b3-b9d1-8dee8c784bd7",
      name: "Pommier",
      family: "Rosacées",
      category: "tree",
      quantity: 1,
      location: {
        parcel: "P2",
        zone: "Z21"
      },
      pollination: {
        type: "entomophilous",
        method: "cross-pollination",
        selfFertile: false,
        needs: "high",
        pollinators: ["bees", "bumblebees", "hover flies"],
        bloomPeriod: {
          estimatedStartWeek: 6,
          estimatedEndWeek: 7,
          year: 2025
        },
        potentialPollinizers: [
          {
            name: "Fuji",
            distance: "5.83",
            inRange: true,
            bloomOverlap: false,
            effectivenessScore: 0
          }
        ],
        pollinatorActivity: {
          "6": { level: "0.31", forecast: "low" },
          "7": { level: "0.20", forecast: "low" }
        },
        status: "insufficient",
        score: 0,
        recommendations: [
          "Plant companion flowers to attract more pollinators",
          "Increase variety diversity for better cross-pollination"
        ]
      }
    },
    {
      product_item_uuid: "867e526c-4414-4a6b-80da-7c423ec8bdfe",
      name: "Fuji",
      family: "Rosacées",
      category: "fruit",
      quantity: 5,
      location: {
        parcel: "NewP1",
        zone: "NewP1Z1"
      },
      pollination: {
        type: "entomophilous",
        method: "cross-pollination",
        selfFertile: false,
        needs: "high",
        pollinators: ["bees", "bumblebees", "hover flies"],
        bloomPeriod: {
          estimatedStartWeek: 11,
          estimatedEndWeek: 12,
          year: 2025
        },
        potentialPollinizers: [
          {
            name: "Pommier",
            distance: "0.00",
            inRange: true,
            bloomOverlap: true,
            effectivenessScore: 100
          }
        ],
        pollinatorActivity: {
          "11": { level: "0.20", forecast: "low" },
          "12": { level: "0.38", forecast: "low" }
        },
        status: "adequate",
        score: 70,
        recommendations: []
      }
    },
    {
      product_item_uuid: "e7dbe958-fc23-4577-97bf-1e08066d331c",
      name: "Cœur de Bœuf",
      family: "Solanacées",
      category: "vegetable",
      quantity: 6,
      location: {
        parcel: "Vegetable Plot",
        zone: "Tomato Bed"
      },
      pollination: {
        type: "entomophilous",
        method: "self-pollination",
        selfFertile: true,
        needs: "low",
        pollinators: ["bumblebees", "carpenter bees", "wind"],
        bloomPeriod: {
          estimatedStartWeek: 24,
          estimatedEndWeek: 29,
          year: 2025
        },
        potentialPollinizers: [],
        pollinatorActivity: {
          "24": { level: "0.30", forecast: "low" },
          "25": { level: "0.60", forecast: "moderate" },
          "26": { level: "0.85", forecast: "high" },
          "27": { level: "0.90", forecast: "high" },
          "28": { level: "0.70", forecast: "high" },
          "29": { level: "0.40", forecast: "moderate" }
        },
        status: "optimal",
        score: 90,
        recommendations: []
      }
    }
  ],
  pollinators: {
    bees: {
      population: "moderate",
      trend: "stable",
      activity: {
        morning: "high",
        midday: "very high",
        afternoon: "moderate",
        evening: "low"
      },
      favoredPlants: ["Fraise", "Pommier", "Fuji"],
      attractionPlants: ["lavender", "borage", "sunflower"]
    },
    bumblebees: {
      population: "high",
      trend: "increasing",
      activity: {
        morning: "moderate",
        midday: "high",
        afternoon: "high",
        evening: "moderate"
      },
      favoredPlants: ["Cœur de Bœuf", "Pastèque"],
      attractionPlants: ["foxglove", "comfrey", "snapdragon"]
    },
    hoverflies: {
      population: "low",
      trend: "fluctuating",
      activity: {
        morning: "low",
        midday: "moderate",
        afternoon: "moderate",
        evening: "low"
      },
      favoredPlants: ["Carotte", "Fraise"],
      attractionPlants: ["fennel", "dill", "cosmos"]
    },
    butterflies: {
      population: "moderate",
      trend: "increasing",
      activity: {
        morning: "low",
        midday: "high",
        afternoon: "high",
        evening: "moderate"
      },
      favoredPlants: ["Fraise"],
      attractionPlants: ["butterfly bush", "milkweed", "zinnia"]
    }
  },
  companionPlants: [
    {
      name: "Borage",
      benefits: "Attracts pollinators, especially bees",
      compatibleWith: ["Fraise", "Cœur de Bœuf"],
      plantingRecommendation: "Plant near strawberries and tomatoes"
    },
    {
      name: "Phacelia",
      benefits: "Excellent pollinator attractor, beneficial insect habitat",
      compatibleWith: ["Carotte", "Pommier", "Fuji"],
      plantingRecommendation: "Plant as border or between fruit trees"
    },
    {
      name: "Sweet Alyssum",
      benefits: "Attracts hover flies and beneficial insects",
      compatibleWith: ["Carotte", "Fraise"],
      plantingRecommendation: "Use as ground cover between vegetable rows"
    },
    {
      name: "Calendula",
      benefits: "Attracts pollinators and repels pests",
      compatibleWith: ["Cœur de Bœuf", "Pastèque"],
      plantingRecommendation: "Plant throughout vegetable beds"
    },
    {
      name: "Nasturtium",
      benefits: "Attracts pollinators and acts as trap crop",
      compatibleWith: ["Pastèque", "Carotte"],
      plantingRecommendation: "Plant at edges of garden beds"
    }
  ],
  gardenStats: {
    pollinationScore: 53,
    pollinatorDiversity: 4,
    companionPlantingScore: 65,
    highNeedCrops: 4,
    highNeedCropsAtRisk: 2,
    currentWeek: 18,
    currentYear: 2025,
    activeBloomingCrops: 1
  }
};

// Helper functions for the pollination dashboard
export const getStatusColor = (status: PollinationStatus): string => {
  switch(status) {
    case 'optimal': return 'bg-green-500';
    case 'adequate': return 'bg-blue-500';
    case 'insufficient': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-600';
  if (score >= 50) return 'text-blue-600';
  return 'text-red-600';
};

// Function to get garden stats for a specific week and year
export const getGardenStatsForDate = (crops: Crop[], week: number, year: number): GardenStats => {
  const activeBloomingCrops = crops.filter(
    crop => crop.pollination.bloomPeriod.year === year &&
           crop.pollination.bloomPeriod.estimatedStartWeek <= week && 
           crop.pollination.bloomPeriod.estimatedEndWeek >= week
  ).length;

  const highNeedCrops = crops.filter(crop => crop.pollination.needs === 'high').length;
  
  const highNeedCropsAtRisk = crops.filter(
    crop => crop.pollination.needs === 'high' && crop.pollination.status !== 'optimal'
  ).length;

  return {
    pollinationScore: 53, // This could be calculated based on the selected week
    pollinatorDiversity: 4,
    companionPlantingScore: 65,
    highNeedCrops,
    highNeedCropsAtRisk,
    currentWeek: week,
    currentYear: year,
    activeBloomingCrops
  };
};

// Function to convert week number to a date range
export const getWeekDateRange = (weekNumber: number, year: number): string => {
  // Get the first day of the year
  const firstDayOfYear = new Date(year, 0, 1);
  
  // Calculate days to the start of the week
  // Week 1 is defined as containing January 1
  const daysToFirstWeek = (weekNumber - 1) * 7;
  
  // Calculate the date of the first day of the week
  const firstDayOfWeek = new Date(year, 0, 1 + daysToFirstWeek);
  
  // Calculate the last day of the week
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
  
  // Format the dates
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const start = firstDayOfWeek.toLocaleDateString(undefined, options);
  const end = lastDayOfWeek.toLocaleDateString(undefined, options);
  
  return `${start} - ${end}`;
};

// Function to get the current week number
export const getCurrentWeekNumber = (): number => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  
  return Math.ceil(days / 7);
};

// Function to get the current year
export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

// Get weeks in a month
export const getWeeksInMonth = (month: number, year: number): number[] => {
  const weeks: number[] = [];
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  // Get the week number of the first day of the month
  const firstWeek = getWeekOfDate(firstDayOfMonth);
  
  // Get the week number of the last day of the month
  const lastWeek = getWeekOfDate(lastDayOfMonth);
  
  // Create an array of week numbers for the month
  for (let week = firstWeek; week <= lastWeek; week++) {
    weeks.push(week);
  }
  
  return weeks;
};

// Get week number of a specific date
export const getWeekOfDate = (date: Date): number => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  
  return Math.ceil(days / 7);
};

// Get month name from number
export const getMonthName = (month: number): string => {
  const monthNames = [
    "January", "February", "March", "April", 
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];
  
  return monthNames[month];
};