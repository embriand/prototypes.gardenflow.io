import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, Trash2, Square, Circle } from 'lucide-react';

const ResizeHandle = ({ position, onResize }) => (
  <div
    className="absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-full hover:border-blue-600"
    style={{
      top: position.includes('top') ? '-6px' : position.includes('bottom') ? 'calc(100% - 6px)' : 'calc(50% - 6px)',
      left: position.includes('left') ? '-6px' : position.includes('right') ? 'calc(100% - 6px)' : 'calc(50% - 6px)',
      cursor: position.match(/(top-left|bottom-right)/) ? 'nwse-resize' 
             : position.match(/(top-right|bottom-left)/) ? 'nesw-resize'
             : position.match(/(left|right)/) ? 'ew-resize'
             : 'ns-resize',
      zIndex: 20
    }}
    onMouseDown={(e) => {
      e.stopPropagation();
      onResize(position, e);
    }}
  />
);

const Shape = ({ data, isSelected, onSelect, onDelete, onRotate, onMove, onResize }) => {
  const { position, size, rotation = 0, type = 'rectangle' } = data;
  const shapeRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [resizeHandle, setResizeHandle] = useState(null);

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
      onSelect();
      e.stopPropagation();
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      onMove({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    } else if (isResizing) {
      const dx = e.clientX - resizeStart.x;
      const dy = e.clientY - resizeStart.y;
      
      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = position.x;
      let newY = position.y;

      if (resizeHandle.includes('right')) {
        newWidth = Math.max(50, resizeStart.width + dx);
      }
      if (resizeHandle.includes('left')) {
        const maxLeftMove = resizeStart.width - 50;
        const actualLeftMove = Math.max(-maxLeftMove, Math.min(dx, resizeStart.width - 50));
        newWidth = resizeStart.width - actualLeftMove;
        newX = position.x + actualLeftMove;
      }
      if (resizeHandle.includes('bottom')) {
        newHeight = Math.max(50, resizeStart.height + dy);
      }
      if (resizeHandle.includes('top')) {
        const maxTopMove = resizeStart.height - 50;
        const actualTopMove = Math.max(-maxTopMove, Math.min(dy, resizeStart.height - 50));
        newHeight = resizeStart.height - actualTopMove;
        newY = position.y + actualTopMove;
      }

      onResize({
        size: { width: newWidth, height: newHeight },
        position: { x: newX, y: newY }
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  const handleResizeStart = (handle, e) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing]);

  return (
    <div
      ref={shapeRef}
      className={`absolute cursor-move ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
        width: size.width,
        height: size.height,
        transition: isDragging ? 'none' : 'transform 0.2s',
        zIndex: isSelected ? 10 : 1
      }}
      onMouseDown={handleMouseDown}
    >
      <div 
        className={`w-full h-full bg-white shadow-lg border border-gray-200
          ${type === 'circle' ? 'rounded-full' : 'rounded-lg'}`}
      />
      
      {isSelected && (
        <>
          <div className="absolute -top-12 left-0 bg-white shadow-lg rounded-lg flex gap-1 p-1 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRotate();
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 hover:bg-gray-100 rounded text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <ResizeHandle position="top-left" onResize={handleResizeStart} />
          <ResizeHandle position="top" onResize={handleResizeStart} />
          <ResizeHandle position="top-right" onResize={handleResizeStart} />
          <ResizeHandle position="right" onResize={handleResizeStart} />
          <ResizeHandle position="bottom-right" onResize={handleResizeStart} />
          <ResizeHandle position="bottom" onResize={handleResizeStart} />
          <ResizeHandle position="bottom-left" onResize={handleResizeStart} />
          <ResizeHandle position="left" onResize={handleResizeStart} />
        </>
      )}
    </div>
  );
};

const Toolbox = ({ selectedTool, onToolSelect }) => (
  <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
    <div className="bg-white rounded-2xl shadow-lg px-4 py-2 flex items-center gap-2 border border-gray-200">
      <button
        onClick={() => onToolSelect('rectangle')}
        className={`p-2 rounded-lg transition-all duration-200 hover:bg-gray-200 relative group
          ${selectedTool === 'rectangle' ? 'bg-gray-200' : 'bg-transparent'}`}
      >
        <Square 
          size={24} 
          className={selectedTool === 'rectangle' ? 'text-blue-600' : 'text-gray-600'} 
        />
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Rectangle
        </span>
      </button>

      <button
        onClick={() => onToolSelect('circle')}
        className={`p-2 rounded-lg transition-all duration-200 hover:bg-gray-200 relative group
          ${selectedTool === 'circle' ? 'bg-gray-200' : 'bg-transparent'}`}
      >
        <Circle 
          size={24} 
          className={selectedTool === 'circle' ? 'text-blue-600' : 'text-gray-600'} 
        />
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Circle
        </span>
      </button>
    </div>
  </div>
);

const InteractiveCanvas = () => {
  const [shapes, setShapes] = useState([]);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [isDraggingNew, setIsDraggingNew] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [currentShape, setCurrentShape] = useState(null);
  const [selectedTool, setSelectedTool] = useState('rectangle');
  const canvasRef = useRef(null);

  const handleCanvasMouseDown = (e) => {
    if (e.target === canvasRef.current) {
      setIsDraggingNew(true);
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setDragStart({ x, y });
      
      const newShape = {
        id: Date.now(),
        type: selectedTool,
        position: { x, y },
        size: { width: 0, height: 0 },
        rotation: 0
      };
      
      setCurrentShape(newShape);
      setSelectedShapeId(newShape.id);
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (isDraggingNew && currentShape) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const width = x - dragStart.x;
      const height = y - dragStart.y;
      
      // For circles, make width and height equal
      const size = currentShape.type === 'circle' 
        ? { width: Math.abs(width), height: Math.abs(width) }
        : { width: Math.abs(width), height: Math.abs(height) };
      
      const newShape = {
        ...currentShape,
        size,
        position: {
          x: width < 0 ? x : dragStart.x,
          y: currentShape.type === 'circle'
            ? (width < 0 ? y - Math.abs(width) : dragStart.y)
            : (height < 0 ? y : dragStart.y)
        }
      };
      
      setCurrentShape(newShape);
    }
  };

  const handleCanvasMouseUp = () => {
    if (isDraggingNew && currentShape && 
        currentShape.size.width > 10 && currentShape.size.height > 10) {
      setShapes([...shapes, currentShape]);
    }
    setIsDraggingNew(false);
    setCurrentShape(null);
  };

  const handleShapeMove = (id, newPosition) => {
    setShapes(shapes.map(shape => 
      shape.id === id ? { ...shape, position: newPosition } : shape
    ));
  };

  const handleShapeResize = (id, updates) => {
    setShapes(shapes.map(shape => {
      if (shape.id === id) {
        if (shape.type === 'circle') {
          // Keep circle proportional
          const maxDim = Math.max(updates.size.width, updates.size.height);
          return {
            ...shape,
            ...updates,
            size: { width: maxDim, height: maxDim }
          };
        }
        return { ...shape, ...updates };
      }
      return shape;
    }));
  };

  const handleShapeRotate = (id) => {
    setShapes(shapes.map(shape =>
      shape.id === id ? { ...shape, rotation: (shape.rotation + 90) % 360 } : shape
    ));
  };

  const handleShapeDelete = (id) => {
    setShapes(shapes.filter(shape => shape.id !== id));
    setSelectedShapeId(null);
  };

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current) {
      setSelectedShapeId(null);
    }
  };

  return (
    <div
      ref={canvasRef}
      className="w-full h-screen bg-gray-100 relative overflow-hidden"
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onClick={handleCanvasClick}
    >
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-4 text-sm text-gray-600">
        Select a shape from the toolbar below.<br />
        Click and drag on the canvas to create shapes.<br />
        Click a shape to select it and see controls.
      </div>
      
      {shapes.map((shape) => (
        <Shape
          key={shape.id}
          data={shape}
          isSelected={shape.id === selectedShapeId}
          onSelect={() => setSelectedShapeId(shape.id)}
          onDelete={() => handleShapeDelete(shape.id)}
          onRotate={() => handleShapeRotate(shape.id)}
          onMove={(newPosition) => handleShapeMove(shape.id, newPosition)}
          onResize={(updates) => handleShapeResize(shape.id, updates)}
        />
      ))}
      
      {currentShape && (
        <div
          className={`absolute border-2 border-dashed border-blue-500 pointer-events-none
            ${currentShape.type === 'circle' ? 'rounded-full' : ''}`}
          style={{
            left: currentShape.position.x,
            top: currentShape.position.y,
            width: currentShape.size.width,
            height: currentShape.size.height,
            zIndex: 30
          }}
        />
      )}

      <Toolbox 
        selectedTool={selectedTool}
        onToolSelect={setSelectedTool}
      />
    </div>
  );
};

export default InteractiveCanvas;