import { UserPreferences } from '../types/preferences';

const STORAGE_KEY = 'garden-user-preferences';
const STORAGE_VERSION = '1.0.0';

// Default preferences
export const defaultPreferences: UserPreferences = {
  tours: {
    enabled: true,
    autoStart: true,
    showOnUpdate: true,
    skipCompleted: true,
    showKeyboardShortcuts: true,
    showProgressDots: true,
    animationSpeed: 'normal',
    minimizeOnComplete: false,
    enableAnalytics: true,
  },
  accessibility: {
    reduceMotion: false,
    highContrast: false,
    largeText: false,
    screenReaderOptimized: false,
    keyboardNavigation: true,
    focusIndicators: true,
  },
  appearance: {
    theme: 'auto',
    colorScheme: 'default',
    fontSize: 'medium',
    density: 'comfortable',
  },
  profile: {
    experienceLevel: 'beginner',
    preferredLearningStyle: 'visual',
    completedOnboarding: false,
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  components: {},
  features: {},
  categories: {
    onboarding: true,
    feature: true,
    update: true,
    help: true,
  },
  privacy: {
    allowAnalytics: true,
    allowCookies: true,
    shareUsageData: false,
    allowPersonalization: true,
  },
  metadata: {
    version: STORAGE_VERSION,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deviceId: generateDeviceId(),
  },
};

function generateDeviceId(): string {
  return 'device_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

// Detect user preferences from system
function detectSystemPreferences(): Partial<UserPreferences> {
  const preferences: Partial<UserPreferences> = {};

  // Detect theme preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    preferences.appearance = { ...defaultPreferences.appearance, theme: 'dark' };
  }

  // Detect reduced motion preference
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    preferences.accessibility = { ...defaultPreferences.accessibility, reduceMotion: true };
    preferences.tours = { ...defaultPreferences.tours, animationSpeed: 'slow' };
  }

  // Detect high contrast preference
  if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
    preferences.accessibility = { ...defaultPreferences.accessibility, highContrast: true };
  }

  // Detect language preference
  const language = navigator.language.split('-')[0];
  preferences.profile = { ...defaultPreferences.profile, language };

  return preferences;
}

// Merge preferences with validation
function mergePreferences(stored: any, defaults: UserPreferences): UserPreferences {
  const systemPrefs = detectSystemPreferences();
  
  // Deep merge with validation
  const merged = {
    ...defaults,
    ...systemPrefs,
    ...stored,
    metadata: {
      ...defaults.metadata,
      ...stored?.metadata,
      updatedAt: new Date().toISOString(),
    },
  };

  // Validate and sanitize
  return validatePreferences(merged);
}

function validatePreferences(prefs: any): UserPreferences {
  // Ensure all required fields exist with proper types
  const validated: UserPreferences = {
    tours: {
      enabled: Boolean(prefs.tours?.enabled ?? defaultPreferences.tours.enabled),
      autoStart: Boolean(prefs.tours?.autoStart ?? defaultPreferences.tours.autoStart),
      showOnUpdate: Boolean(prefs.tours?.showOnUpdate ?? defaultPreferences.tours.showOnUpdate),
      skipCompleted: Boolean(prefs.tours?.skipCompleted ?? defaultPreferences.tours.skipCompleted),
      showKeyboardShortcuts: Boolean(prefs.tours?.showKeyboardShortcuts ?? defaultPreferences.tours.showKeyboardShortcuts),
      showProgressDots: Boolean(prefs.tours?.showProgressDots ?? defaultPreferences.tours.showProgressDots),
      animationSpeed: ['slow', 'normal', 'fast'].includes(prefs.tours?.animationSpeed) 
        ? prefs.tours.animationSpeed 
        : defaultPreferences.tours.animationSpeed,
      minimizeOnComplete: Boolean(prefs.tours?.minimizeOnComplete ?? defaultPreferences.tours.minimizeOnComplete),
      enableAnalytics: Boolean(prefs.tours?.enableAnalytics ?? defaultPreferences.tours.enableAnalytics),
    },
    accessibility: {
      reduceMotion: Boolean(prefs.accessibility?.reduceMotion ?? defaultPreferences.accessibility.reduceMotion),
      highContrast: Boolean(prefs.accessibility?.highContrast ?? defaultPreferences.accessibility.highContrast),
      largeText: Boolean(prefs.accessibility?.largeText ?? defaultPreferences.accessibility.largeText),
      screenReaderOptimized: Boolean(prefs.accessibility?.screenReaderOptimized ?? defaultPreferences.accessibility.screenReaderOptimized),
      keyboardNavigation: Boolean(prefs.accessibility?.keyboardNavigation ?? defaultPreferences.accessibility.keyboardNavigation),
      focusIndicators: Boolean(prefs.accessibility?.focusIndicators ?? defaultPreferences.accessibility.focusIndicators),
    },
    appearance: {
      theme: ['light', 'dark', 'auto'].includes(prefs.appearance?.theme) 
        ? prefs.appearance.theme 
        : defaultPreferences.appearance.theme,
      colorScheme: ['default', 'colorblind', 'high-contrast'].includes(prefs.appearance?.colorScheme)
        ? prefs.appearance.colorScheme
        : defaultPreferences.appearance.colorScheme,
      fontSize: ['small', 'medium', 'large'].includes(prefs.appearance?.fontSize)
        ? prefs.appearance.fontSize
        : defaultPreferences.appearance.fontSize,
      density: ['compact', 'comfortable', 'spacious'].includes(prefs.appearance?.density)
        ? prefs.appearance.density
        : defaultPreferences.appearance.density,
    },
    profile: {
      experienceLevel: ['beginner', 'intermediate', 'advanced'].includes(prefs.profile?.experienceLevel)
        ? prefs.profile.experienceLevel
        : defaultPreferences.profile.experienceLevel,
      preferredLearningStyle: ['visual', 'text', 'interactive'].includes(prefs.profile?.preferredLearningStyle)
        ? prefs.profile.preferredLearningStyle
        : defaultPreferences.profile.preferredLearningStyle,
      completedOnboarding: Boolean(prefs.profile?.completedOnboarding ?? defaultPreferences.profile.completedOnboarding),
      language: typeof prefs.profile?.language === 'string' 
        ? prefs.profile.language 
        : defaultPreferences.profile.language,
      timezone: typeof prefs.profile?.timezone === 'string'
        ? prefs.profile.timezone
        : defaultPreferences.profile.timezone,
    },
    components: prefs.components && typeof prefs.components === 'object' ? prefs.components : {},
    features: prefs.features && typeof prefs.features === 'object' ? prefs.features : {},
    categories: {
      ...defaultPreferences.categories,
      ...(prefs.categories && typeof prefs.categories === 'object' ? prefs.categories : {}),
    },
    privacy: {
      allowAnalytics: Boolean(prefs.privacy?.allowAnalytics ?? defaultPreferences.privacy.allowAnalytics),
      allowCookies: Boolean(prefs.privacy?.allowCookies ?? defaultPreferences.privacy.allowCookies),
      shareUsageData: Boolean(prefs.privacy?.shareUsageData ?? defaultPreferences.privacy.shareUsageData),
      allowPersonalization: Boolean(prefs.privacy?.allowPersonalization ?? defaultPreferences.privacy.allowPersonalization),
    },
    metadata: {
      version: typeof prefs.metadata?.version === 'string' ? prefs.metadata.version : STORAGE_VERSION,
      createdAt: typeof prefs.metadata?.createdAt === 'string' ? prefs.metadata.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncedAt: typeof prefs.metadata?.syncedAt === 'string' ? prefs.metadata.syncedAt : undefined,
      deviceId: typeof prefs.metadata?.deviceId === 'string' ? prefs.metadata.deviceId : generateDeviceId(),
    },
  };

  return validated;
}

