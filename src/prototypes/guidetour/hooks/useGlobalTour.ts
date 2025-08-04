import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Mapping des routes vers les composants et leurs tours
const ROUTE_TO_COMPONENT_MAP: Record<string, {
  component: string;
  availableTours: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}> = {
  '/dashboard': {
    component: 'dashboard',
    availableTours: [
      {
        id: 'dashboard-introduction',
        name: 'Introduction au Dashboard',
        description: 'Découvrez les fonctionnalités principales'
      },
      {
        id: 'dashboard-project-management',
        name: 'Gestion des projets',
        description: 'Apprenez à gérer vos projets'
      }
    ]
  },
  '/editor': {
    component: 'studio',
    availableTours: [
      {
        id: 'studio-basics',
        name: 'Bases du Studio',
        description: 'Interface de conception'
      }
    ]
  },
  '/studio-plus': {
    component: 'studioplus',
    availableTours: [
      {
        id: 'studioplus-features',
        name: 'Fonctionnalités Studio+',
        description: 'Fonctionnalités avancées'
      }
    ]
  },
  '/visualMap': {
    component: 'visualmap',
    availableTours: [
      {
        id: 'visualmap-intro',
        name: 'Visual Map',
        description: 'Navigation visuelle'
      }
    ]
  },
  '/chat': {
    component: 'chat',
    availableTours: [
      {
        id: 'chat-basics',
        name: 'Chat Assistant',
        description: 'Utilisation du chat'
      }
    ]
  },
  '/taskManager': {
    component: 'tasks',
    availableTours: [
      {
        id: 'tasks-management',
        name: 'Gestion des tâches',
        description: 'Organisez vos tâches'
      }
    ]
  },
  '/cropPlanner': {
    component: 'cropplanner',
    availableTours: [
      {
        id: 'crop-planner-overview',
        name: 'Planificateur de cultures',
        description: 'Découvrez comment planifier et gérer vos cultures'
      }
    ]
  }
};

export interface CurrentComponentInfo {
  component: string;
  componentName: string;
  availableTours: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  hasActiveTours: boolean;
}

export const useGlobalTour = () => {
  const location = useLocation();
  const [currentComponent, setCurrentComponent] = useState<CurrentComponentInfo | null>(null);

  // Détection du composant actuel basée sur la route
  useEffect(() => {
    const detectCurrentComponent = () => {
      const currentPath = location.pathname;
      // Trouver la correspondance exacte ou la plus proche
      let matchedRoute = null;
      let bestMatch = '';
      
      for (const route in ROUTE_TO_COMPONENT_MAP) {
        if (currentPath === route) {
          matchedRoute = route;
          break;
        }
        // Pour les routes dynamiques, on cherche le début le plus proche
        if (currentPath.startsWith(route) && route.length > bestMatch.length) {
          bestMatch = route;
          matchedRoute = route;
        }
      }

      if (matchedRoute && ROUTE_TO_COMPONENT_MAP[matchedRoute]) {
        const componentInfo = ROUTE_TO_COMPONENT_MAP[matchedRoute];
        
        setCurrentComponent({
          component: componentInfo.component,
          componentName: getComponentDisplayName(componentInfo.component),
          availableTours: componentInfo.availableTours,
          hasActiveTours: componentInfo.availableTours.length > 0
        });
      } else {
        // Composant non reconnu ou sans tours
        setCurrentComponent({
          component: 'unknown',
          componentName: 'Page actuelle',
          availableTours: [],
          hasActiveTours: false
        });
      }
    };

    detectCurrentComponent();
  }, [location.pathname]);

  return {
    currentComponent,
    isOnSupportedPage: currentComponent?.hasActiveTours || false
  };
};

// Helper pour obtenir le nom d'affichage du composant
const getComponentDisplayName = (component: string): string => {
  const displayNames: Record<string, string> = {
    'dashboard': 'Dashboard',
    'studio': 'Studio',
    'studioplus': 'Studio+',
    'visualmap': 'Visual Map',
    'chat': 'Chat',
    'tasks': 'Gestionnaire de tâches',
    'cropplanner': 'Planificateur de cultures',
    'unknown': 'Page actuelle'
  };

  return displayNames[component] || component;
};

export default useGlobalTour;