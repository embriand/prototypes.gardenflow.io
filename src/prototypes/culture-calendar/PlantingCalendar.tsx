/**
 * CLAUDE TEMPLATE: Planting Calendar Component
 * Interactive calendar showing optimal planting and harvesting times
 */

import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Bed as Seed, Scissors, Sun, Cloud } from 'lucide-react';

interface PlantingCalendarProps {
  className?: string;
}

interface CropCalendar {
  crop: string;
  color: string;
  plantingMonths: number[];
  harvestMonths: number[];
  tips: string;
}

const PlantingCalendar: React.FC<PlantingCalendarProps> = ({ className = '' }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const cropCalendars: CropCalendar[] = [
    {
      crop: 'Tomates',
      color: 'bg-red-500',
      plantingMonths: [2, 3, 4], // Mars, Avril, Mai
      harvestMonths: [6, 7, 8, 9], // Juillet à Octobre
      tips: 'Semis en intérieur dès mars, repiquage après les dernières gelées'
    },
    {
      crop: 'Courgettes',
      color: 'bg-green-500',
      plantingMonths: [3, 4, 5], // Avril à Juin
      harvestMonths: [6, 7, 8, 9], // Juillet à Octobre
      tips: 'Croissance rapide, récolte continue tout l\'été'
    },
    {
      crop: 'Salade',
      color: 'bg-lime-500',
      plantingMonths: [2, 3, 4, 8, 9], // Mars-Mai et Sept-Oct
      harvestMonths: [4, 5, 6, 10, 11], // Mai-Juillet et Nov-Déc
      tips: 'Semis échelonnés toutes les 2 semaines pour une récolte continue'
    },
    {
      crop: 'Radis',
      color: 'bg-orange-500',
      plantingMonths: [2, 3, 4, 8, 9], // Mars-Mai et Sept-Oct
      harvestMonths: [3, 4, 5, 9, 10], // Avril-Juin et Oct-Nov
      tips: 'Croissance très rapide (30 jours), parfait pour débuter'
    }
  ];

  const getCurrentMonthActivities = () => {
    const activities = {
      planting: cropCalendars.filter(crop => crop.plantingMonths.includes(selectedMonth)),
      harvesting: cropCalendars.filter(crop => crop.harvestMonths.includes(selectedMonth))
    };
    return activities;
  };

  const activities = getCurrentMonthActivities();

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
                Calendrier de jardinage
              </h3>
              <p className="text-sm text-gray-600">
                Planifiez vos semis et récoltes
              </p>
            </div>
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

      {/* Calendar Grid */}
      <div className="p-6">
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
        <div className="space-y-3 mb-6">
          {cropCalendars.map((crop) => (
            <div key={crop.crop} className="flex items-center space-x-3">
              <div className="w-20 text-sm font-medium text-gray-700">
                {crop.crop}
              </div>
              <div className="flex-1 grid grid-cols-12 gap-1">
                {months.map((_, monthIndex) => {
                  const isPlanting = crop.plantingMonths.includes(monthIndex);
                  const isHarvesting = crop.harvestMonths.includes(monthIndex);
                  
                  return (
                    <div
                      key={monthIndex}
                      className={`h-6 rounded-sm flex items-center justify-center ${
                        isPlanting && isHarvesting
                          ? `${crop.color} opacity-100`
                          : isPlanting
                          ? `${crop.color} opacity-60`
                          : isHarvesting
                          ? `${crop.color} opacity-80`
                          : 'bg-gray-100'
                      }`}
                    >
                      {isPlanting && (
                        <Seed className="text-white" size={10} />
                      )}
                      {isHarvesting && !isPlanting && (
                        <Scissors className="text-white" size={10} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-600 mb-6">
          <div className="flex items-center">
            <Seed size={12} className="mr-1" />
            <span>Semis</span>
          </div>
          <div className="flex items-center">
            <Scissors size={12} className="mr-1" />
            <span>Récolte</span>
          </div>
        </div>

        {/* Monthly Activities */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Planting This Month */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center">
              <Seed className="mr-2" size={16} />
              À semer en {months[selectedMonth]}
            </h4>
            {activities.planting.length > 0 ? (
              <div className="space-y-2">
                {activities.planting.map((crop) => (
                  <div key={`plant-${crop.crop}`} className="text-sm">
                    <div className="font-medium text-green-700">{crop.crop}</div>
                    <div className="text-green-600 text-xs">{crop.tips}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-green-600">Aucun semis recommandé ce mois-ci</p>
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
                {activities.harvesting.map((crop) => (
                  <div key={`harvest-${crop.crop}`} className="text-sm">
                    <div className="font-medium text-orange-700">{crop.crop}</div>
                    <div className="text-orange-600 text-xs">
                      Récolte optimale pour cette période
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-orange-600">Aucune récolte prévue ce mois-ci</p>
            )}
          </div>
        </div>

        {/* Weather Tips */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
            <Cloud className="mr-2" size={16} />
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

export default PlantingCalendar;