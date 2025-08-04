import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, SkipForward } from 'lucide-react';

// Support both old and new tour types
interface LegacyTourFlow {
  id: string;
  name: string;
  description: string;
  component: string;
  steps: LegacyTourStep[];
  isActive: boolean;
  autoStart?: boolean;
  priority?: number;
}

interface LegacyTourStep {
  id: string;
  title: string;
  content: string;
  target: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  showSkip?: boolean;
  delay?: number;
}

// New tour types from database
interface DatabaseTourFlow {
  id: string;
  identifier: string;
  name: string;
  description: string;
  component: string;
  steps?: DatabaseTourStep[];
  isActive: boolean;
  autoStart?: boolean;
  priority?: number;
}

interface DatabaseTourStep {
  id: string;
  title: string;
  content: string;
  targetSelector: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  showSkip?: boolean;
  delayMs?: number;
}

// Union types for flexibility
type TourFlow = LegacyTourFlow | DatabaseTourFlow;
type TourStep = LegacyTourStep | DatabaseTourStep;

interface TourOverlayProps {
  tour: TourFlow;
  currentStep?: number; // Legacy prop
  stepIndex?: number; // New prop
  currentStepData?: TourStep; // New prop for direct step data
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onEnd: () => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  completionPercentage?: number;
}

