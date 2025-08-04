import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTour, UseTourOptions } from './hooks/useTour';
import { TourFlow } from './types/tourManager';
import { TourOverlay } from './components/tour/TourOverlay';

// Define missing types locally
interface TourStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  placement?: string;
  action?: () => void;
}

interface TourProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
}

interface TourProviderV2ContextType {
  tours: TourFlow[];
  currentTour: TourFlow | null;
  currentStep: TourStep | null;
  isLoading: boolean;
  error: string | null;
  isActive: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
  completionPercentage: number;
  
  // Actions
  startTour: (tourId: string) => Promise<void>;
  nextStep: () => Promise<void>;
  previousStep: () => Promise<void>;
  skipStep: () => Promise<void>;
  skipTour: () => Promise<void>;
  completeTour: (rating?: number, feedback?: string) => Promise<void>;
  resetTour: (tourId: string) => Promise<void>;
  
  // Legacy compatibility methods (for smooth migration)
  state: {
    activeTour: TourFlow | null;
    currentStep: number;
    isRunning: boolean;
    availableTours: TourFlow[];
    completedTours: Set<string>;
    skippedTours: Set<string>;
  };
  endTour: () => Promise<void>;
  setTours: (tours: TourFlow[]) => void;
  toggleTourActive: (tourId: string, isActive: boolean) => void;
  resetTourStatus: (tourId: string) => Promise<void>;
  isTourCompleted: (tourId: string) => boolean;
  isTourSkipped: (tourId: string) => boolean;
}

const TourProviderV2Context = createContext<TourProviderV2ContextType | null>(null);

export const useGuideTourContext = () => {
  const context = useContext(TourProviderV2Context);
  if (!context) {
    throw new Error('useGuideTourContext must be used within a TourProviderV2');
  }
  return context;
};

interface TourProviderV2Props {
  children: React.ReactNode;
  component: string;
  autoStartTours?: string[];
  features?: string[];
  onTourComplete?: (tourId: string) => void;
  onTourSkip?: (tourId: string) => void;
}

