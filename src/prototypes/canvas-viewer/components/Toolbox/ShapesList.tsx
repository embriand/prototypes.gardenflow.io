import React from 'react';
import { SHAPES } from '../../data/shapes';

interface ShapesListProps {
  onShapeDragStart: (shape: any) => void;
}

export const ShapesList = ({ onShapeDragStart }: ShapesListProps) => {
  const handleDragStart = (e: React.DragEvent, shape: any) => {
    // Set the drag data
    e.dataTransfer.setData('application/json', JSON.stringify({
      ...shape.defaultProps,
      type: shape.type,
      color: shape.color,
      rotatable: shape.rotatable,
      scalable: shape.scalable,
    }));
    
    // Call the parent handler
    onShapeDragStart(shape);
  };

  return (
    <div className="space-y-2">
      {SHAPES.map((shape) => {
        const Icon = shape.icon;
        return (
          <div
            key={shape.type}
            draggable
            onDragStart={(e) => handleDragStart(e, shape)}
            className="toolbox-item flex items-center gap-3 p-3 rounded-lg cursor-move hover:bg-gray-800/30"
          >
            <Icon className="w-5 h-5" style={{ color: shape.color }} />
            <span className="font-medium">{shape.label}</span>
          </div>
        );
      })}
    </div>
  );
};