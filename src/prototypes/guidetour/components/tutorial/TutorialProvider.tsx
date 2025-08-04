import React, { createContext, useContext } from 'react';
import { useGuideTour } from '../../hooks/useGuideTour';
import { TutorialOverlay } from './TutorialOverlay';
import { TutorialContextState } from '../../types/tutorial';

interface TutorialContextValue extends TutorialContextState {
  startTutorial: (flowId: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  skipStep: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  resumeTutorial: (flowId: string) => void;
  resetTutorial: (flowId: string) => void;
  getCurrentStep: () => any;
  getFlowProgress: (flowId: string) => any;
  isFlowCompleted: (flowId: string) => boolean;
  getCompletionPercentage: (flowId: string) => number;
}

const TutorialContext = createContext<TutorialContextValue | null>(null);

export const useTutorialContext = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorialContext must be used within a TutorialProvider');
  }
  return context;
};

interface TutorialProviderProps {
  children: React.ReactNode;
}

export const TutorialProvider: React.FC<TutorialProviderProps> = ({ children }) => {
  const tutorial = useGuideTour();
  const currentStep = tutorial.getCurrentStep();

  return (
    <TutorialContext.Provider value={tutorial}>
      {children}
      
      {/* Render tutorial overlay when active */}
      {tutorial.isActive && tutorial.activeFlow && currentStep && (
        <TutorialOverlay
          step={currentStep}
          currentStepIndex={tutorial.currentStep}
          totalSteps={tutorial.activeFlow.steps.length}
          onNext={tutorial.nextStep}
          onPrevious={tutorial.previousStep}
          onSkip={tutorial.skipStep}
          onClose={tutorial.skipTutorial}
          canGoBack={tutorial.currentStep > 0}
          flowName={tutorial.activeFlow.name}
        />
      )}
    </TutorialContext.Provider>
  );
};