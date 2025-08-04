import React, { useEffect, useRef, useState } from 'react';
import { X, ArrowLeft, ArrowRight, SkipForward, Clock } from 'lucide-react';
import { TutorialStep } from '../../types/tutorial';

interface TutorialOverlayProps {
  step: TutorialStep;
  currentStepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onClose: () => void;
  canGoBack: boolean;
  flowName: string;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  step,
  currentStepIndex,
  totalSteps,
  onNext,
  onPrevious,
  onSkip,
  onClose,
  canGoBack,
  flowName,
}) => {
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [highlightPosition, setHighlightPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      const targetElement = document.querySelector(step.targetSelector);
      
      if (targetElement && !step.modal) {
        const rect = targetElement.getBoundingClientRect();
        const tooltipRect = tooltipRef.current?.getBoundingClientRect();
        
        // Set highlight position
        setHighlightPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });

        // Calculate tooltip position based on placement
        let top = 0;
        let left = 0;

        switch (step.placement) {
          case 'top':
            top = rect.top + window.scrollY - (tooltipRect?.height || 0) - 16;
            left = rect.left + window.scrollX + rect.width / 2 - (tooltipRect?.width || 0) / 2;
            break;
          case 'bottom':
            top = rect.bottom + window.scrollY + 16;
            left = rect.left + window.scrollX + rect.width / 2 - (tooltipRect?.width || 0) / 2;
            break;
          case 'left':
            top = rect.top + window.scrollY + rect.height / 2 - (tooltipRect?.height || 0) / 2;
            left = rect.left + window.scrollX - (tooltipRect?.width || 0) - 16;
            break;
          case 'right':
            top = rect.top + window.scrollY + rect.height / 2 - (tooltipRect?.height || 0) / 2;
            left = rect.right + window.scrollX + 16;
            break;
          default:
            top = window.innerHeight / 2 - (tooltipRect?.height || 0) / 2 + window.scrollY;
            left = window.innerWidth / 2 - (tooltipRect?.width || 0) / 2 + window.scrollX;
        }

        // Ensure tooltip stays within viewport
        const maxLeft = window.innerWidth - (tooltipRect?.width || 0) - 16;
        const maxTop = window.innerHeight - (tooltipRect?.height || 0) - 16 + window.scrollY;
        
        setTooltipPosition({
          top: Math.max(16 + window.scrollY, Math.min(top, maxTop)),
          left: Math.max(16, Math.min(left, maxLeft)),
        });

        // Scroll target into view
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [step]);

  const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998] transition-opacity duration-300" />
      
      {/* Highlight spotlight */}
      {step.highlight && !step.modal && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            top: highlightPosition.top - 8,
            left: highlightPosition.left - 8,
            width: highlightPosition.width + 16,
            height: highlightPosition.height + 16,
          }}
        >
          <div className="w-full h-full rounded-lg border-4 border-blue-400 shadow-lg animate-pulse" />
          <div className="absolute inset-0 rounded-lg bg-white bg-opacity-10" />
        </div>
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[10000] bg-white rounded-xl shadow-2xl border border-gray-200 max-w-sm w-full mx-4 transform transition-all duration-300"
        style={step.modal ? {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        } : {
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-sm font-medium text-gray-500">{flowName}</div>
              <div className="text-xs text-gray-400">
                {currentStepIndex + 1} of {totalSteps}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {step.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {canGoBack && (
                <button
                  onClick={onPrevious}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={onSkip}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <SkipForward className="w-4 h-4" />
                <span>Skip</span>
              </button>
              
              <button
                onClick={onNext}
                className="flex items-center space-x-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                <span>{currentStepIndex + 1 === totalSteps ? 'Finish' : 'Next'}</span>
                {currentStepIndex + 1 < totalSteps && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Arrow pointer for non-modal tooltips */}
        {!step.modal && (
          <div
            className={`absolute w-3 h-3 transform rotate-45 bg-white border ${
              step.placement === 'top' ? 'bottom-[-7px] border-b border-r border-gray-200' :
              step.placement === 'bottom' ? 'top-[-7px] border-t border-l border-gray-200' :
              step.placement === 'left' ? 'right-[-7px] border-r border-b border-gray-200' :
              'left-[-7px] border-l border-t border-gray-200'
            }`}
            style={{
              left: step.placement === 'left' || step.placement === 'right' ? 'auto' : '50%',
              top: step.placement === 'top' || step.placement === 'bottom' ? 'auto' : '50%',
              transform: step.placement === 'left' || step.placement === 'right' ? 'translateY(-50%) rotate(45deg)' : 'translateX(-50%) rotate(45deg)',
            }}
          />
        )}
      </div>
    </>
  );
};