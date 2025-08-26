import React from 'react';

const ParcelsPreview: React.FC = () => {
  return (
    <div className="h-full flex flex-col gap-2">
      {/* Search Bar */}
      <div className="bg-white/50 rounded-lg p-2">
        <div className="flex gap-2">
          <div className="flex-1 h-3 bg-gray-200 rounded"></div>
          <div className="w-16 h-3 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Parcels Cards Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((parcelId) => (
            <div key={parcelId} className="bg-white/50 rounded-lg p-2">
              {/* Card Header */}
              <div className="flex justify-between items-center mb-2">
                <div className="h-2 w-20 bg-gray-300 rounded"></div>
                <div className="flex gap-1">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                </div>
              </div>

              {/* Zones List */}
              <div className="space-y-1 mb-2">
                {[1, 2, 3].map((zoneId) => (
                  <div key={zoneId} className="bg-gray-50 rounded p-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-blue-300 rounded"></div>
                      <div className="h-1.5 w-16 bg-gray-200 rounded"></div>
                    </div>
                    {/* Zone details like form fields */}
                    <div className="pl-4 space-y-0.5">
                      <div className="flex gap-1">
                        <div className="h-1 w-8 bg-gray-200 rounded"></div>
                        <div className="h-1 w-12 bg-gray-300 rounded"></div>
                      </div>
                      <div className="flex gap-1">
                        <div className="h-1 w-6 bg-gray-200 rounded"></div>
                        <div className="h-1 w-10 bg-green-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Footer Stats */}
              <div className="flex justify-between pt-1 border-t border-gray-200">
                <div className="flex gap-2">
                  <div className="h-1.5 w-8 bg-gray-200 rounded"></div>
                  <div className="h-1.5 w-6 bg-green-300 rounded"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-1.5 w-8 bg-gray-200 rounded"></div>
                  <div className="h-1.5 w-6 bg-blue-300 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParcelsPreview;