import React from 'react';

const PrototypeLoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header Skeleton */}
      <div className="mb-8 p-8 animate-pulse">
        <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-64 mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-96"></div>
        
        {/* Feature highlights skeleton */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="h-5 bg-blue-200 rounded w-32 mb-2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-blue-150 rounded w-full"></div>
            <div className="h-3 bg-blue-150 rounded w-5/6"></div>
            <div className="h-3 bg-blue-150 rounded w-4/5"></div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-3xl shadow-xl p-8">
          <div className="space-y-6 animate-pulse">
            {/* Content area */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Skeleton cards */}
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-slate-200 rounded-2xl h-48 animate-pulse">
                  <div className="p-4 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="w-8 h-8 bg-slate-300 rounded-lg"></div>
                      <div className="w-16 h-5 bg-slate-300 rounded"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-5 bg-slate-300 rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-300 rounded"></div>
                        <div className="h-3 bg-slate-300 rounded w-5/6"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="h-3 bg-slate-300 rounded w-20"></div>
                        <div className="h-3 bg-slate-300 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Loading message */}
            <div className="text-center py-12">
              <div className="inline-flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce"></div>
                <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <p className="text-slate-600 mt-4">Loading prototype components...</p>
              <p className="text-sm text-slate-500 mt-2">Optimizing with lazy loading</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrototypeLoadingSkeleton;