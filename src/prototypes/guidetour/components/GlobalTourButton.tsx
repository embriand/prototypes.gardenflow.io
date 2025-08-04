import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, ChevronDown, Play, BookOpen } from 'lucide-react';
import { useGlobalTour } from '../hooks/useGlobalTour';

interface GlobalTourButtonProps {
  onStartTour?: (tourId: string) => void;
  variant?: 'icon' | 'button';
  className?: string;
}

export const GlobalTourButton: React.FC<GlobalTourButtonProps> = ({
  onStartTour,
  variant = 'icon',
  className = ''
}) => {
  const { currentComponent, isOnSupportedPage } = useGlobalTour();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handler pour démarrer un tour
  const handleStartTour = (tourId: string) => {
    if (onStartTour) {
      onStartTour(tourId);
    } else {
      // Fallback : essayer de trouver le contexte tour dans la page
      const event = new CustomEvent('startGlobalTour', {
        detail: { tourId, component: currentComponent?.component }
      });
      window.dispatchEvent(event);
    }
    setIsDropdownOpen(false);
  };

  // Handler pour tour par défaut (premier tour disponible)
  const handleDefaultTour = () => {
    if (currentComponent && currentComponent.availableTours.length > 0) {
      const defaultTour = currentComponent.availableTours[0];
      handleStartTour(defaultTour.id);
    }
  };

  // Ne pas afficher le bouton si pas de tours disponibles
  if (!isOnSupportedPage || !currentComponent) {
    return null;
  }

  const hasMultipleTours = currentComponent.availableTours.length > 1;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {variant === 'icon' ? (
        // Version icône compacte
        <div className="flex items-center">
          <button
            onClick={hasMultipleTours ? () => setIsDropdownOpen(!isDropdownOpen) : handleDefaultTour}
            className="flex items-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            title={hasMultipleTours ? 'Choisir une visite guidée' : `Démarrer : ${currentComponent.availableTours[0]?.name}`}
          >
            <HelpCircle className="w-4 h-4" />
            {hasMultipleTours && <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />}
          </button>
        </div>
      ) : (
        // Version bouton complet
        <button
          onClick={hasMultipleTours ? () => setIsDropdownOpen(!isDropdownOpen) : handleDefaultTour}
          className={`flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ${className}`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Aide</span>
          {hasMultipleTours && <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />}
        </button>
      )}

      {/* Dropdown menu pour tours multiples */}
      {hasMultipleTours && isDropdownOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2">
          {/* Header */}
          <div className="px-4 py-2 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">
              Visites guidées pour {currentComponent.componentName}
            </h3>
          </div>

          {/* Tours list */}
          <div className="py-1">
            {currentComponent.availableTours.map((tour) => (
              <button
                key={tour.id}
                onClick={() => handleStartTour(tour.id)}
                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Play className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    {tour.name}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {tour.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              Raccourci : ← → pour naviguer, ESC pour fermer
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalTourButton;