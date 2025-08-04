import React from 'react';
import { PreferencesProvider } from './hooks/usePreferences';
import { TourManagerProvider } from './components/tour/TourManager';
import { TourControlPanel } from './components/tour/TourControlPanel';
import { TourComponent } from './components/tour/TourComponent';
import { SimpleDemo } from './components/demo/SimpleDemo';
import { tourFlows } from './data/tourFlows';

function App() {
  return (
    <PreferencesProvider>
      <TourManagerProvider flows={tourFlows}>
        <div className="min-h-screen bg-gray-50 relative overflow-x-hidden">
          <TourComponent 
            component="garden" 
            features={['creation', 'settings', 'profile']}
            autoStartTours={['garden-basics']}
          >
            <SimpleDemo />
          </TourComponent>
          
          {/* Tour Control Panel - positioned to avoid main app header */}
          <TourControlPanel />
        </div>
      </TourManagerProvider>
    </PreferencesProvider>
  );
}

export default App;