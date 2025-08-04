import { useState, useEffect, useCallback, useContext, createContext } from 'react';
import { UserPreferences, PreferencesContext } from '../types/preferences';
import { PreferencesStorage, defaultPreferences } from '../utils/preferencesStorage';

const storage = new PreferencesStorage();

const PreferencesContextInstance = createContext<PreferencesContext | null>(null);

export const usePreferences = () => {
  const context = useContext(PreferencesContextInstance);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};

export const usePreferencesProvider = (): PreferencesContext => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const loaded = await storage.load();
        if (loaded) {
          setPreferences(loaded);
        }
      } catch (err) {
        console.error('Failed to load preferences:', err);
        setError('Failed to load preferences');
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  // Listen for external preference changes
  useEffect(() => {
    const handlePreferencesUpdated = (event: CustomEvent) => {
      setPreferences(event.detail);
    };

    const handlePreferencesCleared = () => {
      setPreferences(defaultPreferences);
    };

    window.addEventListener('preferencesUpdated', handlePreferencesUpdated as EventListener);
    window.addEventListener('preferencesCleared', handlePreferencesCleared);

    return () => {
      window.removeEventListener('preferencesUpdated', handlePreferencesUpdated as EventListener);
      window.removeEventListener('preferencesCleared', handlePreferencesCleared);
    };
  }, []);

  // Apply system theme changes
  useEffect(() => {
    if (preferences.appearance.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        // Apply theme without saving to preferences
        document.documentElement.setAttribute(
          'data-theme', 
          mediaQuery.matches ? 'dark' : 'light'
        );
      };

      handleChange(); // Apply initial theme
      mediaQuery.addEventListener('change', handleChange);

      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      document.documentElement.setAttribute('data-theme', preferences.appearance.theme);
    }
  }, [preferences.appearance.theme]);

  // Apply accessibility preferences
  useEffect(() => {
    const root = document.documentElement;
    
    // Reduced motion
    if (preferences.accessibility.reduceMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.style.setProperty('--transition-duration', '0.01ms');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }

    // High contrast
    root.setAttribute('data-high-contrast', preferences.accessibility.highContrast.toString());
    
    // Large text
    root.setAttribute('data-large-text', preferences.accessibility.largeText.toString());
    
    // Font size
    root.setAttribute('data-font-size', preferences.appearance.fontSize);
    
    // Density
    root.setAttribute('data-density', preferences.appearance.density);
  }, [preferences.accessibility, preferences.appearance]);

  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    try {
      setError(null);
      
      const updated = {
        ...preferences,
        ...updates,
        metadata: {
          ...preferences.metadata,
          updatedAt: new Date().toISOString(),
        },
      };

      // Deep merge nested objects
      if (updates.tours) {
        updated.tours = { ...preferences.tours, ...updates.tours };
      }
      if (updates.accessibility) {
        updated.accessibility = { ...preferences.accessibility, ...updates.accessibility };
      }
      if (updates.appearance) {
        updated.appearance = { ...preferences.appearance, ...updates.appearance };
      }
      if (updates.profile) {
        updated.profile = { ...preferences.profile, ...updates.profile };
      }
      if (updates.privacy) {
        updated.privacy = { ...preferences.privacy, ...updates.privacy };
      }

      await storage.save(updated);
      setPreferences(updated);
    } catch (err) {
      console.error('Failed to update preferences:', err);
      setError('Failed to save preferences');
      throw err;
    }
  }, [preferences]);

  const resetPreferences = useCallback(async () => {
    try {
      setError(null);
      await storage.clear();
      setPreferences(defaultPreferences);
    } catch (err) {
      console.error('Failed to reset preferences:', err);
      setError('Failed to reset preferences');
      throw err;
    }
  }, []);

  const exportPreferences = useCallback(async () => {
    try {
      setError(null);
      return await storage.export();
    } catch (err) {
      console.error('Failed to export preferences:', err);
      setError('Failed to export preferences');
      throw err;
    }
  }, []);

  const importPreferences = useCallback(async (data: string) => {
    try {
      setError(null);
      const imported = await storage.import(data);
      setPreferences(imported);
    } catch (err) {
      console.error('Failed to import preferences:', err);
      setError('Failed to import preferences');
      throw err;
    }
  }, []);

  return {
    preferences,
    updatePreferences,
    resetPreferences,
    exportPreferences,
    importPreferences,
    isLoading,
    error,
  };
};

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const preferencesContext = usePreferencesProvider();
  
  return (
    <PreferencesContextInstance.Provider value={preferencesContext}>
      {children}
    </PreferencesContextInstance.Provider>
  );
};