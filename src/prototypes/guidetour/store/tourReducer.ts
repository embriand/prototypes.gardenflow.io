import { TourState, TourAction, TourSettings, TourProgress, TourAnalytics } from '../types/tourManager';

const defaultSettings: TourSettings = {
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
};

const defaultAnalytics: TourAnalytics = {
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
};

const defaultFeedbackStats = {
  totalFeedback: 0,
  averageRating: 0,
  likesCount: 0,
  dislikesCount: 0,
  commentsCount: 0,
  ratingDistribution: {},
  categoryBreakdown: {},
};

const defaultUserProfile = {
  experienceLevel: 'beginner' as const,
  preferredLearningStyle: 'visual' as const,
  completedOnboarding: false,
  feedbackSubmissions: 0,
};

const initialState: TourState = {
  activeFlow: null,
  currentStep: 0,
  isActive: false,
  isPaused: false,
  isMinimized: false,
  showHelp: false,
  flows: [],
  progress: {},
  analytics: defaultAnalytics,
  feedback: [],
  settings: defaultSettings,
  queuedFlows: [],
  activeComponents: new Set(),
  activeFeatures: new Set(),
  feedbackStats: defaultFeedbackStats,
  userProfile: defaultUserProfile,
};

export const tourReducer = (state: TourState, action: TourAction): TourState => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        flows: action.payload.flows,
      };

    case 'START_TOUR': {
      const flow = state.flows.find(f => f.id === action.payload.flowId);
      if (!flow) return state;

      // Check if tour is enabled for this component/feature
      const componentEnabled = state.settings.components[flow.component] !== false;
      const featureEnabled = state.settings.features[flow.feature] !== false;
      const categoryEnabled = state.settings.categories[flow.category] !== false;

      if (!state.settings.enabled || !componentEnabled || !featureEnabled || !categoryEnabled) {
        return state;
      }

      // Check if already completed and should skip
      const progress = state.progress[flow.id];
      if (state.settings.skipCompleted && progress?.completed) {
        return state;
      }

      const newProgress: TourProgress = {
        flowId: flow.id,
        currentStep: 0,
        completed: false,
        skipped: false,
        startedAt: new Date().toISOString(),
        viewCount: (progress?.viewCount || 0) + 1,
        timeSpent: 0,
        stepsSkipped: [],
        helpRequested: [],
        lastViewedAt: new Date().toISOString(),
      };

      // Update analytics
      const newAnalytics = {
        ...state.analytics,
        totalToursStarted: state.analytics.totalToursStarted + 1,
        popularTours: {
          ...state.analytics.popularTours,
          [flow.id]: (state.analytics.popularTours[flow.id] || 0) + 1,
        },
      };

      return {
        ...state,
        activeFlow: flow,
        currentStep: 0,
        isActive: true,
        isPaused: false,
        isMinimized: false,
        progress: {
          ...state.progress,
          [flow.id]: newProgress,
        },
        analytics: newAnalytics,
        queuedFlows: state.queuedFlows.filter(id => id !== flow.id),
      };
    }

    case 'STOP_TOUR':
      return {
        ...state,
        activeFlow: null,
        currentStep: 0,
        isActive: false,
        isPaused: false,
        isMinimized: false,
        showHelp: false,
      };

    case 'PAUSE_TOUR':
      return {
        ...state,
        isPaused: true,
      };

    case 'RESUME_TOUR':
      return {
        ...state,
        isPaused: false,
      };

    case 'MINIMIZE_TOUR':
      return {
        ...state,
        isMinimized: true,
      };

    case 'MAXIMIZE_TOUR':
      return {
        ...state,
        isMinimized: false,
      };

    case 'TOGGLE_HELP':
      const newHelpState = !state.showHelp;
      if (newHelpState && state.activeFlow) {
        // Record help request
        const flowId = state.activeFlow.id;
        const currentProgress = state.progress[flowId];
        if (currentProgress) {
          const updatedProgress = {
            ...currentProgress,
            helpRequested: [...(currentProgress.helpRequested || []), state.currentStep],
          };
          return {
            ...state,
            showHelp: newHelpState,
            progress: {
              ...state.progress,
              [flowId]: updatedProgress,
            },
            analytics: {
              ...state.analytics,
              userEngagement: {
                ...state.analytics.userEngagement,
                helpRequests: state.analytics.userEngagement.helpRequests + 1,
              },
            },
          };
        }
      }
      return {
        ...state,
        showHelp: newHelpState,
      };

    case 'NEXT_STEP': {
      if (!state.activeFlow) return state;

      const nextStep = state.currentStep + 1;
      
      if (nextStep >= state.activeFlow.steps.length) {
        // Tour completed
        const completedProgress: TourProgress = {
          ...state.progress[state.activeFlow.id],
          completed: true,
          completedAt: new Date().toISOString(),
        };

        const newAnalytics = {
          ...state.analytics,
          totalToursCompleted: state.analytics.totalToursCompleted + 1,
        };

        return {
          ...state,
          activeFlow: null,
          currentStep: 0,
          isActive: false,
          isPaused: false,
          isMinimized: false,
          showHelp: false,
          progress: {
            ...state.progress,
            [state.activeFlow.id]: completedProgress,
          },
          analytics: newAnalytics,
        };
      }

      return {
        ...state,
        currentStep: nextStep,
        progress: {
          ...state.progress,
          [state.activeFlow.id]: {
            ...state.progress[state.activeFlow.id],
            currentStep: nextStep,
            lastViewedAt: new Date().toISOString(),
          },
        },
      };
    }

    case 'PREVIOUS_STEP': {
      if (!state.activeFlow || state.currentStep === 0) return state;

      const prevStep = state.currentStep - 1;
      
      const newAnalytics = {
        ...state.analytics,
        userEngagement: {
          ...state.analytics.userEngagement,
          backNavigation: state.analytics.userEngagement.backNavigation + 1,
        },
      };

      return {
        ...state,
        currentStep: prevStep,
        progress: {
          ...state.progress,
          [state.activeFlow.id]: {
            ...state.progress[state.activeFlow.id],
            currentStep: prevStep,
            lastViewedAt: new Date().toISOString(),
          },
        },
        analytics: newAnalytics,
      };
    }

    case 'SKIP_STEP': {
      if (!state.activeFlow) return state;

      const flowId = state.activeFlow.id;
      const currentProgress = state.progress[flowId];
      
      if (currentProgress) {
        const updatedProgress = {
          ...currentProgress,
          stepsSkipped: [...(currentProgress.stepsSkipped || []), state.currentStep],
        };
        
        const stepKey = `${flowId}-${state.currentStep}`;
        const newAnalytics = {
          ...state.analytics,
          mostSkippedSteps: {
            ...state.analytics.mostSkippedSteps,
            [stepKey]: (state.analytics.mostSkippedSteps[stepKey] || 0) + 1,
          },
        };

        const newState = {
          ...state,
          progress: {
            ...state.progress,
            [flowId]: updatedProgress,
          },
          analytics: newAnalytics,
        };

        return tourReducer(newState, { type: 'NEXT_STEP' });
      }
      
      return tourReducer(state, { type: 'NEXT_STEP' });
    }

    case 'SKIP_TOUR': {
      if (!state.activeFlow) return state;

      const skippedProgress: TourProgress = {
        ...state.progress[state.activeFlow.id],
        skipped: true,
        completedAt: new Date().toISOString(),
      };

      return {
        ...state,
        activeFlow: null,
        currentStep: 0,
        isActive: false,
        isPaused: false,
        isMinimized: false,
        showHelp: false,
        queuedFlows: state.queuedFlows.filter(id => id !== state.activeFlow!.id),
        progress: {
          ...state.progress,
          [state.activeFlow.id]: skippedProgress,
        },
      };
    }

    case 'COMPLETE_TOUR': {
      if (!state.activeFlow) return state;

      const completedProgress: TourProgress = {
        ...state.progress[state.activeFlow.id],
        completed: true,
        completedAt: new Date().toISOString(),
      };

      const newAnalytics = {
        ...state.analytics,
        totalToursCompleted: state.analytics.totalToursCompleted + 1,
      };

      return {
        ...state,
        activeFlow: null,
        currentStep: 0,
        isActive: false,
        isPaused: false,
        isMinimized: false,
        showHelp: false,
        progress: {
          ...state.progress,
          [state.activeFlow.id]: completedProgress,
        },
        analytics: newAnalytics,
      };
    }

    case 'RESET_PROGRESS': {
      const { [action.payload.flowId]: removed, ...remainingProgress } = state.progress;
      
      const newAnalytics = {
        ...state.analytics,
        userEngagement: {
          ...state.analytics.userEngagement,
          tourResets: state.analytics.userEngagement.tourResets + 1,
        },
      };

      return {
        ...state,
        progress: remainingProgress,
        analytics: newAnalytics,
      };
    }

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };

    case 'UPDATE_USER_PROFILE':
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          ...action.payload,
        },
      };

    case 'RECORD_ANALYTICS':
      // Handle custom analytics events
      return state;

    case 'SUBMIT_FEEDBACK':
      const newFeedback = action.payload;
      const updatedFeedbackStats = {
        ...state.feedbackStats,
        totalFeedback: state.feedbackStats.totalFeedback + 1,
        likesCount: state.feedbackStats.likesCount + (newFeedback.like ? 1 : 0),
        dislikesCount: state.feedbackStats.dislikesCount + (newFeedback.dislike ? 1 : 0),
        commentsCount: state.feedbackStats.commentsCount + (newFeedback.comment ? 1 : 0),
        ratingDistribution: {
          ...state.feedbackStats.ratingDistribution,
          [newFeedback.rating]: (state.feedbackStats.ratingDistribution[newFeedback.rating] || 0) + 1,
        },
        categoryBreakdown: newFeedback.category ? {
          ...state.feedbackStats.categoryBreakdown,
          [newFeedback.category]: (state.feedbackStats.categoryBreakdown[newFeedback.category] || 0) + 1,
        } : state.feedbackStats.categoryBreakdown,
      };

      // Calculate new average rating
      const allRatings = [...state.feedback, newFeedback].map(f => f.rating);
      const averageRating = allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length;
      updatedFeedbackStats.averageRating = Math.round(averageRating * 100) / 100;

      return {
        ...state,
        feedback: [...state.feedback, newFeedback],
        feedbackStats: updatedFeedbackStats,
        userProfile: {
          ...state.userProfile,
          feedbackSubmissions: state.userProfile.feedbackSubmissions + 1,
        },
      };

    case 'REGISTER_COMPONENT': {
      const newActiveComponents = new Set(state.activeComponents);
      newActiveComponents.add(action.payload.component);
      
      // Auto-start tours for this component if enabled
      const eligibleFlows = state.flows.filter(flow => 
        flow.component === action.payload.component && 
        flow.autoStart &&
        !state.progress[flow.id]?.completed &&
        !state.progress[flow.id]?.skipped
      );

      return {
        ...state,
        activeComponents: newActiveComponents,
        queuedFlows: [
          ...state.queuedFlows,
          ...eligibleFlows.map(f => f.id).filter(id => !state.queuedFlows.includes(id))
        ],
      };
    }

    case 'UNREGISTER_COMPONENT': {
      const newActiveComponents = new Set(state.activeComponents);
      newActiveComponents.delete(action.payload.component);
      return {
        ...state,
        activeComponents: newActiveComponents,
      };
    }

    case 'REGISTER_FEATURE': {
      const newActiveFeatures = new Set(state.activeFeatures);
      newActiveFeatures.add(action.payload.feature);
      return {
        ...state,
        activeFeatures: newActiveFeatures,
      };
    }

    case 'UNREGISTER_FEATURE': {
      const newActiveFeatures = new Set(state.activeFeatures);
      newActiveFeatures.delete(action.payload.feature);
      return {
        ...state,
        activeFeatures: newActiveFeatures,
      };
    }

    case 'QUEUE_TOUR':
      if (state.queuedFlows.includes(action.payload.flowId)) return state;
      return {
        ...state,
        queuedFlows: [...state.queuedFlows, action.payload.flowId],
      };

    case 'DEQUEUE_TOUR':
      return {
        ...state,
        queuedFlows: state.queuedFlows.filter(id => id !== action.payload.flowId),
      };

    case 'LOAD_STATE':
      return {
        ...state,
        ...action.payload,
        analytics: {
          ...defaultAnalytics,
          ...(action.payload.analytics || {}),
        },
        feedback: action.payload.feedback || [],
        feedbackStats: {
          ...defaultFeedbackStats,
          ...(action.payload.feedbackStats || {}),
        },
        userProfile: {
          ...defaultUserProfile,
          ...(action.payload.userProfile || {}),
        },
        activeComponents: new Set(action.payload.activeComponents || []),
        activeFeatures: new Set(action.payload.activeFeatures || []),
      };

    default:
      return state;
  }
};