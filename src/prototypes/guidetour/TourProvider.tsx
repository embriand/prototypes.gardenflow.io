import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { TourOverlay } from './components/tour/TourOverlay';

// Types simplifiés pour l'intégration
export interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  showSkip?: boolean;
  delay?: number;
}

export interface TourFlow {
  id: string;
  name: string;
  description: string;
  component: string;
  steps: TourStep[];
  isActive: boolean;
  autoStart?: boolean;
  priority?: number;
}

interface TourState {
  activeTour: TourFlow | null;
  currentStep: number;
  isRunning: boolean;
  availableTours: TourFlow[];
  completedTours: Set<string>; // Tours terminés (completed ou skipped)
  skippedTours: Set<string>; // Tours spécifiquement skippés
}

type TourAction = 
  | { type: 'START_TOUR'; payload: TourFlow }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'END_TOUR'; payload: { tourId: string; completed: boolean } }
  | { type: 'SKIP_TOUR'; payload: { tourId: string } }
  | { type: 'SET_TOURS'; payload: TourFlow[] }
  | { type: 'TOGGLE_TOUR_ACTIVE'; payload: { tourId: string; isActive: boolean } }
  | { type: 'RESET_TOUR_STATUS'; payload: { tourId: string } };

// Récupérer les tours terminés depuis localStorage
const getCompletedTours = (): Set<string> => {
  try {
    const stored = localStorage.getItem('completedTours');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
};

const getSkippedTours = (): Set<string> => {
  try {
    const stored = localStorage.getItem('skippedTours');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
};

const initialState: TourState = {
  activeTour: null,
  currentStep: 0,
  isRunning: false,
  availableTours: [],
  completedTours: getCompletedTours(),
  skippedTours: getSkippedTours()
};

function tourReducer(state: TourState, action: TourAction): TourState {
  switch (action.type) {
    case 'START_TOUR':
      return {
        ...state,
        activeTour: action.payload,
        currentStep: 0,
        isRunning: true
      };
    
    case 'NEXT_STEP':
      if (!state.activeTour) return state;
      
      const nextStep = state.currentStep + 1;
      if (nextStep >= state.activeTour.steps.length) {
        return {
          ...state,
          activeTour: null,
          currentStep: 0,
          isRunning: false
        };
      }
      
      return {
        ...state,
        currentStep: nextStep
      };
    
    case 'PREVIOUS_STEP':
      if (!state.activeTour || state.currentStep <= 0) return state;
      
      return {
        ...state,
        currentStep: state.currentStep - 1
      };
    
    case 'END_TOUR': {
      const newCompletedTours = new Set(state.completedTours);
      newCompletedTours.add(action.payload.tourId);
      
      // Sauvegarder dans localStorage
      localStorage.setItem('completedTours', JSON.stringify([...newCompletedTours]));
      
      return {
        ...state,
        activeTour: null,
        currentStep: 0,
        isRunning: false,
        completedTours: newCompletedTours
      };
    }
    
    case 'SKIP_TOUR': {
      const newCompletedTours = new Set(state.completedTours);
      const newSkippedTours = new Set(state.skippedTours);
      
      newCompletedTours.add(action.payload.tourId);
      newSkippedTours.add(action.payload.tourId);
      
      // Sauvegarder dans localStorage
      localStorage.setItem('completedTours', JSON.stringify([...newCompletedTours]));
      localStorage.setItem('skippedTours', JSON.stringify([...newSkippedTours]));
      
      return {
        ...state,
        activeTour: null,
        currentStep: 0,
        isRunning: false,
        completedTours: newCompletedTours,
        skippedTours: newSkippedTours
      };
    }
    
    case 'SET_TOURS':
      return {
        ...state,
        availableTours: action.payload
      };
    
    case 'TOGGLE_TOUR_ACTIVE':
      return {
        ...state,
        availableTours: state.availableTours.map(tour =>
          tour.id === action.payload.tourId
            ? { ...tour, isActive: action.payload.isActive }
            : tour
        )
      };
    
    case 'RESET_TOUR_STATUS': {
      const newCompletedTours = new Set(state.completedTours);
      const newSkippedTours = new Set(state.skippedTours);
      
      newCompletedTours.delete(action.payload.tourId);
      newSkippedTours.delete(action.payload.tourId);
      
      // Mettre à jour localStorage
      localStorage.setItem('completedTours', JSON.stringify([...newCompletedTours]));
      localStorage.setItem('skippedTours', JSON.stringify([...newSkippedTours]));
      
      return {
        ...state,
        completedTours: newCompletedTours,
        skippedTours: newSkippedTours
      };
    }
    
    default:
      return state;
  }
}

interface TourContextType {
  state: TourState;
  startTour: (tourId: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  endTour: () => void;
  skipTour: () => void;
  setTours: (tours: TourFlow[]) => void;
  toggleTourActive: (tourId: string, isActive: boolean) => void;
  resetTourStatus: (tourId: string) => void;
  isTourCompleted: (tourId: string) => boolean;
  isTourSkipped: (tourId: string) => boolean;
}

const TourContext = createContext<TourContextType | null>(null);

export const useGuideTourContext = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useGuideTourContext must be used within a TourProvider');
  }
  return context;
};

interface TourProviderProps {
  children: React.ReactNode;
  component: string;
  autoStartTours?: string[];
}

export const TourProvider: React.FC<TourProviderProps> = ({ 
  children, 
  component, 
  autoStartTours = [] 
}) => {
  const [state, dispatch] = useReducer(tourReducer, initialState);

  // Fonction pour démarrer un tour
  const startTour = (tourId: string) => {
    const tour = state.availableTours.find(t => t.id === tourId && t.isActive);
    if (tour) {
      dispatch({ type: 'START_TOUR', payload: tour });
    }
  };

  const nextStep = () => dispatch({ type: 'NEXT_STEP' });
  const previousStep = () => dispatch({ type: 'PREVIOUS_STEP' });
  
  const endTour = () => {
    if (state.activeTour) {
      dispatch({ 
        type: 'END_TOUR', 
        payload: { tourId: state.activeTour.id, completed: true } 
      });
    }
  };
  
  const skipTour = () => {
    if (state.activeTour) {
      dispatch({ 
        type: 'SKIP_TOUR', 
        payload: { tourId: state.activeTour.id } 
      });
    }
  };
  
  const setTours = (tours: TourFlow[]) => {
    dispatch({ type: 'SET_TOURS', payload: tours });
  };

  const toggleTourActive = (tourId: string, isActive: boolean) => {
    dispatch({ type: 'TOGGLE_TOUR_ACTIVE', payload: { tourId, isActive } });
  };

  const resetTourStatus = (tourId: string) => {
    dispatch({ type: 'RESET_TOUR_STATUS', payload: { tourId } });
  };

  const isTourCompleted = (tourId: string) => {
    return state.completedTours.has(tourId);
  };

  const isTourSkipped = (tourId: string) => {
    return state.skippedTours.has(tourId);
  };

  // Auto-démarrage des tours (seulement s'ils n'ont pas été terminés)
  useEffect(() => {
    if (state.availableTours.length > 0 && !state.isRunning && autoStartTours.length > 0) {
      const tourToStart = state.availableTours.find(tour => 
        autoStartTours.includes(tour.id) && 
        tour.isActive && 
        tour.component === component &&
        tour.autoStart &&
        !state.completedTours.has(tour.id) // Ne pas démarrer si déjà terminé
      );
      
      if (tourToStart) {
        // Délai pour laisser le temps au DOM de se charger
        setTimeout(() => {
          startTour(tourToStart.id);
        }, 1000);
      }
    }
  }, [state.availableTours, component, autoStartTours, state.isRunning, state.completedTours]);

  // Écouter les événements globaux pour démarrer des tours
  useEffect(() => {
    const handleGlobalTourStart = (event: CustomEvent) => {
      const { tourId, component: eventComponent } = event.detail;
      
      // Vérifier si ce composant peut gérer ce tour
      const canHandleTour = !eventComponent || eventComponent === component;
      const tourExists = state.availableTours.some(tour => tour.id === tourId);
      
      if (canHandleTour && tourExists) {
        startTour(tourId);
      }
    };

    window.addEventListener('startGlobalTour', handleGlobalTourStart as EventListener);
    
    return () => {
      window.removeEventListener('startGlobalTour', handleGlobalTourStart as EventListener);
    };
  }, [component, state.availableTours, startTour]);

  // Chargement des tours depuis localStorage (temporaire - sera remplacé par API)
  useEffect(() => {
    const loadTours = async () => {
      // Tours d'exemple pour le Dashboard
      const dashboardTours: TourFlow[] = [
        {
          id: 'dashboard-introduction',
          name: 'Introduction au Dashboard',
          description: 'Découvrez les fonctionnalités principales du tableau de bord',
          component: 'dashboard',
          isActive: true,
          autoStart: true,
          priority: 1,
          steps: [
            {
              id: 'welcome',
              title: 'Bienvenue sur votre Dashboard !',
              content: 'Ce tableau de bord vous donne un aperçu de tous vos projets et vous permet de les gérer facilement.',
              target: '[data-tour="dashboard-stats"]',
              placement: 'bottom'
            },
            {
              id: 'stats',
              title: 'Statistiques de vos projets',
              content: 'Ces cartes affichent des statistiques importantes : nombre total de projets, projets actifs, et projets terminés.',
              target: '[data-tour="dashboard-stats"]',
              placement: 'bottom'
            },
            {
              id: 'search',
              title: 'Recherche et filtres',
              content: 'Utilisez la barre de recherche et les filtres pour trouver rapidement vos projets.',
              target: '[data-tour="dashboard-search-filters"]',
              placement: 'top'
            },
            {
              id: 'view-modes',
              title: 'Modes d\'affichage',
              content: 'Changez entre vue grille, liste ou carte pour voir vos projets sous différents formats.',
              target: '[data-tour="dashboard-view-modes"]',
              placement: 'bottom'
            },
            {
              id: 'create-project',
              title: 'Créer un nouveau projet',
              content: 'Cliquez sur ce bouton pour créer un nouveau projet. C\'est ici que tout commence !',
              target: '[data-tour="dashboard-create-project"]',
              placement: 'left'
            }
          ]
        },
        {
          id: 'dashboard-project-management',
          name: 'Gestion des projets',
          description: 'Apprenez à gérer vos projets existants',
          component: 'dashboard',
          isActive: false,
          autoStart: false,
          priority: 2,
          steps: [
            {
              id: 'project-actions',
              title: 'Actions sur les projets',
              content: 'Chaque projet dispose d\'actions : éditer, dupliquer, supprimer, définir par défaut.',
              target: '[data-tour="dashboard-create-project"]',
              placement: 'top'
            }
          ]
        }
      ];

      let allTours = [...dashboardTours];

      // Import du tour Crop Planner si nécessaire
      try {
        const cropPlannerModule = await import('./tours/cropPlannerTour');
        const cropPlannerTour = cropPlannerModule.cropPlannerOverviewTour;
        
        // Conversion du format importé vers le format TourFlow
        const cropPlannerTourFlow: TourFlow = {
          id: cropPlannerTour.id,
          name: cropPlannerTour.name,
          description: cropPlannerTour.description,
          component: 'cropplanner',
          isActive: true,
          autoStart: false,
          priority: 1,
          steps: cropPlannerTour.steps
        };

        allTours.push(cropPlannerTourFlow);
      } catch (error) {
        console.error('Error loading crop planner tour:', error);
      }

      // Filtrer les tours pour le composant actuel
      const componentTours = allTours.filter(tour => tour.component === component);
      setTours(componentTours);
    };

    loadTours();
  }, [component]);

  const contextValue: TourContextType = {
    state,
    startTour,
    nextStep,
    previousStep,
    endTour,
    skipTour,
    setTours,
    toggleTourActive,
    resetTourStatus,
    isTourCompleted,
    isTourSkipped
  };

  return (
    <TourContext.Provider value={contextValue}>
      {children}
      {state.isRunning && state.activeTour && (
        <TourOverlay
          tour={state.activeTour}
          currentStep={state.currentStep}
          onNext={nextStep}
          onPrevious={previousStep}
          onSkip={skipTour}
          onEnd={endTour}
        />
      )}
    </TourContext.Provider>
  );
};

export default TourProvider;