import React from 'react';

const TreesPreview: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Tree Season Gantt Skeleton */}
      <div className="flex-1 bg-white/50 rounded-lg p-2 flex flex-col">
        {/* Season Headers */}
        <div className="flex gap-1 mb-2 flex-shrink-0">
          <div className="w-24">
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
          </div>
          <div className="flex-1 grid grid-cols-4 gap-1">
            <div className="bg-green-50 rounded p-1">
              <div className="h-3 w-full bg-green-200 rounded"></div>
            </div>
            <div className="bg-yellow-50 rounded p-1">
              <div className="h-3 w-full bg-yellow-200 rounded"></div>
            </div>
            <div className="bg-orange-50 rounded p-1">
              <div className="h-3 w-full bg-orange-200 rounded"></div>
            </div>
            <div className="bg-blue-50 rounded p-1">
              <div className="h-3 w-full bg-blue-200 rounded"></div>
            </div>
          </div>
        </div>
        
        {/* Tree Activity Rows - Fills full height */}
        <div className="flex-1 flex flex-col gap-1">
          {/* Zone level */}
          <div className="flex gap-1 flex-1">
            <div className="w-24 bg-emerald-100 rounded p-1 flex items-center">
              <div className="h-3 w-14 bg-emerald-300 rounded"></div>
            </div>
            <div className="flex-1"></div>
          </div>
          
          {/* Tree rows with seasonal activities */}
          <div className="flex gap-1 flex-1">
            <div className="w-24 pl-2 flex items-center">
              <div className="h-3 w-12 bg-gray-200 rounded"></div>
            </div>
            <div className="flex-1 grid grid-cols-4 gap-1">
              <div className="bg-green-300 rounded"></div>
              <div className="bg-yellow-300 rounded"></div>
              <div className="bg-orange-300 rounded"></div>
              <div className="bg-gray-100 rounded"></div>
            </div>
          </div>
          
          <div className="flex gap-1 flex-1">
            <div className="w-24 pl-2 flex items-center">
              <div className="h-3 w-12 bg-gray-200 rounded"></div>
            </div>
            <div className="flex-1 grid grid-cols-4 gap-1">
              <div className="bg-green-300 rounded"></div>
              <div className="bg-gray-100 rounded"></div>
              <div className="bg-orange-300 rounded"></div>
              <div className="bg-blue-300 rounded"></div>
            </div>
          </div>
          
          {/* Another zone */}
          <div className="flex gap-1 flex-1">
            <div className="w-24 bg-emerald-100 rounded p-1 flex items-center">
              <div className="h-3 w-14 bg-emerald-300 rounded"></div>
            </div>
            <div className="flex-1"></div>
          </div>
          
          <div className="flex gap-1 flex-1">
            <div className="w-24 pl-2 flex items-center">
              <div className="h-3 w-12 bg-gray-200 rounded"></div>
            </div>
            <div className="flex-1 grid grid-cols-4 gap-1">
              <div className="bg-gray-100 rounded"></div>
              <div className="bg-yellow-300 rounded"></div>
              <div className="bg-orange-300 rounded"></div>
              <div className="bg-gray-100 rounded"></div>
            </div>
          </div>
          
          <div className="flex gap-1 flex-1">
            <div className="w-24 pl-2 flex items-center">
              <div className="h-3 w-12 bg-gray-200 rounded"></div>
            </div>
            <div className="flex-1 grid grid-cols-4 gap-1">
              <div className="bg-green-300 rounded"></div>
              <div className="bg-yellow-300 rounded"></div>
              <div className="bg-gray-100 rounded"></div>
              <div className="bg-blue-300 rounded"></div>
            </div>
          </div>
          
          {/* Third zone */}
          <div className="flex gap-1 flex-1">
            <div className="w-24 bg-emerald-100 rounded p-1 flex items-center">
              <div className="h-3 w-14 bg-emerald-300 rounded"></div>
            </div>
            <div className="flex-1"></div>
          </div>
          
          <div className="flex gap-1 flex-1">
            <div className="w-24 pl-2 flex items-center">
              <div className="h-3 w-12 bg-gray-200 rounded"></div>
            </div>
            <div className="flex-1 grid grid-cols-4 gap-1">
              <div className="bg-green-300 rounded"></div>
              <div className="bg-gray-100 rounded"></div>
              <div className="bg-orange-300 rounded"></div>
              <div className="bg-blue-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreesPreview;