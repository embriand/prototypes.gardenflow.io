import React from "react";
import { RefreshCw, Award, Save, MoveVertical } from "lucide-react";
import { useGardenOptimizer } from "../../hooks/useGardenOptimizer";
import { StatsDisplay } from "./StatsDisplay";
import { GardenCanvas } from "./GardenCanvas";
import { SavedLayouts } from "./SavedLayouts";

const GardenPlanner = () => {
  const {
    boxes,
    stats,
    bestLayout,
    createOptimizedLayout,
    isOptimal,
    direction,
    toggleDirection,
    savedLayouts,
    saveCurrentLayout,
    loadLayout
  } = useGardenOptimizer();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-20">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-green-800">Garden Planner</h1>
          <p className="text-green-600">Optimize your garden layout with automated box placement</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={createOptimizedLayout}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Generate New Layout
            </button>
            <button
              onClick={toggleDirection}
              className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <MoveVertical className="w-5 h-5" />
              {direction === 'horizontal' ? 'Left to Right' : 'Top to Bottom'}
            </button>
            <button
              onClick={saveCurrentLayout}
              className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 font-medium py-3 px-6 rounded-lg transition-colors"
              disabled={boxes.length === 0}
            >
              <Save className="w-5 h-5" />
              Save Layout
            </button>
            {isOptimal && (
              <div className="flex items-center gap-2 px-4 bg-yellow-50 text-yellow-700 rounded-lg">
                <Award className="w-5 h-5" />
                <span className="text-sm font-medium">Best Layout!</span>
              </div>
            )}
          </div>

          <StatsDisplay stats={stats} bestLayout={bestLayout} />
          <GardenCanvas boxes={boxes} />
          <SavedLayouts layouts={savedLayouts} onLoad={loadLayout} />
        </div>
      </div>
    </div>
  );
};

export default GardenPlanner;