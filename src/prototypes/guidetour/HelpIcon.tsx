import React, { useState } from 'react';
import { HelpCircle, Play } from 'lucide-react';
import { useGuideTourContext } from './TourProviderV2';

interface HelpIconProps {
  className?: string;
  size?: number;
  showAvailableTours?: boolean;
}

export const HelpIcon: React.FC<HelpIconProps> = ({ 
  className = "", 
  size = 20,
  showAvailableTours = true 
}) => {
  const { tours, startTour } = useGuideTourContext();
  const [showMenu, setShowMenu] = useState(false);

  // Filter tours that are active and not onboarding (those auto-start)
  const availableTours = tours.filter(tour => 
    tour.isActive && tour.category !== 'onboarding'
  );

  // Debug logging
  console.log('🔍 HelpIcon Debug:', {
    allTours: tours.length,
    availableTours: availableTours.length,
    toursData: tours.map(t => ({
      id: t.id,
      identifier: t.identifier,
      name: t.name,
      category: t.category,
      isActive: t.isActive
    })),
    availableToursData: availableTours.map(t => ({
      id: t.id,
      identifier: t.identifier,
      name: t.name,
      category: t.category
    }))
  });

  const handleIconClick = () => {
    console.log('🎯 HelpIcon clicked!', {
      availableToursCount: availableTours.length,
      availableTours: availableTours.map(t => ({ id: t.id, name: t.name })),
      startTourFunction: typeof startTour
    });

    if (availableTours.length === 1) {
      // If only one tour available, start it directly
      console.log('🚀 Starting single tour:', availableTours[0].id);
      startTour(availableTours[0].id);
    } else if (availableTours.length > 1) {
      // If multiple tours, show menu
      console.log('📋 Showing tour menu, current showMenu:', showMenu);
      setShowMenu(!showMenu);
    } else {
      console.log('❌ No tours available to start');
    }
  };

  const handleTourStart = (tourId: string) => {
    console.log('🚀 Starting tour from menu:', tourId);
    startTour(tourId);
    setShowMenu(false);
  };

  if (availableTours.length === 0) {
    return null; // Don't show help icon if no tours available
  }

  return (
    <div className="relative">
      <button
        onClick={handleIconClick}
        className={`flex items-center justify-center p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-colors ${className}`}
        title="Help & Tours"
        aria-label="Show help tours"
      >
        <HelpCircle size={size} />
      </button>

      {showMenu && availableTours.length > 1 && (
        <>
          {/* Backdrop to close menu */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Tour menu */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border z-20">
            <div className="p-3 border-b">
              <h3 className="font-medium text-gray-900">Available Tours</h3>
              <p className="text-sm text-gray-500">Choose a tour to get started</p>
            </div>
            
            <div className="py-2">
              {availableTours.map((tour) => (
                <button
                  key={tour.id}
                  onClick={() => handleTourStart(tour.id)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start gap-3 transition-colors"
                >
                  <Play size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {tour.name || tour.identifier}
                    </div>
                    {tour.description && (
                      <div className="text-sm text-gray-500 mt-1">
                        {tour.description}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};