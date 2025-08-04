import React, { useEffect, useMemo } from 'react';
import { useTourManagerContext } from './TourManager';

interface TourComponentProps {
  children: React.ReactNode;
  component: string;
  features?: string[];
  autoStartTours?: string[];
}

export const TourComponent: React.FC<TourComponentProps> = ({
  children,
  component,
  features = [],
  autoStartTours = [],
}) => {
  const tourManager = useTourManagerContext();

  // Memoize arrays to prevent unnecessary re-renders
  const memoizedFeatures = useMemo(() => features, [features.join(',')]);
  const memoizedAutoStartTours = useMemo(() => autoStartTours, [autoStartTours.join(',')]);

  useEffect(() => {
    // Register component
    tourManager.registerComponent(component);

    // Register features
    memoizedFeatures.forEach(feature => {
      tourManager.registerFeature(feature);
    });

    // Queue auto-start tours
    memoizedAutoStartTours.forEach(tourId => {
      tourManager.queueTour(tourId);
    });

    return () => {
      // Cleanup on unmount
      tourManager.unregisterComponent(component);
      memoizedFeatures.forEach(feature => {
        tourManager.unregisterFeature(feature);
      });
    };
  }, [component, memoizedFeatures, memoizedAutoStartTours, tourManager.registerComponent, tourManager.registerFeature, tourManager.queueTour, tourManager.unregisterComponent, tourManager.unregisterFeature]);

  return <>{children}</>;
};