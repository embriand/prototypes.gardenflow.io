import { useState, useCallback } from 'react';
import { TourStep, TourState } from '../types/tour';

export const useTour = (steps: TourStep[]) => {
  const [state, setState] = useState<TourState>({
    isActive: false,
    currentStep: 0,
    steps,
  });

  const startTour = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: true,
      currentStep: 0,
    }));
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => {
      if (prev.currentStep >= prev.steps.length - 1) {
        return { ...prev, isActive: false, currentStep: 0 };
      }
      return { ...prev, currentStep: prev.currentStep + 1 };
    });
  }, []);

  const previousStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1),
    }));
  }, []);

  const endTour = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false,
      currentStep: 0,
    }));
  }, []);

  const getCurrentStep = useCallback(() => {
    return state.steps[state.currentStep] || null;
  }, [state.currentStep, state.steps]);

  return {
    ...state,
    startTour,
    nextStep,
    previousStep,
    endTour,
    getCurrentStep,
  };
};