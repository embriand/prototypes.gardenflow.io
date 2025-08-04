/**
 * Memory Status Indicator for Garden Vision
 * Shows current memory usage and provides tips when memory is high
 */

import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { memoryMonitor } from '../utils/memoryMonitor';

interface MemoryStatusIndicatorProps {
  showOnlyWhenHigh?: boolean;
  className?: string;
}

export const MemoryStatusIndicator: React.FC<MemoryStatusIndicatorProps> = ({ 
  showOnlyWhenHigh = true, 
  className = '' 
}) => {
  const [memoryStatus, setMemoryStatus] = useState<'safe' | 'warning' | 'critical'>('safe');
  const [memoryPercentage, setMemoryPercentage] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(!showOnlyWhenHigh);

  useEffect(() => {
    const updateMemoryStatus = () => {
      const stats = memoryMonitor.getCurrentMemoryUsage();
      
      if (stats) {
        setMemoryPercentage(Math.round(stats.percentage));
        
        if (memoryMonitor.isMemoryUsageCritical()) {
          setMemoryStatus('critical');
          setIsVisible(true);
        } else if (memoryMonitor.isMemoryUsageWarning()) {
          setMemoryStatus('warning');
          setIsVisible(true);
        } else {
          setMemoryStatus('safe');
          setIsVisible(!showOnlyWhenHigh);
        }
      } else {
        setMemoryStatus('safe');
        setIsVisible(!showOnlyWhenHigh);
      }
    };

    // Initial update
    updateMemoryStatus();

    // Set up periodic updates
    const interval = setInterval(updateMemoryStatus, 2000);

    return () => clearInterval(interval);
  }, [showOnlyWhenHigh]);

  if (!isVisible) {
    return null;
  }

  const getStatusConfig = () => {
    switch (memoryStatus) {
      case 'critical':
        return {
          icon: AlertCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-50 border-red-200',
          message: 'High memory usage detected',
          tips: [
            'Close other browser tabs',
            'Try a smaller image',
            'Restart your browser if issues persist'
          ]
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50 border-yellow-200',
          message: 'Memory usage is elevated',
          tips: [
            'Consider closing unused tabs',
            'Image processing may be slower'
          ]
        };
      case 'safe':
      default:
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bgColor: 'bg-green-50 border-green-200',
          message: 'Memory usage is normal',
          tips: []
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  const handleOptimizeMemory = () => {
    memoryMonitor.forceGarbageCollection();
  };

  return (
    <div className={`${config.bgColor} border rounded-lg p-3 ${className}`}>
      <div className="flex items-center space-x-2">
        <IconComponent size={16} className={config.color} />
        <span className="text-sm font-medium text-gray-700">
          {config.message}
        </span>
        <span className="text-xs text-gray-500">
          ({memoryPercentage}%)
        </span>
      </div>
      
      {config.tips.length > 0 && (
        <div className="mt-2">
          <div className="text-xs text-gray-600 mb-1">Tips to improve performance:</div>
          <ul className="text-xs text-gray-600 space-y-1">
            {config.tips.map((tip, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-1">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
          
          {memoryStatus !== 'safe' && (
            <button
              onClick={handleOptimizeMemory}
              className="mt-2 text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors"
            >
              Optimize Memory
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MemoryStatusIndicator;