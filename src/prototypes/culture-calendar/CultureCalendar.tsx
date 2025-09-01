import React, { useState } from 'react';
import GardenCalendar from './GardenCalendar';
import GlassyGardenCalendar from './GlassyGardenCalendar';
import PlantingCalendar from './PlantingCalendar';
import EnhancedPlantingCalendar from './EnhancedPlantingCalendar';
import { Calendar, Tractor, ChevronDown, ChevronUp, Sparkles, Palette } from 'lucide-react';

const CultureCalendar: React.FC = () => {
  const [showGardenCalendar, setShowGardenCalendar] = useState(false);
  const [showGlassyCalendar, setShowGlassyCalendar] = useState(true);
  const [showPlantingCalendar, setShowPlantingCalendar] = useState(false);
  const [showEnhancedCalendar, setShowEnhancedCalendar] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Tractor className="text-green-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Calendrier de Culture</h1>
              <p className="text-sm text-gray-600">Planification et suivi de vos cultures</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Glassy Garden Calendar Section - NEW DESIGN */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => setShowGlassyCalendar(!showGlassyCalendar)}
            className="w-full bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 px-6 py-4 border-b border-gray-100 hover:from-indigo-100 hover:via-purple-100 hover:to-pink-100 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Palette className="text-indigo-600" size={20} />
                </div>
                <div className="text-left">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Calendrier Design Glassmorphism
                  </h2>
                  <p className="text-sm text-gray-600">
                    Interface moderne avec effets vitrés et bento design
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-xs text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                  Design 2025
                </div>
                {showGlassyCalendar ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </div>
            </div>
          </button>
          
          {showGlassyCalendar && (
            <div className="animate-in slide-in-from-top-2 duration-200">
              <GlassyGardenCalendar />
            </div>
          )}
        </div>

        {/* Garden Calendar Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => setShowGardenCalendar(!showGardenCalendar)}
            className="w-full bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 px-6 py-4 border-b border-gray-100 hover:from-green-100 hover:via-emerald-100 hover:to-teal-100 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Calendar className="text-green-600" size={20} />
                </div>
                <div className="text-left">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Calendrier de Plantation Détaillé
                  </h2>
                  <p className="text-sm text-gray-600">
                    Suggestions quotidiennes avec données réelles
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  200+ cultures
                </div>
                {showGardenCalendar ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </div>
            </div>
          </button>
          
          {showGardenCalendar && (
            <div className="animate-in slide-in-from-top-2 duration-200">
              <GardenCalendar />
            </div>
          )}
        </div>

        {/* Enhanced Calendar Section - NEW */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => setShowEnhancedCalendar(!showEnhancedCalendar)}
            className="w-full bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 px-6 py-4 border-b border-gray-100 hover:from-purple-100 hover:via-pink-100 hover:to-rose-100 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Sparkles className="text-purple-600" size={20} />
                </div>
                <div className="text-left">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Calendrier Complet 2025
                  </h2>
                  <p className="text-sm text-gray-600">
                    26 légumes avec données complètes de quandplanter.fr
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-xs text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                  Nouveau!
                </div>
                {showEnhancedCalendar ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </div>
            </div>
          </button>
          
          {showEnhancedCalendar && (
            <div className="p-6 animate-in slide-in-from-top-2 duration-200">
              <EnhancedPlantingCalendar />
            </div>
          )}
        </div>

        {/* Planting Calendar Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => setShowPlantingCalendar(!showPlantingCalendar)}
            className="w-full bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 px-6 py-4 border-b border-gray-100 hover:from-emerald-100 hover:via-teal-100 hover:to-cyan-100 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Calendar className="text-emerald-600" size={20} />
                </div>
                <div className="text-left">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Vue Annuelle des Cultures
                  </h2>
                  <p className="text-sm text-gray-600">
                    Visualisez les périodes de semis et récolte sur l'année
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-xs text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                  Vue timeline
                </div>
                {showPlantingCalendar ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </div>
            </div>
          </button>
          
          {showPlantingCalendar && (
            <div className="p-6 animate-in slide-in-from-top-2 duration-200">
              <PlantingCalendar />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 pb-6">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-gray-500">
            🌱 Prototype de calendrier de culture - Données de plantation pour toute l'année
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CultureCalendar;