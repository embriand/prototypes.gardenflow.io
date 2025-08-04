// File: components/compost/data/compostInitialData.js
// Define interfaces for our data structures
export interface CompostSite {
    id: number;
    name: string;
    address: string;
    boxCount: number;
  }
  
  export interface CompostHistoryEntry {
    date: string;
    action: string;
    notes: string;
  }
  
  export interface CompostBox {
    id: number;
    siteId: number;
    name: string;
    fillLevel: number;
    startDate: string;
    status: string;
    temperature: number;
    moisture: 'sec' | 'optimal' | 'humide';
    lastTurned: string;
    materials: string[];
    schedule: any[];
    notifications: any[];
    history: CompostHistoryEntry[];
  }
  
  export interface CompostData {
    sites: CompostSite[];
    boxes: CompostBox[];
  }

  export const initialMockData: CompostData = {
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
        notifications: [],
        history: [
          { date: "2024-02-15", action: "Retournement", notes: "Bonne décomposition" },
          { date: "2024-01-15", action: "Ajout de matières", notes: "Ajout de feuilles" },
          { date: "2023-12-15", action: "Retournement", notes: "Température stable" }
        ]
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
        notifications: [],
        history: [
          { date: "2024-02-12", action: "Retournement", notes: "Bon développement" },
          { date: "2024-01-10", action: "Ajout de matières", notes: "Ajout de tontes de gazon" }
        ]
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
        notifications: [],
        history: [
          { date: "2024-02-10", action: "Retournement", notes: "Humidité élevée, aération améliorée" }
        ]
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
        notifications: [],
        history: [
          { date: "2024-02-14", action: "Retournement", notes: "Première décomposition visible" }
        ]
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
        notifications: [],
        history: [
          { date: "2024-02-17", action: "Retournement", notes: "Bonne montée en température" }
        ]
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
        notifications: [],
        history: [
          { date: "2024-02-17", action: "Création", notes: "Nouveau bac créé" }
        ]
      },
      
      // Ferme Urbaine Sud (6 bacs) - Site ID 2
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
        notifications: [],
        history: [
          { date: "2024-02-15", action: "Retournement", notes: "Compost presque mûr" }
        ]
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
        notifications: [],
        history: [
          { date: "2024-02-14", action: "Retournement", notes: "Développement normal" }
        ]
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
        notifications: [],
        history: [
          { date: "2024-02-13", action: "Retournement", notes: "Ajout de carton sec pour équilibrer l'humidité" }
        ]
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
        notifications: [],
        history: [
          { date: "2024-02-16", action: "Retournement", notes: "Bonne progression" }
        ]
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
        notifications: [],
        history: [
          { date: "2024-02-18", action: "Retournement", notes: "Premier retournement" }
        ]
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
        notifications: [],
        history: [
          { date: "2024-02-17", action: "Création", notes: "Nouveau bac créé" }
        ]
      },
      
      // Potager Collectif Est (6 bacs) - Site ID 3
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
        notifications: [],
        history: [
          { date: "2024-02-15", action: "Retournement", notes: "Compost presque prêt à être utilisé" }
        ]
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
        notifications: [],
        history: [
          { date: "2024-02-14", action: "Retournement", notes: "Bonne décomposition" }
        ]
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
        notifications: [],
        history: [
          { date: "2024-02-13", action: "Retournement", notes: "Humidité élevée, surveillance nécessaire" }
        ]
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
        notifications: [],
        history: [
          { date: "2024-02-16", action: "Retournement", notes: "Développement normal" }
        ]
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
        notifications: [],
        history: [
          { date: "2024-02-18", action: "Retournement", notes: "Première aération" }
        ]
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
        notifications: [],
        history: [
          { date: "2024-02-17", action: "Création", notes: "Nouveau bac créé" }
        ]
      },
      
      // Jardins Partagés Ouest (5 bacs) - Site ID 4
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
        notifications: [],
        history: [
          { date: "2024-02-15", action: "Retournement", notes: "Bonne maturation" }
        ]
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
        notifications: [],
        history: [
          { date: "2024-02-14", action: "Retournement", notes: "Développement normal" }
        ]
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
        notifications: [],
        history: [
          { date: "2024-02-13", action: "Retournement", notes: "Niveau d'humidité à surveiller" }
        ]
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
        notifications: [],
        history: [
          { date: "2024-02-17", action: "Retournement", notes: "Première aération" }
        ]
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
        notifications: [],
        history: [
          { date: "2024-02-17", action: "Création", notes: "Nouveau bac créé" }
        ]
      },
      
      // Éco-Jardin Central (5 bacs) - Site ID 5
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
        notifications: [],
        history: [
          { date: "2024-02-15", action: "Retournement", notes: "Presque prêt à être utilisé" }
        ]
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
        notifications: [],
        history: [
          { date: "2024-02-14", action: "Retournement", notes: "Bonne décomposition" }
        ]
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
        notifications: [],
        history: [
          { date: "2024-02-13", action: "Retournement", notes: "A besoin de matériaux secs" }
        ]
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
        notifications: [],
        history: [
          { date: "2024-02-17", action: "Retournement", notes: "Bonne aération" }
        ]
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
        notifications: [],
        history: [
          { date: "2024-02-17", action: "Création", notes: "Nouveau bac créé" }
        ]
      }
    ]
  };