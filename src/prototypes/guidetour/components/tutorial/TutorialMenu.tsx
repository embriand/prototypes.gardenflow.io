import React from 'react';
import { Play, CheckCircle, Clock, SkipForward, RotateCcw } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { TutorialFlow } from '../../types/tutorial';

interface TutorialMenuProps {
  flows: TutorialFlow[];
  onStartTutorial: (flowId: string) => void;
  onResumeTutorial: (flowId: string) => void;
  onResetTutorial: (flowId: string) => void;
  getFlowProgress: (flowId: string) => any;
  isFlowCompleted: (flowId: string) => boolean;
  getCompletionPercentage: (flowId: string) => number;
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialMenu: React.FC<TutorialMenuProps> = ({
  flows,
  onStartTutorial,
  onResumeTutorial,
  onResetTutorial,
  getFlowProgress,
  isFlowCompleted,
  getCompletionPercentage,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'garden': return 'text-green-600 bg-green-50';
      case 'studio': return 'text-blue-600 bg-blue-50';
      case 'inventory': return 'text-amber-600 bg-amber-50';
      case 'tasks': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="w-5 h-5" /> : <Play className="w-5 h-5" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Garden Guide Tours</h2>
              <p className="text-sm text-gray-600 mt-1">Interactive tutorials to master your garden management</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          <div className="grid gap-4">
            {flows.map((flow) => {
              const progress = getFlowProgress(flow.id);
              const completed = isFlowCompleted(flow.id);
              const percentage = getCompletionPercentage(flow.id);
              const hasStarted = progress && !completed;

              return (
                <div key={flow.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`p-2 rounded-lg ${getCategoryColor(flow.category)}`}>
                        {getIconComponent(flow.icon || 'Play')}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{flow.name}</h3>
                          {completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {progress?.skipped && <SkipForward className="w-4 h-4 text-orange-500" />}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{flow.description}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{flow.estimatedTime} min</span>
                          </div>
                          <div className="capitalize px-2 py-1 bg-gray-100 rounded-full">
                            {flow.category}
                          </div>
                        </div>

                        {/* Progress bar */}
                        {hasStarted && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                              <span>Progress</span>
                              <span>{percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center space-x-2 ml-4">
                      {completed ? (
                        <button
                          onClick={() => onResetTutorial(flow.id)}
                          className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Restart</span>
                        </button>
                      ) : hasStarted ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onResetTutorial(flow.id)}
                            className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>Reset</span>
                          </button>
                          <button
                            onClick={() => onResumeTutorial(flow.id)}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                          >
                            <Play className="w-4 h-4" />
                            <span>Resume</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onStartTutorial(flow.id)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                        >
                          <Play className="w-4 h-4" />
                          <span>Start</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Complete all tutorials to master your garden management skills
          </p>
        </div>
      </div>
    </div>
  );
};