export const TourProviderV2: React.FC<TourProviderV2Props> = ({
  children,
  component,
  autoStartTours = [],
  features = [],
  onTourComplete,
  onTourSkip
}) => {
  const { i18n } = useTranslation();
  const [completedTours, setCompletedTours] = useState<Set<string>>(new Set());
  const [skippedTours, setSkippedTours] = useState<Set<string>>(new Set());

  // Tour hook options - DATABASE ONLY
  const tourOptions: UseTourOptions = {
    autoStart: false, // We handle auto-start manually
    features,
    onTourComplete: (tourId: string) => {
      setCompletedTours(prev => new Set([...prev, tourId]));
      onTourComplete?.(tourId);
    },
    onTourSkip: (tourId: string) => {
      setCompletedTours(prev => new Set([...prev, tourId]));
      setSkippedTours(prev => new Set([...prev, tourId]));
      onTourSkip?.(tourId);
    }
    // DATABASE ONLY - no fallback options
  };

  // Use the tour hook with database-only configuration
  const tourHook = useTour(component, tourOptions);

  // Load localStorage tour status on mount (for completed/skipped tracking)
  useEffect(() => {
    try {
      const storedCompleted = localStorage.getItem('completedTours');
      const storedSkipped = localStorage.getItem('skippedTours');
      
      if (storedCompleted) {
        setCompletedTours(new Set(JSON.parse(storedCompleted)));
      }
      if (storedSkipped) {
        setSkippedTours(new Set(JSON.parse(storedSkipped)));
      }
    } catch (error) {
      console.error('Error loading tour status from localStorage:', error);
    }
  }, []);

  // Update localStorage when tour status changes
  useEffect(() => {
    try {
      localStorage.setItem('completedTours', JSON.stringify([...completedTours]));
    } catch (error) {
      console.error('Error saving completed tours to localStorage:', error);
    }
  }, [completedTours]);

  useEffect(() => {
    try {
      localStorage.setItem('skippedTours', JSON.stringify([...skippedTours]));
    } catch (error) {
      console.error('Error saving skipped tours to localStorage:', error);
    }
  }, [skippedTours]);

  // Auto-start tours when they become available
  useEffect(() => {
    if (tourHook.tours.length > 0 && !tourHook.isActive && autoStartTours.length > 0) {
      const tourToStart = tourHook.tours.find(tour => 
        autoStartTours.includes(tour.identifier || tour.id) && 
        tour.isActive && 
        tour.autoStart &&
        !completedTours.has(tour.id) &&
        !tourHook.progress[tour.id]?.completed
      );
      
      if (tourToStart) {
        // Delay to allow DOM to load
        setTimeout(() => {
          tourHook.startTour(tourToStart.id);
        }, 1000);
      }
    }
  }, [tourHook.tours, tourHook.isActive, autoStartTours, completedTours, tourHook.progress]);

  // Listen for global tour start events
  useEffect(() => {
    const handleGlobalTourStart = (event: CustomEvent) => {
      const { tourId, component: eventComponent } = event.detail;
      
      // Check if this component can handle this tour
      const canHandleTour = !eventComponent || eventComponent === component;
      const tourExists = tourHook.tours.some(tour => tour.id === tourId);
      
      if (canHandleTour && tourExists) {
        tourHook.startTour(tourId);
      }
    };

    window.addEventListener('startGlobalTour', handleGlobalTourStart as EventListener);
    
    return () => {
      window.removeEventListener('startGlobalTour', handleGlobalTourStart as EventListener);
    };
  }, [component, tourHook.tours, tourHook.startTour]);

  // Legacy compatibility methods (temporary - will be removed)
  const endTour = async () => {
    await tourHook.completeTour();
  };

  const isTourCompleted = (tourId: string): boolean => {
    return completedTours.has(tourId) || !!tourHook.progress[tourId]?.completed;
  };

  const isTourSkipped = (tourId: string): boolean => {
    return skippedTours.has(tourId) || !!tourHook.progress[tourId]?.skipped;
  };

  // Enhanced reset tour that also clears localStorage
  const resetTour = async (tourId: string) => {
    await tourHook.resetTour(tourId);
    
    // Also clear from local state and localStorage
    setCompletedTours(prev => {
      const newSet = new Set(prev);
      newSet.delete(tourId);
      return newSet;
    });
    
    setSkippedTours(prev => {
      const newSet = new Set(prev);
      newSet.delete(tourId);
      return newSet;
    });
  };

  // Legacy state object (temporary - will be removed)
  const legacyState = {
    activeTour: tourHook.currentTour,
    currentStep: tourHook.currentTour?.steps?.findIndex(s => s.id === tourHook.currentStep?.id) || 0,
    isRunning: tourHook.isActive,
    availableTours: tourHook.tours,
    completedTours,
    skippedTours
  };

  // Legacy methods (temporary - will be removed)
  const setTours = () => {
    // This is a no-op since tours come from database
    console.warn('setTours is deprecated - tours are loaded from database');
  };

  const toggleTourActive = () => {
    // This should be handled through the admin interface
    console.warn('toggleTourActive is deprecated - use admin interface to manage tour status');
  };

  const resetTourStatus = async (tourId: string) => {
    await resetTour(tourId);
  };

  const contextValue: TourProviderV2ContextType = {
    tours: tourHook.tours,
    currentTour: tourHook.currentTour,
    currentStep: tourHook.currentStep,
    isLoading: tourHook.isLoading,
    error: tourHook.error,
    isActive: tourHook.isActive,
    canGoNext: tourHook.canGoNext,
    canGoPrevious: tourHook.canGoPrevious,
    completionPercentage: tourHook.completionPercentage,
    
    // Actions
    startTour: tourHook.startTour,
    nextStep: tourHook.nextStep,
    previousStep: tourHook.previousStep,
    skipStep: tourHook.skipStep,
    skipTour: tourHook.skipTour,
    completeTour: tourHook.completeTour,
    resetTour,
    
    // Legacy compatibility (temporary - will be removed)
    state: legacyState,
    endTour,
    setTours,
    toggleTourActive,
    resetTourStatus,
    isTourCompleted,
    isTourSkipped
  };

  return (
    <TourProviderV2Context.Provider value={contextValue}>
      {children}
      {tourHook.isActive && tourHook.currentTour && tourHook.currentStep && (
        <TourOverlay
          tour={tourHook.currentTour}
          currentStepData={tourHook.currentStep}
          onNext={tourHook.nextStep}
          onPrevious={tourHook.previousStep}
          onSkip={tourHook.skipTour}
          onEnd={endTour}
          canGoNext={tourHook.canGoNext}
          canGoPrevious={tourHook.canGoPrevious}
          completionPercentage={tourHook.completionPercentage}
        />
      )}
    </TourProviderV2Context.Provider>
  );
};

// Export alias for compatibility during transition (will be removed)
export const TourProvider = TourProviderV2;

export default TourProviderV2;