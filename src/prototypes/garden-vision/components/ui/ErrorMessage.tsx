import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center space-y-4 ${className}`}>
      <div className="text-red-500">
        <AlertTriangle size={48} />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Something went wrong</h3>
        <p className="text-sm text-gray-600 max-w-md">{message}</p>
      </div>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <RefreshCw size={16} className="mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
};