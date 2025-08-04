// File: components/compost/CompostManagement.tsx
import React, { useState, useEffect } from 'react';
import { MapPin, Filter, Plus, List, Grid } from 'lucide-react';

// Import sub-components
import CompostDashboard from './CompostDashboard';
import CompostBoxList from './CompostBoxList';
import CompostBoxGrid from './CompostBoxGrid';
import CompostBoxForm from './CompostBoxForm';
import CompostBoxDetails from './CompostBoxDetails';
import { Alert, AlertTitle, AlertDescription } from './ui/Alert';

// Import helper functions
import { 
  isDataUpToDate,
  needsAction,
  calculateDashboardMetrics,
  DashboardMetrics
} from './utils/compostHelpers';

// Import mock data
import { initialMockData, CompostSite, CompostBox } from './data/compostInitialData';

const CompostManagement: React.FC = () => {
  // State
  const [sites, setSites] = useState<CompostSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<CompostSite | null>(null);
  const [boxes, setBoxes] = useState<CompostBox[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddingBox, setIsAddingBox] = useState<boolean>(false);
  const [editingBox, setEditingBox] = useState<CompostBox | null>(null);
  const [viewingBoxDetails, setViewingBoxDetails] = useState<CompostBox | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'boxes'>('overview');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics>({
    totalBoxes: 0,
    boxesNeedingAction: 0,
    averageTemperature: 0,
    compostMaturityDistribution: [],
    materialTypes: [],
    boxes: []
  });

  // Load data on component mount
  useEffect(() => {
    const storedData = localStorage.getItem('compostData');
    let data;
    
    try {
      data = storedData ? JSON.parse(storedData) : null;
      
      if (!isDataUpToDate(data)) {
        console.warn('Using initial mock data');
        data = initialMockData;
        localStorage.setItem('compostData', JSON.stringify(initialMockData));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      data = initialMockData;
      localStorage.setItem('compostData', JSON.stringify(initialMockData));
    }
    
    setSites(data.sites);
    setBoxes(data.boxes);
    
    if (data.sites.length > 0 && !selectedSite) {
      setSelectedSite(data.sites[0]);
    }
  }, []);

  // Save data when it changes
  useEffect(() => {
    if (sites.length > 0 && boxes.length > 0) {
      try {
        localStorage.setItem('compostData', JSON.stringify({ sites, boxes }));
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  }, [sites, boxes]);

  // Update dashboard metrics
  useEffect(() => {
    if (!boxes.length) return;
    
    let filteredBoxes = boxes;
    if (selectedSite) {
      filteredBoxes = boxes.filter(box => box.siteId === selectedSite.id);
    }
    
    const metrics = calculateDashboardMetrics(filteredBoxes);
    // Add the boxes to the metrics for use in the dashboard
    metrics.boxes = filteredBoxes;
    setDashboardMetrics(metrics);
  }, [boxes, selectedSite]);

  // Handler functions
  const handleAddBox = (boxData: Partial<CompostBox>): void => {
    const currentDate = new Date().toISOString().split('T')[0];
    const newBox: CompostBox = {
      ...boxData as CompostBox,
      id: Date.now(),
      siteId: selectedSite ? selectedSite.id : 0,
      startDate: currentDate,
      status: 'nouveau',
      lastTurned: currentDate,
      schedule: [],
      notifications: [],
      history: [
        { date: currentDate, action: "Création", notes: "Nouveau bac créé" }
      ]
    };
    setBoxes([...boxes, newBox]);
    setIsAddingBox(false);
  };

  const handleUpdateBox = (boxData: Partial<CompostBox>): void => {
    setBoxes(boxes.map(box => {
      if (box.id === boxData.id) {
        // If temperature changed significantly, add to history
        let newHistory = [...(box.history || [])];
        
        if (boxData.temperature && Math.abs(box.temperature - boxData.temperature) > 5) {
          newHistory.push({
            date: new Date().toISOString().split('T')[0],
            action: "Changement de température",
            notes: `De ${box.temperature}°C à ${boxData.temperature}°C`
          });
        }
        
        return { 
          ...box, 
          ...boxData,
          history: newHistory
        };
      }
      return box;
    }));
    setEditingBox(null);
  };

  const handleTurnCompost = (boxId: number): void => {
    const currentDate = new Date().toISOString().split('T')[0];
    setBoxes(boxes.map(box => {
      if (box.id === boxId) {
        // Add turning event to history
        const newHistory = [
          {
            date: currentDate,
            action: "Retournement",
            notes: "Compost retourné"
          },
          ...(box.history || [])
        ];
        
        return { 
          ...box, 
          lastTurned: currentDate,
          history: newHistory
        };
      }
      return box;
    }));
  };

  const handleDeleteBox = (id: number): void => {
    setBoxes(boxes.filter(box => box.id !== id));
  };

  const getFilteredBoxes = (): CompostBox[] => {
    if (!selectedSite) return [];
    
    let filtered = boxes.filter(box => box.siteId === selectedSite.id);
    
    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(box => {
        if (filterStatus === 'needsAction') return needsAction(box);
        return box.status === filterStatus;
      });
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(box => 
        box.name.toLowerCase().includes(term) ||
        box.materials.some(m => m.toLowerCase().includes(term))
      );
    }
    
    return filtered;
  };

  // ListIcon and GridIcon components
  const CompostBoxListIcon = (): JSX.Element => <List className="w-4 h-4" />;
  const CompostBoxGridIcon = (): JSX.Element => <Grid className="w-4 h-4" />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestion des Jardins Composteurs</h1>
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <select 
              className="p-2 border rounded"
              onChange={(e) => {
                const value = e.target.value;
                if (value) {
                  const siteId = parseInt(value);
                  setSelectedSite(sites.find(s => s.id === siteId) || null);
                } else {
                  setSelectedSite(null);
                }
                setActiveTab('overview'); // Reset to overview when site changes
              }}
              value={selectedSite?.id || ""}
            >
              <option value="">Sélectionner un site</option>
              {sites.map(site => (
                <option key={site.id} value={site.id}>{site.name}</option>
              ))}
            </select>
            
            {selectedSite && (
              <div className="flex gap-1">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-1 text-sm rounded ${activeTab === 'overview' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
                >
                  Aperçu
                </button>
                <button 
                  onClick={() => setActiveTab('boxes')}
                  className={`px-3 py-1 text-sm rounded ${activeTab === 'boxes' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
                >
                  Bacs
                </button>
              </div>
            )}
          </div>
          
          {activeTab === 'boxes' && selectedSite && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-8 pr-4 py-2 border rounded w-48"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Filter className="w-4 h-4 absolute left-2 top-3 text-gray-400" />
              </div>
              
              <select 
                className="p-2 border rounded"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="needsAction">Besoin d'action</option>
                <option value="nouveau">Nouveau</option>
                <option value="1-semaine">1 semaine</option>
                <option value="2-semaines">2 semaines</option>
                <option value="1-mois">1 mois</option>
                <option value="2-mois">2 mois</option>
                <option value="3-mois">3 mois</option>
                <option value="6-mois">6 mois</option>
              </select>
              
              <button 
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 border rounded"
                title={viewMode === 'grid' ? 'Vue liste' : 'Vue grille'}
              >
                {viewMode === 'grid' ? <CompostBoxListIcon /> : <CompostBoxGridIcon />}
              </button>
              
              <button 
                onClick={() => setIsAddingBox(true)}
                className="p-2 border rounded flex items-center gap-2"
              >
                <Plus /> Ajouter un Bac
              </button>
            </div>
          )}
        </div>
        
        {selectedSite && (
          <Alert>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <AlertTitle>{selectedSite.name}</AlertTitle>
            </div>
            <AlertDescription>{selectedSite.address}</AlertDescription>
          </Alert>
        )}
      </div>

      {!selectedSite ? (
        <div className="text-center py-8 text-gray-500">
          Veuillez sélectionner un site pour voir les données de compostage
        </div>
      ) : activeTab === 'overview' ? (
        <CompostDashboard metrics={dashboardMetrics} />
      ) : (
        viewMode === 'grid' ? (
          <CompostBoxGrid 
            boxes={getFilteredBoxes()} 
            onView={setViewingBoxDetails}
            onEdit={setEditingBox}
            onTurn={handleTurnCompost}
            onDelete={handleDeleteBox}
          />
        ) : (
          <CompostBoxList 
            boxes={getFilteredBoxes()} 
            onView={setViewingBoxDetails}
            onEdit={setEditingBox}
            onTurn={handleTurnCompost}
            onDelete={handleDeleteBox}
          />
        )
      )}

      {isAddingBox && (
        <CompostBoxForm 
          onSubmit={handleAddBox} 
          onClose={() => setIsAddingBox(false)} 
        />
      )}

      {editingBox && (
        <CompostBoxForm 
          box={editingBox} 
          onSubmit={handleUpdateBox} 
          onClose={() => setEditingBox(null)} 
        />
      )}
      
      {viewingBoxDetails && (
        <CompostBoxDetails 
          box={viewingBoxDetails} 
          onClose={() => setViewingBoxDetails(null)} 
          onEdit={setEditingBox}
          onTurn={handleTurnCompost}
        />
      )}
    </div>
  );
};

export default CompostManagement;