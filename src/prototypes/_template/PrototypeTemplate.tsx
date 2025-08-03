import React from 'react';
import type { PrototypeProps } from './types';

const PrototypeTemplate: React.FC<PrototypeProps> = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
            Your Prototype Name
          </h1>
          <p className="text-slate-600">
            Brief description of what this prototype does
          </p>
          
          {/* Feature highlights */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Key Features:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Feature 1</li>
              <li>• Feature 2</li>
              <li>• Feature 3</li>
            </ul>
          </div>
        </div>

        {/* Main content area */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Prototype Content</h2>
          
          {/* Add your prototype functionality here */}
          <div className="space-y-4">
            <p className="text-slate-600">
              Replace this content with your prototype implementation.
            </p>
            
            {/* Example interactive element */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-2">Interactive Element</h3>
              <p className="text-sm text-slate-600">
                Add your interactive components, forms, canvases, or other functionality here.
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>Prototype running in isolated environment • Port 5174</p>
        </div>
      </div>
    </div>
  );
};

export default PrototypeTemplate;