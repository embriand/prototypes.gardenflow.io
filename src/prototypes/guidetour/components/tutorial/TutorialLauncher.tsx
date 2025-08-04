import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { TutorialMenu } from './TutorialMenu';
import { useTutorialContext } from './TutorialProvider';

export const TutorialLauncher: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const tutorial = useTutorialContext();

  return (
    <>
      {/* Floating help button */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 hover:scale-110 z-40 flex items-center justify-center"
        title="Open Tutorial Guide"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* Tutorial Menu */}
      <TutorialMenu
        flows={tutorial.availableFlows}
        onStartTutorial={tutorial.startTutorial}
        onResumeTutorial={tutorial.resumeTutorial}
        onResetTutorial={tutorial.resetTutorial}
        getFlowProgress={tutorial.getFlowProgress}
        isFlowCompleted={tutorial.isFlowCompleted}
        getCompletionPercentage={tutorial.getCompletionPercentage}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
};