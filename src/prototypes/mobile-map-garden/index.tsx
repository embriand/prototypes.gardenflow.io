import React, { useState, useEffect, useRef } from 'react';
import MobileDeviceFrame from '../../components/MobileDeviceFrame';

// Data and types
const GARDEN_DATA_KEY = 'garden_data';

type ActionType = 'water' | 'harvest' | 'treat' | 'fertilize' | 'size' | 'weed';

interface Tile {
  id: string;
  type: string;
  width: number;
  height: number;
  actionsCompleted: {
    [key in ActionType]?: boolean;
  };
  needsWater?: boolean;
  readyToHarvest?: boolean;
  hasPests?: boolean;
  needsFertilizer?: boolean;
}

const actionNames: Record<ActionType, string> = {
  'water': 'Arrosage',
  'harvest': 'Récolte',
  'treat': 'Traitement',
  'fertilize': 'Fertilisation',
  'size': 'Taille',
  'weed': 'Désherbage'
};

const plantTypes = {
  tomato: { name: 'Tomate', color: '#7B3C45', textColor: 'text-white', harvestTime: 'Juil-Sep' },
  carrot: { name: 'Carotte', color: '#EB7739', textColor: 'text-white', harvestTime: 'Août-Oct' },
  lettuce: { name: 'Laitue', color: '#3B5639', textColor: 'text-white', harvestTime: 'Juin-Août' },
  cucumber: { name: 'Concombre', color: '#3B5639', textColor: 'text-white', harvestTime: 'Juil-Août' },
  pepper: { name: 'Poivron', color: '#C7B144', textColor: 'text-gray-800', harvestTime: 'Août-Sep' },
  radish: { name: 'Radis', color: '#7B3C45', textColor: 'text-white', harvestTime: 'Avr-Juin' },
  potato: { name: 'Pomme de terre', color: '#343233', textColor: 'text-white', harvestTime: 'Août-Oct' },
  zucchini: { name: 'Courgette', color: '#D2D4AD', textColor: 'text-gray-800', harvestTime: 'Juin-Août' },
  herb: { name: 'Herbes', color: '#3B5639', textColor: 'text-white', harvestTime: 'Mai-Sep' },
  berry: { name: 'Baies', color: '#7B3C45', textColor: 'text-white', harvestTime: 'Juin-Août' }
};

const initialGardenData = {
  sections: {
    'A': [
      { id: 'a1', width: 2, height: 0.8, type: 'tomato', needsWater: true, readyToHarvest: false, hasPests: false, needsFertilizer: true, actionsCompleted: { water: false, harvest: false, treat: false, fertilize: false, size: false, weed: false } },
      { id: 'a2', width: 2, height: 0.8, type: 'carrot', needsWater: false, readyToHarvest: true, hasPests: false, needsFertilizer: false, actionsCompleted: { water: true, harvest: false, treat: false, fertilize: true, size: false, weed: false } },
      { id: 'a3', width: 2, height: 0.8, type: 'potato', needsWater: true, readyToHarvest: false, hasPests: true, needsFertilizer: false, actionsCompleted: { water: false, harvest: false, treat: false, fertilize: true, size: false, weed: false } },
      { id: 'a4', width: 2, height: 0.8, type: 'radish', needsWater: false, readyToHarvest: false, hasPests: false, needsFertilizer: true, actionsCompleted: { water: true, harvest: false, treat: true, fertilize: false, size: false, weed: false } },
      { id: 'a5', width: 2, height: 0.8, type: 'berry', needsWater: true, readyToHarvest: false, hasPests: false, needsFertilizer: false, actionsCompleted: { water: false, harvest: false, treat: false, fertilize: false, size: false, weed: false } },
    ],
    'B': [
      { id: 'b1', width: 2, height: 0.8, type: 'pepper', needsWater: true, readyToHarvest: false, hasPests: false, needsFertilizer: false, actionsCompleted: { water: false, harvest: false, treat: false, fertilize: false, size: false, weed: false } },
      { id: 'b2', width: 2, height: 0.8, type: 'radish', needsWater: false, readyToHarvest: true, hasPests: false, needsFertilizer: false, actionsCompleted: { water: true, harvest: false, treat: false, fertilize: true, size: false, weed: false } },
      { id: 'b3', width: 2, height: 0.8, type: 'lettuce', needsWater: false, readyToHarvest: false, hasPests: true, needsFertilizer: true, actionsCompleted: { water: true, harvest: false, treat: false, fertilize: false, size: false, weed: false } },
      { id: 'b4', width: 2, height: 0.8, type: 'potato', needsWater: true, readyToHarvest: false, hasPests: false, needsFertilizer: false, actionsCompleted: { water: false, harvest: false, treat: true, fertilize: false, size: false, weed: false } },
      { id: 'b5', width: 2, height: 0.8, type: 'herb', needsWater: false, readyToHarvest: true, hasPests: false, needsFertilizer: true, actionsCompleted: { water: true, harvest: false, treat: false, fertilize: false, size: false, weed: false } },
    ],
    'C': [
      { id: 'c1', width: 2, height: 0.8, type: 'cucumber', needsWater: true, readyToHarvest: false, hasPests: false, needsFertilizer: true, actionsCompleted: { water: false, harvest: false, treat: false, fertilize: false, size: false, weed: false } },
      { id: 'c2', width: 2, height: 0.8, type: 'tomato', needsWater: false, readyToHarvest: true, hasPests: false, needsFertilizer: false, actionsCompleted: { water: true, harvest: false, treat: false, fertilize: true, size: false, weed: false } },
      { id: 'c3', width: 2, height: 0.8, type: 'pepper', needsWater: true, readyToHarvest: false, hasPests: true, needsFertilizer: false, actionsCompleted: { water: false, harvest: false, treat: false, fertilize: false, size: false, weed: false } },
      { id: 'c4', width: 2, height: 0.8, type: 'lettuce', needsWater: false, readyToHarvest: false, hasPests: false, needsFertilizer: true, actionsCompleted: { water: true, harvest: false, treat: true, fertilize: false, size: false, weed: false } },
      { id: 'c5', width: 2, height: 0.8, type: 'herb', needsWater: true, readyToHarvest: false, hasPests: true, needsFertilizer: false, actionsCompleted: { water: false, harvest: false, treat: false, fertilize: true, size: false, weed: false } },
    ],
    'D': [
      { id: 'd1', width: 2, height: 0.8, type: 'lettuce', needsWater: false, readyToHarvest: true, hasPests: false, needsFertilizer: false, actionsCompleted: { water: true, harvest: false, treat: false, fertilize: true, size: false, weed: false } },
      { id: 'd2', width: 2, height: 0.8, type: 'cucumber', needsWater: true, readyToHarvest: false, hasPests: false, needsFertilizer: true, actionsCompleted: { water: false, harvest: false, treat: false, fertilize: false, size: false, weed: false } },
      { id: 'd3', width: 2, height: 0.8, type: 'tomato', needsWater: false, readyToHarvest: false, hasPests: true, needsFertilizer: false, actionsCompleted: { water: true, harvest: false, treat: false, fertilize: false, size: false, weed: false } },
      { id: 'd4', width: 2, height: 0.8, type: 'zucchini', needsWater: true, readyToHarvest: true, hasPests: false, needsFertilizer: false, actionsCompleted: { water: false, harvest: false, treat: true, fertilize: false, size: false, weed: false } },
      { id: 'd5', width: 2, height: 0.8, type: 'berry', needsWater: false, readyToHarvest: false, hasPests: true, needsFertilizer: true, actionsCompleted: { water: true, harvest: false, treat: false, fertilize: false, size: false, weed: false } },
    ]
  }
};

// Icons
const WaterIconOutline = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
  </svg>
);

const HarvestIconOutline = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20h16"></path>
    <path d="M9 7h1l3 7h1"></path>
    <path d="M7 7h1"></path>
    <path d="M16 7h1"></path>
    <path d="M14.5 7l-3.5 7"></path>
  </svg>
);

const BugIconOutline = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2l1.88 1.88"></path>
    <path d="M14.12 3.88L16 2"></path>
    <path d="M9 7.13v-1a3.003 3.003 0 112.83 5.88"></path>
    <path d="M12 21a8 8 0 100-16 8 8 0 000 16z"></path>
    <path d="M7 16a8 8 0 0110 0"></path>
    <path d="M10 11l-2 2"></path>
    <path d="M14 11l2 2"></path>
  </svg>
);

