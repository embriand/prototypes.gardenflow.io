export interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
  showSkip?: boolean;
  component?: string;
  feature?: string;
  delay?: number;
  action?: 'click' | 'hover' | 'input' | 'observe';
}

export interface TourFlow {
  id: string;
  name: string;
  description: string;
  component: string;
  feature: string;
  steps: TourStep[];
  autoStart?: boolean;
  priority?: number;
  prerequisites?: string[];
  category: 'onboarding' | 'feature' | 'update' | 'help';
}

export interface TourProgress {
  flowId: string;
  currentStep: number;
  completed: boolean;
  skipped: boolean;
  startedAt: string;
  completedAt?: string;
  viewCount: number;
  timeSpent?: number;
  stepsSkipped?: number[];
  helpRequested?: number[];
  lastViewedAt?: string;
}

export interface TourSettings {
  enabled: boolean;
  autoStart: boolean;
  showOnUpdate: boolean;
  skipCompleted: boolean;
  showKeyboardShortcuts: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  theme: 'light' | 'dark' | 'auto';
  language: string;
  showProgressDots: boolean;
  enableAnalytics: boolean;
  components: Record<string, boolean>;
  features: Record<string, boolean>;
  categories: Record<string, boolean>;
}

export interface TourAnalytics {
  totalToursStarted: number;
  totalToursCompleted: number;
  averageCompletionTime: number;
  mostSkippedSteps: Record<string, number>;
  popularTours: Record<string, number>;
  userEngagement: {
    helpRequests: number;
    backNavigation: number;
    tourResets: number;
  };
}

export interface TourFeedback {
  flowId: string;
  stepId?: string;
  rating: number;
  like?: boolean;
  dislike?: boolean;
  comment?: string;
  timestamp: string;
  helpful: boolean;
  userId?: string;
  category?: 'bug' | 'suggestion' | 'praise' | 'question';
}

export interface TourState {
  // Current tour state
  activeFlow: TourFlow | null;
  currentStep: number;
  isActive: boolean;
  isPaused: boolean;
  isMinimized: boolean;
  showHelp: boolean;
  
  // Available tours
  flows: TourFlow[];
  
  // Progress tracking
  progress: Record<string, TourProgress>;
  analytics: TourAnalytics;
  feedback: TourFeedback[];
  
  // Settings
  settings: TourSettings;
  
  // Queue management
  queuedFlows: string[];
  
  // Component/feature tracking
  activeComponents: Set<string>;
  activeFeatures: Set<string>;
  
  // User context
  feedbackStats: {
    totalFeedback: number;
    averageRating: number;
    likesCount: number;
    dislikesCount: number;
    commentsCount: number;
    ratingDistribution: Record<number, number>;
    categoryBreakdown: Record<string, number>;
  };
  userProfile: {
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
    preferredLearningStyle: 'visual' | 'text' | 'interactive';
    completedOnboarding: boolean;
    feedbackSubmissions: number;
  };
}

export type TourAction =
  | { type: 'INITIALIZE'; payload: { flows: TourFlow[] } }
  | { type: 'START_TOUR'; payload: { flowId: string } }
  | { type: 'STOP_TOUR' }
  | { type: 'PAUSE_TOUR' }
  | { type: 'RESUME_TOUR' }
  | { type: 'MINIMIZE_TOUR' }
  | { type: 'MAXIMIZE_TOUR' }
  | { type: 'TOGGLE_HELP' }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'SKIP_STEP' }
  | { type: 'SKIP_TOUR' }
  | { type: 'COMPLETE_TOUR' }
  | { type: 'RESET_PROGRESS'; payload: { flowId: string } }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<TourSettings> }
  | { type: 'UPDATE_USER_PROFILE'; payload: Partial<TourState['userProfile']> }
  | { type: 'RECORD_ANALYTICS'; payload: { event: string; data?: any } }
  | { type: 'SUBMIT_FEEDBACK'; payload: TourFeedback }
  | { type: 'REGISTER_COMPONENT'; payload: { component: string } }
  | { type: 'UNREGISTER_COMPONENT'; payload: { component: string } }
  | { type: 'REGISTER_FEATURE'; payload: { feature: string } }
  | { type: 'UNREGISTER_FEATURE'; payload: { feature: string } }
  | { type: 'QUEUE_TOUR'; payload: { flowId: string } }
  | { type: 'DEQUEUE_TOUR'; payload: { flowId: string } }
  | { type: 'LOAD_STATE'; payload: Partial<TourState> };