// Storage implementation
export class PreferencesStorage {
  private storageKey: string;

  constructor(key: string = STORAGE_KEY) {
    this.storageKey = key;
  }

  async save(preferences: UserPreferences): Promise<void> {
    try {
      const toSave = {
        ...preferences,
        metadata: {
          ...preferences.metadata,
          updatedAt: new Date().toISOString(),
        },
      };

      // Save to localStorage
      localStorage.setItem(this.storageKey, JSON.stringify(toSave));

      // Also save to IndexedDB for larger storage and better performance
      if ('indexedDB' in window) {
        await this.saveToIndexedDB(toSave);
      }

      // Dispatch custom event for other components to listen
      window.dispatchEvent(new CustomEvent('preferencesUpdated', { 
        detail: toSave 
      }));

    } catch (error) {
      console.error('Failed to save preferences:', error);
      throw new Error('Failed to save preferences');
    }
  }

  async load(): Promise<UserPreferences | null> {
    try {
      // Try IndexedDB first, then localStorage
      let stored = null;
      
      if ('indexedDB' in window) {
        stored = await this.loadFromIndexedDB();
      }
      
      if (!stored) {
        const localData = localStorage.getItem(this.storageKey);
        stored = localData ? JSON.parse(localData) : null;
      }

      if (!stored) {
        return null;
      }

      return mergePreferences(stored, defaultPreferences);
    } catch (error) {
      console.error('Failed to load preferences:', error);
      return null;
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.removeItem(this.storageKey);
      
      if ('indexedDB' in window) {
        await this.clearIndexedDB();
      }

      window.dispatchEvent(new CustomEvent('preferencesCleared'));
    } catch (error) {
      console.error('Failed to clear preferences:', error);
      throw new Error('Failed to clear preferences');
    }
  }

  async export(): Promise<string> {
    const preferences = await this.load();
    if (!preferences) {
      throw new Error('No preferences to export');
    }

    const exportData = {
      ...preferences,
      metadata: {
        ...preferences.metadata,
        exportedAt: new Date().toISOString(),
      },
    };

    return JSON.stringify(exportData, null, 2);
  }

  async import(data: string): Promise<UserPreferences> {
    try {
      const parsed = JSON.parse(data);
      const validated = validatePreferences(parsed);
      await this.save(validated);
      return validated;
    } catch (error) {
      console.error('Failed to import preferences:', error);
      throw new Error('Invalid preferences data');
    }
  }

  private async saveToIndexedDB(preferences: UserPreferences): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('GardenPreferences', 1);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['preferences'], 'readwrite');
        const store = transaction.objectStore('preferences');
        
        store.put(preferences, 'user-preferences');
        
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      };
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('preferences')) {
          db.createObjectStore('preferences');
        }
      };
    });
  }

  private async loadFromIndexedDB(): Promise<UserPreferences | null> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('GardenPreferences', 1);
      
      request.onerror = () => resolve(null); // Fallback to localStorage
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['preferences'], 'readonly');
        const store = transaction.objectStore('preferences');
        const getRequest = store.get('user-preferences');
        
        getRequest.onsuccess = () => resolve(getRequest.result || null);
        getRequest.onerror = () => resolve(null);
      };
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('preferences')) {
          db.createObjectStore('preferences');
        }
      };
    });
  }

  private async clearIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('GardenPreferences', 1);
      
      request.onerror = () => resolve(); // Don't fail if IndexedDB unavailable
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['preferences'], 'readwrite');
        const store = transaction.objectStore('preferences');
        
        store.delete('user-preferences');
        
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => resolve(); // Don't fail
      };
    });
  }
}