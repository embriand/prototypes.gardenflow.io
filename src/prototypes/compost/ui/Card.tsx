// File: components/compost/ui/card.tsx
import React from 'react';

export interface FillLevelIndicatorProps {
  level: number;
}

export const FillLevelIndicator: React.FC<FillLevelIndicatorProps> = ({ level }) => {
  // Get color based on fill level
  const getColorByLevel = (fillLevel: number): string => {
    if (fillLevel < 30) return 'bg-yellow-400'; // Low fill
    if (fillLevel < 70) return 'bg-blue-400';   // Medium fill
    if (fillLevel < 90) return 'bg-green-400';  // Good fill
    return 'bg-red-400';                        // Almost full/full
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${getColorByLevel(level)}`}
        style={{ width: `${level}%` }}
      ></div>
    </div>
  );
};

// Export other card components...
// These are placeholders since we don't have the implementation in the provided code
export interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className || ''}`}>
    {children}
  </div>
);

export interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ className, children }) => (
  <div className={`flex flex-col space-y-1.5 p-4 ${className || ''}`}>{children}</div>
);

export interface CardTitleProps {
  className?: string;
  children: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = ({ className, children }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className || ''}`}>{children}</h3>
);

export interface CardDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ className, children }) => (
  <p className={`text-sm text-muted-foreground ${className || ''}`}>{children}</p>
);

export interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ className, children }) => (
  <div className={`p-4 pt-0 ${className || ''}`}>{children}</div>
);

export interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({ className, children }) => (
  <div className={`flex items-center p-4 pt-0 ${className || ''}`}>{children}</div>
);
  
  
  // File: components/compost/ui/FillLevelIndicator.js
  