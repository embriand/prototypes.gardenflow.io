import { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, List, Grid, MapPin, ThermometerSun } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

// Initial mock data
const initialMockData = {
    sites: [
      { id: 1, name: "Jardin Communautaire Nord", address: "123 Rue des Jardins", boxCount: 6 },
      { id: 2, name: "Ferme Urbaine Sud", address: "456 Avenue de la Terre", boxCount: 6 },
      { id: 3, name: "Potager Collectif Est", address: "789 Boulevard des Fleurs", boxCount: 6 },
      { id: 4, name: "Jardins Partagés Ouest", address: "321 Rue du Compost", boxCount: 5 },
      { id: 5, name: "Éco-Jardin Central", address: "654 Avenue Verte", boxCount: 5 },
    ],
    boxes: [
      // Jardin Communautaire Nord (6 bacs)
      {
        id: 1,
        siteId: 1,
        name: "Bac A1",
        fillLevel: 95,
        startDate: "2023-11-15",
        status: "6-mois",
        temperature: 45,
        moisture: "optimal",
        lastTurned: "2024-02-15",
        materials: ["déchets alimentaires", "feuilles", "marc de café"],
        schedule: [],
        notifications: []
      },
      {
        id: 2,
        siteId: 1,
        name: "Bac A2",
        fillLevel: 85,
        startDate: "2024-01-01",
        status: "3-mois",
        temperature: 52,
        moisture: "optimal",
        lastTurned: "2024-02-12",
        materials: ["tontes de gazon", "déchets alimentaires", "feuilles mortes"],
        schedule: [],
        notifications: []
      },
      {
        id: 3,
        siteId: 1,
        name: "Bac A3",
        fillLevel: 70,
        startDate: "2024-01-15",
        status: "2-mois",
        temperature: 54,
        moisture: "humide",
        lastTurned: "2024-02-10",
        materials: ["déchets de cuisine", "paille", "feuilles"],
        schedule: [],
        notifications: []
      },
      {
        id: 4,
        siteId: 1,
        name: "Bac A4",
        fillLevel: 60,
        startDate: "2024-01-30",
        status: "1-mois",
        temperature: 56,
        moisture: "optimal",
        lastTurned: "2024-02-14",
        materials: ["déchets verts", "marc de café", "carton"],
        schedule: [],
        notifications: []
      },
      {
        id: 5,
        siteId: 1,
        name: "Bac A5",
        fillLevel: 30,
        startDate: "2024-02-10",
        status: "2-semaines",
        temperature: 60,
        moisture: "optimal",
        lastTurned: "2024-02-17",
        materials: ["déchets alimentaires", "herbe"],
        schedule: [],
        notifications: []
      },
      {
        id: 6,
        siteId: 1,
        name: "Bac A6",
        fillLevel: 5,
        startDate: "2024-02-17",
        status: "nouveau",
        temperature: 45,
        moisture: "sec",
        lastTurned: "2024-02-17",
        materials: ["déchets alimentaires"],
        schedule: [],
        notifications: []
      },
      // Ferme Urbaine Sud (6 bacs)
      {
        id: 7,
        siteId: 2,
        name: "Bac B1",
        fillLevel: 90,
        startDate: "2023-12-01",
        status: "5-mois",
        temperature: 48,
        moisture: "optimal",
        lastTurned: "2024-02-15",
        materials: ["feuilles mortes", "fruits", "légumes"],
        schedule: [],
        notifications: []
      },
      {
        id: 8,
        siteId: 2,
        name: "Bac B2",
        fillLevel: 80,
        startDate: "2024-01-05",
        status: "3-mois",
        temperature: 50,
        moisture: "optimal",
        lastTurned: "2024-02-14",
        materials: ["déchets de cuisine", "paille", "feuilles"],
        schedule: [],
        notifications: []
      },
      {
        id: 9,
        siteId: 2,
        name: "Bac B3",
        fillLevel: 65,
        startDate: "2024-01-20",
        status: "2-mois",
        temperature: 53,
        moisture: "humide",
        lastTurned: "2024-02-13",
        materials: ["marc de café", "déchets verts", "carton"],
        schedule: [],
        notifications: []
      },
      {
        id: 10,
        siteId: 2,
        name: "Bac B4",
        fillLevel: 50,
        startDate: "2024-02-01",
        status: "1-mois",
        temperature: 55,
        moisture: "optimal",
        lastTurned: "2024-02-16",
        materials: ["tontes de gazon", "feuilles", "fruits"],
        schedule: [],
        notifications: []
      },
      {
        id: 11,
        siteId: 2,
        name: "Bac B5",
        fillLevel: 25,
        startDate: "2024-02-12",
        status: "2-semaines",
        temperature: 59,
        moisture: "optimal",
        lastTurned: "2024-02-18",
        materials: ["déchets de cuisine", "herbe"],
        schedule: [],
        notifications: []
      },
      {
        id: 12,
        siteId: 2,
        name: "Bac B6",
        fillLevel: 5,
        startDate: "2024-02-17",
        status: "nouveau",
        temperature: 45,
        moisture: "sec",
        lastTurned: "2024-02-17",
        materials: ["déchets verts"],
        schedule: [],
        notifications: []
      },
      // Potager Collectif Est (6 bacs)
      {
        id: 13,
        siteId: 3,
        name: "Bac C1",
        fillLevel: 95,
        startDate: "2023-11-20",
        status: "6-mois",
        temperature: 47,
        moisture: "optimal",
        lastTurned: "2024-02-15",
        materials: ["déchets de cuisine", "paille", "carton"],
        schedule: [],
        notifications: []
      },
      {
        id: 14,
        siteId: 3,
        name: "Bac C2",
        fillLevel: 85,
        startDate: "2024-01-10",
        status: "3-mois",
        temperature: 49,
        moisture: "optimal",
        lastTurned: "2024-02-14",
        materials: ["déchets verts", "copeaux de bois", "feuilles"],
        schedule: [],
        notifications: []
      },
      {
        id: 15,
        siteId: 3,
        name: "Bac C3",
        fillLevel: 70,
        startDate: "2024-01-25",
        status: "2-mois",
        temperature: 52,
        moisture: "humide",
        lastTurned: "2024-02-13",
        materials: ["fruits", "légumes", "marc de café"],
        schedule: [],
        notifications: []
      },
      {
        id: 16,
        siteId: 3,
        name: "Bac C4",
        fillLevel: 55,
        startDate: "2024-02-01",
        status: "1-mois",
        temperature: 54,
        moisture: "optimal",
        lastTurned: "2024-02-16",
        materials: ["déchets alimentaires", "herbe", "carton"],
        schedule: [],
        notifications: []
      },
      {
        id: 17,
        siteId: 3,
        name: "Bac C5",
        fillLevel: 30,
        startDate: "2024-02-11",
        status: "2-semaines",
        temperature: 58,
        moisture: "optimal",
        lastTurned: "2024-02-18",
        materials: ["déchets de cuisine", "paille"],
        schedule: [],
        notifications: []
      },
      {
        id: 18,
        siteId: 3,
        name: "Bac C6",
        fillLevel: 5,
        startDate: "2024-02-17",
        status: "nouveau",
        temperature: 45,
        moisture: "sec",
        lastTurned: "2024-02-17",
        materials: ["fruits", "légumes"],
        schedule: [],
        notifications: []
      },
      // Jardins Partagés Ouest (5 bacs)
      {
        id: 19,
        siteId: 4,
        name: "Bac D1",
        fillLevel: 90,
        startDate: "2023-12-15",
        status: "4-mois",
        temperature: 46,
        moisture: "optimal",
        lastTurned: "2024-02-15",
        materials: ["déchets alimentaires", "feuilles", "marc de café"],
        schedule: [],
        notifications: []
      },
      {
        id: 20,
        siteId: 4,
        name: "Bac D2",
        fillLevel: 75,
        startDate: "2024-01-15",
        status: "3-mois",
        temperature: 48,
        moisture: "optimal",
        lastTurned: "2024-02-14",
        materials: ["déchets de cuisine", "paille", "carton"],
        schedule: [],
        notifications: []
      },
      {
        id: 21,
        siteId: 4,
        name: "Bac D3",
        fillLevel: 60,
        startDate: "2024-01-30",
        status: "2-mois",
        temperature: 51,
        moisture: "humide",
        lastTurned: "2024-02-13",
        materials: ["tontes de gazon", "feuilles mortes"],
        schedule: [],
        notifications: []
      },
      {
        id: 22,
        siteId: 4,
        name: "Bac D4",
        fillLevel: 35,
        startDate: "2024-02-09",
        status: "2-semaines",
        temperature: 55,
        moisture: "humide",
        lastTurned: "2024-02-17",
        materials: ["déchets verts", "herbe"],
        schedule: [],
        notifications: []
      },
      {
        id: 23,
        siteId: 4,
        name: "Bac D5",
        fillLevel: 5,
        startDate: "2024-02-17",
        status: "nouveau",
        temperature: 45,
        moisture: "sec",
        lastTurned: "2024-02-17",
        materials: ["déchets alimentaires"],
        schedule: [],
        notifications: []
      },
      // Éco-Jardin Central (5 bacs)
      {
        id: 24,
        siteId: 5,
        name: "Bac E1",
        fillLevel: 95,
        startDate: "2023-11-25",
        status: "6-mois",
        temperature: 47,
        moisture: "optimal",
        lastTurned: "2024-02-15",
        materials: ["déchets de cuisine", "feuilles", "marc de café"],
        schedule: [],
        notifications: []
      },
      {
        id: 25,
        siteId: 5,
        name: "Bac E2",
        fillLevel: 80,
        startDate: "2024-01-10",
        status: "3-mois",
        temperature: 50,
        moisture: "optimal",
        lastTurned: "2024-02-14",
        materials: ["tontes de gazon", "paille", "carton"],
        schedule: [],
        notifications: []
      },
      {
        id: 26,
        siteId: 5,
        name: "Bac E3",
        fillLevel: 65,
        startDate: "2024-01-25",
        status: "2-mois",
        temperature: 53,
        moisture: "humide",
        lastTurned: "2024-02-13",
        materials: ["fruits", "légumes", "copeaux de bois"],
        schedule: [],
        notifications: []
      },
      {
        id: 27,
        siteId: 5,
        name: "Bac E4",
        fillLevel: 40,
        startDate: "2024-02-08",
        status: "2-semaines",
        temperature: 57,
        moisture: "optimal",
        lastTurned: "2024-02-17",
        materials: ["déchets verts", "herbe"],
        schedule: [],
        notifications: []
      },
      {
        id: 28,
        siteId: 5,
        name: "Bac E5",
        fillLevel: 5,
        startDate: "2024-02-17",
        status: "nouveau",
        temperature: 45,
        moisture: "sec",
        lastTurned: "2024-02-17",
        materials: ["déchets alimentaires"],
        schedule: [],
        notifications: []
      }
    ]
  };

