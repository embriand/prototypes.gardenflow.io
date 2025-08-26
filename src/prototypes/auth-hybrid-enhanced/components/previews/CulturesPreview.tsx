import React from 'react';

const CulturesPreview: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Gantt Chart Skeleton */}
      <div className="flex-1 bg-white/50 rounded-lg p-2 flex flex-col">
        {/* Timeline Header */}
        <div className="flex gap-1 mb-2 flex-shrink-0">
          <div className="w-24">
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
          </div>
          <div className="flex-1 flex gap-1">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="flex-1">
                <div className="h-3 w-full bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Gantt Rows - All rows have timeline bars */}
        <div className="flex-1 flex flex-col gap-1">
          {/* Parcel 1 */}
          <div className="flex gap-1 flex-1">
            <div className="w-24 bg-blue-100 rounded p-1 flex items-center">
              <div className="h-3 w-14 bg-blue-300 rounded"></div>
            </div>
            <div className="flex-1 flex items-center">
              <div className="h-5 bg-blue-200 rounded" style={{marginLeft: '5%', width: '85%'}}></div>
            </div>
          </div>
          
          {/* Zone 1 */}
          <div className="flex gap-1 flex-1">
            <div className="w-24 pl-2 flex items-center">
              <div className="h-3 w-12 bg-gray-200 rounded"></div>
            </div>
            <div className="flex-1 flex items-center">
              <div className="h-5 bg-gray-300 rounded" style={{marginLeft: '5%', width: '60%'}}></div>
            </div>
          </div>
          
          {/* Crops in Zone 1 with Tooltip */}
          <div className="flex gap-1 flex-1 relative">
            <div className="w-24 pl-4 flex items-center">
              <div className="h-3 w-10 bg-gray-200 rounded"></div>
            </div>
            <div className="flex-1 flex items-center relative">
              <div className="h-5 bg-orange-300 rounded" style={{marginLeft: '10%', width: '25%'}}></div>
              {/* Tooltip appearing over this gantt bar - skeleton only */}
              <div className="absolute top-[-40px] left-[15%] z-10 bg-gray-900/95 backdrop-blur rounded-lg shadow-xl p-2.5 whitespace-nowrap">
                <div className="h-2 w-20 bg-gray-400 rounded mb-2"></div>
                <div className="space-y-1">
                  <div className="flex gap-3">
                    <div className="h-1.5 w-8 bg-gray-500 rounded"></div>
                    <div className="h-1.5 w-12 bg-gray-300 rounded"></div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-1.5 w-10 bg-gray-500 rounded"></div>
                    <div className="h-1.5 w-10 bg-gray-300 rounded"></div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-1.5 w-12 bg-gray-500 rounded"></div>
                    <div className="h-1.5 w-8 bg-green-400 rounded"></div>
                  </div>
                </div>
                {/* Tooltip arrow pointing down */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900/95 transform rotate-45"></div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-1 flex-1">
            <div className="w-24 pl-4 flex items-center">
              <div className="h-3 w-10 bg-gray-200 rounded"></div>
            </div>
            <div className="flex-1 flex items-center">
              <div className="h-5 bg-green-300 rounded" style={{marginLeft: '25%', width: '20%'}}></div>
            </div>
          </div>
          
          {/* Zone 2 */}
          <div className="flex gap-1 flex-1">
            <div className="w-24 pl-2 flex items-center">
              <div className="h-3 w-12 bg-gray-200 rounded"></div>
            </div>
            <div className="flex-1 flex items-center">
              <div className="h-5 bg-gray-300 rounded" style={{marginLeft: '35%', width: '45%'}}></div>
            </div>
          </div>
          
          <div className="flex gap-1 flex-1">
            <div className="w-24 pl-4 flex items-center">
              <div className="h-3 w-10 bg-gray-200 rounded"></div>
            </div>
            <div className="flex-1 flex items-center">
              <div className="h-5 bg-purple-300 rounded" style={{marginLeft: '35%', width: '30%'}}></div>
            </div>
          </div>
          
          {/* Parcel 2 */}
          <div className="flex gap-1 flex-1">
            <div className="w-24 bg-green-100 rounded p-1 flex items-center">
              <div className="h-3 w-14 bg-green-300 rounded"></div>
            </div>
            <div className="flex-1 flex items-center">
              <div className="h-5 bg-green-200 rounded" style={{marginLeft: '15%', width: '70%'}}></div>
            </div>
          </div>
          
          {/* Zone 3 */}
          <div className="flex gap-1 flex-1">
            <div className="w-24 pl-2 flex items-center">
              <div className="h-3 w-12 bg-gray-200 rounded"></div>
            </div>
            <div className="flex-1 flex items-center">
              <div className="h-5 bg-gray-300 rounded" style={{marginLeft: '20%', width: '55%'}}></div>
            </div>
          </div>
          
          <div className="flex gap-1 flex-1">
            <div className="w-24 pl-4 flex items-center">
              <div className="h-3 w-10 bg-gray-200 rounded"></div>
            </div>
            <div className="flex-1 flex items-center">
              <div className="h-5 bg-red-300 rounded" style={{marginLeft: '15%', width: '40%'}}></div>
            </div>
          </div>
          
          <div className="flex gap-1 flex-1">
            <div className="w-24 pl-4 flex items-center">
              <div className="h-3 w-10 bg-gray-200 rounded"></div>
            </div>
            <div className="flex-1 flex items-center">
              <div className="h-5 bg-yellow-300 rounded" style={{marginLeft: '45%', width: '25%'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CulturesPreview;