import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface LoadingFallbackProps {
  message?: string;
  showLogo?: boolean;
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  message = "Loading prototype...", 
  showLogo = true 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
      <div className="text-center">
        {showLogo && (
          <div className="mb-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg inline-block animate-pulse">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
          <span className="text-lg font-medium text-slate-700">{message}</span>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="bg-slate-200 rounded-full h-1 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <p className="text-sm text-slate-500 mt-4">
          Optimizing performance with lazy loading...
        </p>
      </div>
    </div>
  );
};

export default LoadingFallback;