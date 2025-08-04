import { useState, useCallback, useEffect } from 'react';
import { TutorialFlow, TutorialStep, TutorialProgress, TutorialContextState } from '../types/tutorial';
import { tutorialFlows } from '../data/tutorialFlows';

export const useGuideTour = () => {
  const [state, setState] = useState<TutorialContextState>({
    activeFlow: null,
    currentStep: 0,
    isActive: false,
    canSkip: true,
    progress: [],
    availableFlows: tutorialFlows,
  });

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('garden-tutorial-progress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setState(prev => ({ ...prev, progress }));
      } catch (error) {
        console.error('Failed to load tutorial progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = useCallback((progress: TutorialProgress[]) => {
    localStorage.setItem('garden-tutorial-progress', JSON.stringify(progress));
  }, []);

  const startTutorial = useCallback((flowId: string) => {
    const flow = tutorialFlows.find(f => f.id === flowId);
    if (!flow) return;

    setState(prev => ({
      ...prev,
      activeFlow: flow,
      currentStep: 0,
      isActive: true,
    }));

    // Update progress
    const newProgress = [...state.progress];
    const existingIndex = newProgress.findIndex(p => p.flowId === flowId);
    
    if (existingIndex >= 0) {
      newProgress[existingIndex] = {
        ...newProgress[existingIndex],
        currentStep: 0,
        startedAt: new Date(),
        completed: false,
        skipped: false,
      };
    } else {
      newProgress.push({
        flowId,
        currentStep: 0,
        completed: false,
        startedAt: new Date(),
      });
    }

    setState(prev => ({ ...prev, progress: newProgress }));
    saveProgress(newProgress);
  }, [state.progress, saveProgress]);

  const nextStep = useCallback(() => {
    if (!state.activeFlow) return;

    const nextStepIndex = state.currentStep + 1;
    
    if (nextStepIndex >= state.activeFlow.steps.length) {
      // Tutorial completed
      completeTutorial();
      return;
    }

    setState(prev => ({
      ...prev,
      currentStep: nextStepIndex,
    }));

    // Update progress
    const newProgress = [...state.progress];
    const progressIndex = newProgress.findIndex(p => p.flowId === state.activeFlow!.id);
    
    if (progressIndex >= 0) {
      newProgress[progressIndex].currentStep = nextStepIndex;
    }

    setState(prev => ({ ...prev, progress: newProgress }));
    saveProgress(newProgress);
  }, [state.activeFlow, state.currentStep, state.progress, saveProgress]);

  const previousStep = useCallback(() => {
    if (!state.activeFlow || state.currentStep === 0) return;

    const prevStepIndex = state.currentStep - 1;
    
    setState(prev => ({
      ...prev,
      currentStep: prevStepIndex,
    }));

    // Update progress
    const newProgress = [...state.progress];
    const progressIndex = newProgress.findIndex(p => p.flowId === state.activeFlow!.id);
    
    if (progressIndex >= 0) {
      newProgress[progressIndex].currentStep = prevStepIndex;
    }

    setState(prev => ({ ...prev, progress: newProgress }));
    saveProgress(newProgress);
  }, [state.activeFlow, state.currentStep, state.progress, saveProgress]);

  const skipStep = useCallback(() => {
    nextStep();
  }, [nextStep]);

  const completeTutorial = useCallback(() => {
    if (!state.activeFlow) return;

    const newProgress = [...state.progress];
    const progressIndex = newProgress.findIndex(p => p.flowId === state.activeFlow!.id);
    
    if (progressIndex >= 0) {
      newProgress[progressIndex] = {
        ...newProgress[progressIndex],
        completed: true,
        completedAt: new Date(),
      };
    }

    setState(prev => ({
      ...prev,
      activeFlow: null,
      currentStep: 0,
      isActive: false,
      progress: newProgress,
    }));

    saveProgress(newProgress);
  }, [state.activeFlow, state.progress, saveProgress]);

  const skipTutorial = useCallback(() => {
    if (!state.activeFlow) return;

    const newProgress = [...state.progress];
    const progressIndex = newProgress.findIndex(p => p.flowId === state.activeFlow!.id);
    
    if (progressIndex >= 0) {
      newProgress[progressIndex] = {
        ...newProgress[progressIndex],
        skipped: true,
        completedAt: new Date(),
      };
    }

    setState(prev => ({
      ...prev,
      activeFlow: null,
      currentStep: 0,
      isActive: false,
      progress: newProgress,
    }));

    saveProgress(newProgress);
  }, [state.activeFlow, state.progress, saveProgress]);

  const resumeTutorial = useCallback((flowId: string) => {
    const flow = tutorialFlows.find(f => f.id === flowId);
    const progress = state.progress.find(p => p.flowId === flowId);
    
    if (!flow || !progress) return;

    setState(prev => ({
      ...prev,
      activeFlow: flow,
      currentStep: progress.currentStep,
      isActive: true,
    }));
  }, [state.progress]);

  const resetTutorial = useCallback((flowId: string) => {
    const newProgress = state.progress.filter(p => p.flowId !== flowId);
    setState(prev => ({ ...prev, progress: newProgress }));
    saveProgress(newProgress);
  }, [state.progress, saveProgress]);

  const getCurrentStep = useCallback((): TutorialStep | null => {
    if (!state.activeFlow || !state.isActive) return null;
    return state.activeFlow.steps[state.currentStep] || null;
  }, [state.activeFlow, state.currentStep, state.isActive]);

  const getFlowProgress = useCallback((flowId: string) => {
    return state.progress.find(p => p.flowId === flowId);
  }, [state.progress]);

  const isFlowCompleted = useCallback((flowId: string) => {
    const progress = getFlowProgress(flowId);
    return progress?.completed || false;
  }, [getFlowProgress]);

  const getCompletionPercentage = useCallback((flowId: string) => {
    const flow = tutorialFlows.find(f => f.id === flowId);
    const progress = getFlowProgress(flowId);
    
    if (!flow || !progress) return 0;
    if (progress.completed) return 100;
    
    return Math.round((progress.currentStep / flow.steps.length) * 100);
  }, [getFlowProgress]);

  return {
    ...state,
    startTutorial,
    nextStep,
    previousStep,
    skipStep,
    skipTutorial,
    completeTutorial,
    resumeTutorial,
    resetTutorial,
    getCurrentStep,
    getFlowProgress,
    isFlowCompleted,
    getCompletionPercentage,
  };
};