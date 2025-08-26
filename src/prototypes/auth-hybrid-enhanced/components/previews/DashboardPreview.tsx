import React from 'react';

const DashboardPreview: React.FC = () => {
  return (
    <div className="h-full flex flex-col gap-2">
      {/* View Mode Switcher */}
      <div className="flex items-center justify-between">
        <div className="h-2 w-20 bg-gray-300 rounded"></div>
        <div className="flex gap-1">
          <div className="px-2 py-1 bg-blue-100 rounded">
            <div className="h-1.5 w-8 bg-blue-300 rounded"></div>
          </div>
          <div className="px-2 py-1 bg-gray-100 rounded">
            <div className="h-1.5 w-8 bg-gray-300 rounded"></div>
          </div>
          <div className="px-2 py-1 bg-gray-100 rounded">
            <div className="h-1.5 w-8 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>

      {/* Top Stats Cards - Always visible */}
      <div className="grid grid-cols-4 gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`rounded p-1.5 ${
            i === 1 ? 'bg-green-50' :
            i === 2 ? 'bg-blue-50' :
            i === 3 ? 'bg-purple-50' :
            'bg-orange-50'
          }`}>
            <div className="flex items-center justify-between mb-0.5">
              <div className="h-1.5 w-10 bg-gray-200 rounded"></div>
              <div className={`w-3 h-3 rounded ${
                i === 1 ? 'bg-green-200' :
                i === 2 ? 'bg-blue-200' :
                i === 3 ? 'bg-purple-200' :
                'bg-orange-200'
              }`}></div>
            </div>
            <div className="h-2.5 w-6 bg-gray-300 rounded mb-0.5"></div>
            <div className="h-1 w-12 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>

      {/* Main Content - Split View showing Cards and Map */}
      <div className="flex-1 grid grid-cols-2 gap-2">
        {/* Left Side - Cards View */}
        <div className="bg-white/50 rounded-lg p-2 overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <div className="h-1.5 w-14 bg-gray-300 rounded"></div>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-gray-200 rounded"></div>
              <div className="w-3 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
          {/* Cards Grid */}
          <div className="grid grid-cols-2 gap-1.5 h-[calc(100%-20px)] overflow-y-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-50 rounded p-1.5 h-fit">
                {/* Card image area */}
                <div className="w-full h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded mb-1"></div>
                {/* Card content */}
                <div className="space-y-0.5">
                  <div className="h-1.5 w-full bg-gray-300 rounded"></div>
                  <div className="h-1 w-3/4 bg-gray-200 rounded"></div>
                  <div className="flex justify-between items-center pt-0.5">
                    <div className={`h-1 w-8 rounded ${
                      i % 3 === 0 ? 'bg-green-300' :
                      i % 3 === 1 ? 'bg-orange-300' :
                      'bg-blue-300'
                    }`}></div>
                    <div className="flex gap-0.5">
                      <div className="w-2 h-2 bg-gray-200 rounded"></div>
                      <div className="w-2 h-2 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Map View */}
        <div className="bg-white/50 rounded-lg p-2">
          <div className="flex items-center justify-between mb-1.5">
            <div className="h-1.5 w-14 bg-gray-300 rounded"></div>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-gray-200 rounded"></div>
              <div className="w-3 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
          {/* Map Container */}
          <div className="h-[calc(100%-20px)] relative bg-gradient-to-br from-green-50 to-blue-50 rounded overflow-hidden">
            {/* Map grid lines */}
            <div className="absolute inset-0 opacity-20">
              <div className="h-full w-full" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, #ccc 0px, transparent 1px, transparent 30px, #ccc 31px), repeating-linear-gradient(90deg, #ccc 0px, transparent 1px, transparent 30px, #ccc 31px)',
                backgroundSize: '30px 30px'
              }}></div>
            </div>
            
            {/* Map markers/parcels - Pin style markers */}
            <div className="absolute top-[20%] left-[15%] transform -translate-x-1/2 -translate-y-full">
              <div className="relative">
                <div className="w-6 h-8 bg-green-400 rounded-t-full rounded-b-lg shadow-lg border border-green-500 relative">
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white/80 rounded-full"></div>
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-green-400"></div>
              </div>
            </div>
            
            <div className="absolute top-[40%] left-[30%] transform -translate-x-1/2 -translate-y-full">
              <div className="relative">
                <div className="w-6 h-8 bg-blue-400 rounded-t-full rounded-b-lg shadow-lg border border-blue-500 relative">
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white/80 rounded-full"></div>
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-blue-400"></div>
              </div>
            </div>
            
            <div className="absolute top-[60%] right-[25%] transform -translate-x-1/2 -translate-y-full">
              <div className="relative">
                <div className="w-6 h-8 bg-orange-400 rounded-t-full rounded-b-lg shadow-lg border border-orange-500 relative">
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white/80 rounded-full"></div>
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-orange-400"></div>
              </div>
            </div>
            
            <div className="absolute bottom-[20%] left-[40%] transform -translate-x-1/2 -translate-y-full">
              <div className="relative">
                <div className="w-5 h-7 bg-purple-400 rounded-t-full rounded-b-lg shadow-lg border border-purple-500 relative">
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/80 rounded-full"></div>
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[2px] border-l-transparent border-r-[2px] border-r-transparent border-t-[3px] border-t-purple-400"></div>
              </div>
            </div>
            
            <div className="absolute top-[30%] right-[15%] transform -translate-x-1/2 -translate-y-full">
              <div className="relative">
                <div className="w-6 h-8 bg-red-400 rounded-t-full rounded-b-lg shadow-lg border border-red-500 relative">
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white/80 rounded-full"></div>
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-red-400"></div>
              </div>
            </div>
            
            {/* Map polygons/zones */}
            <div className="absolute top-[10%] left-[10%] w-[25%] h-[20%] bg-green-200/30 border border-green-400 rounded transform rotate-6"></div>
            <div className="absolute bottom-[30%] right-[20%] w-[30%] h-[25%] bg-blue-200/30 border border-blue-400 rounded transform -rotate-3"></div>
            <div className="absolute top-[50%] left-[35%] w-[20%] h-[15%] bg-yellow-200/30 border border-yellow-400 rounded"></div>
            
            {/* Map legend */}
            <div className="absolute bottom-2 left-2 bg-white/80 rounded p-1">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="h-1 w-8 bg-gray-200 rounded"></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="h-1 w-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
            
            {/* Map controls */}
            <div className="absolute top-2 right-2 bg-white/80 rounded p-1">
              <div className="space-y-1">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;