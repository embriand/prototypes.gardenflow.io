import React, { useState } from 'react';
import { MapPin, Ruler, Calendar, Tag, Edit3, Save, X, Palette, Grid } from 'lucide-react';

// Types
interface ParcelZone {
  id: string;
  name: string;
  area: number; // in square meters
  coordinates: { lat: number; lng: number }[];
  type: 'cultivation' | 'path' | 'water' | 'structure' | 'other';
  description?: string;
  plantingDate?: string;
  harvestDate?: string;
  tags?: string[];
  color: string;
}

interface TemplateParcelZoneProps {
  zone?: ParcelZone;
  onSave?: (zone: ParcelZone) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

// Default zone template
const defaultZone: Omit<ParcelZone, 'id'> = {
  name: 'New Zone',
  area: 0,
  coordinates: [],
  type: 'cultivation',
  description: '',
  plantingDate: '',
  harvestDate: '',
  tags: [],
  color: '#10b981'
};

// Zone type configurations
const zoneTypes = {
  cultivation: { label: 'Cultivation Area', color: '#10b981', icon: '🌱' },
  path: { label: 'Pathway', color: '#8b5cf6', icon: '🛤️' },
  water: { label: 'Water Feature', color: '#3b82f6', icon: '💧' },
  structure: { label: 'Structure', color: '#f59e0b', icon: '🏗️' },
  other: { label: 'Other', color: '#6b7280', icon: '📦' }
};

const TemplateParcelZone: React.FC<TemplateParcelZoneProps> = ({
  zone,
  onSave,
  onCancel,
  isEditing = false
}) => {
  const [editedZone, setEditedZone] = useState<ParcelZone>({
    id: zone?.id || `zone-${Date.now()}`,
    ...defaultZone,
    ...zone
  });

  const [isEditMode, setIsEditMode] = useState(isEditing);
  const [newTag, setNewTag] = useState('');

  // Handle form field changes
  const handleChange = (field: keyof ParcelZone, value: any) => {
    setEditedZone(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle tag addition
  const addTag = () => {
    if (newTag.trim() && !editedZone.tags?.includes(newTag.trim())) {
      handleChange('tags', [...(editedZone.tags || []), newTag.trim()]);
      setNewTag('');
    }
  };

  // Handle tag removal
  const removeTag = (tagToRemove: string) => {
    handleChange('tags', editedZone.tags?.filter(tag => tag !== tagToRemove) || []);
  };

  // Handle save
  const handleSave = () => {
    onSave?.(editedZone);
    setIsEditMode(false);
  };

  // Handle cancel
  const handleCancel = () => {
    if (zone) {
      setEditedZone({ ...defaultZone, ...zone, id: zone.id });
    }
    setIsEditMode(false);
    onCancel?.();
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div 
        className="p-4 border-b border-slate-200/50"
        style={{ backgroundColor: `${editedZone.color}15` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-medium shadow-lg"
              style={{ backgroundColor: editedZone.color }}
            >
              <span className="text-lg">{zoneTypes[editedZone.type]?.icon || '📦'}</span>
            </div>
            <div>
              {isEditMode ? (
                <input
                  type="text"
                  value={editedZone.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="text-lg font-semibold bg-transparent border border-slate-300 rounded-lg px-2 py-1 focus:border-green-500 outline-none"
                />
              ) : (
                <h3 className="text-lg font-semibold text-slate-900">
                  {editedZone.name}
                </h3>
              )}
              <p className="text-sm text-slate-600">
                {zoneTypes[editedZone.type]?.label || 'Unknown Type'}
              </p>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            {isEditMode ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
                  title="Save changes"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors shadow-md"
                  title="Cancel editing"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditMode(true)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                title="Edit zone"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Zone Type Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <Grid className="w-4 h-4" />
            Zone Type
          </label>
          {isEditMode ? (
            <select
              value={editedZone.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
            >
              {Object.entries(zoneTypes).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.icon} {config.label}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg">
              <span className="text-xl">{zoneTypes[editedZone.type]?.icon}</span>
              <span className="text-sm text-slate-700 font-medium">
                {zoneTypes[editedZone.type]?.label}
              </span>
            </div>
          )}
        </div>

        {/* Area */}
        <div className="flex items-center space-x-3">
          <Ruler className="w-5 h-5 text-slate-400" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Area
            </label>
            {isEditMode ? (
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={editedZone.area}
                  onChange={(e) => handleChange('area', parseFloat(e.target.value) || 0)}
                  className="flex-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  min="0"
                  step="0.1"
                />
                <span className="text-sm text-slate-600 font-medium">m²</span>
              </div>
            ) : (
              <p className="text-slate-900 font-medium bg-slate-50 px-3 py-2 rounded-lg">
                {editedZone.area.toFixed(1)} m²
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>
          {isEditMode ? (
            <textarea
              value={editedZone.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
              rows={3}
              placeholder="Enter zone description..."
            />
          ) : (
            <p className="text-slate-700 text-sm bg-slate-50 p-3 rounded-lg">
              {editedZone.description || 'No description provided'}
            </p>
          )}
        </div>

        {/* Planting and Harvest Dates */}
        {editedZone.type === 'cultivation' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Planting Date
              </label>
              {isEditMode ? (
                <input
                  type="date"
                  value={editedZone.plantingDate || ''}
                  onChange={(e) => handleChange('plantingDate', e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              ) : (
                <p className="text-slate-700 text-sm bg-slate-50 px-3 py-2 rounded-lg">
                  {editedZone.plantingDate ? new Date(editedZone.plantingDate).toLocaleDateString() : 'Not set'}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Harvest Date
              </label>
              {isEditMode ? (
                <input
                  type="date"
                  value={editedZone.harvestDate || ''}
                  onChange={(e) => handleChange('harvestDate', e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              ) : (
                <p className="text-slate-700 text-sm bg-slate-50 px-3 py-2 rounded-lg">
                  {editedZone.harvestDate ? new Date(editedZone.harvestDate).toLocaleDateString() : 'Not set'}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
            <Tag className="w-4 h-4" />
            Tags
          </label>
          
          {/* Existing tags */}
          <div className="flex flex-wrap gap-2 mb-2">
            {editedZone.tags?.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-200"
              >
                {tag}
                {isEditMode && (
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
            {(!editedZone.tags || editedZone.tags.length === 0) && !isEditMode && (
              <span className="text-slate-500 text-sm">No tags added</span>
            )}
          </div>

          {/* Add new tag */}
          {isEditMode && (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                className="flex-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Add a tag..."
              />
              <button
                onClick={addTag}
                disabled={!newTag.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Color picker */}
        {isEditMode && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
              <Palette className="w-4 h-4" />
              Zone Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={editedZone.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-12 h-10 border border-slate-300 rounded-lg cursor-pointer"
              />
              <span className="text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg font-mono">
                {editedZone.color}
              </span>
            </div>
          </div>
        )}

        {/* Coordinates info */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <MapPin className="w-4 h-4" />
            <span>
              {editedZone.coordinates.length > 0 
                ? `${editedZone.coordinates.length} coordinate points defined`
                : 'No coordinates defined'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sample data for demonstration
const sampleZones: ParcelZone[] = [
  {
    id: 'zone-1',
    name: 'Tomato Cultivation Area',
    area: 25.5,
    coordinates: [
      { lat: 43.6047, lng: 3.8767 },
      { lat: 43.6050, lng: 3.8770 },
      { lat: 43.6048, lng: 3.8772 },
      { lat: 43.6045, lng: 3.8769 }
    ],
    type: 'cultivation',
    description: 'Main tomato growing area with drip irrigation system. Optimal sun exposure throughout the day.',
    plantingDate: '2024-03-15',
    harvestDate: '2024-07-30',
    tags: ['tomatoes', 'drip irrigation', 'high yield', 'organic'],
    color: '#ef4444'
  },
  {
    id: 'zone-2',
    name: 'Garden Path',
    area: 8.2,
    coordinates: [
      { lat: 43.6045, lng: 3.8760 },
      { lat: 43.6052, lng: 3.8762 }
    ],
    type: 'path',
    description: 'Main walkway connecting different cultivation areas',
    tags: ['gravel', 'maintenance'],
    color: '#8b5cf6'
  },
  {
    id: 'zone-3',
    name: 'Water Collection Basin',
    area: 12.0,
    coordinates: [
      { lat: 43.6040, lng: 3.8765 },
      { lat: 43.6042, lng: 3.8768 },
      { lat: 43.6039, lng: 3.8770 },
      { lat: 43.6037, lng: 3.8767 }
    ],
    type: 'water',
    description: 'Rainwater collection and storage system for irrigation',
    tags: ['rainwater', 'irrigation', 'sustainable'],
    color: '#3b82f6'
  },
  {
    id: 'zone-4',
    name: 'Herb Garden',
    area: 15.8,
    coordinates: [
      { lat: 43.6055, lng: 3.8775 },
      { lat: 43.6058, lng: 3.8778 },
      { lat: 43.6056, lng: 3.8780 },
      { lat: 43.6053, lng: 3.8777 }
    ],
    type: 'cultivation',
    description: 'Mixed herb cultivation with basil, rosemary, thyme and oregano',
    plantingDate: '2024-04-01',
    harvestDate: '2024-09-15',
    tags: ['herbs', 'companion planting', 'aromatic'],
    color: '#10b981'
  },
  {
    id: 'zone-5',
    name: 'Tool Shed',
    area: 6.5,
    coordinates: [
      { lat: 43.6035, lng: 3.8755 },
      { lat: 43.6037, lng: 3.8757 },
      { lat: 43.6036, lng: 3.8759 },
      { lat: 43.6034, lng: 3.8757 }
    ],
    type: 'structure',
    description: 'Storage building for gardening tools and equipment',
    tags: ['storage', 'tools', 'equipment'],
    color: '#f59e0b'
  }
];

// Demo component to showcase different zone types
const TemplateParcelZoneDemo: React.FC = () => {
  const [zones, setZones] = useState<ParcelZone[]>(sampleZones);

  const handleSave = (updatedZone: ParcelZone) => {
    setZones(prev => 
      prev.map(zone => zone.id === updatedZone.id ? updatedZone : zone)
    );
    console.log('Zone saved:', updatedZone);
  };

  const handleCancel = () => {
    console.log('Edit cancelled');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="mb-8 p-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
          Template Parcel Zone
        </h1>
        <p className="text-slate-600">
          Interactive template for displaying and editing parcel zones with drag-and-drop canvas integration
        </p>
        
        {/* Feature highlights */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Key Features:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Visual representation of different zone types (cultivation, path, water, structure)</li>
            <li>• Inline editing capabilities with immediate visual feedback</li>
            <li>• Color-coded zones with customizable colors</li>
            <li>• Tag management and metadata display</li>
            <li>• Responsive design for canvas integration</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zones.map((zone) => (
            <TemplateParcelZone
              key={zone.id}
              zone={zone}
              onSave={handleSave}
              onCancel={handleCancel}
              isEditing={false}
            />
          ))}
        </div>

        <div className="mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-slate-200/50">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Grid className="w-5 h-5" />
            Usage Instructions
          </h3>
          <div className="prose text-sm text-slate-600">
            <p><strong>Design System Integration:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Use this component as a template for parcel zone management</li>
              <li>Integrate with canvas systems for drag-and-drop functionality</li>
              <li>Customize zone types and colors to match your design system</li>
              <li>Add coordinate mapping for spatial garden planning</li>
            </ol>
            <p className="mt-4"><strong>Current Features:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Click edit button to modify any zone</li>
              <li>Different zone types with distinct colors and icons</li>
              <li>Tag management with add/remove functionality</li>
              <li>Date picker for cultivation zones</li>
              <li>Color picker for custom zone colors</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export both components for flexibility
export { TemplateParcelZone, TemplateParcelZoneDemo };
export default TemplateParcelZoneDemo;