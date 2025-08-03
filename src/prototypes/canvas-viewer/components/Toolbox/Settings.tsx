import React from 'react';
import { Button } from '../ui/button';
import { Grid, Magnet, Square, Layers } from 'lucide-react';

interface SettingsProps {
  showGrid: boolean;
  snapToGrid: boolean;
  viewMode: '2d' | '3d' | 'flat';
  onToggleGrid: () => void;
  onToggleSnap: () => void;
  onViewModeChange: (mode: '2d' | '3d' | 'flat') => void;
}

export const Settings = ({
  showGrid,
  snapToGrid,
  viewMode,
  onToggleGrid,
  onToggleSnap,
  onViewModeChange,
}: SettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Grid Settings</label>
        <div className="flex gap-2">
          <Button
            onClick={onToggleGrid}
            variant="outline"
            className="game-button flex-1"
          >
            <Grid className="w-4 h-4 mr-2" />
            {showGrid ? 'Hide Grid' : 'Show Grid'}
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onToggleSnap}
            variant="outline"
            className="game-button flex-1"
          >
            <Magnet className="w-4 h-4 mr-2" />
            {snapToGrid ? 'Disable Snap' : 'Enable Snap'}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">View Settings</label>
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => onViewModeChange('flat')}
            variant={viewMode === 'flat' ? 'default' : 'outline'}
            className="game-button w-full justify-start"
          >
            <Square className="w-4 h-4 mr-2" />
            Flat View
          </Button>
          <Button
            onClick={() => onViewModeChange('2d')}
            variant={viewMode === '2d' ? 'default' : 'outline'}
            className="game-button w-full justify-start"
          >
            <Square className="w-4 h-4 mr-2" />
            Front View
          </Button>
          <Button
            onClick={() => onViewModeChange('3d')}
            variant={viewMode === '3d' ? 'default' : 'outline'}
            className="game-button w-full justify-start"
          >
            <Layers className="w-4 h-4 mr-2" />
            3D View
          </Button>
        </div>
      </div>
    </div>
  );
};