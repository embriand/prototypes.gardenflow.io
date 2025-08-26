import React from 'react';

const StudioPreview: React.FC = () => {
  return (
    <div className="h-full flex gap-2">
      {/* Left Panel - Layers */}
      <div className="w-1/5 bg-white/50 rounded p-2">
        <div className="text-xs font-medium mb-2">
          <div className="h-2 w-10 bg-gray-300 rounded"></div>
        </div>
        <div className="space-y-1 text-xs">
          {[
            { active: true },
            { active: false },
            { active: true },
            { active: true }
          ].map((layer, i) => (
            <div key={i} className={`flex items-center gap-1 p-1 rounded ${
              layer.active ? 'bg-green-50' : 'bg-gray-50'
            }`}>
              <div className={`w-2 h-2 rounded ${layer.active ? 'bg-green-400' : 'bg-gray-300'}`}></div>
              <div className="flex-1 h-1.5 bg-gray-200 rounded"></div>
              <div className="w-2 h-2 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Central Canvas with Dock Tools */}
      <div className="flex-1 flex gap-2">
        {/* Canvas */}
        <div className="flex-1 bg-white/50 rounded p-2">
          <div className="h-full relative bg-gradient-to-br from-green-50 to-gray-50">
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="h-full w-full" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, #ccc 0px, transparent 1px, transparent 15px, #ccc 16px), repeating-linear-gradient(90deg, #ccc 0px, transparent 1px, transparent 15px, #ccc 16px)',
              backgroundSize: '15px 15px'
            }}></div>
          </div>
          
          {/* Multiple parcels filling the canvas */}
          {/* Large parcel top-left with right-click menu */}
          <div className="absolute top-1 left-1 w-[30%] h-[45%] border border-green-400 bg-green-100/30">
            {/* Right-click context menu - skeleton only */}
            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur rounded-lg shadow-lg border border-gray-200 p-1.5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded cursor-pointer">
                  <div className="w-2.5 h-2.5 bg-blue-400 rounded"></div>
                  <div className="h-1.5 w-12 bg-gray-300 rounded"></div>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded cursor-pointer">
                  <div className="w-2.5 h-2.5 bg-green-400 rounded"></div>
                  <div className="h-1.5 w-14 bg-gray-300 rounded"></div>
                </div>
                <div className="border-t border-gray-200 my-0.5"></div>
                <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded cursor-pointer">
                  <div className="w-2.5 h-2.5 bg-orange-400 rounded"></div>
                  <div className="h-1.5 w-10 bg-gray-300 rounded"></div>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded cursor-pointer">
                  <div className="w-2.5 h-2.5 bg-red-400 rounded"></div>
                  <div className="h-1.5 w-11 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 grid-rows-3 gap-0.5 p-0.5 h-full">
              {/* Zones with crops inside */}
              <div className="bg-blue-200/40 border border-blue-300/50">
                <div className="grid grid-cols-2 grid-rows-2 gap-px h-full">
                  <div className="bg-orange-300/60"></div>
                  <div className="bg-orange-300/60"></div>
                  <div className="bg-orange-300/60"></div>
                  <div className="bg-orange-300/60"></div>
                </div>
              </div>
              <div className="bg-yellow-200/40 border border-yellow-300/50">
                <div className="grid grid-cols-3 gap-px h-full">
                  <div className="bg-green-400/60"></div>
                  <div className="bg-green-400/60"></div>
                  <div className="bg-green-400/60"></div>
                </div>
              </div>
              <div className="bg-purple-200/40 border border-purple-300/50"></div>
              <div className="bg-orange-200/40 border border-orange-300/50">
                <div className="grid grid-rows-3 gap-px h-full">
                  <div className="bg-red-400/60"></div>
                  <div className="bg-red-400/60"></div>
                  <div className="bg-red-400/60"></div>
                </div>
              </div>
              <div className="bg-green-200/40 border border-green-300/50"></div>
              <div className="bg-blue-200/40 border border-blue-300/50">
                <div className="grid grid-cols-2 gap-px h-full">
                  <div className="bg-purple-400/60"></div>
                  <div className="bg-purple-400/60"></div>
                </div>
              </div>
              <div className="bg-yellow-200/40 border border-yellow-300/50"></div>
              <div className="bg-pink-200/40 border border-pink-300/50">
                <div className="h-full bg-yellow-400/60"></div>
              </div>
              <div className="bg-cyan-200/40 border border-cyan-300/50"></div>
            </div>
          </div>

          {/* Rectangle parcel top-right */}
          <div className="absolute top-1 right-1 w-[35%] h-[25%] border border-blue-400 bg-blue-100/30">
            <div className="grid grid-cols-4 grid-rows-2 gap-0.5 p-0.5 h-full">
              <div className="bg-green-300/40 border border-green-400/50">
                <div className="h-full bg-green-500/60"></div>
              </div>
              <div className="bg-orange-300/40 border border-orange-400/50">
                <div className="h-full bg-orange-500/60"></div>
              </div>
              <div className="bg-red-300/40 border border-red-400/50">
                <div className="h-full bg-red-500/60"></div>
              </div>
              <div className="bg-purple-300/40 border border-purple-400/50"></div>
              <div className="bg-yellow-300/40 border border-yellow-400/50">
                <div className="h-full bg-yellow-500/60"></div>
              </div>
              <div className="bg-blue-300/40 border border-blue-400/50"></div>
              <div className="bg-green-300/40 border border-green-400/50">
                <div className="h-full bg-green-500/60"></div>
              </div>
              <div className="bg-pink-300/40 border border-pink-400/50"></div>
            </div>
          </div>

          {/* Square parcel middle-right */}
          <div className="absolute top-[30%] right-1 w-[25%] h-[25%] border border-purple-400 bg-purple-100/30">
            <div className="grid grid-cols-2 grid-rows-2 gap-0.5 p-0.5 h-full">
              <div className="bg-orange-300/40 border border-orange-400/50">
                <div className="grid grid-cols-2 grid-rows-2 gap-px h-full">
                  <div className="bg-orange-500/70"></div>
                  <div className="bg-orange-500/70"></div>
                  <div className="bg-orange-500/70"></div>
                  <div className="bg-orange-500/70"></div>
                </div>
              </div>
              <div className="bg-green-300/40 border border-green-400/50">
                <div className="h-full bg-green-500/60"></div>
              </div>
              <div className="bg-blue-300/40 border border-blue-400/50">
                <div className="h-full bg-blue-500/60"></div>
              </div>
              <div className="bg-red-300/40 border border-red-400/50">
                <div className="grid grid-rows-2 gap-px h-full">
                  <div className="bg-red-500/70"></div>
                  <div className="bg-red-500/70"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Long parcel bottom */}
          <div className="absolute bottom-1 left-1 w-[60%] h-[30%] border border-orange-400 bg-orange-100/30">
            <div className="grid grid-cols-5 grid-rows-2 gap-0.5 p-0.5 h-full">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className={`${
                  i % 3 === 0 ? 'bg-green-300/40 border border-green-400/50' :
                  i % 3 === 1 ? 'bg-blue-300/40 border border-blue-400/50' :
                  'bg-yellow-300/40 border border-yellow-400/50'
                }`}>
                  <div className={`h-full ${
                    i % 2 === 0 ? 'bg-green-500/60' : 'bg-orange-500/60'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Small square parcel bottom-right */}
          <div className="absolute bottom-1 right-1 w-[20%] h-[20%] border border-red-400 bg-red-100/30">
            <div className="grid grid-cols-3 grid-rows-3 gap-0.5 p-0.5 h-full">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="bg-green-300/40 border border-green-400/50">
                  <div className="h-full bg-green-500/70"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Center small parcel */}
          <div className="absolute top-[50%] left-[35%] w-[15%] h-[15%] border border-cyan-400 bg-cyan-100/30">
            <div className="p-0.5 h-full">
              <div className="h-full bg-cyan-300/50 border border-cyan-400/50">
                <div className="grid grid-cols-2 grid-rows-2 gap-px h-full p-px">
                  <div className="bg-cyan-500/70"></div>
                  <div className="bg-cyan-500/70"></div>
                  <div className="bg-cyan-500/70"></div>
                  <div className="bg-cyan-500/70"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        
        {/* Dock Tools - Right Side */}
        <div className="bg-white/50 rounded-lg p-2 flex flex-col justify-end">
          <div className="flex gap-1">
            {/* Tool buttons */}
            <div className="space-y-1">
              {/* Create Parcel Tool */}
              <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center cursor-pointer hover:bg-green-200">
                <div className="w-4 h-4 bg-green-400 rounded"></div>
              </div>
              {/* Create Zone Tool */}
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center cursor-pointer hover:bg-blue-200">
                <div className="w-4 h-4 bg-blue-400 rounded-sm"></div>
              </div>
              {/* Add Crop Tool */}
              <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center cursor-pointer hover:bg-orange-200">
                <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
              </div>
              {/* Divider */}
              <div className="h-px bg-gray-300 my-1"></div>
              {/* Select Tool */}
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center cursor-pointer hover:bg-gray-200">
                <div className="w-4 h-4 border-2 border-gray-400 rounded-sm"></div>
              </div>
              {/* Move Tool */}
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center cursor-pointer hover:bg-gray-200">
                <div className="grid grid-cols-2 grid-rows-2 gap-px">
                  <div className="w-1.5 h-1.5 bg-gray-400"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400"></div>
                </div>
              </div>
              {/* Delete Tool */}
              <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center cursor-pointer hover:bg-red-200">
                <div className="w-4 h-0.5 bg-red-400 rounded"></div>
              </div>
            </div>
            
            {/* Vertical divider */}
            <div className="w-px bg-gray-300 mx-1"></div>
            
            {/* Search and settings */}
            <div className="space-y-1">
              {/* Search */}
              <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center cursor-pointer hover:bg-purple-200">
                <div className="w-4 h-4 rounded-full border-2 border-purple-400">
                  <div className="w-1 h-1 bg-purple-400 rounded-full ml-2.5 mt-2.5"></div>
                </div>
              </div>
              {/* Zoom In */}
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center cursor-pointer hover:bg-gray-200">
                <div className="relative">
                  <div className="w-4 h-0.5 bg-gray-400"></div>
                  <div className="w-0.5 h-4 bg-gray-400 absolute left-1.5 -top-1.5"></div>
                </div>
              </div>
              {/* Zoom Out */}
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center cursor-pointer hover:bg-gray-200">
                <div className="w-4 h-0.5 bg-gray-400"></div>
              </div>
              {/* Divider */}
              <div className="h-px bg-gray-300 my-1"></div>
              {/* Layers */}
              <div className="w-8 h-8 bg-indigo-100 rounded flex items-center justify-center cursor-pointer hover:bg-indigo-200">
                <div className="space-y-0.5">
                  <div className="w-4 h-0.5 bg-indigo-400"></div>
                  <div className="w-4 h-0.5 bg-indigo-400"></div>
                  <div className="w-4 h-0.5 bg-indigo-400"></div>
                </div>
              </div>
              {/* Settings */}
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center cursor-pointer hover:bg-gray-200">
                <div className="w-4 h-4 rounded-full border-2 border-gray-400">
                  <div className="grid grid-cols-2 grid-rows-2 gap-px p-0.5">
                    <div className="w-0.5 h-0.5 bg-gray-400 rounded-full"></div>
                    <div className="w-0.5 h-0.5 bg-gray-400 rounded-full"></div>
                    <div className="w-0.5 h-0.5 bg-gray-400 rounded-full"></div>
                    <div className="w-0.5 h-0.5 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Actions & Properties */}
      <div className="w-1/5 flex flex-col gap-2">
        {/* Quick Actions */}
        <div className="bg-white/50 rounded p-1.5">
          <div className="grid grid-cols-3 gap-1">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>

        {/* Properties */}
        <div className="bg-white/50 rounded p-2 flex-1">
          <div className="text-xs space-y-1.5">
            <div className="h-1.5 w-12 bg-gray-300 rounded mb-2"></div>
            <div className="flex justify-between">
              <div className="h-1.5 w-6 bg-gray-200 rounded"></div>
              <div className="h-1.5 w-8 bg-green-300 rounded"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-1.5 w-6 bg-gray-200 rounded"></div>
              <div className="h-1.5 w-8 bg-blue-300 rounded"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-1.5 w-6 bg-gray-200 rounded"></div>
              <div className="h-1.5 w-8 bg-orange-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioPreview;