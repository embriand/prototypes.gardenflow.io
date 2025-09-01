/**
 * Enhanced Planting Calendar Component with comprehensive vegetable data
 * Based on data from quandplanter.fr
 */

import React, { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Bed as Seed, Scissors, Sun, CloudRain, Droplets, Info, AlertCircle } from 'lucide-react';
import vegetablesData from './data/vegetablesData.json';

interface EnhancedPlantingCalendarProps {
  className?: string;
}

const EnhancedPlantingCalendar: React.FC<EnhancedPlantingCalendarProps> = ({ className = '' }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedVegetable, setSelectedVegetable] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'month'>('timeline');
  
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // Get activities for selected month
  const getCurrentMonthActivities = useMemo(() => {
    const sowing = vegetablesData.vegetables.filter(v => 
      v.sowingMonths.includes(selectedMonth)
    );
    const planting = vegetablesData.vegetables.filter(v => 
      v.plantingMonths.includes(selectedMonth)
    );
    const harvesting = vegetablesData.vegetables.filter(v => 
      v.harvestMonths.includes(selectedMonth)
    );
    
    return { sowing, planting, harvesting };
  }, [selectedMonth]);

  const activities = getCurrentMonthActivities;

  // Get color based on action type
  const getActionColor = (type: 'sow' | 'plant' | 'harvest') => {
    switch (type) {
      case 'sow': return 'bg-blue-500';
      case 'plant': return 'bg-green-500';
      case 'harvest': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facile': return 'bg-green-100 text-green-800';
      case 'moyen': return 'bg-yellow-100 text-yellow-800';
      case 'difficile': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get sun exposure icon
  const getSunIcon = (exposure: string) => {
    switch (exposure) {
      case 'full': return <Sun className="text-yellow-500" size={16} />;
      case 'partial': return <CloudRain className="text-gray-500" size={16} />;
      default: return <CloudRain className="text-gray-400" size={16} />;
    }
  };

  // Get water needs icon
  const getWaterIcon = (needs: string) => {
    const baseClass = "ml-2";
    switch (needs) {
      case 'low': return <Droplets className={`${baseClass} text-blue-300`} size={16} />;
      case 'medium': return <Droplets className={`${baseClass} text-blue-500`} size={16} />;
      case 'high': return <Droplets className={`${baseClass} text-blue-700`} size={16} />;
      default: return null;
    }
  };

  const getWeatherTips = (month: number): string => {
    const tips = [
      "Protégez vos plants du gel et préparez les semis en intérieur.", // Janvier
      "Commencez les premiers semis sous abri, surveillez les variations de température.", // Février
      "Période idéale pour les semis précoces, attention aux dernières gelées.", // Mars
      "Intensifiez les semis, préparez le sol et planifiez l'arrosage.", // Avril
      "Plantez en pleine terre, installez les supports pour les grimpantes.", // Mai
      "Arrosez régulièrement, paillez le sol, surveillez les parasites.", // Juin
      "Arrosage quotidien nécessaire, récoltez régulièrement, ombragez si besoin.", // Juillet
      "Continuez l'arrosage intensif, préparez les semis d'automne.", // Août
      "Réduisez l'arrosage, préparez le jardin pour l'automne.", // Septembre
      "Nettoyez les parcelles, plantez les légumes d'hiver, protégez du froid.", // Octobre
      "Protégez les cultures sensibles, préparez le compost.", // Novembre
      "Planifiez la saison suivante, entretenez les outils, protégez du gel." // Décembre
    ];
    
    return tips[month] || "Adaptez vos pratiques aux conditions météorologiques locales.";
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="text-green-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Calendrier de jardinage complet
              </h3>
              <p className="text-sm text-gray-600">
                {vegetablesData.vegetables.length} légumes - Données de quandplanter.fr
              </p>
            </div>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'timeline' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'month' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mois
              </button>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedMonth((prev) => (prev - 1 + 12) % 12)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="font-semibold text-gray-900 min-w-[100px] text-center">
                {months[selectedMonth]}
              </span>
              <button
                onClick={() => setSelectedMonth((prev) => (prev + 1) % 12)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content based on view mode */}
      <div className="p-6">
        {viewMode === 'timeline' ? (
          <>
            {/* Calendar Grid */}
            <div className="grid grid-cols-12 gap-2 mb-6">
              {months.map((month, index) => (
                <div
                  key={month}
                  className={`text-center p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    index === selectedMonth
                      ? 'bg-green-100 text-green-800 font-semibold'
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                  onClick={() => setSelectedMonth(index)}
                >
                  <div className="text-xs font-medium">{month.slice(0, 3)}</div>
                </div>
              ))}
            </div>

            {/* Crop Timeline */}
            <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
              {vegetablesData.vegetables.map((veg) => (
                <div 
                  key={veg.id} 
                  className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedVegetable === veg.id ? 'bg-blue-50 border border-blue-200' : ''
                  }`}
                  onClick={() => setSelectedVegetable(selectedVegetable === veg.id ? null : veg.id)}
                >
                  <div className="w-24 flex items-center space-x-2">
                    <span className="text-lg">{veg.emoji}</span>
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {veg.name}
                    </span>
                  </div>
                  <div className="flex-1 grid grid-cols-12 gap-1">
                    {months.map((_, monthIndex) => {
                      const isSowing = veg.sowingMonths.includes(monthIndex);
                      const isPlanting = veg.plantingMonths.includes(monthIndex);
                      const isHarvesting = veg.harvestMonths.includes(monthIndex);
                      
                      let bgColor = 'bg-gray-100';
                      let icon = null;
                      
                      if (isSowing && isPlanting && isHarvesting) {
                        bgColor = 'bg-gradient-to-r from-blue-500 via-green-500 to-orange-500';
                      } else if (isSowing && isHarvesting) {
                        bgColor = 'bg-gradient-to-r from-blue-500 to-orange-500';
                      } else if (isPlanting && isHarvesting) {
                        bgColor = 'bg-gradient-to-r from-green-500 to-orange-500';
                      } else if (isSowing) {
                        bgColor = 'bg-blue-500';
                        icon = <Seed className="text-white" size={10} />;
                      } else if (isPlanting) {
                        bgColor = 'bg-green-500';
                        icon = <Seed className="text-white" size={10} />;
                      } else if (isHarvesting) {
                        bgColor = 'bg-orange-500';
                        icon = <Scissors className="text-white" size={10} />;
                      }
                      
                      return (
                        <div
                          key={monthIndex}
                          className={`h-6 rounded-sm flex items-center justify-center ${bgColor}`}
                          title={`${months[monthIndex]}: ${isSowing ? 'Semis ' : ''}${isPlanting ? 'Plantation ' : ''}${isHarvesting ? 'Récolte' : ''}`}
                        >
                          {icon}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center space-x-2">
                    {getSunIcon(veg.sunExposure)}
                    {getWaterIcon(veg.waterNeeds)}
                    <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(veg.difficulty)}`}>
                      {veg.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-600 mb-6 border-t pt-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                <span>Semis</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                <span>Plantation</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
                <span>Récolte</span>
              </div>
              <div className="flex items-center">
                <Sun size={12} className="mr-1 text-yellow-500" />
                <span>Plein soleil</span>
              </div>
              <div className="flex items-center">
                <CloudRain size={12} className="mr-1 text-gray-500" />
                <span>Mi-ombre</span>
              </div>
              <div className="flex items-center">
                <Droplets size={12} className="mr-1 text-blue-500" />
                <span>Besoins en eau</span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Monthly View */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Sowing This Month */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <Seed className="mr-2" size={16} />
                  À semer en {months[selectedMonth]}
                </h4>
                {activities.sowing.length > 0 ? (
                  <div className="space-y-2">
                    {activities.sowing.map((veg) => (
                      <div key={`sow-${veg.id}`} className="text-sm bg-white rounded-lg p-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span>{veg.emoji}</span>
                            <span className="font-medium text-blue-700">{veg.name}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(veg.difficulty)}`}>
                            {veg.difficulty}
                          </span>
                        </div>
                        <div className="text-xs text-blue-600 mt-1">{veg.tips}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-blue-600">Aucun semis recommandé ce mois-ci</p>
                )}
              </div>

              {/* Planting This Month */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                  <Seed className="mr-2" size={16} />
                  À planter en {months[selectedMonth]}
                </h4>
                {activities.planting.length > 0 ? (
                  <div className="space-y-2">
                    {activities.planting.map((veg) => (
                      <div key={`plant-${veg.id}`} className="text-sm bg-white rounded-lg p-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span>{veg.emoji}</span>
                            <span className="font-medium text-green-700">{veg.name}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(veg.difficulty)}`}>
                            {veg.difficulty}
                          </span>
                        </div>
                        <div className="text-xs text-green-600 mt-1">{veg.tips}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-green-600">Aucune plantation recommandée ce mois-ci</p>
                )}
              </div>

              {/* Harvesting This Month */}
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                  <Scissors className="mr-2" size={16} />
                  À récolter en {months[selectedMonth]}
                </h4>
                {activities.harvesting.length > 0 ? (
                  <div className="space-y-2">
                    {activities.harvesting.map((veg) => (
                      <div key={`harvest-${veg.id}`} className="text-sm bg-white rounded-lg p-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span>{veg.emoji}</span>
                            <span className="font-medium text-orange-700">{veg.name}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(veg.difficulty)}`}>
                            {veg.difficulty}
                          </span>
                        </div>
                        <div className="text-xs text-orange-600 mt-1">
                          Temps de croissance: {veg.growthTime}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-orange-600">Aucune récolte prévue ce mois-ci</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Selected Vegetable Details */}
        {selectedVegetable && viewMode === 'timeline' && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            {(() => {
              const veg = vegetablesData.vegetables.find(v => v.id === selectedVegetable);
              if (!veg) return null;
              
              return (
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{veg.emoji}</span>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{veg.name}</h4>
                        <p className="text-sm text-gray-600">Temps de croissance: {veg.growthTime}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedVegetable(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                        <Info className="mr-1" size={14} />
                        Informations
                      </h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center">
                          <span className="text-gray-600 mr-2">Difficulté:</span>
                          <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(veg.difficulty)}`}>
                            {veg.difficulty}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-600 mr-2">Exposition:</span>
                          {getSunIcon(veg.sunExposure)}
                          <span className="ml-1 text-gray-700">
                            {veg.sunExposure === 'full' ? 'Plein soleil' : 'Mi-ombre'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-600 mr-2">Arrosage:</span>
                          {getWaterIcon(veg.waterNeeds)}
                          <span className="ml-1 text-gray-700">
                            {veg.waterNeeds === 'low' ? 'Faible' : veg.waterNeeds === 'medium' ? 'Moyen' : 'Important'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Associations</h5>
                      <div className="space-y-1 text-sm">
                        {veg.companions.length > 0 && (
                          <div>
                            <span className="text-green-600">✓ Bonnes:</span>
                            <span className="ml-1 text-gray-700">{veg.companions.join(', ')}</span>
                          </div>
                        )}
                        {veg.avoid.length > 0 && (
                          <div>
                            <span className="text-red-600">✗ À éviter:</span>
                            <span className="ml-1 text-gray-700">{veg.avoid.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-800">
                      <AlertCircle className="inline mr-1" size={14} />
                      {veg.tips}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Weather Tips */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
            <CloudRain className="mr-2" size={16} />
            Conseils météo pour {months[selectedMonth]}
          </h4>
          <p className="text-sm text-blue-700">
            {getWeatherTips(selectedMonth)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPlantingCalendar;