import { useReducer, useEffect, useCallback, useMemo } from 'react';
import { tourReducer } from '../store/tourReducer';
import { TourState, TourAction, TourFlow, TourSettings } from '../types/tourManager';

const STORAGE_KEY = 'garden-tour-manager';

const initialState: TourState = {
  activeFlow: null,
  currentStep: 0,
  isActive: false,
  isPaused: false,
  isMinimized: false,
  showHelp: false,
  flows: [],
  progress: {},
  analytics: {
    totalToursStarted: 0,
    totalToursCompleted: 0,
    averageCompletionTime: 0,
    mostSkippedSteps: {},
    popularTours: {},
    userEngagement: {
      helpRequests: 0,
      backNavigation: 0,
      tourResets: 0,
    },
  },
  feedback: [],
  settings: {
    enabled: true,
    autoStart: true,
    showOnUpdate: true,
    skipCompleted: true,
    showKeyboardShortcuts: true,
    animationSpeed: 'normal',
    theme: 'auto',
    language: 'en',
    showProgressDots: true,
    enableAnalytics: true,
    components: {},
    features: {},
    categories: {
      onboarding: true,
      feature: true,
      update: true,
      help: true,
    },
  },
  queuedFlows: [],
  activeComponents: new Set(),
  activeFeatures: new Set(),
  feedbackStats: {
    totalFeedback: 0,
    averageRating: 0,
    likesCount: 0,
    dislikesCount: 0,
    commentsCount: 0,
    ratingDistribution: {},
    categoryBreakdown: {},
  },
  userProfile: {
    experienceLevel: 'beginner',
    preferredLearningStyle: 'visual',
    completedOnboarding: false,
    feedbackSubmissions: 0,
  },
};

