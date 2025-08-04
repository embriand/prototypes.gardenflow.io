// types.ts - Types partagés pour l'application
export interface ImageData {
    url: string;
    name: string;
    description: string;
    data?: any;
  }
  
  export interface Flower {
    id: number;
    x: number;
    y: number;
    size: number;
    confidence: number;
  }
  
  export interface Fruit {
    id: number;
    x: number;
    y: number;
    size: number;
    maturity: number;
    confidence: number;
  }
  
  export interface Match {
    flowerId: number;
    fruitId: number | null;
    distance: number | null;
    successful: boolean;
  }
  
  export interface ZoneAnalysis {
    zone: string;
    flowerCount: number;
    fruitCount: number;
    rate: number;
  }
  
  export interface AnalysisResult {
    flowerCount: number;
    fruitCount: number;
    pollinationRate: number;
    pollinationQuality: string;
    pollinationEfficiency: ZoneAnalysis[];
    insectActivity: {
      observed: boolean;
      diversity: string;
      dominantSpecies: string;
      notes: string;
    };
    environmentalFactors: {
      sunExposure: string;
      soilQuality: string;
      waterAvailability: string;
      plantHealth: string;
    };
    recommendations: string[];
  }