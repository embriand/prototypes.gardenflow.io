import React, { useState, useEffect } from 'react';
import { Plus, Minus, Check, X, Info, Filter, Search, Download, Settings, RotateCcw } from 'lucide-react';

// Define types for our data models
interface Plant {
  id: number;
  name: string;
  type: string;
  image: string;
  season: string;
  family: string;
}

interface Companion {
  plant1Id: number;
  plant2Id: number;
  type: 'companion' | 'non-companion';
  notes: string;
  benefit?: string;
  detriment?: string;
  strength?: 'low' | 'medium' | 'strong';
  severity?: 'low' | 'medium' | 'high';
}

interface ChangeHistoryItem {
  action: 'add-relationship' | 'remove-relationship' | 'update-relationship';
  data: any;
  timestamp: number;
}

const PlantCompanionManager: React.FC = () => {
  // Mock initial inventory data
  const initialInventory: Plant[] = [
    { id: 1, name: 'Tomato', type: 'vegetable', image: 'tomato', season: 'summer', family: 'Solanaceae' },
    { id: 2, name: 'Basil', type: 'herb', image: 'basil', season: 'summer', family: 'Lamiaceae' },
    { id: 3, name: 'Carrot', type: 'vegetable', image: 'carrot', season: 'spring/fall', family: 'Apiaceae' },
    { id: 4, name: 'Onion', type: 'vegetable', image: 'onion', season: 'spring', family: 'Amaryllidaceae' },
    { id: 5, name: 'Strawberry', type: 'fruit', image: 'strawberry', season: 'spring', family: 'Rosaceae' },
    { id: 6, name: 'Lettuce', type: 'vegetable', image: 'lettuce', season: 'spring/fall', family: 'Asteraceae' },
    { id: 7, name: 'Cucumber', type: 'vegetable', image: 'cucumber', season: 'summer', family: 'Cucurbitaceae' },
    { id: 8, name: 'Garlic', type: 'vegetable', image: 'garlic', season: 'fall', family: 'Amaryllidaceae' },
    { id: 9, name: 'Marigold', type: 'flower', image: 'marigold', season: 'summer', family: 'Asteraceae' },
    { id: 10, name: 'Peas', type: 'vegetable', image: 'peas', season: 'spring', family: 'Fabaceae' },
    { id: 11, name: 'Bean', type: 'vegetable', image: 'bean', season: 'summer', family: 'Fabaceae' },
    { id: 12, name: 'Mint', type: 'herb', image: 'mint', season: 'spring/summer', family: 'Lamiaceae' },
  ];

  // Mock initial companion data
  const initialCompanionships: Companion[] = [
    { plant1Id: 1, plant2Id: 2, type: 'companion', notes: 'Basil improves tomato flavor and repels pests', benefit: 'flavor enhancement, pest repellent', strength: 'strong' },
    { plant1Id: 1, plant2Id: 8, type: 'companion', notes: 'Garlic repels spider mites', benefit: 'pest repellent', strength: 'medium' },
    { plant1Id: 1, plant2Id: 9, type: 'companion', notes: 'Marigolds deter nematodes', benefit: 'pest repellent', strength: 'strong' },
    { plant1Id: 1, plant2Id: 3, type: 'non-companion', notes: 'Carrots stunt tomato growth', detriment: 'growth inhibition', severity: 'medium' },
    { plant1Id: 3, plant2Id: 4, type: 'companion', notes: 'Classic companion planting', benefit: 'pest management', strength: 'medium' },
    { plant1Id: 5, plant2Id: 6, type: 'companion', notes: 'Good ground cover combination', benefit: 'space optimization', strength: 'medium' },
    { plant1Id: 6, plant2Id: 4, type: 'non-companion', notes: 'Onions can inhibit lettuce growth', detriment: 'growth inhibition', severity: 'low' },
    { plant1Id: 10, plant2Id: 11, type: 'companion', notes: 'Nitrogen-fixing partners', benefit: 'soil improvement', strength: 'strong' },
    { plant1Id: 7, plant2Id: 12, type: 'non-companion', notes: 'Mint can take over cucumber beds', detriment: 'space competition', severity: 'high' },
  ];

  const [inventory, setInventory] = useState<Plant[]>(initialInventory);
  const [displayedInventory, setDisplayedInventory] = useState<Plant[]>(initialInventory);
  const [companionships, setCompanionships] = useState<Companion[]>(initialCompanionships);
  const [selectedPlant, setSelectedPlant] = useState<number | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newRelation, setNewRelation] = useState<Companion>({ 
    plant1Id: null as unknown as number, 
    plant2Id: null as unknown as number, 
    type: 'companion', 
    notes: '', 
    benefit: '', 
    strength: 'medium' 
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSeason, setFilterSeason] = useState<string>('all');
  const [filterFamily, setFilterFamily] = useState<string>('all');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [changeHistory, setChangeHistory] = useState<ChangeHistoryItem[]>([]);

  // Get unique values for filter dropdowns
  const plantTypes = ['all', ...Array.from(new Set(inventory.map(p => p.type)))];
  const plantSeasons = ['all', ...Array.from(new Set(inventory.map(p => p.season)))];
  const plantFamilies = ['all', ...Array.from(new Set(inventory.map(p => p.family)))];

  // Filter and search plants
  useEffect(() => {
    let filtered = inventory;
    
    if (filterType !== 'all') {
      filtered = filtered.filter(plant => plant.type === filterType);
    }
    
    if (filterSeason !== 'all') {
      filtered = filtered.filter(plant => plant.season.includes(filterSeason));
    }
    
    if (filterFamily !== 'all') {
      filtered = filtered.filter(plant => plant.family === filterFamily);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(plant => 
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.family.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setDisplayedInventory(filtered);
  }, [inventory, searchTerm, filterType, filterSeason, filterFamily]);

  // Helper function to get a plant by ID
  const getPlantById = (id: number): Plant | undefined => inventory.find(plant => plant.id === id);

  // Helper function to check if two plants have a relationship
  const getRelationship = (plant1Id: number, plant2Id: number): Companion | undefined => {
    return companionships.find(
      c => (c.plant1Id === plant1Id && c.plant2Id === plant2Id) || 
           (c.plant1Id === plant2Id && c.plant2Id === plant1Id)
    );
  };

  // Track changes for undo functionality
  const trackChange = (action: ChangeHistoryItem['action'], data: any): void => {
    setChangeHistory([...changeHistory, { action, data, timestamp: Date.now() }]);
  };

  // Undo last action
  const undoLastChange = (): void => {
    if (changeHistory.length === 0) return;
    
    const lastChange = changeHistory[changeHistory.length - 1];
    
    if (lastChange.action === 'add-relationship') {
      setCompanionships(companionships.filter(c => 
        !(c.plant1Id === lastChange.data.plant1Id && c.plant2Id === lastChange.data.plant2Id)
      ));
    } else if (lastChange.action === 'remove-relationship') {
      setCompanionships([...companionships, lastChange.data]);
    } else if (lastChange.action === 'update-relationship') {
      // Restore the previous relationship
      setCompanionships(companionships.map(c => 
        (c.plant1Id === lastChange.data.plant1Id && c.plant2Id === lastChange.data.plant2Id) ? 
        lastChange.data.previous : c
      ));
    }
    
    // Remove the last change from history
    setChangeHistory(changeHistory.slice(0, -1));
  };

  // Function to toggle a relationship between plants
  const toggleRelationship = (plant1Id: number, plant2Id: number, newType: 'companion' | 'non-companion'): void => {
    const existingRelationship = getRelationship(plant1Id, plant2Id);
    
    if (existingRelationship) {
      // If the relationship exists with the same type, remove it
      if (existingRelationship.type === newType) {
        trackChange('remove-relationship', existingRelationship);
        setCompanionships(companionships.filter(c => c !== existingRelationship));
      } else {
        // Otherwise, update the type
        trackChange('update-relationship', {
          plant1Id,
          plant2Id,
          previous: existingRelationship,
          new: { ...existingRelationship, type: newType }
        });
        
        setCompanionships(companionships.map(c => 
          c === existingRelationship ? { ...c, type: newType } : c
        ));
      }
    } else {
      // Open modal to create new relationship
      setNewRelation({
        plant1Id: plant1Id,
        plant2Id: plant2Id,
        type: newType,
        notes: '',
        benefit: newType === 'companion' ? '' : undefined,
        detriment: newType === 'non-companion' ? '' : undefined,
        strength: newType === 'companion' ? 'medium' : undefined,
        severity: newType === 'non-companion' ? 'medium' : undefined
      });
      setShowModal(true);
    }
  };

  // Function to add a new relationship
  const addRelationship = (): void => {
    if (newRelation.plant1Id && newRelation.plant2Id && newRelation.type) {
      const newRelationship: Companion = { ...newRelation };
      
      trackChange('add-relationship', newRelationship);
      setCompanionships([...companionships, newRelationship]);
      setShowModal(false);
      setNewRelation({ 
        plant1Id: null as unknown as number, 
        plant2Id: null as unknown as number, 
        type: 'companion', 
        notes: '', 
        benefit: '', 
        strength: 'medium' 
      });
    }
  };

  // Function to handle cell click
  const handleCellClick = (plant1Id: number): void => {
    // Toggle selected state
    if (selectedPlant === plant1Id) {
      setSelectedPlant(null);
    } else {
      setSelectedPlant(plant1Id);
    }
  };

  // Icons for the different relationship types
  const relationshipIcons: Record<string, React.ReactNode> = {
    companion: <Check className="text-green-600" />,
    'non-companion': <X className="text-red-600" />
  };

  // Function to get cell background color
  const getCellBgColor = (plant1Id: number, plant2Id: number): string => {
    if (plant1Id === plant2Id) return 'bg-gray-100';
    
    const relationship = getRelationship(plant1Id, plant2Id);
    if (!relationship) return '';
    
    if (relationship.type === 'companion') {
      if (relationship.strength === 'strong') return 'bg-green-100';
      if (relationship.strength === 'medium') return 'bg-green-50';
      return 'bg-green-50 bg-opacity-50';
    } else {
      if (relationship.severity === 'high') return 'bg-red-100';
      if (relationship.severity === 'medium') return 'bg-red-50';
      return 'bg-red-50 bg-opacity-50';
    }
  };

  // Export data as JSON
  const exportData = (): void => {
    const data = {
      inventory,
      companionships,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plant-companions.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Render relationship strength/severity indicator
  const renderStrengthIndicator = (relationship: Companion): React.ReactNode => {
    if (!relationship) return null;
    
    const isCompanion = relationship.type === 'companion';
    const value = isCompanion ? relationship.strength : relationship.severity;
    
    if (!value) return null;
    
    const levels: Record<string, number> = {
      low: 1,
      medium: 2,
      high: 3,
      strong: 3
    };
    
    const baseClass = isCompanion ? "bg-green-200" : "bg-red-200";
    const emptyClass = "bg-gray-100";
    
    return (
      <div className="flex space-x-px mt-1">
        {[1, 2, 3].map(level => (
          <div 
            key={level} 
            className={`w-1 h-3 rounded-sm ${level <= levels[value] ? baseClass : emptyClass}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestionaire de compagnons /  non compagnon</h1>
        
        <div className="flex space-x-2">
          <button 
            className="p-2 rounded-full hover:bg-gray-100" 
            onClick={() => setShowFilters(!showFilters)}
            title="Show filters"
          >
            <Filter size={20} />
          </button>
          <button 
            className="p-2 rounded-full hover:bg-gray-100" 
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
          >
            <Settings size={20} />
          </button>
          <button 
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={exportData}
            title="Export data"
          >
            <Download size={20} />
          </button>
          <button 
            className={`p-2 rounded-full hover:bg-gray-100 ${changeHistory.length === 0 ? 'text-gray-300' : ''}`}
            onClick={undoLastChange}
            disabled={changeHistory.length === 0}
            title="Undo last action"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                  <Search size={16} className="text-gray-400" />
                </span>
                <input
                  type="text"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Search plants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plant Type</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                {plantTypes.map(type => (
                  <option key={type} value={type}>{type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Season</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filterSeason}
                onChange={(e) => setFilterSeason(e.target.value)}
              >
                {plantSeasons.map(season => (
                  <option key={season} value={season}>{season === 'all' ? 'All Seasons' : season.charAt(0).toUpperCase() + season.slice(1)}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Family</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filterFamily}
                onChange={(e) => setFilterFamily(e.target.value)}
              >
                {plantFamilies.map(family => (
                  <option key={family} value={family}>{family === 'all' ? 'All Families' : family}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between">
            <div>
              <span className="text-sm text-gray-500">
                Showing {displayedInventory.length} of {inventory.length} plants
              </span>
            </div>
            <button
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterSeason('all');
                setFilterFamily('all');
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
      
      {showSettings && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-medium mb-3">Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">View Mode</label>
              <div className="flex space-x-2">
                <button
                  className={`px-3 py-1 text-sm rounded-md ${viewMode === 'grid' ? 'bg-blue-100 border border-blue-300' : 'bg-gray-100'}`}
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md ${viewMode === 'list' ? 'bg-blue-100 border border-blue-300' : 'bg-gray-100'}`}
                  onClick={() => setViewMode('list')}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 border border-green-200 mr-1"></div>
            <span className="text-sm">Strong Companions</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-50 border border-green-200 mr-1"></div>
            <span className="text-sm">Medium Companions</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-100 border border-red-200 mr-1"></div>
            <span className="text-sm">Major Conflicts</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-50 border border-red-200 mr-1"></div>
            <span className="text-sm">Minor Conflicts</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600">
          Click on a plant name to select it, then use the buttons in each cell to manage companion relationships.
          {selectedPlant && ` Currently selected: ${getPlantById(selectedPlant)?.name}`}
        </p>
      </div>

      {viewMode === 'grid' && (
        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="border border-gray-200 bg-gray-50 p-2 sticky left-0 z-10"></th>
                {displayedInventory.map(plant => (
                  <th 
                    key={plant.id} 
                    className={`border border-gray-200 p-2 text-sm font-medium ${selectedPlant === plant.id ? 'bg-blue-50' : 'bg-gray-50'}`}
                    onClick={() => handleCellClick(plant.id)}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mb-1">
                        {plant.name.charAt(0)}
                      </div>
                      <span>{plant.name}</span>
                      <span className="text-xs text-gray-500">{plant.type}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayedInventory.map(rowPlant => (
                <tr key={rowPlant.id}>
                  <td 
                    className={`border border-gray-200 p-2 font-medium sticky left-0 z-10 ${selectedPlant === rowPlant.id ? 'bg-blue-50' : 'bg-gray-50'}`}
                    onClick={() => handleCellClick(rowPlant.id)}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                        {rowPlant.name.charAt(0)}
                      </div>
                      <div>
                        <div>{rowPlant.name}</div>
                        <div className="text-xs text-gray-500">{rowPlant.type} • {rowPlant.family}</div>
                      </div>
                    </div>
                  </td>
                  {displayedInventory.map(colPlant => {
                    const relationship = getRelationship(rowPlant.id, colPlant.id);
                    
                    return (
                      <td 
                        key={colPlant.id} 
                        className={`border border-gray-200 p-1 text-center relative ${getCellBgColor(rowPlant.id, colPlant.id)}`}
                      >
                        {rowPlant.id === colPlant.id ? (
                          <div className="h-full flex items-center justify-center">—</div>
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            {relationship && (
                              <div className="mb-1 flex items-center">
                                {relationshipIcons[relationship.type]}
                                {relationship.notes && (
                                  <button
                                    className="ml-1 text-gray-400 hover:text-gray-600"
                                    onMouseEnter={() => setActiveTooltip(`${rowPlant.id}-${colPlant.id}`)}
                                    onMouseLeave={() => setActiveTooltip(null)}
                                  >
                                    <Info size={14} />
                                  </button>
                                )}
                              </div>
                            )}
                            
                            {relationship && renderStrengthIndicator(relationship)}
                            
                            {(selectedPlant === rowPlant.id || selectedPlant === colPlant.id) && (
                              <div className="flex space-x-1 mt-1">
                                <button
                                  className="p-1 rounded hover:bg-green-100"
                                  onClick={() => toggleRelationship(rowPlant.id, colPlant.id, 'companion')}
                                  title="Mark as companion"
                                >
                                  <Plus size={14} className="text-green-600" />
                                </button>
                                <button
                                  className="p-1 rounded hover:bg-red-100"
                                  onClick={() => toggleRelationship(rowPlant.id, colPlant.id, 'non-companion')}
                                  title="Mark as non-companion"
                                >
                                  <Minus size={14} className="text-red-600" />
                                </button>
                              </div>
                            )}
                            
                            {activeTooltip === `${rowPlant.id}-${colPlant.id}` && relationship?.notes && (
                              <div className="absolute z-20 bg-white p-2 shadow-lg rounded border border-gray-200 w-48 text-xs text-left bottom-full left-1/2 transform -translate-x-1/2 mb-1">
                                <p className="font-medium mb-1">{relationship.type === 'companion' ? 'Companion Benefit' : 'Conflict Issue'}</p>
                                <p>{relationship.notes}</p>
                                {relationship.type === 'companion' && relationship.benefit && (
                                  <p className="mt-1 text-green-600">{relationship.benefit}</p>
                                )}
                                {relationship.type === 'non-companion' && relationship.detriment && (
                                  <p className="mt-1 text-red-600">{relationship.detriment}</p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedInventory.map(plant => (
            <div 
              key={plant.id}
              className={`p-4 rounded-lg border ${selectedPlant === plant.id ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}
              onClick={() => setSelectedPlant(plant.id === selectedPlant ? null : plant.id)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    {plant.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium">{plant.name}</h3>
                    <div className="text-sm text-gray-500">{plant.type} • {plant.family} • {plant.season}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Relationships:</h4>
                <div className="space-y-2">
                  {companionships
                    .filter(c => c.plant1Id === plant.id || c.plant2Id === plant.id)
                    .map((relation, index) => {
                      const otherPlantId = relation.plant1Id === plant.id ? relation.plant2Id : relation.plant1Id;
                      const otherPlant = getPlantById(otherPlantId);
                      
                      if (!otherPlant) return null;
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                          <div className="flex items-center">
                            {relation.type === 'companion' ? (
                              <Check size={16} className="text-green-600 mr-2" />
                            ) : (
                              <X size={16} className="text-red-600 mr-2" />
                            )}
                            <span>{otherPlant.name}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {relation.type === 'companion' ? relation.benefit : relation.detriment}
                          </div>
                        </div>
                      );
                    })}
                  
                  {companionships.filter(c => c.plant1Id === plant.id || c.plant2Id === plant.id).length === 0 && (
                    <div className="text-sm text-gray-500 italic">No relationships defined</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add Relationship Details</h2>
            
            <div className="mb-4">
              <div className="font-medium mb-2">Plants:</div>
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span>{getPlantById(newRelation.plant1Id)?.name}</span>
                <span className="mx-2">and</span>
                <span>{getPlantById(newRelation.plant2Id)?.name}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="font-medium mb-2">Relationship Type:</div>
              <div className="flex space-x-2">
                <button
                  className={`px-3 py-2 rounded-md flex items-center ${newRelation.type === 'companion' ? 'bg-green-100 border border-green-300' : 'bg-gray-100'}`}
                  onClick={() => setNewRelation({
                    ...newRelation, 
                    type: 'companion',
                    benefit: '',
                    strength: 'medium',
                    detriment: undefined,
                    severity: undefined
                  })}
                >
                  <Check size={16} className="text-green-600 mr-1" />
                  <span>Companion</span>
                </button>
                <button
                  className={`px-3 py-2 rounded-md flex items-center ${newRelation.type === 'non-companion' ? 'bg-red-100 border border-red-300' : 'bg-gray-100'}`}
                  onClick={() => setNewRelation({
                    ...newRelation, 
                    type: 'non-companion',
                    detriment: '',
                    severity: 'medium',
                    benefit: undefined,
                    strength: undefined
                  })}
                >
                  <X size={16} className="text-red-600 mr-1" />
                  <span>Non-companion</span>
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="font-medium mb-2 block">Notes:</label>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2"
                rows={2}
                placeholder="Add general notes about this relationship..."
                value={newRelation.notes}
                onChange={(e) => setNewRelation({...newRelation, notes: e.target.value})}
              ></textarea>
            </div>
            
            {newRelation.type === 'companion' && (
              <>
                <div className="mb-4">
                  <label className="font-medium mb-2 block">Benefit:</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="e.g., pest control, improved flavor"
                    value={newRelation.benefit || ''}
                    onChange={(e) => setNewRelation({...newRelation, benefit: e.target.value})}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="font-medium mb-2 block">Benefit Strength:</label>
                  <div className="flex space-x-2">
                    {(['low', 'medium', 'strong'] as const).map((strength) => (
                      <button
                        key={strength}
                        className={`px-3 py-1 rounded-md ${newRelation.strength === strength ? 'bg-green-100 border border-green-300' : 'bg-gray-100'}`}
                        onClick={() => setNewRelation({...newRelation, strength})}
                      >
                        {strength.charAt(0).toUpperCase() + strength.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            {newRelation.type === 'non-companion' && (
              <>
                <div className="mb-4">
                  <label className="font-medium mb-2 block">Detriment:</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="e.g., competes for nutrients, allelopathy"
                    value={newRelation.detriment || ''}
                    onChange={(e) => setNewRelation({...newRelation, detriment: e.target.value})}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="font-medium mb-2 block">Issue Severity:</label>
                  <div className="flex space-x-2">
                    {(['low', 'medium', 'high'] as const).map((severity) => (
                      <button
                        key={severity}
                        className={`px-3 py-1 rounded-md ${newRelation.severity === severity ? 'bg-red-100 border border-red-300' : 'bg-gray-100'}`}
                        onClick={() => setNewRelation({...newRelation, severity})}
                      >
                        {severity.charAt(0).toUpperCase() + severity.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setShowModal(false);
                  setNewRelation({ 
                    plant1Id: null as unknown as number, 
                    plant2Id: null as unknown as number, 
                    type: 'companion', 
                    notes: '', 
                    benefit: '', 
                    strength: 'medium' 
                  });
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={addRelationship}
              >
                Save Relationship
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantCompanionManager;