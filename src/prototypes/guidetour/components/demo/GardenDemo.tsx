import React from 'react';
import { Plus, Save, Palette, Calendar, Package } from 'lucide-react';

export const GardenDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Garden Manager</h1>
              <nav className="flex space-x-6">
                <a href="#" className="text-blue-600 font-medium">Gardens</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Studio</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Inventory</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Tasks</a>
              </nav>
            </div>
            <div className="flex items-center space-x-3">
              <button
                data-tutorial="create-garden"
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Garden</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Garden Creation Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Garden</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="garden-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Garden Name
                  </label>
                  <input
                    type="text"
                    id="garden-name"
                    data-tutorial="garden-name"
                    placeholder="My Vegetable Garden"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="garden-width" className="block text-sm font-medium text-gray-700 mb-1">
                      Width (feet)
                    </label>
                    <input
                      type="number"
                      id="garden-width"
                      data-tutorial="garden-size"
                      placeholder="20"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="garden-height" className="block text-sm font-medium text-gray-700 mb-1">
                      Height (feet)
                    </label>
                    <input
                      type="number"
                      id="garden-height"
                      placeholder="15"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  data-tutorial="save-garden"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Garden</span>
                </button>
              </div>
            </div>

            {/* Studio Canvas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Garden Studio</h2>
              <div
                data-tutorial="studio-canvas"
                className="w-full h-96 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
              >
                <div className="text-center text-gray-500">
                  <Palette className="w-12 h-12 mx-auto mb-2" />
                  <p>Drag items from the palette to design your garden</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tool Palette */}
            <div data-tutorial="tool-palette" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tool Palette</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Parcels</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div
                      data-tutorial="parcel-tool"
                      className="p-3 bg-green-50 border border-green-200 rounded-lg cursor-pointer hover:bg-green-100 transition-colors text-center"
                    >
                      <div className="w-8 h-8 bg-green-200 rounded mx-auto mb-1"></div>
                      <span className="text-xs text-green-700">Parcel</span>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors text-center">
                      <div className="w-8 h-8 bg-blue-200 rounded mx-auto mb-1"></div>
                      <span className="text-xs text-blue-700">Zone</span>
                    </div>
                  </div>
                </div>

                <div data-tutorial="crops-section">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Crops</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors text-center">
                      <div className="w-8 h-8 bg-orange-200 rounded-full mx-auto mb-1"></div>
                      <span className="text-xs text-orange-700">Tomato</span>
                    </div>
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors text-center">
                      <div className="w-8 h-8 bg-purple-200 rounded-full mx-auto mb-1"></div>
                      <span className="text-xs text-purple-700">Lettuce</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button
                  data-tutorial="crop-dashboard"
                  className="w-full flex items-center space-x-3 p-3 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  <Package className="w-5 h-5 text-amber-600" />
                  <span className="text-amber-700 font-medium">Crop Dashboard</span>
                </button>
                
                <button
                  data-tutorial="task-manager"
                  className="w-full flex items-center space-x-3 p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span className="text-purple-700 font-medium">Task Manager</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};