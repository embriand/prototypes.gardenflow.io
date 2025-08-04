// src/utils/imageProcessing.ts - Fonctions d'analyse d'image
import { ImageData, Flower, Fruit, Match, ZoneAnalysis, AnalysisResult } from './types';

// Fonctions simulées de détection pour la démonstration
export const detectFlowers = (imageData: ImageData): Flower[] => {
  return [
    { id: 1, x: 120, y: 85, size: 28, confidence: 0.92 },
    { id: 2, x: 210, y: 150, size: 32, confidence: 0.89 },
    { id: 3, x: 180, y: 220, size: 30, confidence: 0.95 },
    { id: 4, x: 320, y: 180, size: 26, confidence: 0.88 },
    { id: 5, x: 400, y: 140, size: 31, confidence: 0.91 },
    { id: 6, x: 280, y: 90, size: 29, confidence: 0.94 },
    { id: 7, x: 220, y: 310, size: 27, confidence: 0.87 },
    { id: 8, x: 350, y: 240, size: 33, confidence: 0.93 },
  ];
};

export const detectFruits = (imageData: ImageData): Fruit[] => {
  return [
    { id: 1, x: 125, y: 90, size: 45, maturity: 0.85, confidence: 0.94 },
    { id: 2, x: 215, y: 155, size: 38, maturity: 0.76, confidence: 0.88 },
    { id: 3, x: 185, y: 225, size: 42, maturity: 0.81, confidence: 0.92 },
    { id: 4, x: 325, y: 185, size: 40, maturity: 0.78, confidence: 0.90 },
    { id: 5, x: 290, y: 95, size: 39, maturity: 0.83, confidence: 0.91 },
  ];
};

export const matchFlowersToFruits = (flowers: Flower[], fruits: Fruit[]): Match[] => {
  return flowers.map(flower => {
    let closestFruit: Fruit | null = null;
    let minDistance = Infinity;
    
    fruits.forEach(fruit => {
      const distance = Math.sqrt(Math.pow(flower.x - fruit.x, 2) + Math.pow(flower.y - fruit.y, 2));
      if (distance < minDistance) {
        minDistance = distance;
        closestFruit = fruit;
      }
    });
    
    if (minDistance < 50) {
      return {
        flowerId: flower.id,
        fruitId: closestFruit!.id,
        distance: minDistance,
        successful: true
      };
    } else {
      return {
        flowerId: flower.id,
        fruitId: null,
        distance: null,
        successful: false
      };
    }
  });
};

export const analyzeByZones = (
  flowers: Flower[],
  fruits: Fruit[],
  matches: Match[]
): ZoneAnalysis[] => {
  const imageWidth = 640;
  const imageHeight = 480;
  const centerX = imageWidth / 2;
  const centerY = imageHeight / 2;
  
  const zones = [
    { 
      name: "Centre", 
      isInZone: (x: number, y: number) => Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)) < 100 
    },
    { 
      name: "Haut gauche", 
      isInZone: (x: number, y: number) => x < centerX && y < centerY 
    },
    { 
      name: "Haut droit", 
      isInZone: (x: number, y: number) => x >= centerX && y < centerY 
    },
    { 
      name: "Bas gauche", 
      isInZone: (x: number, y: number) => x < centerX && y >= centerY 
    },
    { 
      name: "Bas droit", 
      isInZone: (x: number, y: number) => x >= centerX && y >= centerY 
    }
  ];
  
  return zones.map(zone => {
    const zoneFlowers = flowers.filter(flower => zone.isInZone(flower.x, flower.y));
    const zoneMatches = matches.filter(match => {
      const flower = flowers.find(f => f.id === match.flowerId);
      return flower && zone.isInZone(flower.x, flower.y) && match.successful;
    });
    
    const flowerCount = zoneFlowers.length;
    const fruitCount = zoneMatches.length;
    const rate = flowerCount > 0 ? Math.round((fruitCount / flowerCount) * 100) : 0;
    
    return {
      zone: zone.name,
      flowerCount,
      fruitCount,
      rate
    };
  });
};

export const generateRecommendations = (
  pollinationRate: number,
  zoneAnalysis: ZoneAnalysis[]
): string[] => {
  const recommendations: string[] = [];
  
  if (pollinationRate < 50) {
    recommendations.push("Installez des plantes compagnes pour attirer plus de pollinisateurs");
    recommendations.push("Ajoutez un hôtel à insectes à proximité pour augmenter la population");
  }
  
  const poorZones = zoneAnalysis.filter(zone => zone.rate < 40);
  if (poorZones.length > 0) {
    recommendations.push(`Améliorez l'exposition dans les zones: ${poorZones.map(z => z.zone).join(', ')}`);
  }
  
  recommendations.push("Arrosez tôt le matin pour maximiser l'humidité durant la période de pollinisation");
  recommendations.push("Évitez tout traitement chimique pendant la floraison");
  
  return recommendations;
};

export const analyzeImages = (beforeImage: ImageData, afterImage: ImageData): AnalysisResult => {
  // Détection simulée
  const flowers = detectFlowers(beforeImage);
  const fruits = detectFruits(afterImage);
  const matches = matchFlowersToFruits(flowers, fruits);
  const zoneAnalysis = analyzeByZones(flowers, fruits, matches);
  
  const successfulMatches = matches.filter(m => m.successful).length;
  const pollinationRate = Math.round((successfulMatches / flowers.length) * 100);
  
  let pollinationQuality = "Faible";
  if (pollinationRate >= 70) pollinationQuality = "Excellente";
  else if (pollinationRate >= 50) pollinationQuality = "Bonne";
  else if (pollinationRate >= 30) pollinationQuality = "Moyenne";
  
  const recommendations = generateRecommendations(pollinationRate, zoneAnalysis);
  
  return {
    flowerCount: flowers.length,
    fruitCount: fruits.length,
    pollinationRate,
    pollinationQuality,
    pollinationEfficiency: zoneAnalysis,
    insectActivity: {
      observed: true,
      diversity: "Moyenne",
      dominantSpecies: "Abeilles domestiques",
      notes: "Quelques bourdons observés, activité principalement matinale"
    },
    environmentalFactors: {
      sunExposure: "Excellente",
      soilQuality: "Bonne",
      waterAvailability: "Adéquate",
      plantHealth: "Excellente"
    },
    recommendations
  };
};