// ImageVisualization.tsx - Composant de visualisation des images
import React from 'react';
import { Flower, Fruit, Match } from './types';

interface ImageVisualizationProps {
  beforeImageUrl: string;
  afterImageUrl: string;
  flowers: Flower[];
  fruits: Fruit[];
  matches: Match[];
}

const ImageVisualization: React.FC<ImageVisualizationProps> = ({
  beforeImageUrl,
  afterImageUrl,
  flowers,
  fruits,
  matches
}) => {
  const successfulMatches = matches.filter(m => m.successful).length;
  const matchRate = Math.round((successfulMatches / flowers.length) * 100);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="font-semibold text-lg mb-3">Visualisation des Détections</h2>
      
      <div className="text-center mb-4">
        <span className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">
          {matchRate}% des fleurs ont produit des fruits
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Avant avec détection des fleurs */}
        <div className="relative border rounded overflow-hidden">
          <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-sm z-10">
            Avant - {flowers.length} fleurs détectées
          </div>
          
          <img 
            src={beforeImageUrl} 
            alt="Image avant" 
            className="w-full object-contain"
          />
          
          <svg 
            className="absolute top-0 left-0 w-full h-full" 
            viewBox="0 0 640 480"
          >
            {flowers.map((flower) => {
              const match = matches.find(m => m.flowerId === flower.id);
              const hasMatch = match && match.successful;
              
              return (
                <g key={`flower-${flower.id}`}>
                  <circle
                    cx={flower.x}
                    cy={flower.y}
                    r={flower.size / 2}
                    fill="none"
                    stroke={hasMatch ? "#10b981" : "#ef4444"}
                    strokeWidth="2"
                    strokeDasharray={hasMatch ? "none" : "5,5"}
                  />
                  
                  <text
                    x={flower.x}
                    y={flower.y - flower.size / 2 - 5}
                    fontSize="12"
                    textAnchor="middle"
                    fill={hasMatch ? "#10b981" : "#ef4444"}
                  >
                    F{flower.id}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        
        {/* Image Après avec détection des fruits */}
        <div className="relative border rounded overflow-hidden">
          <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-sm z-10">
            Après - {fruits.length} fruits détectés
          </div>
          
          <img 
            src={afterImageUrl} 
            alt="Image après" 
            className="w-full object-contain"
          />
          
          <svg 
            className="absolute top-0 left-0 w-full h-full" 
            viewBox="0 0 640 480"
          >
            {fruits.map((fruit) => {
              const match = matches.find(m => m.fruitId === fruit.id);
              
              return (
                <g key={`fruit-${fruit.id}`}>
                  <circle
                    cx={fruit.x}
                    cy={fruit.y}
                    r={fruit.size / 2}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                  
                  <text
                    x={fruit.x}
                    y={fruit.y - fruit.size / 2 - 5}
                    fontSize="12"
                    textAnchor="middle"
                    fill="#10b981"
                  >
                    F{fruit.id}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
      
      {/* Légende */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-green-500"></div>
          <span className="text-sm">Fleur avec fruit</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-red-500 border-dashed"></div>
          <span className="text-sm">Fleur sans fruit</span>
        </div>
      </div>
    </div>
  );
};

export default ImageVisualization;