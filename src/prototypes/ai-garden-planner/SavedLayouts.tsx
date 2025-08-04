import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';

// Interfaces
import type { SavedLayoutsProps } from '../../models';

export const SavedLayouts: React.FC<SavedLayoutsProps> = ({ layouts, onLoad }) => {
  if (layouts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-green-800">Saved Layouts</h3>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {layouts.map((layout) => (
          <div
            key={layout.id}
            className="bg-white border border-green-100 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium text-green-700">{layout.name}</h4>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {new Date(layout.timestamp).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={() => onLoad(layout.id)}
                className="text-green-600 hover:text-green-700 p-1"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-600">Direction</p>
                <p className="font-medium capitalize">{layout.direction}</p>
              </div>
              <div>
                <p className="text-gray-600">Boxes</p>
                <p className="font-medium">{layout.stats.boxCount}</p>
              </div>
              <div>
                <p className="text-gray-600">Cultivated</p>
                <p className="font-medium">{layout.stats.cultivatedArea.toFixed(1)}m²</p>
              </div>
              <div>
                <p className="text-gray-600">Paths</p>
                <p className="font-medium">{layout.stats.pathArea.toFixed(1)}m²</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};