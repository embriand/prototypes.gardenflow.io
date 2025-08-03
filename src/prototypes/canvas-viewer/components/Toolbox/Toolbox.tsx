import { Button } from '../ui/button';
import { ChevronLeft, Layers, Settings as SettingsIcon } from 'lucide-react';
import { ShapesList } from './ShapesList';
import { Settings } from './Settings';

interface ToolboxProps {
  isOpen: boolean;
  activeTab: string;
  showGrid: boolean;
  snapToGrid: boolean;
  viewMode: '2d' | '3d' | 'flat';
  onClose: () => void;
  onTabChange: (tab: string) => void;
  onShapeDragStart: (shape: any) => void;
  onToggleGrid: () => void;
  onToggleSnap: () => void;
  onViewModeChange: (mode: '2d' | '3d' | 'flat') => void;
}

export const Toolbox = ({
  isOpen,
  activeTab,
  showGrid,
  snapToGrid,
  viewMode,
  onClose,
  onTabChange,
  onShapeDragStart,
  onToggleGrid,
  onToggleSnap,
  onViewModeChange,
}: ToolboxProps) => {
  if (!isOpen) return null;

  return (
    <div className="game-panel floating-panel rounded-lg w-64">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h3 className="font-bold text-lg">Toolbox</h3>
        <Button
          onClick={onClose}
          variant="outline"
          className="game-button p-2"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4">
        <div className="flex gap-2 mb-4">
          <Button
            onClick={() => onTabChange('shapes')}
            variant={activeTab === 'shapes' ? 'default' : 'outline'}
            className="game-button flex-1"
          >
            <Layers className="w-4 h-4 mr-2" />
            Shapes
          </Button>
          <Button
            onClick={() => onTabChange('settings')}
            variant={activeTab === 'settings' ? 'default' : 'outline'}
            className="game-button flex-1"
          >
            <SettingsIcon className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>

        {activeTab === 'shapes' && (
          <ShapesList onShapeDragStart={onShapeDragStart} />
        )}

        {activeTab === 'settings' && (
          <Settings
            showGrid={showGrid}
            snapToGrid={snapToGrid}
            viewMode={viewMode}
            onToggleGrid={onToggleGrid}
            onToggleSnap={onToggleSnap}
            onViewModeChange={onViewModeChange}
          />
        )}
      </div>
    </div>
  );
};