interface Position {
  x: number;
  y: number;
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

export const TourOverlay: React.FC<TourOverlayProps> = ({
  tour,
  currentStep,
  stepIndex,
  currentStepData,
  onNext,
  onPrevious,
  onSkip,
  onEnd,
  canGoNext,
  canGoPrevious,
  completionPercentage
}) => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0, placement: 'bottom' });
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Support both old and new interfaces
  const actualStepIndex = stepIndex !== undefined ? stepIndex : (currentStep || 0);
  const step = currentStepData || (tour.steps && tour.steps[actualStepIndex]) || null;
  const isFirstStep = canGoPrevious !== undefined ? !canGoPrevious : actualStepIndex === 0;
  const isLastStep = canGoNext !== undefined ? !canGoNext : actualStepIndex === (tour.steps?.length || 1) - 1;
  const totalSteps = tour.steps?.length || 1;
  const progress = completionPercentage !== undefined ? completionPercentage : Math.round(((actualStepIndex + 1) / totalSteps) * 100);

  // Helper function to get target selector from step
  const getTargetSelector = (step: TourStep): string => {
    if ('target' in step) {
      return step.target; // Legacy format
    }
    return step.targetSelector; // Database format
  };

  // Helper function to get placement from step
  const getPlacement = (step: TourStep): string => {
    return step.placement || 'bottom';
  };

  // Helper function to get show skip from step
  const getShowSkip = (step: TourStep): boolean => {
    return step.showSkip !== false;
  };

  // Fonction pour calculer la position du tooltip avec gestion des bordures
  const calculatePosition = (target: HTMLElement, placement: string = 'bottom'): Position => {
    const targetRect = target.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Dimensions estimées du dialog (sera affiné après le rendu)
    const dialogWidth = 400;
    const dialogHeight = 300;
    const padding = 20; // Distance minimale des bords
    
    let x = 0;
    let y = 0;
    let finalPlacement = placement as 'top' | 'bottom' | 'left' | 'right' | 'center';

    switch (placement) {
      case 'center':
        x = windowWidth / 2;
        y = windowHeight / 2;
        finalPlacement = 'center';
        break;
        
      case 'top':
        x = targetRect.left + targetRect.width / 2;
        y = targetRect.top - 10;
        if (y - dialogHeight < padding) { // Pas assez d'espace en haut
          finalPlacement = 'bottom';
          y = targetRect.bottom + 10;
        }
        break;
      
      case 'bottom':
        x = targetRect.left + targetRect.width / 2;
        y = targetRect.bottom + 10;
        if (y + dialogHeight > windowHeight - padding) { // Pas assez d'espace en bas
          finalPlacement = 'top';
          y = targetRect.top - 10;
        }
        break;
      
      case 'left':
        x = targetRect.left - 10;
        y = targetRect.top + targetRect.height / 2;
        if (x - dialogWidth < padding) { // Pas assez d'espace à gauche
          finalPlacement = 'right';
          x = targetRect.right + 10;
        }
        break;
      
      case 'right':
        x = targetRect.right + 10;
        y = targetRect.top + targetRect.height / 2;
        if (x + dialogWidth > windowWidth - padding) { // Pas assez d'espace à droite
          finalPlacement = 'left';
          x = targetRect.left - 10;
        }
        break;
    }

    return { x, y, placement: finalPlacement };
  };

  // Effet pour positionner le tooltip
  useEffect(() => {
    if (!step) return;

    const updatePosition = () => {
      const placement = getPlacement(step);
      // Pour le placement center, on peut créer un élément fictif au centre de l'écran
      if (placement === 'center') {
        const pos = {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          placement: 'center' as const
        };
        setPosition(pos);
        setTargetElement(null); // Pas d'élément à highlighter
        return;
      }
      
      const targetSelector = getTargetSelector(step);
      const target = document.querySelector(targetSelector) as HTMLElement;
      
      if (target) {
        setTargetElement(target);
        
        // Calculer la position immédiatement
        const pos = calculatePosition(target, placement);
        setPosition(pos);
        
        // Scroll vers l'élément si nécessaire (après le positionnement)
        setTimeout(() => {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
        }, 100);
      } else {
        console.error('❌ TourOverlay - Target not found:', targetSelector);
        console.log('Available data-tour elements:', 
          Array.from(document.querySelectorAll('[data-tour]')).map(el => el.getAttribute('data-tour'))
        );
      }
    };

    updatePosition();
    
    // Recalculer lors du redimensionnement
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [step]);

  // Effet pour affiner la position après le rendu initial
  useEffect(() => {
    if (!overlayRef.current || !step || !targetElement) return;

    const refinePosition = () => {
      const actualWidth = overlayRef.current!.offsetWidth;
      const actualHeight = overlayRef.current!.offsetHeight;
      
      // Recalculer avec les vraies dimensions
      const targetRect = targetElement.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const padding = 20;
      
      let x = position.x;
      let y = position.y;
      
      // Ajustements pour éviter les débordements
      switch (position.placement) {
        case 'top':
        case 'bottom':
          // Ajuster horizontalement
          const idealLeft = x - actualWidth / 2;
          const clampedLeft = Math.max(padding, Math.min(idealLeft, windowWidth - actualWidth - padding));
          if (Math.abs(idealLeft - clampedLeft) > 5) {
            setPosition(prev => ({ ...prev, x: clampedLeft + actualWidth / 2 }));
          }
          break;
          
        case 'left':
        case 'right':
          // Ajuster verticalement
          const idealTop = y - actualHeight / 2;
          const clampedTop = Math.max(padding, Math.min(idealTop, windowHeight - actualHeight - padding));
          if (Math.abs(idealTop - clampedTop) > 5) {
            setPosition(prev => ({ ...prev, y: clampedTop + actualHeight / 2 }));
          }
          break;
      }
    };

    // Attendre que le CSS soit appliqué
    const timeoutId = setTimeout(refinePosition, 50);
    
    return () => clearTimeout(timeoutId);
  }, [position, step, targetElement]);

  // Effet pour ajouter le highlight sur l'élément cible
  useEffect(() => {
    if (targetElement) {
      // Ajouter une classe pour le highlight
      targetElement.style.position = 'relative';
      targetElement.style.zIndex = '9998';
      targetElement.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 8px rgba(59, 130, 246, 0.2)';
      targetElement.style.borderRadius = '8px';
      targetElement.style.transition = 'all 0.3s ease';

      return () => {
        // Nettoyer les styles
        targetElement.style.position = '';
        targetElement.style.zIndex = '';
        targetElement.style.boxShadow = '';
        targetElement.style.borderRadius = '';
        targetElement.style.transition = '';
      };
    }
  }, [targetElement]);

  // Gestion du clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'Enter':
          e.preventDefault();
          if (isLastStep) {
            onEnd();
          } else {
            onNext();
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (!isFirstStep) {
            onPrevious();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onSkip();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFirstStep, isLastStep, onNext, onPrevious, onSkip, onEnd]);

  if (!step) return null;

  // Styles pour le positionnement avec gestion des bords
  const getTooltipStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      zIndex: 10000,
      maxWidth: '400px',
      minWidth: '280px',
      width: '90vw',
      maxHeight: '80vh',
      pointerEvents: 'auto' as const
    };

    const padding = 20;
    // Utiliser les vraies dimensions si disponibles, sinon estimation
    const dialogWidth = overlayRef.current?.offsetWidth || 400;
    const dialogHeight = overlayRef.current?.offsetHeight || 300;
    const halfWidth = dialogWidth / 2;

    switch (position.placement) {
      case 'center':
        return {
          ...baseStyles,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        };
      case 'top':
      case 'bottom': {
        // Calcul de la position horizontale avec limites
        let leftPos = position.x - halfWidth;
        
        // S'assurer que le dialog ne dépasse pas à gauche
        if (leftPos < padding) {
          leftPos = padding;
        }
        
        // S'assurer que le dialog ne dépasse pas à droite
        if (leftPos + dialogWidth > window.innerWidth - padding) {
          leftPos = window.innerWidth - dialogWidth - padding;
        }
        
        if (position.placement === 'top') {
          return {
            ...baseStyles,
            left: `${leftPos}px`,
            bottom: `${window.innerHeight - position.y}px`
          };
        } else {
          return {
            ...baseStyles,
            left: `${leftPos}px`,
            top: `${position.y}px`
          };
        }
      }
      case 'left':
        return {
          ...baseStyles,
          right: `${window.innerWidth - position.x}px`,
          top: `${Math.max(padding, Math.min(position.y - dialogHeight/2, window.innerHeight - dialogHeight - padding))}px`
        };
      case 'right':
        return {
          ...baseStyles,
          left: `${position.x}px`,
          top: `${Math.max(padding, Math.min(position.y - dialogHeight/2, window.innerHeight - dialogHeight - padding))}px`
        };
    }
  };

  // Flèche de direction
  const getArrowClasses = () => {
    const baseClasses = "absolute w-2.5 h-2.5 bg-white border border-gray-200 transform rotate-45";
    
    switch (position.placement) {
      case 'center':
        return 'hidden'; // No arrow for center placement
      case 'top':
        return `${baseClasses} -bottom-[5px] left-1/2 -translate-x-1/2 border-r-0 border-b-0`;
      case 'bottom':
        return `${baseClasses} -top-[5px] left-1/2 -translate-x-1/2 border-l-0 border-t-0`;
      case 'left':
        return `${baseClasses} -right-[5px] top-1/2 -translate-y-1/2 border-t-0 border-r-0`;
      case 'right':
        return `${baseClasses} -left-[5px] top-1/2 -translate-y-1/2 border-b-0 border-l-0`;
      default:
        return baseClasses;
    }
  };

  return (
    <>
      {/* Overlay sombre */}
      <div className="fixed inset-0 bg-black bg-opacity-30 z-[9999]" />
      
      {/* Tooltip */}
      <div
        ref={overlayRef}
        style={getTooltipStyles()}
        className="bg-white rounded-lg shadow-xl border border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-300 overflow-hidden flex flex-col"
      >
        {/* Flèche */}
        <div className={getArrowClasses()} />
        
        {/* Header */}
        <div className="flex items-start justify-between p-4 pb-0">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 truncate pr-2">
              {step.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <span className="whitespace-nowrap">Étape {actualStepIndex + 1}/{totalSteps}</span>
              <span>•</span>
              <span className="truncate">{tour.name}</span>
            </div>
          </div>
          <button
            onClick={onSkip}
            className="p-1 -mt-1 -mr-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            title="Fermer le tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenu */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <p className="text-sm text-gray-700 leading-relaxed">
            {step.content}
          </p>
        </div>

        {/* Progress bar */}
        <div className="px-4 pb-2">
          <div className="bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1 flex-shrink-0">
              <button
                onClick={onPrevious}
                disabled={isFirstStep}
                className={`inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  isFirstStep
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="w-3 h-3" />
                <span className="hidden sm:inline">Précédent</span>
              </button>
              
              {getShowSkip(step) && (
                <button
                  onClick={onSkip}
                  className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <SkipForward className="w-3 h-3" />
                  <span className="hidden sm:inline">Passer</span>
                </button>
              )}
            </div>

            <button
              onClick={isLastStep ? onEnd : onNext}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors flex-shrink-0"
            >
              {isLastStep ? 'Terminer' : 'Suivant'}
              {!isLastStep && <ChevronRight className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Raccourcis clavier */}
        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500">
            <span className="hidden sm:inline">Raccourcis:</span>
            <kbd className="px-1 py-0.5 bg-white rounded border border-gray-300">←</kbd>
            <kbd className="px-1 py-0.5 bg-white rounded border border-gray-300">→</kbd>
            <kbd className="px-1 py-0.5 bg-white rounded border border-gray-300">ESC</kbd>
          </div>
        </div>
      </div>
    </>
  );
};

export default TourOverlay;