const FertilizeIconOutline = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 19V5c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v14"></path>
    <path d="M8 23h8"></path>
    <path d="M8 15h8"></path>
  </svg>
);

const WaterIconFilled = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="#3B82F6"></path>
  </svg>
);

const HarvestIconFilled = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20h16" fill="none"></path>
    <path d="M9 7h1l3 7h1 M7 7h1 M16 7h1 M14.5 7l-3.5 7" fill="#10B981"></path>
  </svg>
);

const BugIconFilled = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2l1.88 1.88 M14.12 3.88L16 2" fill="none"></path>
    <path d="M9 7.13v-1a3.003 3.003 0 112.83 5.88 M12 21a8 8 0 100-16 8 8 0 000 16z M7 16a8 8 0 0110 0 M10 11l-2 2 M14 11l2 2" fill="#EF4444"></path>
  </svg>
);

const FertilizeIconFilled = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 19V5c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v14 M8 23h8 M8 15h8" fill="#F59E0B"></path>
  </svg>
);

const SizeIconOutline = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6"></path>
    <path d="M6 15l6 6 6-6"></path>
  </svg>
);

const SizeIconFilled = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" fill="#A855F7"></path>
    <path d="M6 15l6 6 6-6" fill="#A855F7"></path>
  </svg>
);

const WeedIconOutline = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v8"></path>
    <path d="M18.3 5.7L12 12"></path>
    <path d="M5.7 5.7L12 12"></path>
    <path d="M2 12h8"></path>
    <path d="M12 18.3l6.3-6.3"></path>
    <path d="M12 18.3l-6.3-6.3"></path>
  </svg>
);

const WeedIconFilled = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v8 M18.3 5.7L12 12 M5.7 5.7L12 12 M2 12h8 M12 18.3l6.3-6.3 M12 18.3l-6.3-6.3" fill="#EC4899"></path>
  </svg>
);

// Helper function to render icons
const renderIcon = (bed: Tile, needKey: string | null, actionKey: string): JSX.Element | null => {
  const iconMap: Record<string, { outline: JSX.Element, filled: JSX.Element }> = {
    'water': { outline: <WaterIconOutline />, filled: <WaterIconFilled /> },
    'harvest': { outline: <HarvestIconOutline />, filled: <HarvestIconFilled /> },
    'treat': { outline: <BugIconOutline />, filled: <BugIconFilled /> },
    'fertilize': { outline: <FertilizeIconOutline />, filled: <FertilizeIconFilled /> },
    'size': { outline: <SizeIconOutline />, filled: <SizeIconFilled /> },
    'weed': { outline: <WeedIconOutline />, filled: <WeedIconFilled /> }
  };

  const needsKeyMap: Record<string, string | null> = {
    'water': 'needsWater',
    'harvest': 'readyToHarvest',
    'treat': 'hasPests',
    'fertilize': 'needsFertilizer',
    'size': null,
    'weed': null
  };

  const effectiveNeedKey = needKey || needsKeyMap[actionKey];

  if (effectiveNeedKey === null) {
    return bed.actionsCompleted[actionKey as ActionType] ? iconMap[actionKey].filled : null;
  }

  if (bed[effectiveNeedKey as keyof Tile]) {
    return bed.actionsCompleted[actionKey as ActionType] ? iconMap[actionKey].filled : iconMap[actionKey].outline;
  }

  return null;
};

// Notification Component
const Notification: React.FC<{ message: string | null }> = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="notification-fixed bg-green-500 text-white py-2 px-4 text-center font-mono">
      {message}
    </div>
  );
};

