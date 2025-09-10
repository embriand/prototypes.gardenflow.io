import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Home, Package, Pentagon, Shapes } from 'lucide-react';
import ParcelPrototype1 from './ParcelPrototype1';
import ParcelPrototype2 from './ParcelPrototype2';
import ParcelPrototype3 from './ParcelPrototype3';

const RotationPrototypesNavigation: React.FC = () => {
  const [activePrototype, setActivePrototype] = useState(1);

  const prototypes = [
    {
      id: 1,
      name: 'Shape Manipulation',
      icon: <Package className="w-5 h-5" />,
      description: 'Basic shapes with rotation, resize, and delete',
      component: <ParcelPrototype1 />
    },
    {
      id: 2,
      name: 'Free Polygons',
      icon: <Pentagon className="w-5 h-5" />,
      description: 'Draw free-form polygons with dynamic points',
      component: <ParcelPrototype2 />
    },
    {
      id: 3,
      name: 'Interactive Canvas',
      icon: <Shapes className="w-5 h-5" />,
      description: 'Rectangles and circles with full manipulation',
      component: <ParcelPrototype3 />
    }
  ];

  const currentPrototype = prototypes.find(p => p.id === activePrototype);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Navigation Panel */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2">
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => setActivePrototype(prev => prev > 1 ? prev - 1 : 3)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Previous prototype"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Prototype Buttons */}
            {prototypes.map(proto => (
              <button
                key={proto.id}
                onClick={() => setActivePrototype(proto.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activePrototype === proto.id
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100'
                }`}
                title={proto.description}
              >
                {proto.icon}
                <span className="font-medium">{proto.name}</span>
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => setActivePrototype(prev => prev < 3 ? prev + 1 : 1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Next prototype"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Description */}
          <div className="mt-2 px-2 py-1 text-sm text-gray-600 text-center border-t">
            {currentPrototype?.description}
          </div>
        </div>
      </div>

      {/* Prototype Content */}
      <div className="w-full h-full">
        {currentPrototype?.component}
      </div>

      {/* Keyboard Navigation Hint */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-3 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-gray-100 rounded">←</kbd>
          <kbd className="px-2 py-1 bg-gray-100 rounded">→</kbd>
          <span>Navigate prototypes</span>
        </div>
      </div>
    </div>
  );
};

export default RotationPrototypesNavigation;