import React from 'react';

const BudgetPreview: React.FC = () => {
  return (
    <div className="h-full flex flex-col gap-2">
      {/* Top Financial Stats */}
      <div className="grid grid-cols-4 gap-1">
        <div className="bg-green-50 rounded p-1">
          <div className="flex items-center justify-between mb-0.5">
            <div className="h-1 w-8 bg-gray-200 rounded"></div>
            <div className="w-2 h-2 bg-green-300 rounded"></div>
          </div>
          <div className="h-3 w-10 bg-green-400 rounded mb-0.5"></div>
          <div className="h-1 w-6 bg-green-200 rounded"></div>
        </div>
        <div className="bg-red-50 rounded p-1">
          <div className="flex items-center justify-between mb-0.5">
            <div className="h-1 w-8 bg-gray-200 rounded"></div>
            <div className="w-2 h-2 bg-red-300 rounded"></div>
          </div>
          <div className="h-3 w-10 bg-red-400 rounded mb-0.5"></div>
          <div className="h-1 w-6 bg-red-200 rounded"></div>
        </div>
        <div className="bg-blue-50 rounded p-1">
          <div className="flex items-center justify-between mb-0.5">
            <div className="h-1 w-8 bg-gray-200 rounded"></div>
            <div className="w-2 h-2 bg-blue-300 rounded"></div>
          </div>
          <div className="h-3 w-10 bg-blue-400 rounded mb-0.5"></div>
          <div className="h-1 w-6 bg-blue-200 rounded"></div>
        </div>
        <div className="bg-purple-50 rounded p-1">
          <div className="flex items-center justify-between mb-0.5">
            <div className="h-1 w-8 bg-gray-200 rounded"></div>
            <div className="w-2 h-2 bg-purple-300 rounded"></div>
          </div>
          <div className="h-3 w-10 bg-purple-400 rounded mb-0.5"></div>
          <div className="h-1 w-6 bg-purple-200 rounded"></div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-3 gap-2">
        {/* Left - Crop Revenue Breakdown */}
        <div className="bg-white/50 rounded-lg p-2">
          <div className="h-2 w-16 bg-gray-300 rounded mb-2"></div>
          {/* Crop list with revenue */}
          <div className="space-y-1">
            {[
              { crop: 'Tomates', revenue: 75, color: 'red' },
              { crop: 'Carottes', revenue: 60, color: 'orange' },
              { crop: 'Salades', revenue: 45, color: 'green' },
              { crop: 'Fraises', revenue: 80, color: 'pink' },
              { crop: 'Basilic', revenue: 30, color: 'green' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className={`w-1 h-4 bg-${item.color}-400 rounded`}></div>
                <div className="flex-1">
                  <div className="h-1 w-12 bg-gray-200 rounded mb-0.5"></div>
                  <div className="h-3 bg-gray-100 rounded relative overflow-hidden">
                    <div 
                      className={`absolute left-0 top-0 h-full bg-${item.color}-300`}
                      style={{ width: `${item.revenue}%` }}
                    ></div>
                  </div>
                </div>
                <div className="h-2 w-6 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Center - Monthly Cash Flow Chart */}
        <div className="bg-white/50 rounded-lg p-2">
          <div className="h-2 w-20 bg-gray-300 rounded mb-2"></div>
          {/* Dual bar chart - Income vs Expenses */}
          <div className="h-full flex items-end gap-1 pb-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-1 flex gap-0.5 items-end">
                <div className="flex-1 flex flex-col justify-end">
                  <div 
                    className="w-full bg-green-400 rounded-t"
                    style={{ height: `${Math.random() * 60 + 20}%` }}
                  ></div>
                </div>
                <div className="flex-1 flex flex-col justify-end">
                  <div 
                    className="w-full bg-red-400 rounded-t"
                    style={{ height: `${Math.random() * 50 + 10}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          {/* Month labels */}
          <div className="flex gap-1 mt-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-1">
                <div className="h-1 w-full bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Expense Categories Pie Chart */}
        <div className="bg-white/50 rounded-lg p-2">
          <div className="h-2 w-16 bg-gray-300 rounded mb-2"></div>
          {/* Pie chart skeleton */}
          <div className="flex items-center justify-center h-24">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-green-300 via-blue-300 via-orange-300 to-purple-300"></div>
              <div className="absolute inset-2 rounded-full bg-white/90"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-3 w-8 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-1 mt-2">
            {[
              { color: 'green' },
              { color: 'blue' },
              { color: 'orange' },
              { color: 'purple' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className={`w-2 h-2 bg-${item.color}-400 rounded`}></div>
                <div className="h-1 w-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom - Recent Transactions Table */}
      <div className="bg-white/50 rounded-lg p-2">
        <div className="h-1.5 w-20 bg-gray-300 rounded mb-1"></div>
        <div className="space-y-0.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2 p-1 bg-gray-50 rounded">
              <div className={`w-1 h-3 rounded ${
                i % 2 === 0 ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
              <div className="h-1 w-8 bg-gray-200 rounded"></div>
              <div className="flex-1 h-1 bg-gray-200 rounded"></div>
              <div className="h-1 w-10 bg-gray-200 rounded"></div>
              <div className={`h-1.5 w-8 rounded ${
                i % 2 === 0 ? 'bg-green-300' : 'bg-red-300'
              }`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetPreview;