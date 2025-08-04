import React from 'react';

interface FillLevelIndicatorProps {
  level: number;
}

export const FillLevelIndicator: React.FC<FillLevelIndicatorProps> = ({ level }) => (
  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
    <div 
      className={`h-full transition-all duration-300 ${
        level > 90 ? 'bg-red-500' : 
        level > 70 ? 'bg-green-500' : 
        level > 30 ? 'bg-blue-500' : 
        'bg-yellow-500'
      }`}
      style={{ width: `${level}%` }}
    />
  </div>
);