// Garden Tile Component
const GardenTile: React.FC<{
  bed: Tile;
  isSelected: boolean;
  isTransitioning: boolean;
  onClick: () => void;
}> = ({ bed, isSelected, isTransitioning, onClick }) => {
  type PlantType = keyof typeof plantTypes;

  return (
    <div 
      className={`
        rounded-lg cursor-pointer tile shadow-md
        ${isSelected ? 'rotating' : ''}
        ${isTransitioning ? 'pointer-events-none' : ''}
      `}
      style={{
        backgroundColor: plantTypes[bed.type as PlantType].color,
        minHeight: '120px',
        border: '2px solid rgba(0,0,0,0.1)'
      }}
      onClick={onClick}
    >
      <div className="p-4 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <h3 className={`font-semibold text-sm ${plantTypes[bed.type as PlantType].textColor}`}>
            {plantTypes[bed.type as PlantType].name}
          </h3>
          <div className="flex space-x-1">
            {renderIcon(bed, 'needsWater', 'water')}
            {renderIcon(bed, 'readyToHarvest', 'harvest')}
          </div>
        </div>
        
        <div className="flex justify-between items-end">
          <div className="flex space-x-1">
            {bed.actionsCompleted.size && renderIcon(bed, null, 'size')}
            {bed.actionsCompleted.weed && renderIcon(bed, null, 'weed')}
          </div>
          <div className="flex space-x-1">
            {renderIcon(bed, 'hasPests', 'treat')}
            {renderIcon(bed, 'needsFertilizer', 'fertilize')}
          </div>
        </div>
      </div>
    </div>
  );
};

// Garden Section Component
const GardenSection: React.FC<{
  sectionData: Tile[];
  selectedTile: Tile | null;
  isTransitioning: boolean;
  onTileClick: (bed: Tile) => void;
}> = ({ sectionData, selectedTile, isTransitioning, onTileClick }) => {
  return (
    <div className="space-y-2 px-1">
      {sectionData.map((bed) => (
        <GardenTile 
          key={bed.id}
          bed={bed}
          isSelected={selectedTile?.id === bed.id}
          isTransitioning={isTransitioning}
          onClick={() => onTileClick(bed)}
        />
      ))}
    </div>
  );
};

