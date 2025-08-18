import React, { useState, useMemo } from 'react';
import { Calendar, Grid3x3, Layers, Filter, Download, Plus, Eye, EyeOff, LayoutGrid, Rows } from 'lucide-react';
import { ViewMode, TimelineMode, Crop } from './types';
import { getParcelsWithZones, mockCrops } from './mockData';
import TimelineHeader from './components/TimelineHeader';
import ParcelSection from './components/ParcelSection';
import MatrixView from './components/MatrixView';
import CropDetailsModal from './components/CropDetailsModal';

type LayoutMode = 'timeline' | 'matrix';

const ParcelZoneMatrixEnhanced: React.FC = () => {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('matrix');
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [timelineMode, setTimelineMode] = useState<TimelineMode>('compact');
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
  
  const stats = useMemo(() => {
    const totalParcels = parcels.length;
    const totalZones = parcels.reduce((sum, p) => sum + p.zones.length, 0);
    const occupiedZones = new Set(filteredCrops.map(c => c.zoneUuid)).size;
    const totalCrops = filteredCrops.length;
    
    return {
      totalParcels,
      totalZones,
      occupiedZones,
      totalCrops,
      occupancyRate: Math.round((occupiedZones / totalZones) * 100)
    };
  }, [parcels, filteredCrops]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Vue Matrice Parcelles-Zones
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {layoutMode === 'matrix' 
                  ? 'Vue matricielle avec zones en colonnes'
                  : 'Vue chronologique avec timeline'
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Plus size={18} />
                Nouvelle culture
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                <Download size={18} />
                Exporter
              </button>
            </div>
          </div>
          
          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg px-4 py-2">
              <div className="text-xs text-gray-500">Parcelles</div>
              <div className="text-xl font-semibold">{stats.totalParcels}</div>
            </div>
            <div className="bg-gray-50 rounded-lg px-4 py-2">
              <div className="text-xs text-gray-500">Zones</div>
              <div className="text-xl font-semibold">
                {stats.occupiedZones}/{stats.totalZones}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg px-4 py-2">
              <div className="text-xs text-gray-500">Cultures</div>
              <div className="text-xl font-semibold">{stats.totalCrops}</div>
            </div>
            <div className="bg-gray-50 rounded-lg px-4 py-2">
              <div className="text-xs text-gray-500">Taux d'occupation</div>
              <div className="text-xl font-semibold">{stats.occupancyRate}%</div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Layout Mode Selector */}
              <div className="flex items-center gap-2 bg-purple-100 rounded-lg p-1">
                <button
                  onClick={() => setLayoutMode('matrix')}
                  className={`px-3 py-1.5 rounded flex items-center gap-2 transition-all ${
                    layoutMode === 'matrix' 
                      ? 'bg-white shadow-sm text-purple-700 font-medium' 
                      : 'hover:bg-purple-50 text-gray-600'
                  }`}
                >
                  <LayoutGrid size={16} />
                  Matrice
                </button>
                <button
                  onClick={() => setLayoutMode('timeline')}
                  className={`px-3 py-1.5 rounded flex items-center gap-2 transition-all ${
                    layoutMode === 'timeline' 
                      ? 'bg-white shadow-sm text-purple-700 font-medium' 
                      : 'hover:bg-purple-50 text-gray-600'
                  }`}
                >
                  <Rows size={16} />
                  Timeline
                </button>
              </div>
              
              {layoutMode === 'timeline' && (
                <>
                  {/* View Mode Selector */}
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('week')}
                      className={`px-3 py-1 rounded ${
                        viewMode === 'week' 
                          ? 'bg-white shadow-sm' 
                          : 'hover:bg-gray-50'
                      } transition-all flex items-center gap-1`}
                    >
                      <Grid3x3 size={16} />
                      Semaine
                    </button>
                    <button
                      onClick={() => setViewMode('month')}
                      className={`px-3 py-1 rounded ${
                        viewMode === 'month' 
                          ? 'bg-white shadow-sm' 
                          : 'hover:bg-gray-50'
                      } transition-all flex items-center gap-1`}
                    >
                      <Calendar size={16} />
                      Mois
                    </button>
                    <button
                      onClick={() => setViewMode('season')}
                      className={`px-3 py-1 rounded ${
                        viewMode === 'season' 
                          ? 'bg-white shadow-sm' 
                          : 'hover:bg-gray-50'
                      } transition-all flex items-center gap-1`}
                    >
                      <Layers size={16} />
                      Saison
                    </button>
                  </div>
                  
                  {/* Timeline Mode */}
                  <select
                    value={timelineMode}
                    onChange={(e) => setTimelineMode(e.target.value as TimelineMode)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="compact">Vue compacte</option>
                    <option value="expanded">Vue étendue</option>
                    <option value="phases">Vue par phases</option>
                  </select>
                </>
              )}
              
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
      {layoutMode === 'matrix' ? (
        <div className="p-4">
          <MatrixView 
            parcels={parcels}
            crops={filteredCrops}
            viewMode={viewMode}
            onCropClick={setSelectedCrop}
          />
        </div>
      ) : (
        <div className="relative">
          <TimelineHeader viewMode={viewMode} currentYear={currentYear} />
          
          <div className="overflow-x-auto">
            <div className="min-w-[1200px]">
              {parcels.map(parcel => {
                const parcelCrops = filteredCrops.filter(c => c.parcelUuid === parcel.uuid);
                const hasContent = parcelCrops.length > 0 || showEmptyZones;
                
                if (!hasContent) return null;
                
                return (
                  <ParcelSection
                    key={parcel.uuid}
                    parcel={parcel}
                    crops={filteredCrops}
                    viewMode={viewMode}
                    onCropClick={setSelectedCrop}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* Crop Details Modal */}
      <CropDetailsModal 
        crop={selectedCrop}
        onClose={() => setSelectedCrop(null)}
      />
      
      {/* Legend */}
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
        <div className="text-xs font-medium text-gray-600 mb-2">Légende</div>
        {layoutMode === 'matrix' ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-100 rounded" />
              <span className="text-xs">Faible occupation (&lt;50%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-100 rounded" />
              <span className="text-xs">Occupation moyenne (50-75%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-100 rounded" />
              <span className="text-xs">Forte occupation (&gt;75%)</span>
            </div>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default ParcelZoneMatrixEnhanced;