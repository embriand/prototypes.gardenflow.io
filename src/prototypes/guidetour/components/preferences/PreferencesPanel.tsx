import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Eye, 
  Palette, 
  Shield, 
  Download, 
  Upload, 
  RotateCcw,
  X,
  Check,
  AlertCircle,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { usePreferences } from '../../hooks/usePreferences';

interface PreferencesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PreferencesPanel: React.FC<PreferencesPanelProps> = ({ isOpen, onClose }) => {
  const { preferences, updatePreferences, resetPreferences, exportPreferences, importPreferences, isLoading, error } = usePreferences();
  const [activeTab, setActiveTab] = useState<'tours' | 'accessibility' | 'appearance' | 'profile' | 'privacy'>('tours');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importData, setImportData] = useState('');
  const [showImport, setShowImport] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      const data = await exportPreferences();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `garden-preferences-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleImport = async () => {
    try {
      await importPreferences(importData);
      setShowImport(false);
      setImportData('');
    } catch (err) {
      console.error('Import failed:', err);
    }
  };

  const handleReset = async () => {
    try {
      await resetPreferences();
      setShowResetConfirm(false);
    } catch (err) {
      console.error('Reset failed:', err);
    }
  };

  const tabs = [
    { id: 'tours', label: 'Tours', icon: Settings },
    { id: 'accessibility', label: 'Accessibility', icon: Eye },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">User Preferences</h2>
              <p className="text-sm text-gray-600 mt-1">Customize your experience</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white/50 rounded-xl"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="mt-8 space-y-2">
              <button
                onClick={handleExport}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Settings</span>
              </button>
              
              <button
                onClick={() => setShowImport(true)}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Import Settings</span>
              </button>
              
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset All</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            {activeTab === 'tours' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Tour Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Enable Tours</span>
                      <input
                        type="checkbox"
                        checked={preferences.tours.enabled}
                        onChange={(e) => updatePreferences({ tours: { ...preferences.tours, enabled: e.target.checked } })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Auto Start Tours</span>
                      <input
                        type="checkbox"
                        checked={preferences.tours.autoStart}
                        onChange={(e) => updatePreferences({ tours: { ...preferences.tours, autoStart: e.target.checked } })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Show Keyboard Shortcuts</span>
                      <input
                        type="checkbox"
                        checked={preferences.tours.showKeyboardShortcuts}
                        onChange={(e) => updatePreferences({ tours: { ...preferences.tours, showKeyboardShortcuts: e.target.checked } })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Show Progress Dots</span>
                      <input
                        type="checkbox"
                        checked={preferences.tours.showProgressDots}
                        onChange={(e) => updatePreferences({ tours: { ...preferences.tours, showProgressDots: e.target.checked } })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Animation Speed</label>
                      <select
                        value={preferences.tours.animationSpeed}
                        onChange={(e) => updatePreferences({ tours: { ...preferences.tours, animationSpeed: e.target.value as any } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="slow">Slow</option>
                        <option value="normal">Normal</option>
                        <option value="fast">Fast</option>
                      </select>
                    </div>

                    <label className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Skip Completed Tours</span>
                      <input
                        type="checkbox"
                        checked={preferences.tours.skipCompleted}
                        onChange={(e) => updatePreferences({ tours: { ...preferences.tours, skipCompleted: e.target.checked } })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Minimize on Complete</span>
                      <input
                        type="checkbox"
                        checked={preferences.tours.minimizeOnComplete}
                        onChange={(e) => updatePreferences({ tours: { ...preferences.tours, minimizeOnComplete: e.target.checked } })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'accessibility' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Accessibility Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Reduce Motion</span>
                      <input
                        type="checkbox"
                        checked={preferences.accessibility.reduceMotion}
                        onChange={(e) => updatePreferences({ accessibility: { ...preferences.accessibility, reduceMotion: e.target.checked } })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">High Contrast</span>
                      <input
                        type="checkbox"
                        checked={preferences.accessibility.highContrast}
                        onChange={(e) => updatePreferences({ accessibility: { ...preferences.accessibility, highContrast: e.target.checked } })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Large Text</span>
                      <input
                        type="checkbox"
                        checked={preferences.accessibility.largeText}
                        onChange={(e) => updatePreferences({ accessibility: { ...preferences.accessibility, largeText: e.target.checked } })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Screen Reader Optimized</span>
                      <input
                        type="checkbox"
                        checked={preferences.accessibility.screenReaderOptimized}
                        onChange={(e) => updatePreferences({ accessibility: { ...preferences.accessibility, screenReaderOptimized: e.target.checked } })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Keyboard Navigation</span>
                      <input
                        type="checkbox"
                        checked={preferences.accessibility.keyboardNavigation}
                        onChange={(e) => updatePreferences({ accessibility: { ...preferences.accessibility, keyboardNavigation: e.target.checked } })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Focus Indicators</span>
                      <input
                        type="checkbox"
                        checked={preferences.accessibility.focusIndicators}
                        onChange={(e) => updatePreferences({ accessibility: { ...preferences.accessibility, focusIndicators: e.target.checked } })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Appearance Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'light', label: 'Light', icon: Sun },
                          { value: 'dark', label: 'Dark', icon: Moon },
                          { value: 'auto', label: 'Auto', icon: Monitor },
                        ].map(({ value, label, icon: Icon }) => (
                          <button
                            key={value}
                            onClick={() => updatePreferences({ appearance: { ...preferences.appearance, theme: value as any } })}
                            className={`flex flex-col items-center space-y-2 p-3 rounded-xl border-2 transition-all ${
                              preferences.appearance.theme === value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="text-xs font-medium">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                      <select
                        value={preferences.appearance.fontSize}
                        onChange={(e) => updatePreferences({ appearance: { ...preferences.appearance, fontSize: e.target.value as any } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Color Scheme</label>
                      <select
                        value={preferences.appearance.colorScheme}
                        onChange={(e) => updatePreferences({ appearance: { ...preferences.appearance, colorScheme: e.target.value as any } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="default">Default</option>
                        <option value="colorblind">Colorblind Friendly</option>
                        <option value="high-contrast">High Contrast</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Density</label>
                      <select
                        value={preferences.appearance.density}
                        onChange={(e) => updatePreferences({ appearance: { ...preferences.appearance, density: e.target.value as any } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="compact">Compact</option>
                        <option value="comfortable">Comfortable</option>
                        <option value="spacious">Spacious</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Profile Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                      <select
                        value={preferences.profile.experienceLevel}
                        onChange={(e) => updatePreferences({ profile: { ...preferences.profile, experienceLevel: e.target.value as any } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Learning Style</label>
                      <select
                        value={preferences.profile.preferredLearningStyle}
                        onChange={(e) => updatePreferences({ profile: { ...preferences.profile, preferredLearningStyle: e.target.value as any } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="visual">Visual</option>
                        <option value="text">Text</option>
                        <option value="interactive">Interactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select
                        value={preferences.profile.language}
                        onChange={(e) => updatePreferences({ profile: { ...preferences.profile, language: e.target.value } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>

                    <label className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Completed Onboarding</span>
                      <input
                        type="checkbox"
                        checked={preferences.profile.completedOnboarding}
                        onChange={(e) => updatePreferences({ profile: { ...preferences.profile, completedOnboarding: e.target.checked } })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>
                
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Allow Analytics</span>
                      <p className="text-xs text-gray-500">Help improve the app by sharing usage data</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.privacy.allowAnalytics}
                      onChange={(e) => updatePreferences({ privacy: { ...preferences.privacy, allowAnalytics: e.target.checked } })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Allow Cookies</span>
                      <p className="text-xs text-gray-500">Store preferences and settings locally</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.privacy.allowCookies}
                      onChange={(e) => updatePreferences({ privacy: { ...preferences.privacy, allowCookies: e.target.checked } })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Share Usage Data</span>
                      <p className="text-xs text-gray-500">Share anonymous usage statistics</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.privacy.shareUsageData}
                      onChange={(e) => updatePreferences({ privacy: { ...preferences.privacy, shareUsageData: e.target.checked } })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Allow Personalization</span>
                      <p className="text-xs text-gray-500">Customize experience based on your usage</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.privacy.allowPersonalization}
                      onChange={(e) => updatePreferences({ privacy: { ...preferences.privacy, allowPersonalization: e.target.checked } })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reset All Preferences?</h3>
              <p className="text-sm text-gray-600 mb-4">
                This will reset all your preferences to default values. This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Import Modal */}
        {showImport && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-6 max-w-md mx-4 w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Import Preferences</h3>
              <p className="text-sm text-gray-600 mb-4">
                Paste your exported preferences JSON data below:
              </p>
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs font-mono"
                placeholder="Paste JSON data here..."
              />
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => setShowImport(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={!importData.trim()}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Import
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};