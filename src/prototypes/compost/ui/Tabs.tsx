// File: components/compost/ui/Tabs.tsx
import React, { useState, ReactNode, ReactElement } from 'react';

interface TabsProps {
  children: ReactNode;
  defaultValue: string;
}

export const Tabs: React.FC<TabsProps> = ({ children, defaultValue }) => {
  const [activeTab, setActiveTab] = useState<string>(defaultValue);
  
  return (
    <div className="space-y-4">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          if (child.type === TabsList) {
            return React.cloneElement(child as ReactElement<TabsListProps>, { activeTab, setActiveTab });
          }
          if (child.type === TabsContent) {
            return React.cloneElement(child as ReactElement<TabsContentProps>, { activeTab });
          }
        }
        return child;
      })}
    </div>
  );
};

interface TabsListProps {
  children: ReactNode;
  activeTab?: string;
  setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
}

export const TabsList: React.FC<TabsListProps> = ({ children, activeTab, setActiveTab }) => (
  <div className="flex space-x-1 border-b">
    {React.Children.map(children, child => {
      if (React.isValidElement(child) && child.type === TabsTrigger) {
        return React.cloneElement(child as ReactElement<TabsTriggerProps>, { activeTab, setActiveTab });
      }
      return child;
    })}
  </div>
);

interface TabsTriggerProps {
  children: ReactNode;
  value: string;
  activeTab?: string;
  setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ children, value, activeTab, setActiveTab }) => (
  <button
    className={`px-4 py-2 text-sm font-medium ${activeTab === value 
      ? 'border-b-2 border-blue-500 text-blue-600' 
      : 'text-gray-500 hover:text-gray-700'}`}
    onClick={() => setActiveTab && setActiveTab(value)}
  >
    {children}
  </button>
);

interface TabsContentProps {
  children: ReactNode;
  value: string;
  activeTab?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({ children, value, activeTab }) => {
  if (activeTab !== value) return null;
  return <div>{children}</div>;
};