import React, { useState } from 'react';
import { usePreferences } from '../../hooks/usePreferences';
import { PreferencesPanel } from '../preferences/PreferencesPanel';
import { 
  Settings, 
  Play, 
  Pause, 
  Square, 
  SkipForward, 
  RotateCcw,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  BarChart3,
  User,
  Palette,
  Sliders,
  HelpCircle,
  Minimize2
} from 'lucide-react';
import { useTourManagerContext } from './TourManager';
import { TourAnalytics } from './TourAnalytics';

export const TourControlPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [activeTab, setActiveTab] = useState<'controls' | 'settings' | 'flows' | 'analytics' | 'profile'>('controls');
  const tourManager = useTourManagerContext();
  const { preferences } = usePreferences();

  const toggleHelp = () => {
    tourManager.updateSettings({ 
      showHelp: !tourManager.showHelp 
    });
  };

  const minimizeTour = () => {
    if (tourManager.isActive) {
      tourManager.updateSettings({ 
        isMinimized: !tourManager.isMinimized 
      });
    }
  };

  const toggleGlobalTours = () => {
    tourManager.updateSettings({ enabled: !preferences.tours.enabled });
  };

  const toggleAutoStart = () => {
    tourManager.updateSettings({ autoStart: !preferences.tours.autoStart });
  };

  const toggleCategory = (category: string) => {
    const currentValue = preferences.categories[category];
    tourManager.enableCategory(category, !currentValue);
  };

  const updateAnimationSpeed = (speed: 'slow' | 'normal' | 'fast') => {
    tourManager.updateSettings({ animationSpeed: speed });
  };

  const updateUserProfile = (updates: any) => {
    tourManager.updateUserProfile(updates);
  };

  if (!isOpen) {
    return (
      <div className="fixed top-20 right-6 z-[9997] flex flex-col space-y-3">
        {/* Guide Tour Management Button */}
        <div className="flex flex-col items-center bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-white/50">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2.5 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            title="Guide Tour Management"
            aria-label="Open guide tour management panel"
          >
            <Settings className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-700 mt-2 font-medium">Management</span>
        </div>
        
        {/* User Config Button */}
        <div className="flex flex-col items-center bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-white/50">
          <button
            onClick={() => setShowPreferences(true)}
            className="p-2.5 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
            title="User Config"
            aria-label="Open user configuration"
          >
            <Sliders className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-700 mt-2 font-medium">Config</span>
        </div>
        
        <PreferencesPanel isOpen={showPreferences} onClose={() => setShowPreferences(false)} />
      </div>
    );
  }

  return (
    <>
      <div 
        className="fixed top-20 right-4 w-96 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 z-[9999] transform transition-all duration-300 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="control-panel-title"
      >
        {/* Gradient accent */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
          <div>
            <h2 id="control-panel-title" className="text-lg font-bold text-gray-900">Tour Control Panel</h2>
            <p className="text-xs text-gray-600 mt-1">Manage your guide tours</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            aria-label="Close control panel"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-blue-50/30">
          {[
            { id: 'controls', label: 'Controls' },
            { id: 'settings', label: 'Settings' },
            { id: 'flows', label: 'Flows' },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'profile', label: 'Profile', icon: User },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-2 py-3 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-inset flex items-center justify-center space-x-1 ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white/60 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/40'
              }`}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              {tab.icon && <tab.icon className="w-3 h-3" />}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5 max-h-96 overflow-y-auto" role="tabpanel">
          {activeTab === 'controls' && (
            <div className="space-y-4">
              {/* Current Tour Status */}
              {tourManager.isActive && tourManager.activeFlow ? (
                <div className="p-4 bg-gradient-to-br from-blue-50 via-purple-50/50 to-pink-50/30 rounded-2xl border border-blue-200/50 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-blue-900">
                      {tourManager.activeFlow.name}
                    </span>
                    <span className="text-xs text-blue-600 font-medium">
                      Step {tourManager.currentStep + 1} of {tourManager.activeFlow.steps.length}
                    </span>
                  </div>
                  <div className="w-full bg-blue-200/60 rounded-full h-2 mb-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 shadow-sm"
                      style={{
                        width: `${((tourManager.currentStep + 1) / tourManager.activeFlow.steps.length) * 100}%`
                      }}
                    />
                  </div>
                  <div className="flex space-x-2 flex-wrap gap-1">
                    {tourManager.isPaused ? (
                      <button
                        onClick={tourManager.resumeTour}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-green-500 text-white rounded-xl text-xs font-medium hover:bg-green-600 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                        aria-label="Resume tour"
                      >
                        <Play className="w-3 h-3" />
                        <span>Resume</span>
                      </button>
                    ) : (
                      <button
                        onClick={tourManager.pauseTour}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-yellow-500 text-white rounded-xl text-xs font-medium hover:bg-yellow-600 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                        aria-label="Pause tour"
                      >
                        <Pause className="w-3 h-3" />
                        <span>Pause</span>
                      </button>
                    )}
                    <button
                      onClick={tourManager.stopTour}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-red-500 text-white rounded-xl text-xs font-medium hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                      aria-label="Stop tour"
                    >
                      <Square className="w-3 h-3" />
                      <span>Stop</span>
                    </button>
                    <button
                      onClick={tourManager.skipTour}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-gray-500 text-white rounded-xl text-xs font-medium hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                      aria-label="Skip tour"
                    >
                      <SkipForward className="w-3 h-3" />
                      <span>Skip</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl text-center border border-gray-200/50">
                  <p className="text-sm text-gray-600 font-medium">No active tour</p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700">Quick Start</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => tourManager.startTour('garden-basics')}
                    className="px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-xs font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                  >
                    Garden Tour
                  </button>
                  <button
                    onClick={() => tourManager.startTour('studio-basics')}
                    className="px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-xs font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                  >
                    Studio Tour
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              {/* Global Settings */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Global Settings</h4>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Enable Tours</span>
                  <button
                    onClick={toggleGlobalTours}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
                      preferences.tours.enabled ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                    role="switch"
                    aria-checked={preferences.tours.enabled}
                    aria-label="Toggle tours"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.tours.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Auto Start</span>
                  <button
                    onClick={toggleAutoStart}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
                      preferences.tours.autoStart ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                    role="switch"
                    aria-checked={preferences.tours.autoStart}
                    aria-label="Toggle auto start"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.tours.autoStart ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Show Keyboard Shortcuts</span>
                  <button
                    onClick={() => tourManager.updateSettings({ showKeyboardShortcuts: !preferences.tours.showKeyboardShortcuts })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
                      preferences.tours.showKeyboardShortcuts ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                    role="switch"
                    aria-checked={preferences.tours.showKeyboardShortcuts}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.tours.showKeyboardShortcuts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>

                <div className="space-y-2">
                  <span className="text-sm text-gray-600">Animation Speed</span>
                  <div className="flex space-x-2">
                    {(['slow', 'normal', 'fast'] as const).map((speed) => (
                      <button
                        key={speed}
                        onClick={() => updateAnimationSpeed(speed)}
                        className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                          preferences.tours.animationSpeed === speed
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {speed.charAt(0).toUpperCase() + speed.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category Settings */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Categories</h4>
                {Object.entries(preferences.categories).map(([category, enabled]) => (
                  <label key={category} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{category}</span>
                    <button
                      onClick={() => toggleCategory(category)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
                        enabled ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                      role="switch"
                      aria-checked={enabled}
                      aria-label={`Toggle ${category} category`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'flows' && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Available Tours</h4>
              {tourManager.flows.map((flow) => {
                const progress = tourManager.getFlowProgress(flow.id);
                const completed = tourManager.isFlowCompleted(flow.id);
                const skipped = tourManager.isFlowSkipped(flow.id);
                const percentage = tourManager.getCompletionPercentage(flow.id);

                return (
                  <div key={flow.id} className="p-3 border border-gray-200 rounded-2xl bg-gradient-to-br from-white to-gray-50/50 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{flow.name}</span>
                      <div className="flex items-center space-x-1">
                        {completed && <span className="text-xs text-green-600">✓</span>}
                        {skipped && <span className="text-xs text-orange-600">⏭</span>}
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-2">{flow.description}</p>
                    
                    {progress && !completed && !skipped && (
                      <div className="mb-2">
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button
                        onClick={() => tourManager.startTour(flow.id)}
                        className="flex items-center space-x-1 px-2 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                      >
                        <Play className="w-3 h-3" />
                        <span>{progress ? 'Resume' : 'Start'}</span>
                      </button>
                      
                      {progress && (
                        <button
                          onClick={() => tourManager.resetProgress(flow.id)}
                          className="flex items-center space-x-1 px-2 py-1 bg-gray-500 text-white rounded-lg text-xs hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'analytics' && <TourAnalytics />}

          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">User Profile</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <div className="flex space-x-2">
                    {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => updateUserProfile({ experienceLevel: level })}
                        className={`px-3 py-1.5 text-xs rounded-lg transition-colors capitalize ${
                          preferences.profile.experienceLevel === level
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Learning Style
                  </label>
                  <div className="flex space-x-2">
                    {(['visual', 'text', 'interactive'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => updateUserProfile({ preferredLearningStyle: style })}
                        className={`px-3 py-1.5 text-xs rounded-lg transition-colors capitalize ${
                          preferences.profile.preferredLearningStyle === style
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed Onboarding</span>
                  <button
                    onClick={() => updateUserProfile({ completedOnboarding: !preferences.profile.completedOnboarding })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
                      preferences.profile.completedOnboarding ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                    role="switch"
                    aria-checked={preferences.profile.completedOnboarding}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.profile.completedOnboarding ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};