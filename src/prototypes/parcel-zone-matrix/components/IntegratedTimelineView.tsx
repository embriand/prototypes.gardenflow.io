import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Calendar, CalendarDays, CalendarRange, ZoomIn, ZoomOut, Layers } from 'lucide-react';
import { Parcel, Crop, ViewMode } from '../types';
import CropPhaseBar from './CropPhaseBar';

interface IntegratedTimelineViewProps {
  parcels: Parcel[];
  crops: Crop[];
  currentYear: number;
  showEmptyZones?: boolean;
  onCropClick?: (crop: Crop) => void;
}

const IntegratedTimelineView: React.FC<IntegratedTimelineViewProps> = ({ 
  parcels, 
  crops, 
  currentYear,
  showEmptyZones = true,
  onCropClick 
}) => {
  const [expandedParcels, setExpandedParcels] = useState<Set<string>>(new Set(parcels.map(p => p.uuid)));
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [dayView, setDayView] = useState<boolean>(false);
  
  const months = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
    'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
  ];

  const monthEmojis = ['❄️', '❄️', '🌱', '🌷', '🌸', '☀️', '🌻', '🌾', '🍂', '🎃', '🍁', '⛄'];
  
  const getMonthColor = (monthIndex: number) => {
    const colors = [
      'bg-gradient-to-b from-blue-50 to-blue-100',
      'bg-gradient-to-b from-blue-50 to-blue-100',
      'bg-gradient-to-b from-green-50 to-green-100',
      'bg-gradient-to-b from-green-50 to-green-100',
      'bg-gradient-to-b from-green-50 to-green-100',
      'bg-gradient-to-b from-yellow-50 to-yellow-100',
      'bg-gradient-to-b from-yellow-50 to-yellow-100',
      'bg-gradient-to-b from-yellow-50 to-yellow-100',
      'bg-gradient-to-b from-orange-50 to-orange-100',
      'bg-gradient-to-b from-orange-50 to-orange-100',
      'bg-gradient-to-b from-orange-50 to-orange-100',
      'bg-gradient-to-b from-blue-50 to-blue-100'
    ];
    return colors[monthIndex];
  };

  const toggleParcel = (parcelUuid: string) => {
    setExpandedParcels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(parcelUuid)) {
        newSet.delete(parcelUuid);
      } else {
        newSet.add(parcelUuid);
      }
      return newSet;
    });
  };

  const getCropsForZone = (zoneUuid: string) => {
    return crops.filter(crop => crop.zoneUuid === zoneUuid);
  };

  const renderTimelineHeader = () => {
    if (viewMode === 'week' && dayView) {
      // Day view - show 365 days
      const daysInYear = 365;
      return (
        <div className="flex bg-gradient-to-b from-white to-gray-50 border-b-2 border-gray-300 sticky top-0 z-30">
          <div className="w-64 flex-shrink-0 sticky left-0 z-40 px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold border-r border-gray-400">
            <div className="flex items-center justify-between">
              <span>{currentYear}</span>
              <span className="text-xs opacity-80">{daysInYear} jours</span>
            </div>
          </div>
          <div className="flex">
            {months.map((month, monthIndex) => {
              const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
              return (
                <div key={monthIndex} className={`flex border-r-2 border-gray-300 ${getMonthColor(monthIndex)}`}>
                  {Array.from({ length: daysInMonth }, (_, dayIndex) => dayIndex + 1).map(day => {
                    const isWeekend = new Date(currentYear, monthIndex, day).getDay() === 0 || 
                                     new Date(currentYear, monthIndex, day).getDay() === 6;
                    return (
                      <div 
                        key={`${monthIndex}-${day}`} 
                        className={`flex-shrink-0 w-8 text-center py-1 border-r text-xs transition-all duration-150 cursor-default group ${
                          isWeekend ? 'bg-gray-100/50 border-gray-200' : 'border-gray-100 hover:bg-white/70'
                        }`}
                      >
                        <div className="text-[10px] text-gray-600 font-medium group-hover:text-gray-800">
                          {months[monthIndex].slice(0, 3)}
                        </div>
                        <div className={`text-[11px] font-bold ${
                          isWeekend ? 'text-gray-500' : 'text-gray-700'
                        } group-hover:text-gray-900`}>
                          {day}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      );
    } else if (viewMode === 'week') {
      return (
        <div className="flex bg-gradient-to-b from-white to-gray-50 border-b-2 border-gray-300 sticky top-0 z-30">
          <div className="w-64 flex-shrink-0 sticky left-0 z-40 px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold border-r border-gray-400">
            <div className="flex items-center justify-between">
              <span>{currentYear}</span>
              <span className="text-xs opacity-80">52 semaines</span>
            </div>
          </div>
          <div className="flex overflow-x-visible">
            {Array.from({ length: 52 }, (_, i) => i + 1).map(week => {
              const monthIndex = Math.floor((week - 1) / 4.33);
              const isMonthStart = week === 1 || week === 5 || week === 9 || week === 14 || 
                                  week === 18 || week === 22 || week === 27 || week === 31 || 
                                  week === 35 || week === 40 || week === 44 || week === 48;
              return (
                <div 
                  key={week} 
                  className={`flex-shrink-0 w-20 text-center py-2 border-r text-xs transition-all duration-150 ${
                    isMonthStart ? 'border-gray-400 border-r-2' : 'border-gray-200'
                  } ${getMonthColor(monthIndex)} hover:brightness-110`}
                >
                  <div className="text-[10px] text-gray-600 font-medium">
                    {monthEmojis[monthIndex]}
                  </div>
                  <div className="font-bold text-gray-800">
                    S{week}
                  </div>
                  {isMonthStart && (
                    <div className="text-[9px] text-gray-500 mt-0.5">
                      {months[monthIndex]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="flex bg-gradient-to-b from-white to-gray-50 border-b-2 border-gray-300 sticky top-0 z-20">
        <div className="w-64 flex-shrink-0 sticky left-0 z-30 px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold border-r border-gray-400">
          <div className="flex items-center justify-between">
            <span>{currentYear}</span>
            <span className="text-xs opacity-80">12 mois</span>
          </div>
        </div>
        <div className="flex">
          {months.map((month, index) => (
            <div 
              key={index} 
              className={`flex-shrink-0 w-[120px] text-center border-r border-gray-300 ${getMonthColor(index)}`}
            >
              <div className="py-2">
                <div className="text-lg">{monthEmojis[index]}</div>
                <div className="text-sm font-bold text-gray-800">{month}</div>
                <div className="text-xs text-gray-600">S{index * 4 + 1}-{(index + 1) * 4}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCropTimeline = (crop: Crop) => {
    if (viewMode === 'week' && dayView) {
      // Day view rendering
      const daysInYear = 365;
      let dayCounter = 0;
      
      return (
        <div className="flex">
          {months.map((_, monthIndex) => {
            const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
            return (
              <div key={monthIndex} className="flex">
                {Array.from({ length: daysInMonth }, (_, dayInMonth) => {
                  dayCounter++;
                  const weekNum = Math.ceil(dayCounter / 7);
                  
                  const hasSow = crop.sowStartWeek && crop.sowEndWeek && 
                                weekNum >= crop.sowStartWeek && weekNum <= crop.sowEndWeek;
                  const hasCulture = crop.cultureStartWeek && crop.cultureEndWeek && 
                                   weekNum >= crop.cultureStartWeek && weekNum <= crop.cultureEndWeek;
                  const hasHarvest = crop.harvestStartWeek && crop.harvestEndWeek && 
                                   weekNum >= crop.harvestStartWeek && weekNum <= crop.harvestEndWeek;

                  return (
                    <div key={`${monthIndex}-${dayInMonth}`} className="flex-shrink-0 w-8 h-8 border-r border-gray-100 relative">
                      <div className="absolute inset-0 flex flex-col gap-px p-px">
                        {hasSow && (
                          <div className="flex-1 bg-gradient-to-r from-green-400 to-green-500 rounded-sm opacity-90 hover:opacity-100 cursor-pointer" 
                               onClick={() => onCropClick?.(crop)} />
                        )}
                        {hasCulture && (
                          <div className="flex-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-sm opacity-90 hover:opacity-100 cursor-pointer"
                               onClick={() => onCropClick?.(crop)} />
                        )}
                        {hasHarvest && (
                          <div className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 rounded-sm opacity-90 hover:opacity-100 cursor-pointer"
                               onClick={() => onCropClick?.(crop)} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      );
    } else if (viewMode === 'week') {
      return (
        <div className="flex">
          {Array.from({ length: 52 }, (_, week) => week + 1).map(weekNum => {
            const hasSow = crop.sowStartWeek && crop.sowEndWeek && 
                          weekNum >= crop.sowStartWeek && weekNum <= crop.sowEndWeek;
            const hasCulture = crop.cultureStartWeek && crop.cultureEndWeek && 
                             weekNum >= crop.cultureStartWeek && weekNum <= crop.cultureEndWeek;
            const hasHarvest = crop.harvestStartWeek && crop.harvestEndWeek && 
                             weekNum >= crop.harvestStartWeek && weekNum <= crop.harvestEndWeek;

            const monthIndex = Math.floor((weekNum - 1) / 4.33);
            const isMonthStart = weekNum === 1 || weekNum === 5 || weekNum === 9 || weekNum === 14 || 
                                weekNum === 18 || weekNum === 22 || weekNum === 27 || weekNum === 31 || 
                                weekNum === 35 || weekNum === 40 || weekNum === 44 || weekNum === 48;

            return (
              <div key={weekNum} className={`flex-shrink-0 w-20 h-8 border-r relative transition-colors ${
                isMonthStart ? 'border-gray-300' : 'border-gray-100'
              } ${hasSow || hasCulture || hasHarvest ? '' : 'hover:bg-gray-50/20'}`}>
                <div className="absolute inset-0 flex flex-col gap-px p-px">
                  {hasSow && (
                    <div className="flex-1 bg-gradient-to-r from-green-400 to-green-500 rounded-sm opacity-90 hover:opacity-100 cursor-pointer shadow-sm hover:shadow-md transition-all duration-150" 
                         onClick={() => onCropClick?.(crop)} />
                  )}
                  {hasCulture && (
                    <div className="flex-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-sm opacity-90 hover:opacity-100 cursor-pointer shadow-sm hover:shadow-md transition-all duration-150"
                         onClick={() => onCropClick?.(crop)} />
                  )}
                  {hasHarvest && (
                    <div className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 rounded-sm opacity-90 hover:opacity-100 cursor-pointer shadow-sm hover:shadow-md transition-all duration-150"
                         onClick={() => onCropClick?.(crop)} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="flex relative h-10">
        {months.map((_, monthIndex) => (
          <div key={monthIndex} className="flex-shrink-0 w-[120px] relative border-r border-gray-200">
            <CropPhaseBar crop={crop} phase="sow" monthIndex={monthIndex} onClick={onCropClick} />
            <CropPhaseBar crop={crop} phase="culture" monthIndex={monthIndex} onClick={onCropClick} />
            <CropPhaseBar crop={crop} phase="harvest" monthIndex={monthIndex} onClick={onCropClick} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Controls Bar */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Calendar size={20} />
            Vue Intégrée - Parcelles & Timeline
            <span className="text-xs font-normal bg-white/20 px-2 py-0.5 rounded-full ml-2">
              {viewMode === 'month' ? '12 mois' : viewMode === 'week' && dayView ? '365 jours' : '52 semaines'}
            </span>
          </h3>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur rounded-lg p-1">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 rounded flex items-center gap-1.5 ${viewMode === 'month' ? 'bg-white text-indigo-600 shadow-sm' : 'text-white hover:bg-white/20'} transition-all duration-200`}
                title="Vue par mois (12 périodes)"
              >
                <Calendar size={14} />
                <span className="text-sm font-medium">Mois</span>
              </button>
              <button
                onClick={() => {
                  setViewMode('week');
                  setDayView(false);
                }}
                className={`px-3 py-1.5 rounded flex items-center gap-1.5 ${viewMode === 'week' && !dayView ? 'bg-white text-indigo-600 shadow-sm' : 'text-white hover:bg-white/20'} transition-all duration-200`}
                title="Vue par semaines (52 semaines)"
              >
                <CalendarRange size={14} />
                <span className="text-sm font-medium">Semaines</span>
              </button>
              <button
                onClick={() => {
                  setViewMode('week');
                  setDayView(true);
                }}
                className={`px-3 py-1.5 rounded flex items-center gap-1.5 ${viewMode === 'week' && dayView ? 'bg-white text-indigo-600 shadow-sm' : 'text-white hover:bg-white/20'} transition-all duration-200`}
                title="Vue par jours (365 jours)"
              >
                <CalendarDays size={14} />
                <span className="text-sm font-medium">Jours</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Synchronized Timeline and Parcels */}
      <div className="relative overflow-auto max-h-[calc(100vh-300px)]">
        <div className={`relative min-w-full ${viewMode === 'week' && dayView ? 'w-[calc(256px+365*32px)]' : viewMode === 'week' ? 'w-[calc(256px+52*80px)]' : 'w-[calc(256px+12*120px)]'}`}>
          {/* Timeline Header - Sticky at top */}
          {renderTimelineHeader()}
          
          {/* Parcels and Zones with Timeline - Scrollable content */}
          <div className="">
            {parcels.map(parcel => {
              const isExpanded = expandedParcels.has(parcel.uuid);
              const parcelCrops = crops.filter(c => c.parcelUuid === parcel.uuid);
              
              return (
                <div key={parcel.uuid} className="border-b-2 border-gray-300">
                  {/* Parcel Header */}
                  <div className="flex bg-gradient-to-r from-indigo-50 via-white to-blue-50 hover:from-indigo-100 hover:to-blue-100 transition-colors">
                    <div className="w-64 flex-shrink-0 sticky left-0 z-20 px-4 py-3 border-r border-gray-300 bg-gradient-to-r from-indigo-50 to-blue-50">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleParcel(parcel.uuid)}
                          className="p-1 hover:bg-white/60 rounded transition-all"
                        >
                          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </button>
                        <div className="flex-1">
                          <div className="font-bold text-gray-900">{parcel.name}</div>
                          <div className="text-xs text-gray-600">
                            {parcel.zones.length} zones • {parcelCrops.length} cultures
                            {parcel.zones.some(z => getCropsForZone(z.uuid).length === 0) && (
                              <span className="text-orange-600 ml-1">(zones libres)</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 relative">
                      {/* Empty parcel timeline area - crops are shown in zones below */}
                    </div>
                  </div>
                  
                  {/* Zones */}
                  {isExpanded && parcel.zones.map(zone => {
                    const zoneCrops = getCropsForZone(zone.uuid);
                    
                    // Skip empty zones if showEmptyZones is false
                    if (!showEmptyZones && zoneCrops.length === 0) {
                      return null;
                    }
                    
                    return (
                      <div key={zone.uuid} className="bg-gray-50">
                        {/* Zone Header */}
                        <div className="flex border-t border-gray-200 hover:bg-gray-100 transition-colors">
                          <div className="w-64 flex-shrink-0 sticky left-0 z-20 px-8 py-2 border-r border-gray-300 bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Layers size={14} className="text-gray-500" />
                              <div>
                                <div className="font-medium text-sm text-gray-800">{zone.name}</div>
                                <div className="text-xs text-gray-500">
                                  {zoneCrops.length === 0 ? (
                                    <span className="text-orange-600 font-medium">Zone disponible</span>
                                  ) : (
                                    <span>{zoneCrops.length} culture{zoneCrops.length !== 1 ? 's' : ''}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex-1">
                            {/* Zone timeline placeholder */}
                          </div>
                        </div>
                        
                        {/* Crops in Zone or Empty Zone Indicator */}
                        {zoneCrops.length === 0 ? (
                          <div className="flex border-t border-gray-100 bg-gray-50/50">
                            <div className="w-64 flex-shrink-0 sticky left-0 z-20 px-12 py-3 border-r border-gray-300 bg-gray-50">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center shadow-sm">
                                  <span className="text-xs font-bold text-gray-500">∅</span>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-500 italic">Zone libre</div>
                                  <div className="text-xs text-gray-400">Prête pour plantation</div>
                                </div>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="h-8 flex items-center px-4">
                                <div className="text-xs text-gray-400 italic">Aucune culture planifiée</div>
                              </div>
                            </div>
                          </div>
                        ) : zoneCrops.map(crop => (
                          <div key={crop.uuid} className="flex border-t border-gray-100 hover:bg-blue-50/30 transition-colors">
                            <div className="w-64 flex-shrink-0 sticky left-0 z-20 px-12 py-2 border-r border-gray-300 bg-white">
                              <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-lg ${crop.color} flex items-center justify-center shadow-sm`}>
                                  <span className="text-xs font-bold text-white">
                                    {crop.name.substring(0, 2).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{crop.name}</div>
                                  {crop.variety && (
                                    <div className="text-xs text-gray-600">{crop.variety}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex-1">
                              {renderCropTimeline(crop)}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-gradient-to-r from-green-400 to-green-500" />
              Semis
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-gradient-to-r from-blue-400 to-blue-500" />
              Culture
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-gradient-to-r from-orange-400 to-orange-500" />
              Récolte
            </span>
          </div>
          <div>
            {crops.length} cultures • {parcels.length} parcelles
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegratedTimelineView;