import React from 'react';
import { Plus, Settings, User } from 'lucide-react';

export const SimpleDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16">
      {/* Template Banner */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-center py-2 mt-4">
        <p className="text-sm font-medium">🎯 Guide Tour Template - Interactive Demo</p>
      </div>
      
      {/* Header - positioned to avoid main app header */}
      <header className="relative bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🌱</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Guide Tour - Garden Manager</h1>
            </div>
            <div className="flex items-center space-x-4 relative">
              <button
                data-tour="settings-button"
                className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all duration-200 hover:shadow-sm relative z-10"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                data-tour="profile-button"
                className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all duration-200 hover:shadow-sm relative z-10"
                title="Profile"
              >
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Welcome Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Welcome to Your Garden</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Start managing your garden with our intuitive tools. Create gardens, track crops, and plan your harvest.
            </p>
            <button
              data-tour="create-garden"
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium relative z-10"
              title="Create Your First Garden"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Garden</span>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Garden Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl border border-green-200/50">
                <span className="text-green-800 font-semibold">Active Gardens</span>
                <span className="text-green-600 font-bold text-lg">0</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50">
                <span className="text-blue-800 font-semibold">Planted Crops</span>
                <span className="text-blue-600 font-bold text-lg">0</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl border border-amber-200/50">
                <span className="text-amber-800 font-semibold">Pending Tasks</span>
                <span className="text-amber-600 font-bold text-lg">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-3">Create Gardens</h3>
            <p className="text-sm text-gray-700 leading-relaxed">Design and plan your garden spaces with our intuitive tools.</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-3">Manage Crops</h3>
            <p className="text-sm text-gray-700 leading-relaxed">Track growth stages and harvest schedules for all your plants.</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-3">Plan Tasks</h3>
            <p className="text-sm text-gray-700 leading-relaxed">Schedule watering, fertilizing, and maintenance activities.</p>
          </div>
        </div>
      </main>
    </div>
  );
};