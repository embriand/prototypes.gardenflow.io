/**
 * Garden Calendar Component - Calendrier de plantation avec données réelles
 */

import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Bed as Seed, Scissors, Clock, Star, Info, Sun, CloudRain, Thermometer } from 'lucide-react';

// Import all monthly data
import januaryData from './data/gardenData.json';
import februaryData from './data/gardenData.json';
import marchData from './data/march.json';
import aprilData from './data/april.json';
import mayData from './data/may.json';
import juneData from './data/june.json';
import julyData from './data/july.json';
import augustData from './data/august.json';
import septemberData from './data/september.json';
import octoberData from './data/october.json';
import novemberData from './data/november.json';
import decemberData from './data/december.json';

interface Plant {
  id: string;
  name: string;
  emoji: string;
  type: 'vegetable' | 'fruit' | 'herb' | 'planning' | 'maintenance';
  action: 'sow' | 'harvest' | 'plan' | 'maintain';
  difficulty: 'facile' | 'moyen' | 'difficile';
  maturationTime: string;
  tips: string;
  companions: string[];
  sunExposure: 'full' | 'partial' | 'shade';
  weather: string;
  temperature: string;
  color: string;
  yieldKgM2?: string;
  yieldTHa?: string;
}

const GardenCalendar: React.FC = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // Current month
  const [currentYear, setCurrentYear] = useState(today.getFullYear()); // Dynamic year
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  // Obtenir les données du mois actuel
  const getMonthData = () => {
    const monthDataSources = [
      januaryData.january,
      februaryData.february,
      marchData.march,
      aprilData.april,
      mayData.may,
      juneData.june,
      julyData.july,
      augustData.august,
      septemberData.september,
      octoberData.october,
      novemberData.november,
      decemberData.december
    ];
    
    return monthDataSources[currentMonth] || [];
  };

  const generateCalendarDays = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
    const monthData = getMonthData();
    
    const days = [];
    
    // Jours vides au début
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({
        day: 0,
        plants: [],
        isToday: false,
        isWeekend: false,
        weatherTip: undefined
      });
    }
    
    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const dayOfWeek = (firstDayOfMonth + day - 1) % 7;
      const dayData = monthData.find(d => d.day === day);
      
      days.push({
        day,
        plants: dayData?.plants || [],
        isToday: isCurrentMonth && today.getDate() === day,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        weatherTip: getWeatherTip(day, currentMonth)
      });
    }
    
    return days;
  };

  const getWeatherTip = (day: number, month: number): string | undefined => {
    const winterMonths = [11, 0, 1]; // Dec, Jan, Feb
    const springMonths = [2, 3, 4]; // Mar, Apr, May
    const summerMonths = [5, 6, 7]; // Jun, Jul, Aug
    const autumnMonths = [8, 9, 10]; // Sep, Oct, Nov
    
    if (winterMonths.includes(month)) {
      if (day <= 10) return "❄️ Froid sec";
      if (day <= 20) return "🌨️ Risque de gel";
      return "☁️ Temps couvert";
    } else if (springMonths.includes(month)) {
      if (day <= 10) return "🌤️ Temps frais";
      if (day <= 20) return "☀️ Réchauffement";
      return "🌧️ Averses printanières";
    } else if (summerMonths.includes(month)) {
      if (day <= 10) return "☀️ Temps chaud et sec";
      if (day <= 20) return "🌤️ Alternance soleil/nuages";
      return "🌧️ Possibles orages";
    }
    return "🍂 Temps automnal";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facile': return 'bg-green-100 text-green-800';
      case 'moyen': return 'bg-yellow-100 text-yellow-800';
      case 'difficile': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'sow': return <Seed size={12} className="text-green-600" />;
      case 'harvest': return <Scissors size={12} className="text-orange-600" />;
      case 'plan': return <Calendar size={12} className="text-blue-600" />;
      case 'maintain': return <Info size={12} className="text-gray-600" />;
      default: return <Seed size={12} className="text-green-600" />;
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'sow': return 'Semer';
      case 'harvest': return 'Récolter';
      case 'plan': return 'Planifier';
      case 'maintain': return 'Entretenir';
      default: return 'Action';
    }
  };

  const getSunIcon = (exposure: string) => {
    switch (exposure) {
      case 'full': return <Sun size={10} className="text-yellow-500" />;
      case 'partial': return <Sun size={10} className="text-yellow-400 opacity-60" />;
      case 'shade': return <CloudRain size={10} className="text-gray-500" />;
      default: return <Sun size={10} className="text-yellow-500" />;
    }
  };

  const getSunText = (exposure: string) => {
    switch (exposure) {
      case 'full': return 'Plein soleil';
      case 'partial': return 'Mi-ombre';
      case 'shade': return 'Ombre';
      default: return 'Plein soleil';
    }
  };

  const calendarDays = generateCalendarDays();

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentMonth(prev => prev === 0 ? 11 : prev - 1);
    } else {
      setCurrentMonth(prev => prev === 11 ? 0 : prev + 1);
    }
    setSelectedDay(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <Calendar className="text-green-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Calendrier De Plantation
              </h2>
              <p className="text-sm text-gray-600">
                Suggestions quotidiennes personnalisées
              </p>
            </div>
          </div>
          
          {/* Month Navigation */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <div className="text-center min-w-[120px]">
              <h3 className="text-lg font-bold text-gray-900">{months[currentMonth]}</h3>
              <p className="text-sm text-gray-500">{currentYear}</p>
            </div>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs bg-white rounded-lg p-3 shadow-sm">
          {/* Actions */}
          <div className="flex items-center space-x-1">
            <Seed size={12} className="text-green-600" />
            <span className="text-gray-700 font-medium">Semis</span>
          </div>
          <div className="flex items-center space-x-1">
            <Scissors size={12} className="text-orange-600" />
            <span className="text-gray-700 font-medium">Récolte</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar size={12} className="text-blue-600" />
            <span className="text-gray-700 font-medium">Planning</span>
          </div>
          <div className="flex items-center space-x-1">
            <Info size={12} className="text-gray-600" />
            <span className="text-gray-700 font-medium">Entretien</span>
          </div>
          
          {/* Sun Exposure */}
          <div className="flex items-center space-x-1">
            <Sun size={12} className="text-yellow-500" />
            <span className="text-gray-700 font-medium">Soleil</span>
          </div>
          <div className="flex items-center space-x-1">
            <Sun size={12} className="text-yellow-400 opacity-60" />
            <span className="text-gray-700 font-medium">Mi-ombre</span>
          </div>
          <div className="flex items-center space-x-1">
            <CloudRain size={12} className="text-gray-500" />
            <span className="text-gray-700 font-medium">Ombre</span>
          </div>
          
          {/* Difficulty */}
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600">Facile</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-gray-600">Moyen</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-600">Difficile</span>
          </div>
          
          {/* Yield Statistics */}
          <div className="flex items-center space-x-1">
            <div className="text-purple-600 font-bold">📊</div>
            <span className="text-gray-600">kg/m²</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="text-blue-600 font-bold">🏆</div>
            <span className="text-gray-600">t/ha</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((dayData, index) => (
            <div
              key={index}
              className={`min-h-[120px] border rounded-lg transition-all duration-200 ${
                dayData.day === 0 
                  ? 'border-transparent' 
                  : dayData.isToday
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : dayData.isWeekend
                  ? 'border-gray-200 bg-gray-50'
                  : 'border-gray-200 bg-white hover:shadow-sm hover:border-green-300'
              } ${dayData.plants.length > 0 ? 'cursor-pointer' : ''}`}
              onClick={() => dayData.day > 0 && dayData.plants.length > 0 && setSelectedDay(dayData.day)}
            >
              {dayData.day > 0 && (
                <div className="p-2 h-full flex flex-col">
                  {/* Day Number */}
                  <div className={`text-sm font-semibold mb-2 ${
                    dayData.isToday ? 'text-green-700' : 'text-gray-700'
                  }`}>
                    {dayData.day}
                    {dayData.weatherTip && (
                      <div className="text-xs text-gray-500 mt-1">
                        {dayData.weatherTip}
                      </div>
                    )}
                  </div>

                  {/* Plants for this day */}
                  <div className="flex-1 space-y-1">
                    {dayData.plants.slice(0, 2).map((plant, plantIndex) => {
                      
                      return (
                        <div
                          key={`${plant.id}-${plantIndex}`}
                          className={`text-xs p-2 rounded-lg border transition-all duration-200 hover:shadow-sm ${
                            plant.action === 'sow'
                              ? 'bg-green-50 border-green-200 text-green-800'
                              : plant.action === 'harvest'
                              ? 'bg-orange-50 border-orange-200 text-orange-800'
                              : plant.action === 'plan'
                              ? 'bg-blue-50 border-blue-200 text-blue-800'
                              : 'bg-gray-50 border-gray-200 text-gray-800'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-1">
                              <span className="text-sm">{plant.emoji}</span>
                              <span className="font-semibold text-xs truncate max-w-[80px]">{plant.name}</span>
                            </div>
                            {getActionIcon(plant.action)}
                          </div>
                          
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs px-1 py-0.5 rounded ${getDifficultyColor(plant.difficulty)}`}>
                              {plant.difficulty.charAt(0).toUpperCase()}
                            </span>
                            <div className="flex items-center space-x-1">
                              {getSunIcon(plant.sunExposure)}
                              <Thermometer size={8} className="text-gray-500" />
                              <span className="text-xs text-gray-600">{plant.temperature.split('-')[0]}°</span>
                            </div>
                          </div>
                          
                          {/* Yield information for vegetables */}
                          {plant.type === 'vegetable' && plant.yieldKgM2 && (
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-1">
                                <span className="text-purple-600 text-xs">📊</span>
                                <span className="text-xs text-purple-600 font-medium">{plant.yieldKgM2}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="text-blue-600 text-xs">🏆</span>
                                <span className="text-xs text-blue-600 font-medium">{plant.yieldTHa}</span>
                              </div>
                            </div>
                          )}
                          
                          {plant.companions.length > 0 && (
                            <div className="text-xs text-purple-600 truncate">
                              👥 {plant.companions.slice(0, 1).join('')}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    {dayData.plants.length > 2 && (
                      <div className="text-xs text-gray-500 text-center py-1">
                        +{dayData.plants.length - 2} autres
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Day Details Modal */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedDay} {months[currentMonth]} {currentYear}
                </h3>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {calendarDays.find(d => d.day === selectedDay)?.plants.map((plant, index) => {
                
                return (
                  <div key={index} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl ${plant.color}`}>
                        {plant.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{plant.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(plant.difficulty)}`}>
                            {plant.difficulty}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-3 flex items-center">
                          {getActionIcon(plant.action)} <span className="ml-2">{getActionText(plant.action)}</span>
                        </div>
                        
                        <div className="text-sm text-gray-700 mb-3">
                          💡 {plant.tips}
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <Clock size={12} className="mr-1" />
                              {plant.maturationTime}
                            </div>
                            <div className="flex items-center">
                              {getSunIcon(plant.sunExposure)}
                              <span className="ml-1">{getSunText(plant.sunExposure)}</span>
                            </div>
                            <div className="flex items-center">
                              <Thermometer size={12} className="mr-1" />
                              {plant.temperature}
                            </div>
                            {plant.type === 'vegetable' && plant.yieldKgM2 && (
                              <>
                                <div className="flex items-center">
                                  <span className="text-purple-600 mr-1">📊</span>
                                  <span>{plant.yieldKgM2} kg/m²</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="text-blue-600 mr-1">🏆</span>
                                  <span>{plant.yieldTHa} t/ha</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {plant.companions.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="text-purple-600">
                              👥 Compagnons: {plant.companions.join(', ')}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
        <div className="text-center text-xs text-gray-500">
          🌱 Calendrier complet avec 200+ suggestions de plantation pour toute l'année
        </div>
      </div>
    </div>
  );
};


export default GardenCalendar