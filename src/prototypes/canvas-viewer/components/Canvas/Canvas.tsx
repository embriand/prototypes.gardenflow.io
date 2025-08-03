import React from 'react';

interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  width: number;
  height: number;
  isDragging: boolean;
  cursorStyle: string;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export const Canvas = ({
  canvasRef,
  width,
  height,
  isDragging,
  cursorStyle,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onDragOver,
  onDrop,
}: CanvasProps) => {
  return (
    <div className="p-4">
      <div className="canvas-container rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="w-full"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          style={{ cursor: isDragging ? 'grabbing' : cursorStyle }}
        />
      </div>
    </div>
  );
};