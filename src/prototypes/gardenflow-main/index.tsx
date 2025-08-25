import React, { useState } from 'react';
import './styles.css';

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Chargement...</p>
    </div>
  </div>
);

// Simple Sidebar Component
const SimpleSidebar: React.FC<{ 
  isExpanded: boolean; 
  setIsExpanded: (value: boolean) => void;
  activeView: string;
  onViewChange: (view: string) => void;
}> = ({ 
  isExpanded, 
  setIsExpanded,
  activeView,
  onViewChange
}) => {
  const menuItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'crop-planner', icon: '🌱', label: 'Crop Planner' },
    { id: 'tree-planner', icon: '🌳', label: 'Tree Planner' },
    { id: 'inventory', icon: '📦', label: 'Inventory' },
    { id: 'tasks', icon: '✓', label: 'Tasks' },
    { id: 'budget', icon: '💰', label: 'Budget' },
    { id: 'media', icon: '📸', label: 'Media' },
    { id: 'plots', icon: '🗺️', label: 'Plots' },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-50 ${
      isExpanded ? 'w-64' : 'w-20'
    }`}>
      <div className="p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isExpanded ? '←' : '☰'}
        </button>
      </div>
      
      <nav className="mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center px-4 py-3 hover:bg-gray-100 transition-colors ${
              activeView === item.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {isExpanded && <span className="ml-3 text-left">{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
};

// Simple Navigation Bar
const SimpleNavigation: React.FC<{ sidebarExpanded: boolean }> = ({ sidebarExpanded }) => {
  return (
    <div className={`fixed top-0 right-0 left-0 h-16 bg-white shadow-sm z-40 transition-all duration-300 ${
      sidebarExpanded ? 'ml-64' : 'ml-20'
    }`}>
      <div className="flex items-center justify-between h-full px-6">
        <h1 className="text-xl font-semibold text-gray-800">GardenFlow Prototype</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">No Auth Version</span>
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600">U</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Layout Component
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className={`w-full flex-1 ${isExpanded ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <SimpleNavigation sidebarExpanded={isExpanded} />
        
        <div className="w-full pt-16 px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
};

// Page Components
const Dashboard = () => (
  <div className="p-6 bg-white rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800">Active Projects</h3>
        <p className="text-3xl font-bold text-blue-600 mt-2">5</p>
      </div>
      <div className="p-4 bg-green-50 rounded-lg">
        <h3 className="font-semibold text-green-800">Plants</h3>
        <p className="text-3xl font-bold text-green-600 mt-2">127</p>
      </div>
      <div className="p-4 bg-purple-50 rounded-lg">
        <h3 className="font-semibold text-purple-800">Tasks</h3>
        <p className="text-3xl font-bold text-purple-600 mt-2">23</p>
      </div>
    </div>
    <p className="mt-6 text-gray-600">
      Welcome to the GardenFlow prototype without authentication. This is a simplified version 
      for testing UI components and workflows.
    </p>
  </div>
);

const CropPlanner = () => (
  <div className="p-6 bg-white rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-4">Crop Planner</h2>
    <p className="text-gray-600">Crop planning interface will be loaded here.</p>
    <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
      <p className="text-center text-gray-500">Crop Planner Component Placeholder</p>
    </div>
  </div>
);

const TreePlanner = () => (
  <div className="p-6 bg-white rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-4">Tree Planner</h2>
    <p className="text-gray-600">Tree planning interface will be loaded here.</p>
    <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
      <p className="text-center text-gray-500">Tree Planner Component Placeholder</p>
    </div>
  </div>
);

const Inventory = () => (
  <div className="p-6 bg-white rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-4">Inventory Manager</h2>
    <p className="text-gray-600">Inventory management interface will be loaded here.</p>
    <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
      <p className="text-center text-gray-500">Inventory Manager Component Placeholder</p>
    </div>
  </div>
);

const Tasks = () => (
  <div className="p-6 bg-white rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-4">Task Manager</h2>
    <p className="text-gray-600">Task management interface will be loaded here.</p>
    <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
      <p className="text-center text-gray-500">Task Manager Component Placeholder</p>
    </div>
  </div>
);

const Budget = () => (
  <div className="p-6 bg-white rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-4">Budget Dashboard</h2>
    <p className="text-gray-600">Budget tracking interface will be loaded here.</p>
    <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
      <p className="text-center text-gray-500">Budget Dashboard Component Placeholder</p>
    </div>
  </div>
);

const Media = () => (
  <div className="p-6 bg-white rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-4">Media Manager</h2>
    <p className="text-gray-600">Media management interface will be loaded here.</p>
    <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
      <p className="text-center text-gray-500">Media Manager Component Placeholder</p>
    </div>
  </div>
);

const Plots = () => (
  <div className="p-6 bg-white rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-4">Plots & Parcels</h2>
    <p className="text-gray-600">Plots management interface will be loaded here.</p>
    <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
      <p className="text-center text-gray-500">Plots Manager Component Placeholder</p>
    </div>
  </div>
);

// Main GardenFlow Prototype Component
const GardenFlowMain: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [isExpanded, setIsExpanded] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'crop-planner':
        return <CropPlanner />;
      case 'tree-planner':
        return <TreePlanner />;
      case 'inventory':
        return <Inventory />;
      case 'tasks':
        return <Tasks />;
      case 'budget':
        return <Budget />;
      case 'media':
        return <Media />;
      case 'plots':
        return <Plots />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="gardenflow-main-container">
      <div className="flex min-h-screen bg-gray-50">
        <SimpleSidebar 
          isExpanded={isExpanded} 
          setIsExpanded={setIsExpanded}
          activeView={activeView}
          onViewChange={setActiveView}
        />
        
        <div className={`w-full flex-1 ${isExpanded ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
          <SimpleNavigation sidebarExpanded={isExpanded} />
          
          <div className="w-full pt-16 px-6 py-4">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GardenFlowMain;