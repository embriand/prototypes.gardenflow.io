import React, { createContext, useContext, useEffect } from 'react';
import { useTourManager } from '../../hooks/useTourManager';
import { TourFlow } from '../../types/tourManager';
import { TourOverlay } from './TourOverlay';

interface TourManagerContextValue {
  startTour: (flowId: string) => void;
  stopTour: () => void;
  pauseTour: () => void;
  resumeTour: () => void;
  nextStep: () => void;
  previousStep: () => void;
  skipStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
  resetProgress: (flowId: string) => void;
  updateSettings: (settings: any) => void;
  updateUserProfile: (updates: any) => void;
  registerComponent: (component: string) => void;
  unregisterComponent: (component: string) => void;
  registerFeature: (feature: string) => void;
  unregisterFeature: (feature: string) => void;
  queueTour: (flowId: string) => void;
  dequeueTour: (flowId: string) => void;
  getCurrentStep: () => any;
  getFlowProgress: (flowId: string) => any;
  isFlowCompleted: (flowId: string) => boolean;
  isFlowSkipped: (flowId: string) => boolean;
  getCompletionPercentage: (flowId: string) => number;
  getAvailableFlows: (component?: string, feature?: string) => TourFlow[];
  enableComponent: (component: string, enabled?: boolean) => void;
  enableFeature: (feature: string, enabled?: boolean) => void;
  enableCategory: (category: string, enabled?: boolean) => void;
  dispatch: (action: any) => void;
  isActive: boolean;
  isPaused: boolean;
  isMinimized: boolean;
  showHelp: boolean;
  activeFlow: TourFlow | null;
  currentStep: number;
  settings: any;
  progress: any;
  flows: TourFlow[];
}

const TourManagerContext = createContext<TourManagerContextValue | null>(null);

export const useTourManagerContext = () => {
  const context = useContext(TourManagerContext);
  if (!context) {
    throw new Error('useTourManagerContext must be used within a TourManagerProvider');
  }
  return context;
};

interface TourManagerProviderProps {
  children: React.ReactNode;
  flows: TourFlow[];
}

export const TourManagerProvider: React.FC<TourManagerProviderProps> = ({ 
  children, 
  flows 
}) => {
  const tourManager = useTourManager(flows);
  const currentStep = tourManager.getCurrentStep();

  return (
    <TourManagerContext.Provider value={tourManager}>
      {children}
      
      {/* Render tour overlay when active and not paused */}
      {tourManager.isActive && !tourManager.isPaused && tourManager.activeFlow && currentStep && (
        <TourOverlay
          step={currentStep}
          currentStep={tourManager.currentStep}
          totalSteps={tourManager.activeFlow.steps.length}
          onNext={tourManager.nextStep}
          onPrevious={tourManager.previousStep}
          onEnd={tourManager.skipTour}
        />
      )}
    </TourManagerContext.Provider>
  );
};