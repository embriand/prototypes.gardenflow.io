import React, { useState, useMemo } from 'react';
import { Filter, Eye, EyeOff } from 'lucide-react';
import { Crop } from './types';
import { getParcelsWithZones, mockCrops } from './mockData';
import IntegratedTimelineView from './components/IntegratedTimelineView';
import CropDetailsModal from './components/CropDetailsModal';


const ParcelZoneMatrix: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [currentYear] = useState(2025);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [showEmptyZones, setShowEmptyZones] = useState(true);
  
  const parcels = useMemo(() => getParcelsWithZones(), []);
  
  const families = useMemo(() => {
    const uniqueFamilies = new Set(mockCrops.map(crop => crop.family));
    return Array.from(uniqueFamilies).sort();
  }, []);
  
  const filteredCrops = useMemo(() => {
    return mockCrops.filter(crop => {
      const matchesSearch = searchTerm === '' || 
        crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.variety?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFamily = selectedFamily === 'all' || crop.family === selectedFamily;
      
      return matchesSearch && matchesFamily;
    });
  }, [searchTerm, selectedFamily]);
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Vue Parcelles-Zones avec Timeline
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Visualisation hiérarchique des cultures par parcelle et zone
              </p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              
              
              {/* Show/Hide Empty */}
              <button
                onClick={() => setShowEmptyZones(!showEmptyZones)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${
                  showEmptyZones 
                    ? 'bg-gray-100 text-gray-700' 
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                {showEmptyZones ? <Eye size={16} /> : <EyeOff size={16} />}
                Zones vides
              </button>
            </div>
            
            {/* Filters */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher une culture..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-3 pr-8 py-1.5 border border-gray-300 rounded-lg text-sm w-48"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
              </div>
              
              <select
                value={selectedFamily}
                onChange={(e) => setSelectedFamily(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">Toutes les familles</option>
                {families.map(family => (
                  <option key={family} value={family}>{family}</option>
                ))}
              </select>
              
              <button className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="p-4">
        <IntegratedTimelineView
          parcels={parcels}
          crops={filteredCrops}
          currentYear={currentYear}
          showEmptyZones={showEmptyZones}
          onCropClick={setSelectedCrop}
        />
      </div>
      
      {/* Crop Details Modal */}
      <CropDetailsModal 
        crop={selectedCrop}
        onClose={() => setSelectedCrop(null)}
      />
      
      {/* Legend */}
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
        <div className="text-xs font-medium text-gray-600 mb-2">Légende</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded" />
            <span className="text-xs">Semis</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded" />
            <span className="text-xs">Culture</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-400 rounded" />
            <span className="text-xs">Récolte</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParcelZoneMatrix;