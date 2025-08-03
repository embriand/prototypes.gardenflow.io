import React, { useState } from 'react';
import { MapPin, Layers, Sprout, Ruler, Activity } from 'lucide-react';
import { mockCanvasObjects } from './mockData';
import type { DroppedGarden, DroppedParcel, DroppedZone, DroppedCrop } from './types';

const EnhancedParcelZoneCrops: React.FC = () => {
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);
  const { garden } = mockCanvasObjects;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'healthy': return 'bg-emerald-50 border-emerald-300 shadow-emerald-100';
      case 'needs-attention': return 'bg-amber-50 border-amber-300 shadow-amber-100';
      case 'ready-harvest': return 'bg-blue-50 border-blue-300 shadow-blue-100';
      default: return 'bg-green-50 border-green-300 shadow-green-100';
    }
  };

  // Helper function to find selected object details
  const getSelectedObjectDetails = () => {
    if (!selectedObject) return null;
    
    // Check if it's the garden
    if (selectedObject === garden.id) {
      return { type: 'garden', data: garden };
    }
    
    // Check parcels
    for (const parcel of garden.parcels) {
      if (selectedObject === parcel.id) {
        return { type: 'parcel', data: parcel };
      }
      
      // Check zones within this parcel
      for (const zone of parcel.zones) {
        if (selectedObject === zone.id) {
          return { type: 'zone', data: zone };
        }
        
        // Check crops within this zone
        for (const crop of zone.crops) {
          if (selectedObject === crop.id) {
            return { type: 'crop', data: crop };
          }
        }
      }
    }
    
    return null;
  };

  const isObjectSelected = (id: string) => selectedObject === id;
  const isObjectHovered = (id: string) => hoveredObject === id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
            Enhanced Parcel-Zone-Crops Design
          </h1>
          <p className="text-slate-600">
            Improved design with better spacing, hover effects, and visual hierarchy
          </p>
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-medium text-green-900 mb-2">Design Improvements Applied:</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Enhanced surface design with gradients and shadows</li>
              <li>• Proper spacing between objects to prevent overlap</li>
              <li>• Smooth hover highlights and scale effects</li>
              <li>• Clean icon/label positioning without overlap</li>
              <li>• Status indicators with visual feedback</li>
              <li>• Better color scheme differentiation</li>
            </ul>
          </div>
        </div>

        {/* Legend Section */}
        <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 rounded-lg">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span>Element Legend</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Parcel Legend */}
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200">
              <div className="w-8 h-8 rounded-lg" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #d97706 100%)', border: '2px solid #92400e' }}></div>
              <div>
                <div className="font-semibold text-slate-900">Parcels</div>
                <div className="text-xs text-slate-600">Land boundaries</div>
              </div>
            </div>

            {/* Zone Legend */}
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200">
              <div className="w-8 h-8 rounded-lg" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 50%, #a5b4fc 100%)', border: '2px solid #4f46e5' }}></div>
              <div>
                <div className="font-semibold text-slate-900">Zones</div>
                <div className="text-xs text-slate-600">Cultivation areas</div>
              </div>
            </div>

            {/* Crop Legend */}
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 border-2 border-emerald-400"></div>
              <div>
                <div className="font-semibold text-slate-900">Crops</div>
                <div className="text-xs text-slate-600">Individual plants</div>
              </div>
            </div>
          </div>

          {/* Status Legend */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
              <Sprout className="w-4 h-4 text-green-600" />
              <span>Crop Status Indicators</span>
            </h4>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-slate-700">Healthy</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-slate-700">Needs Attention</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-slate-700">Ready to Harvest</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Canvas */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/50 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <span className="text-sm font-semibold text-slate-700">Studio+ Canvas - Enhanced Design</span>
            </div>
            <div className="text-xs text-slate-500">
              Click to select • Hover for preview
            </div>
          </div>
          
          <div className="relative bg-gradient-to-br from-emerald-50/50 via-green-50/30 to-teal-50/50 overflow-x-auto overflow-y-hidden" style={{ height: '700px', paddingTop: '50px' }}>
            <div style={{ width: '1350px', height: '100%', position: 'relative' }}>
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#10b981" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Enhanced Garden Area */}
            <div
              className={`absolute rounded-3xl transition-all duration-300 cursor-pointer group/garden ${
                isObjectSelected(garden.id) 
                  ? 'ring-4 ring-green-400/50 shadow-2xl scale-105 z-5' 
                  : 'hover:shadow-xl hover:scale-[1.01]'
              } ${
                isObjectHovered(garden.id) ? 'z-10' : ''
              }`}
              style={{
                left: garden.x,
                top: garden.y,
                width: garden.width,
                height: garden.height,
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
                border: '3px solid #16a34a',
                boxShadow: '0 12px 48px rgba(22, 163, 74, 0.12)'
              }}
              onClick={() => setSelectedObject(garden.id)}
              onMouseEnter={() => setHoveredObject(garden.id)}
              onMouseLeave={() => setHoveredObject(null)}
            >
              {/* Garden Header */}
              <div className="absolute -top-8 left-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center space-x-2 group-hover/garden:scale-110 transition-transform duration-300 z-10">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                </svg>
                <span>{garden.name}</span>
              </div>

              {/* Garden Stats */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-slate-700 shadow-md border border-green-200/50">
                <div className="flex items-center space-x-2 mb-1">
                  <Ruler className="w-3 h-3 text-green-600" />
                  <span className="font-semibold">{garden.widthMeters}m × {garden.heightMeters}m</span>
                </div>
                <div className="text-center text-slate-500">Garden Area</div>
              </div>

              {/* Enhanced Parcels */}
              {garden.parcels.map((parcel) => (
                <div
                  key={parcel.id}
                  className={`absolute rounded-2xl transition-all duration-300 cursor-pointer group/parcel ${
                    isObjectSelected(parcel.id) 
                      ? 'ring-4 ring-orange-400/50 shadow-2xl scale-105 z-20' 
                      : 'hover:shadow-xl hover:scale-[1.02]'
                  } ${
                    isObjectHovered(parcel.id) ? 'z-30' : ''
                  }`}
                  style={{
                    left: parcel.x - garden.x + 30,
                    top: parcel.y - garden.y + 30,
                    width: parcel.width - 60,
                    height: parcel.height - 60,
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 30%, #f59e0b 100%)',
                    border: '2px solid #d97706',
                    boxShadow: '0 8px 32px rgba(217, 119, 6, 0.15)'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedObject(parcel.id);
                  }}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    setHoveredObject(parcel.id);
                  }}
                  onMouseLeave={() => setHoveredObject(null)}
                >
                  {/* Parcel Header - Better positioned to avoid all overlaps */}
                  <div className="absolute -top-6 left-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center space-x-2 group-hover/parcel:scale-110 transition-transform duration-300 z-10">
                    <MapPin className="w-4 h-4" />
                    <span>{parcel.name}</span>
                  </div>

                  {/* Parcel Stats - Better positioned */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs text-slate-700 shadow-md border border-orange-200/50">
                    <div className="flex items-center space-x-2">
                      <Ruler className="w-3 h-3 text-orange-600" />
                      <span className="font-semibold">{parcel.area}m²</span>
                    </div>
                  </div>

                  {/* Enhanced Zones with proper spacing */}
                  {parcel.zones.map((zone) => (
                    <div
                      key={zone.id}
                      className={`absolute rounded-xl transition-all duration-300 cursor-pointer group/zone ${
                        isObjectSelected(zone.id) 
                          ? 'ring-3 ring-indigo-400/70 z-40 scale-105' 
                          : 'hover:shadow-lg hover:scale-[1.03]'
                      } ${
                        isObjectHovered(zone.id) ? 'z-50' : ''
                      }`}
                      style={{
                        left: zone.x - parcel.x + 20,
                        top: zone.y - parcel.y + 20,
                        width: zone.width - 40,
                        height: zone.height - 40,
                        background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 70%, #a5b4fc 100%)',
                        border: '2px solid #4f46e5',
                        boxShadow: '0 4px 20px rgba(79, 70, 229, 0.15)'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedObject(zone.id);
                      }}
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        setHoveredObject(zone.id);
                      }}
                      onMouseLeave={() => setHoveredObject(null)}
                    >
                      {/* Zone Header - Better positioned to avoid overlap */}
                      <div className="absolute -top-5 left-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md flex items-center space-x-1.5 group-hover/zone:scale-110 transition-transform duration-300 z-10">
                        <Layers className="w-3 h-3" />
                        <span>{zone.name}</span>
                      </div>

                      {/* Zone Stats - Always visible with better positioning */}
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-md px-2 py-1 text-xs text-slate-600 shadow-md border border-indigo-200/50 z-50">
                        <div className="flex items-center space-x-1">
                          <Ruler className="w-2.5 h-2.5 text-indigo-600" />
                          <span className="font-semibold">{zone.area}m²</span>
                        </div>
                      </div>

                      {/* Enhanced Crops with proper spacing */}
                      {zone.crops.map((crop) => (
                        <div
                          key={crop.id}
                          className={`absolute rounded-lg transition-all duration-300 cursor-pointer group/crop ${
                            getStatusColor(crop.status)
                          } ${
                            isObjectSelected(crop.id) 
                              ? 'ring-2 ring-green-500/70 z-60 scale-110' 
                              : 'hover:shadow-lg hover:scale-105'
                          } ${
                            isObjectHovered(crop.id) ? 'z-70' : ''
                          }`}
                          style={{
                            left: crop.x - zone.x,
                            top: crop.y - zone.y,
                            width: crop.width,
                            height: crop.height,
                            borderWidth: '2px',
                            boxShadow: '0 3px 12px rgba(0, 0, 0, 0.08)'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedObject(crop.id);
                          }}
                          onMouseEnter={(e) => {
                            e.stopPropagation();
                            setHoveredObject(crop.id);
                          }}
                          onMouseLeave={() => setHoveredObject(null)}
                        >
                          {/* Crop Icon - Positioned inside to avoid overlap */}
                          <div className="absolute top-1 left-1 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full p-1 shadow-md group-hover/crop:scale-110 transition-transform duration-300">
                            <Sprout className="w-2.5 h-2.5" />
                          </div>

                          {/* Combined Crop name and variety - Centered in middle */}
                          <div className="absolute inset-1 flex items-center justify-center">
                            <div className="text-center px-1 py-0.5 bg-white/95 rounded backdrop-blur-sm shadow-sm border border-white/50">
                              <div className="text-xs font-bold text-slate-800 leading-tight">
                                {crop.name}
                              </div>
                              {crop.variety && (
                                <div className="text-xs text-slate-500 font-medium leading-tight">
                                  {crop.variety}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Quantity Badge - Small chip in top-right */}
                          {crop.quantity && (
                            <div className="absolute -top-2 -right-2 bg-slate-700 text-white rounded-full min-w-[20px] h-[20px] flex items-center justify-center text-xs font-bold shadow-md ring-2 ring-white z-10">
                              {crop.quantity}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Enhanced hover tooltip */}
            {hoveredObject && (
              <div className="absolute bottom-6 left-6 bg-black/90 backdrop-blur-sm text-white px-4 py-3 rounded-xl text-sm shadow-2xl border border-white/10 animate-in slide-in-from-bottom">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span className="font-medium">Hovering: {hoveredObject}</span>
                </div>
              </div>
            )}

            {/* Enhanced Properties Dialog */}
            {selectedObject && (() => {
              const details = getSelectedObjectDetails();
              if (!details) return null;
              
              return (
                <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200/50 p-6 min-w-[300px] animate-in slide-in-from-bottom duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {details.type === 'garden' && (
                        <div className="bg-green-100 p-2 rounded-lg">
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                          </svg>
                        </div>
                      )}
                      {details.type === 'parcel' && (
                        <div className="bg-orange-100 p-2 rounded-lg">
                          <MapPin className="w-5 h-5 text-orange-600" />
                        </div>
                      )}
                      {details.type === 'zone' && (
                        <div className="bg-indigo-100 p-2 rounded-lg">
                          <Layers className="w-5 h-5 text-indigo-600" />
                        </div>
                      )}
                      {details.type === 'crop' && (
                        <div className="bg-emerald-100 p-2 rounded-lg">
                          <Sprout className="w-5 h-5 text-emerald-600" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-slate-900 capitalize">{details.type}</h3>
                        <p className="text-sm text-slate-600">{details.data.name}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedObject(null)}
                      className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Garden Properties */}
                    {details.type === 'garden' && (
                      <>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-sm text-slate-600">Dimensions</span>
                          <span className="font-medium text-slate-900">{(details.data as DroppedGarden).widthMeters}m × {(details.data as DroppedGarden).heightMeters}m</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-sm text-slate-600">Parcels</span>
                          <span className="font-medium text-slate-900">{(details.data as DroppedGarden).parcels.length}</span>
                        </div>
                      </>
                    )}
                    
                    {/* Parcel Properties */}
                    {details.type === 'parcel' && (
                      <>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-sm text-slate-600">Area</span>
                          <span className="font-medium text-slate-900">{(details.data as DroppedParcel).area}m²</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-sm text-slate-600">Zones</span>
                          <span className="font-medium text-slate-900">{(details.data as DroppedParcel).zones.length}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm text-slate-600">Total Crops</span>
                          <span className="font-medium text-slate-900">{(details.data as DroppedParcel).zones.reduce((sum: number, zone: DroppedZone) => sum + zone.crops.length, 0)}</span>
                        </div>
                      </>
                    )}
                    
                    {/* Zone Properties */}
                    {details.type === 'zone' && (
                      <>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-sm text-slate-600">Area</span>
                          <span className="font-medium text-slate-900">{(details.data as DroppedZone).area}m²</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-sm text-slate-600">Crops</span>
                          <span className="font-medium text-slate-900">{(details.data as DroppedZone).crops.length}</span>
                        </div>
                        <div className="py-2">
                          <span className="text-sm text-slate-600">Crop Types:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {(details.data as DroppedZone).crops.map((crop: DroppedCrop) => (
                              <span key={crop.id} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                                {crop.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    
                    {/* Crop Properties */}
                    {details.type === 'crop' && (
                      <>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-sm text-slate-600">Variety</span>
                          <span className="font-medium text-slate-900">{(details.data as DroppedCrop).variety || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-sm text-slate-600">Quantity</span>
                          <span className="font-medium text-slate-900">{(details.data as DroppedCrop).quantity || 0}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-sm text-slate-600">Planted</span>
                          <span className="font-medium text-slate-900">{(details.data as DroppedCrop).plantingDate || 'Not specified'}</span>
                        </div>
                        {(details.data as DroppedCrop).status && (
                          <div className="flex justify-between items-center py-2 border-b border-slate-100">
                            <span className="text-sm text-slate-600">Status</span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              (details.data as DroppedCrop).status === 'healthy' ? 'bg-emerald-100 text-emerald-800' :
                              (details.data as DroppedCrop).status === 'needs-attention' ? 'bg-amber-100 text-amber-800' :
                              (details.data as DroppedCrop).status === 'ready-harvest' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {(details.data as DroppedCrop).status?.replace('-', ' ')}
                            </span>
                          </div>
                        )}
                        {(details.data as DroppedCrop).health && (
                          <div className="py-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-slate-600">Health</span>
                              <span className="font-medium text-slate-900">{(details.data as DroppedCrop).health}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div 
                                className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                                style={{ width: `${(details.data as DroppedCrop).health}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        {(details.data as DroppedCrop).growth && (
                          <div className="py-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-slate-600">Growth</span>
                              <span className="font-medium text-slate-900">{(details.data as DroppedCrop).growth}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                                style={{ width: `${(details.data as DroppedCrop).growth}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })()}
            </div>
          </div>
        </div>

        {/* Design improvements summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 rounded-lg mr-3" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #d97706 100%)', border: '2px solid #92400e' }}></div>
              <h3 className="font-bold text-orange-900">Enhanced Parcels</h3>
            </div>
            <p className="text-sm text-orange-800 mb-3">
              Gradient backgrounds, proper shadows, and clean label positioning.
            </p>
            <div className="text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded">
              ✓ No overlapping elements
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 rounded-lg mr-3" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 50%, #a5b4fc 100%)', border: '2px solid #4f46e5' }}></div>
              <h3 className="font-bold text-indigo-900">Enhanced Zones</h3>
            </div>
            <p className="text-sm text-indigo-800 mb-3">
              Better visual hierarchy with improved spacing and hover effects.
            </p>
            <div className="text-xs text-indigo-700 bg-indigo-100 px-2 py-1 rounded">
              ✓ Proper nested positioning
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg mr-3"></div>
              <h3 className="font-bold text-emerald-900">Enhanced Crops</h3>
            </div>
            <p className="text-sm text-emerald-800 mb-3">
              Status indicators, clean labels, and responsive information display.
            </p>
            <div className="text-xs text-emerald-700 bg-emerald-100 px-2 py-1 rounded">
              ✓ Status-based styling
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedParcelZoneCrops;