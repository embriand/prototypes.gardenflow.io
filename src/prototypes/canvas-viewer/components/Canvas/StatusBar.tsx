import React from 'react';
import { Move } from 'lucide-react';

interface StatusBarProps {
  viewMode: '2d' | '3d' | 'flat';
  selectedObject: any | null;
}

export const StatusBar = ({ viewMode, selectedObject }: StatusBarProps) => {
  return (
    <div className="flex justify-between items-center px-4 py-2 border-t border-gray-800 bg-gray-800/30">
      <span className="text-sm text-gray-400">
        {viewMode === 'flat' ? 'Top-down View' : 
         viewMode === '2d' ? 'Front View' : 
         '3D View'}
      </span>
      <span className="text-sm text-gray-400">
        {selectedObject ? 
          <span className="flex items-center gap-1">
            <Move className="w-4 h-4" /> Selected: {selectedObject.type}
          </span> : 
          'Click an object to select it'
        }
      </span>
    </div>
  );
};