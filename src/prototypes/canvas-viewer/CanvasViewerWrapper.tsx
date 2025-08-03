import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../../store/canvasStore';
import CanvasViewer from './CanvasViewer';

const CanvasViewerWrapper = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
            Canvas Viewer
          </h1>
          <p className="text-slate-600">
            Interactive 3D shape canvas with advanced tooling and grid system
          </p>
          
          {/* Feature highlights */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Key Features:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Interactive 3D shape manipulation</li>
              <li>• Grid system with snap-to-grid functionality</li>
              <li>• Advanced toolbox with shape library</li>
              <li>• Undo/Redo history management</li>
              <li>• Real-time canvas rendering</li>
            </ul>
          </div>
        </div>

        {/* Canvas Viewer with Redux Provider */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50">
          <Provider store={store}>
            <CanvasViewer />
          </Provider>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>Canvas Viewer prototype • Interactive 3D shape manipulation</p>
        </div>
      </div>
    </div>
  );
};

export default CanvasViewerWrapper;