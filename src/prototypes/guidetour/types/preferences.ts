export interface UserPreferences {
  // Tour Settings
  tours: {
    enabled: boolean;
    autoStart: boolean;
    showOnUpdate: boolean;
    skipCompleted: boolean;
    showKeyboardShortcuts: boolean;
    showProgressDots: boolean;
    animationSpeed: 'slow' | 'normal' | 'fast';
    minimizeOnComplete: boolean;
    enableAnalytics: boolean;
  };

  // Accessibility
  accessibility: {
    reduceMotion: boolean;
    highContrast: boolean;
    largeText: boolean;
    screenReaderOptimized: boolean;
    keyboardNavigation: boolean;
    focusIndicators: boolean;
  };

  // Appearance
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    colorScheme: 'default' | 'colorblind' | 'high-contrast';
    fontSize: 'small' | 'medium' | 'large';
    density: 'compact' | 'comfortable' | 'spacious';
  };

  // User Profile
  profile: {
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
    preferredLearningStyle: 'visual' | 'text' | 'interactive';
    completedOnboarding: boolean;
    language: string;
    timezone: string;
  };

  // Component Visibility
  components: {
    [key: string]: boolean;
  };

  // Feature Toggles
  features: {
    [key: string]: boolean;
  };

  // Category Preferences
  categories: {
    [key: string]: boolean;
  };

  // Privacy Settings
  privacy: {
    allowAnalytics: boolean;
    allowCookies: boolean;
    shareUsageData: boolean;
    allowPersonalization: boolean;
  };

  // Metadata
  metadata: {
    version: string;
    createdAt: string;
    updatedAt: string;
    syncedAt?: string;
    deviceId: string;
  };
}

export interface PreferencesStorage {
  save: (preferences: UserPreferences) => Promise<void>;
  load: () => Promise<UserPreferences | null>;
  clear: () => Promise<void>;
  export: () => Promise<string>;
  import: (data: string) => Promise<UserPreferences>;
  sync?: (preferences: UserPreferences) => Promise<void>;
}

export interface PreferencesContext {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => Promise<void>;
  exportPreferences: () => Promise<string>;
  importPreferences: (data: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}