// Fonction pour vérifier si les données sont à jour
interface Site {
  id: number;
  name: string;
  address: string;
  boxCount: number;
}

interface Box {
  id: number;
  siteId: number;
  name: string;
  fillLevel: number;
  startDate: string;
  status: string;
  temperature: number;
  moisture: string;
  lastTurned: string;
  materials: string[];
  schedule: any[];
  notifications: any[];
}

interface CompostData {
  sites: Site[];
  boxes: Box[];
}

const isDataUpToDate = (data: CompostData): boolean => {
  // Vérifie si le nombre total de bacs correspond à ce qu'on attend
  const expectedTotalBoxes = 28; // Nombre total de bacs attendu
  return data.boxes.length === expectedTotalBoxes;
};

const CompostManagement = () => {
  const [sites, setSites] = useState<{ id: number; name: string; address: string; boxCount: number }[]>([]);
  const [selectedSite, setSelectedSite] = useState<{ id: number; name: string; address: string; boxCount: number } | null>(null);
  const [boxes, setBoxes] = useState<{ id: number; siteId: number; name: string; fillLevel: number; startDate: string; status: string; temperature: number; moisture: string; lastTurned: string; materials: string[]; schedule: any[]; notifications: any[] }[]>([]);
  const [viewMode, setViewMode] = useState('grid');
  const [isAddingBox, setIsAddingBox] = useState(false);
  const [editingBox, setEditingBox] = useState<Box | null>(null);

  useEffect(() => {
    // Récupération des données du localStorage
    const storedData = localStorage.getItem('compostData');
    let data;
    
    try {
      // Tentative de parse des données stockées
      data = storedData ? JSON.parse(storedData) : null;
      
      // Vérification de l'intégrité des données
      if (!data.sites || !data.boxes || !Array.isArray(data.sites) || !Array.isArray(data.boxes) || !isDataUpToDate(data)) {
        console.warn('Données corrompues dans le localStorage, utilisation des données initiales');
        data = initialMockData;
        localStorage.setItem('compostData', JSON.stringify(initialMockData));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      data = initialMockData;
      localStorage.setItem('compostData', JSON.stringify(initialMockData));
    }
    
    // Mise à jour des états
    setSites(data.sites);
    setBoxes(data.boxes);
    
    // Si aucun site n'est sélectionné, sélectionner le premier par défaut
    if (data.sites.length > 0 && !selectedSite) {
      setSelectedSite(data.sites[0]);
    }
  }, []);

  useEffect(() => {
    if (sites.length > 0 && boxes.length > 0) {
      try {
        localStorage.setItem('compostData', JSON.stringify({ 
          sites, 
          boxes 
        }));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des données:', error);
      }
    }
  }, [sites, boxes]);

  interface BoxData {
    name: string;
    fillLevel: number;
    temperature: number;
    moisture: string;
    materials: string[];
    schedule: any[];
    notifications: any[];
  }

  const handleAddBox = (boxData: BoxData) => {
    const newBox: Box = {
      ...boxData,
      id: Date.now(),
      siteId: selectedSite ? selectedSite.id : 0,
      startDate: new Date().toISOString(),
      status: '1-semaine',
      lastTurned: new Date().toISOString(),
      schedule: [],
      notifications: []
    };
    setBoxes([...boxes, newBox]);
    setIsAddingBox(false);
  };

  interface BoxData {
    id: number;
    name: string;
    fillLevel: number;
    temperature: number;
    moisture: string;
    materials: string[];
    schedule: any[];
    notifications: any[];
  }

  const handleUpdateBox = (boxData: BoxData) => {
    setBoxes(boxes.map(box => box.id === boxData.id ? { ...box, ...boxData } : box));
    setEditingBox(null);
  };

  const handleDeleteBox = (id: number) => {
    setBoxes(boxes.filter(box => box.id !== id));
  };

  interface StatusColors {
    [key: string]: string;
  }

  const getStatusColor = (status: string): string => {
    const colors: StatusColors = {
      '1-semaine': 'bg-yellow-200',
      '1-mois': 'bg-green-200',
      '2-mois': 'bg-green-300',
      '3-mois': 'bg-green-500'
    };
    return colors[status] || 'bg-gray-200';
  };

  const FillLevelIndicator = ({ level }: { level: number }) => (
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-green-500 transition-all duration-300"
        style={{ width: `${level}%` }}
      />
    </div>
  );

  const BoxForm = ({ box = null, onSubmit, onClose }: { box?: any, onSubmit: (boxData: any) => void, onClose: () => void }) => (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{box ? 'Modifier le Bac' : 'Ajouter un Nouveau Bac'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          onSubmit({
            name: formData.get('name'),
            fillLevel: parseInt(formData.get('fillLevel') as string),
            temperature: parseInt(formData.get('temperature') as string),
            moisture: formData.get('moisture'),
            materials: formData.get('materials')?.toString().split(',').map(m => m.trim()) ?? [],
            schedule: box?.schedule || []
          });
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input
              name="name"
              defaultValue={box?.name}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Niveau de Remplissage (%)</label>
            <input
              name="fillLevel"
              type="number"
              defaultValue={box?.fillLevel || 0}
              className="w-full p-2 border rounded"
              min="0"
              max="100"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Température (°C)</label>
            <input
              name="temperature"
              type="number"
              defaultValue={box?.temperature || 20}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Niveau d'Humidité</label>
            <select
              name="moisture"
              defaultValue={box?.moisture || 'optimal'}
              className="w-full p-2 border rounded"
            >
              <option value="sec">Sec</option>
              <option value="optimal">Optimal</option>
              <option value="humide">Humide</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Matériaux</label>
            <input
              name="materials"
              defaultValue={box?.materials?.join(', ') || ''}
              className="w-full p-2 border rounded"
              placeholder="Entrez les matériaux séparés par des virgules"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Annuler
            </button>
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
              Enregistrer
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  const CompostBoxCard = ({ box }: { box: Box }) => (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          {box.name}
          <div className="flex gap-2">
            <button onClick={() => setEditingBox(box)} className="p-1">
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={() => handleDeleteBox(box.id)} className="p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </CardTitle>
        <CardDescription>
          Démarré le: {new Date(box.startDate).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="text-sm mb-1">Niveau de Remplissage</div>
            <FillLevelIndicator level={box.fillLevel} />
          </div>
          <div className={`text-sm px-2 py-1 rounded ${getStatusColor(box.status)}`}>
            Statut: {box.status}
          </div>
          <div className="text-sm flex items-center gap-2">
            <ThermometerSun className="w-4 h-4" />
            {box.temperature}°C
          </div>
          <div className="text-sm">
            Matériaux: {box.materials.join(", ")}
          </div>
          {box.schedule?.length > 0 && (
            <div className="mt-2">
              <div className="text-sm font-medium">Prochaine Tâche Planifiée:</div>
              {box.schedule
                .filter(item => new Date(item.date) >= new Date())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 1)
                .map((item, index) => (
                  <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                    {item.task} - {new Date(item.date).toLocaleDateString()}
                  </div>
                ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const CompostBoxListItem = ({ box }: { box: Box }) => (
    <div className="flex items-center gap-4 p-4 border rounded">
      <div className="flex-1">
        <div className="font-medium">{box.name}</div>
        <div className="text-sm text-gray-500">
          Started: {new Date(box.startDate).toLocaleDateString()}
        </div>
      </div>
      <div className="flex-1">
        <FillLevelIndicator level={box.fillLevel} />
      </div>
      <div className={`px-2 py-1 rounded ${getStatusColor(box.status)}`}>
        {box.status}
      </div>
      <div className="flex items-center gap-2">
        <ThermometerSun className="w-4 h-4" />
        {box.temperature}°C
      </div>
      <div className="flex gap-2">
        <button onClick={() => setEditingBox(box)} className="p-1">
          <Edit className="w-4 h-4" />
        </button>
        <button onClick={() => handleDeleteBox(box.id)} className="p-1">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gestion des Jardins Composteurs</h1>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <select 
            className="p-2 border rounded"
            onChange={(e) => setSelectedSite(sites.find(s => s.id === parseInt(e.target.value)) || null)}
            value={selectedSite?.id || ""}
          >
            <option value="">Sélectionner un site</option>
            {sites.map(site => (
              <option key={site.id} value={site.id}>{site.name}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button 
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 border rounded"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => setIsAddingBox(true)}
              className="p-2 border rounded flex items-center gap-2"
              disabled={!selectedSite}
            >
              <Plus className="w-4 h-4" /> Ajouter un Bac
            </button>
          </div>
        </div>
        {selectedSite && (
          <Alert>
            <MapPin className="w-4 h-4" />
            <AlertTitle>{selectedSite.name}</AlertTitle>
            <AlertDescription>{selectedSite.address}</AlertDescription>
          </Alert>
        )}
      </div>

      {selectedSite ? (
  <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
    {boxes
      .filter(box => box.siteId === selectedSite.id)
      .map(box => viewMode === 'grid' ? (
        <CompostBoxCard key={box.id} box={box} />
      ) : (
        <CompostBoxListItem key={box.id} box={box} />
      ))}
    {boxes.filter(box => box.siteId === selectedSite.id).length === 0 && (
      <div className="col-span-full text-center py-8 text-gray-500">
        Aucun bac trouvé pour ce site
      </div>
    )}
  </div>
) : (
  <div className="text-center py-8 text-gray-500">
    Veuillez sélectionner un site pour voir les bacs de compost
  </div>
)}

      {isAddingBox && (
        <BoxForm onSubmit={handleAddBox} onClose={() => setIsAddingBox(false)} />
      )}

      {editingBox && (
        <BoxForm 
          box={editingBox} 
          onSubmit={handleUpdateBox} 
          onClose={() => setEditingBox(null)} 
        />
      )}
    </div>
  );
};

export default CompostManagement;