import React from "react";
import { Maximize, Grid, Award, TreeDeciduous } from "lucide-react";

// Interfaces
import type { GardenStats } from "../../models";

interface StatsDisplayProps {
  stats: GardenStats;
  bestLayout: GardenStats | null;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats, bestLayout }) => {
  const efficiency = ((stats.cultivatedArea / (stats.cultivatedArea + stats.pathArea)) * 100).toFixed(1);
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
          <Maximize className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm text-green-600">Cultivated Area</p>
            <p className="font-semibold text-green-800">{stats.cultivatedArea.toFixed(2)} m²</p>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
          <Grid className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm text-green-600">Path Area</p>
            <p className="font-semibold text-green-800">{stats.pathArea.toFixed(2)} m²</p>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
          <TreeDeciduous className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm text-green-600">Free Area</p>
            <p className="font-semibold text-green-800">{stats.freeArea.toFixed(2)} m²</p>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
          <Award className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm text-green-600">Efficiency</p>
            <p className="font-semibold text-green-800">{efficiency}%</p>
          </div>
        </div>
      </div>
      
      {bestLayout && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-medium text-yellow-800 mb-2">Best Layout Found</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-yellow-600">Cultivated Area</p>
              <p className="font-semibold text-yellow-800">{bestLayout.cultivatedArea.toFixed(2)} m²</p>
            </div>
            <div>
              <p className="text-yellow-600">Path Area</p>
              <p className="font-semibold text-yellow-800">{bestLayout.pathArea.toFixed(2)} m²</p>
            </div>
            <div>
              <p className="text-yellow-600">Free Area</p>
              <p className="font-semibold text-yellow-800">{bestLayout.freeArea.toFixed(2)} m²</p>
            </div>
            <div>
              <p className="text-yellow-600">Boxes</p>
              <p className="font-semibold text-yellow-800">{bestLayout.boxCount}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};