export const useTourManager = (flows: TourFlow[] = []) => {
  const [state, dispatch] = useReducer(tourReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      } catch (error) {
        console.error('Failed to load tour state:', error);
      }
    }
  }, []);

  // Initialize flows separately to avoid unnecessary re-runs
  useEffect(() => {
    if (flows.length > 0) {
      dispatch({ type: 'INITIALIZE', payload: { flows } });
    }
  }, [flows]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      progress: state.progress,
      settings: state.settings,
      queuedFlows: state.queuedFlows,
      feedback: state.feedback,
      feedbackStats: state.feedbackStats,
      analytics: state.analytics,
      userProfile: state.userProfile,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [state.progress, state.settings, state.queuedFlows, state.feedback, state.feedbackStats, state.analytics, state.userProfile]);

  // Auto-start queued tours
  useEffect(() => {
    if (!state.isActive && state.queuedFlows.length > 0 && state.settings.autoStart) {
      const nextFlowId = state.queuedFlows[0];
      const flow = state.flows.find(f => f.id === nextFlowId);
      
      if (flow) {
        // Check if tour was skipped and should not auto-restart
        const progress = state.progress[nextFlowId];
        if (progress?.skipped && state.settings.skipCompleted) {
          dispatch({ type: 'DEQUEUE_TOUR', payload: { flowId: nextFlowId } });
          return;
        }

        // Check prerequisites
        const prerequisitesMet = flow.prerequisites?.every(prereqId => 
          state.progress[prereqId]?.completed
        ) ?? true;

        if (prerequisitesMet) {
          dispatch({ type: 'START_TOUR', payload: { flowId: nextFlowId } });
        } else {
          // Remove from queue if prerequisites not met
          dispatch({ type: 'DEQUEUE_TOUR', payload: { flowId: nextFlowId } });
        }
      }
    }
  }, [state.queuedFlows, state.isActive, state.settings.autoStart, state.flows, state.progress]);

  // Actions
  const startTour = useCallback((flowId: string) => {
    dispatch({ type: 'START_TOUR', payload: { flowId } });
  }, []);

  const stopTour = useCallback(() => {
    dispatch({ type: 'STOP_TOUR' });
  }, []);

  const pauseTour = useCallback(() => {
    dispatch({ type: 'PAUSE_TOUR' });
  }, []);

  const resumeTour = useCallback(() => {
    dispatch({ type: 'RESUME_TOUR' });
  }, []);

  const nextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' });
  }, []);

  const previousStep = useCallback(() => {
    dispatch({ type: 'PREVIOUS_STEP' });
  }, []);

  const skipStep = useCallback(() => {
    dispatch({ type: 'SKIP_STEP' });
  }, []);

  const skipTour = useCallback(() => {
    dispatch({ type: 'SKIP_TOUR' });
  }, []);

  const completeTour = useCallback(() => {
    dispatch({ type: 'COMPLETE_TOUR' });
  }, []);

  const resetProgress = useCallback((flowId: string) => {
    dispatch({ type: 'RESET_PROGRESS', payload: { flowId } });
  }, []);

  const updateSettings = useCallback((settings: Partial<TourSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);

  const registerComponent = useCallback((component: string) => {
    dispatch({ type: 'REGISTER_COMPONENT', payload: { component } });
  }, []);

  const unregisterComponent = useCallback((component: string) => {
    dispatch({ type: 'UNREGISTER_COMPONENT', payload: { component } });
  }, []);

  const registerFeature = useCallback((feature: string) => {
    dispatch({ type: 'REGISTER_FEATURE', payload: { feature } });
  }, []);

  const unregisterFeature = useCallback((feature: string) => {
    dispatch({ type: 'UNREGISTER_FEATURE', payload: { feature } });
  }, []);

  const queueTour = useCallback((flowId: string) => {
    dispatch({ type: 'QUEUE_TOUR', payload: { flowId } });
  }, []);

  const dequeueTour = useCallback((flowId: string) => {
    dispatch({ type: 'DEQUEUE_TOUR', payload: { flowId } });
  }, []);

  // Utility functions
  const getCurrentStep = useCallback(() => {
    if (!state.activeFlow || !state.isActive) return null;
    return state.activeFlow.steps[state.currentStep] || null;
  }, [state.activeFlow, state.currentStep, state.isActive]);

  const getFlowProgress = useCallback((flowId: string) => {
    return state.progress[flowId] || null;
  }, [state.progress]);

  const isFlowCompleted = useCallback((flowId: string) => {
    return state.progress[flowId]?.completed || false;
  }, [state.progress]);

  const isFlowSkipped = useCallback((flowId: string) => {
    return state.progress[flowId]?.skipped || false;
  }, [state.progress]);

  const getCompletionPercentage = useCallback((flowId: string) => {
    const flow = state.flows.find(f => f.id === flowId);
    const progress = state.progress[flowId];
    
    if (!flow || !progress) return 0;
    if (progress.completed) return 100;
    
    return Math.round((progress.currentStep / flow.steps.length) * 100);
  }, [state.flows, state.progress]);

  const getAvailableFlows = useCallback((component?: string, feature?: string) => {
    return state.flows.filter(flow => {
      if (component && flow.component !== component) return false;
      if (feature && flow.feature !== feature) return false;
      
      const componentEnabled = state.settings.components[flow.component] !== false;
      const featureEnabled = state.settings.features[flow.feature] !== false;
      const categoryEnabled = state.settings.categories[flow.category] !== false;
      
      return componentEnabled && featureEnabled && categoryEnabled;
    });
  }, [state.flows, state.settings]);

  const enableComponent = useCallback((component: string, enabled: boolean = true) => {
    updateSettings({
      components: {
        ...state.settings.components,
        [component]: enabled,
      },
    });
  }, [state.settings.components, updateSettings]);

  const enableFeature = useCallback((feature: string, enabled: boolean = true) => {
    updateSettings({
      features: {
        ...state.settings.features,
        [feature]: enabled,
      },
    });
  }, [state.settings.features, updateSettings]);

  const enableCategory = useCallback((category: string, enabled: boolean = true) => {
    updateSettings({
      categories: {
        ...state.settings.categories,
        [category]: enabled,
      },
    });
  }, [state.settings.categories, updateSettings]);

  const updateUserProfile = useCallback((updates: any) => {
    dispatch({ type: 'UPDATE_USER_PROFILE', payload: updates });
  }, []);

  const submitFeedback = useCallback((feedback: any) => {
    dispatch({ type: 'SUBMIT_FEEDBACK', payload: feedback });
  }, []);

  const getFeedbackStats = useCallback(() => {
    return state.feedbackStats;
  }, [state.feedbackStats]);

  const getTourFeedback = useCallback((flowId: string) => {
    return state.feedback.filter(f => f.flowId === flowId);
  }, [state.feedback]);

  // Expose dispatch for components that need direct access
  const dispatchAction = useCallback((action: TourAction) => {
    dispatch(action);
  }, []);

  return useMemo(() => ({
    // State
    ...state,
    
    // Actions
    startTour,
    stopTour,
    pauseTour,
    resumeTour,
    nextStep,
    previousStep,
    skipStep,
    skipTour,
    completeTour,
    resetProgress,
    updateSettings,
    updateUserProfile,
    registerComponent,
    unregisterComponent,
    registerFeature,
    unregisterFeature,
    queueTour,
    dequeueTour,
    dispatch: dispatchAction,
    
    // Utilities
    getCurrentStep,
    getFlowProgress,
    isFlowCompleted,
    isFlowSkipped,
    getCompletionPercentage,
    getAvailableFlows,
    enableComponent,
    enableFeature,
    enableCategory,
    submitFeedback,
    getFeedbackStats,
    getTourFeedback,
  }), [
    state,
    startTour,
    stopTour,
    pauseTour,
    resumeTour,
    nextStep,
    previousStep,
    skipStep,
    skipTour,
    completeTour,
    resetProgress,
    updateSettings,
    updateUserProfile,
    registerComponent,
    unregisterComponent,
    registerFeature,
    unregisterFeature,
    queueTour,
    dequeueTour,
    dispatchAction,
    getCurrentStep,
    getFlowProgress,
    isFlowCompleted,
    isFlowSkipped,
    getCompletionPercentage,
    getAvailableFlows,
    enableComponent,
    enableFeature,
    enableCategory,
    submitFeedback,
    getFeedbackStats,
    getTourFeedback,
  ]);
};