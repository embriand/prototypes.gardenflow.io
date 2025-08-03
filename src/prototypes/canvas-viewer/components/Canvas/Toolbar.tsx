import React from 'react';
import { Button } from '../ui/button';
import {
  ChevronRight,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Trash2
} from 'lucide-react';

interface ToolbarProps {
  isToolboxOpen: boolean;
  historyIndex: number;
  historyLength: number;
  zoom: number;
  selectedObject: any | null;
  onOpenToolbox: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoom: (delta: number) => void;
  onRotate: () => void;
  onDelete: () => void;
}

export const Toolbar = ({
  isToolboxOpen,
  historyIndex,
  historyLength,
  zoom,
  selectedObject,
  onOpenToolbox,
  onUndo,
  onRedo,
  onZoom,
  onRotate,
  onDelete,
}: ToolbarProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-800">
      <div className="flex items-center gap-4">
        {!isToolboxOpen && (
          <Button
            onClick={onOpenToolbox}
            variant="outline"
            className="game-button p-2"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
          Canvas Viewer
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={onUndo}
            variant="outline"
            className="game-button p-2"
            disabled={historyIndex <= 0}
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            onClick={onRedo}
            variant="outline"
            className="game-button p-2"
            disabled={historyIndex >= historyLength - 1}
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex gap-2 bg-gray-800/50 p-1 rounded-lg">
          <Button
            onClick={() => onZoom(-0.1)}
            variant="outline"
            className="game-button p-2"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="flex items-center px-2 font-mono">
            {(zoom * 100).toFixed(0)}%
          </span>
          <Button
            onClick={() => onZoom(0.1)}
            variant="outline"
            className="game-button p-2"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        {selectedObject && (
          <>
            <Button
              onClick={onRotate}
              variant="outline"
              className="game-button p-2"
              disabled={!selectedObject?.rotatable}
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              onClick={onDelete}
              className="game-button bg-red-500/20 hover:bg-red-500/30"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
};