// Garden Layout Component
const GardenLayout: React.FC<{
  gardenData: { sections: { [key: string]: Tile[] } };
  selectedTile: Tile | null;
  isTransitioning: boolean;
  onTileClick: (tile: Tile) => void;
}> = ({ gardenData, selectedTile, isTransitioning, onTileClick }) => {
  const middleSpaceWidth = 80;

  return (
    <div className="flex p-4 overflow-auto font-mono relative" style={{ 
      backgroundColor: '#8B4513',
      backgroundImage: 'repeating-linear-gradient(45deg, #A0522D 0px, #A0522D 10px, #8B4513 10px, #8B4513 20px)'
    }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex">
          <div className="flex w-1/2 pr-2">
            <div className="w-1/2 space-y-2">
              <GardenSection 
                sectionData={gardenData.sections['A']} 
                selectedTile={selectedTile}
                isTransitioning={isTransitioning}
                onTileClick={onTileClick}
              />
            </div>
            <div className="w-1/2 space-y-2">
              <GardenSection 
                sectionData={gardenData.sections['B']} 
                selectedTile={selectedTile}
                isTransitioning={isTransitioning}
                onTileClick={onTileClick}
              />
            </div>
          </div>
          
          <div style={{ 
            width: `${middleSpaceWidth}px`,
            backgroundColor: '#8B4513',
            backgroundImage: 'linear-gradient(to right, #A0522D, #8B4513, #A0522D)'
          }}></div>
          
          <div className="flex w-1/2 pl-2">
            <div className="w-1/2 space-y-2">
              <GardenSection 
                sectionData={gardenData.sections['C']} 
                selectedTile={selectedTile}
                isTransitioning={isTransitioning}
                onTileClick={onTileClick}
              />
            </div>
            <div className="w-1/2 space-y-2">
              <GardenSection 
                sectionData={gardenData.sections['D']} 
                selectedTile={selectedTile}
                isTransitioning={isTransitioning}
                onTileClick={onTileClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Tile Detail Lightbox Component
const TileDetailLightbox: React.FC<{
  selectedTile: Tile;
  onClose: () => void;
  onPerformAction: (action: ActionType) => void;
}> = ({ selectedTile, onClose, onPerformAction }) => {
  const additionalActions = [
    { 
      id: 'size' as ActionType, 
      name: 'Taille', 
      color: 'bg-purple-600', 
      colorActive: 'bg-purple-800',
      icon: selectedTile.actionsCompleted.size ? <SizeIconFilled /> : <SizeIconOutline />
    },
    { 
      id: 'weed' as ActionType, 
      name: 'Désherbage', 
      color: 'bg-pink-600', 
      colorActive: 'bg-pink-800',
      icon: selectedTile.actionsCompleted.weed ? <WeedIconFilled /> : <WeedIconOutline />
    }
  ];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" 
      onClick={onClose}
      style={{ animationName: 'slideIn', animationDuration: '0.3s' }}
    >
      <div 
        className="bg-gray-900 border border-gray-700 p-6 rounded-lg w-80 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white font-mono tracking-wide">
            {plantTypes[selectedTile.type as keyof typeof plantTypes].name}
          </h2>
          <div 
            style={{ backgroundColor: plantTypes[selectedTile.type as keyof typeof plantTypes].color }}
            className="w-6 h-6 rounded-full"
          ></div>
        </div>
        
        <div className="mb-6 space-y-2 font-mono">
          <p>Taille: <span className="opacity-80">{selectedTile.width}m × {selectedTile.height}m</span></p>
          <p>Récolte: <span className="opacity-80">{plantTypes[selectedTile.type as keyof typeof plantTypes].harvestTime}</span></p>
          <p>Statut:</p>
          <ul className="ml-4 space-y-1 opacity-80">
            {selectedTile.needsWater && (
              <li className="flex items-center text-blue-300">
                {selectedTile.actionsCompleted.water ? <WaterIconFilled /> : <WaterIconOutline />}
                <span className="ml-2">Besoin d'eau</span>
              </li>
            )}
            {selectedTile.readyToHarvest && (
              <li className="flex items-center text-green-300">
                {selectedTile.actionsCompleted.harvest ? <HarvestIconFilled /> : <HarvestIconOutline />}
                <span className="ml-2">Prêt à récolter</span>
              </li>
            )}
            {selectedTile.hasPests && (
              <li className="flex items-center text-red-300">
                {selectedTile.actionsCompleted.treat ? <BugIconFilled /> : <BugIconOutline />}
                <span className="ml-2">Problème de parasites</span>
              </li>
            )}
            {selectedTile.needsFertilizer && (
              <li className="flex items-center text-yellow-300">
                {selectedTile.actionsCompleted.fertilize ? <FertilizeIconFilled /> : <FertilizeIconOutline />}
                <span className="ml-2">Besoin d'engrais</span>
              </li>
            )}
            {selectedTile.actionsCompleted.size && (
              <li className="flex items-center text-purple-300">
                <SizeIconFilled />
                <span className="ml-2">Taille effectuée</span>
              </li>
            )}
            {selectedTile.actionsCompleted.weed && (
              <li className="flex items-center text-pink-300">
                <WeedIconFilled />
                <span className="ml-2">Désherbage effectué</span>
              </li>
            )}
          </ul>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          {selectedTile.needsWater && (
            <button 
              className={`${selectedTile.actionsCompleted.water ? 'bg-blue-800' : 'bg-blue-600'} text-white py-2 px-4 rounded-md flex items-center justify-center font-mono tracking-tight`}
              onClick={() => onPerformAction('water')}
            >
              {selectedTile.actionsCompleted.water ? <WaterIconFilled /> : <WaterIconOutline />}
              <span className="ml-2">Arroser</span>
            </button>
          )}
          {selectedTile.readyToHarvest && (
            <button 
              className={`${selectedTile.actionsCompleted.harvest ? 'bg-green-600' : 'bg-gray-600'} text-white py-2 px-4 rounded-md flex items-center justify-center font-mono tracking-tight`}
              onClick={() => onPerformAction('harvest')}
            >
              {selectedTile.actionsCompleted.harvest ? <HarvestIconFilled /> : <HarvestIconOutline />}
              <span className="ml-2">Récolter</span>
            </button>
          )}
          {selectedTile.hasPests && (
            <button 
              className={`${selectedTile.actionsCompleted.treat ? 'bg-red-800' : 'bg-red-600'} text-white py-2 px-4 rounded-md flex items-center justify-center font-mono tracking-tight`}
              onClick={() => onPerformAction('treat')}
            >
              {selectedTile.actionsCompleted.treat ? <BugIconFilled /> : <BugIconOutline />}
              <span className="ml-2">Traiter</span>
            </button>
          )}
          {selectedTile.needsFertilizer && (
            <button 
              className={`${selectedTile.actionsCompleted.fertilize ? 'bg-yellow-800' : 'bg-yellow-600'} text-white py-2 px-4 rounded-md flex items-center justify-center font-mono tracking-tight`}
              onClick={() => onPerformAction('fertilize')}
            >
              {selectedTile.actionsCompleted.fertilize ? <FertilizeIconFilled /> : <FertilizeIconOutline />}
              <span className="ml-2">Fertiliser</span>
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {additionalActions.map(action => (
            <button 
              key={action.id}
              className={`${selectedTile.actionsCompleted[action.id] ? action.colorActive : action.color} text-white py-1 px-3 rounded-md flex items-center justify-center font-mono tracking-tight text-sm`}
              onClick={() => onPerformAction(action.id)}
            >
              {action.icon}
              <span className="ml-2">{action.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Garden App Component
const MobileMapGarden = () => {
  const [gardenData, setGardenData] = useState(initialGardenData);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isTransitioning, _setIsTransitioning] = useState(false);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem(GARDEN_DATA_KEY);
    if (savedData) {
      try {
        setGardenData(JSON.parse(savedData));
      } catch (error) {
        console.error("Error loading garden data from localStorage:", error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(GARDEN_DATA_KEY, JSON.stringify(gardenData));
  }, [gardenData]);

  const handleTileClick = (bed: Tile) => {
    if (isTransitioning) return;
    setSelectedTile(bed);
    setShowLightbox(true);
  };
  
  const performAction = (action: ActionType) => {
    const updatedGardenData = JSON.parse(JSON.stringify(gardenData));
    
    for (const section in updatedGardenData.sections) {
      const tileIndex: number = updatedGardenData.sections[section].findIndex(
        (tile: Tile) => tile.id === selectedTile?.id
      );
      
      if (tileIndex !== -1) {
        if (!updatedGardenData.sections[section][tileIndex].actionsCompleted) {
          updatedGardenData.sections[section][tileIndex].actionsCompleted = {};
        }
        
        updatedGardenData.sections[section][tileIndex].actionsCompleted[action] = 
          !updatedGardenData.sections[section][tileIndex].actionsCompleted[action];
        
        setGardenData(updatedGardenData);
        
        const actionCompleted = updatedGardenData.sections[section][tileIndex].actionsCompleted[action];
        const frenchAction = actionNames[action];
        
        if (selectedTile) {
          setNotification(`${frenchAction} ${actionCompleted ? 'terminé' : 'annulé'} sur ${plantTypes[selectedTile.type as keyof typeof plantTypes].name}`);
        }
        break;
      }
    }
    
    setShowLightbox(false);
    setSelectedTile(null);
    
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    setSelectedTile(null);
  };

  const verticalSections = Object.keys(gardenData.sections)
    .map(section => section.charAt(0).toUpperCase() + section.slice(1))
    .reverse();
  
  const horizontalSections = ['Gauche', 'Centre', 'Droite'];

  return (
    <MobileDeviceFrame>
      <div className="flex flex-col h-full w-full overflow-hidden" style={{ backgroundColor: '#111111' }}>
      <style>
        {`
          @keyframes rotateOut {
            from {
              transform: perspective(1000px) rotateX(0deg);
            }
            to {
              transform: perspective(1000px) rotateX(90deg);
            }
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .tile {
            transform-style: preserve-3d;
            transform-origin: center center;
            backface-visibility: hidden;
            transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
          }

          .tile.rotating {
            animation: rotateOut 0.5s ease-in-out forwards;
            pointer-events: none;
          }

          .tile:hover {
            transform: translateY(4px);
            opacity: 0.9;
          }

          .notification-fixed {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 50;
          }
        `}
      </style>
      
      <Notification message={notification} />
      
      <GardenLayout 
        gardenData={gardenData} 
        selectedTile={selectedTile}
        isTransitioning={isTransitioning}
        onTileClick={handleTileClick}
      />
      
      {showLightbox && selectedTile && (
        <TileDetailLightbox 
          selectedTile={selectedTile} 
          onClose={closeLightbox}
          onPerformAction={performAction}
        />
      )}
      </div>
    </MobileDeviceFrame>
  );
};

export default MobileMapGarden;