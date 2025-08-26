import React from 'react';

const InventoryPreview: React.FC = () => {
  return (
    <div className="h-full flex flex-col gap-2">
      {/* Top Stats Bar */}
      <div className="grid grid-cols-4 gap-1">
        <div className="bg-green-50 rounded p-1">
          <div className="h-1.5 w-6 bg-gray-200 rounded mb-0.5"></div>
          <div className="h-2 w-4 bg-green-300 rounded"></div>
        </div>
        <div className="bg-orange-50 rounded p-1">
          <div className="h-1.5 w-6 bg-gray-200 rounded mb-0.5"></div>
          <div className="h-2 w-4 bg-orange-300 rounded"></div>
        </div>
        <div className="bg-blue-50 rounded p-1">
          <div className="h-1.5 w-6 bg-gray-200 rounded mb-0.5"></div>
          <div className="h-2 w-4 bg-blue-300 rounded"></div>
        </div>
        <div className="bg-red-50 rounded p-1">
          <div className="h-1.5 w-6 bg-gray-200 rounded mb-0.5"></div>
          <div className="h-2 w-4 bg-red-300 rounded"></div>
        </div>
      </div>

      {/* Items Grid - Cards with form-like skeleton */}
      <div className="flex-1 bg-white/50 rounded-lg p-2">
        <div className="grid grid-cols-4 gap-1.5 h-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-gray-50 rounded p-1.5 flex flex-col">
              {/* Image skeleton area */}
              <div className="w-full h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded mb-1.5"></div>
              
              {/* Form-like fields */}
              <div className="space-y-1 flex-1">
                {/* Field 1 - Name label/input */}
                <div>
                  <div className="h-1 w-8 bg-gray-300 rounded mb-0.5"></div>
                  <div className="h-2 w-full bg-gray-200 rounded"></div>
                </div>
                
                {/* Field 2 - Category */}
                <div>
                  <div className="h-1 w-6 bg-gray-300 rounded mb-0.5"></div>
                  <div className="h-2 w-3/4 bg-gray-200 rounded"></div>
                </div>
                
                {/* Field 3 - Quantity with number */}
                <div className="flex gap-1">
                  <div className="flex-1">
                    <div className="h-1 w-5 bg-gray-300 rounded mb-0.5"></div>
                    <div className="h-2 w-full bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-1/3">
                    <div className="h-1 w-3 bg-gray-300 rounded mb-0.5"></div>
                    <div className={`h-2 w-full rounded ${
                      i % 3 === 0 ? 'bg-green-200' : 
                      i % 3 === 1 ? 'bg-orange-200' : 
                      'bg-red-200'
                    }`}></div>
                  </div>
                </div>
                
                {/* Field 4 - Status indicator */}
                <div className="flex items-center gap-1">
                  <div className={`w-1 h-1 rounded-full ${
                    i % 3 === 0 ? 'bg-green-400' : 
                    i % 3 === 1 ? 'bg-orange-400' : 
                    'bg-red-400'
                  }`}></div>
                  <div className="h-1 w-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryPreview;