// File: components/compost/ui/Alert.tsx
import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ children, className = "" }) => (
  <div className={`bg-blue-50 border border-blue-200 rounded-md p-4 ${className}`}>
    {children}
  </div>
);

interface AlertTitleProps {
  children: React.ReactNode;
}

export const AlertTitle: React.FC<AlertTitleProps> = ({ children }) => (
  <h4 className="text-sm font-medium text-blue-800">
    {children}
  </h4>
);

interface AlertDescriptionProps {
  children: React.ReactNode;
}

export const AlertDescription: React.FC<AlertDescriptionProps> = ({ children }) => (
  <div className="text-sm text-blue-700">
    {children}
  </div>
);