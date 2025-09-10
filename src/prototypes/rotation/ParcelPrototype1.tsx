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
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;

      if (resizeHandle.includes('right')) newWidth = resizeStart.width + deltaX;
      if (resizeHandle.includes('left')) newWidth = resizeStart.width - deltaX;
      if (resizeHandle.includes('bottom')) newHeight = resizeStart.height + deltaY;
      if (resizeHandle.includes('top')) newHeight = resizeStart.height - deltaY;

      onResize({
        width: Math.max(50, newWidth),
        height: Math.max(50, newHeight)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  const handleRotate = (e) => {
    e.stopPropagation();
    const rect = shapeRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const startRotation = rotation;

    const handleMouseMove = (e) => {
      const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const deltaAngle = (currentAngle - startAngle) * (180 / Math.PI);
      onRotate((startRotation + deltaAngle + 360) % 360);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResize = (handle, e) => {
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
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart, resizeHandle]);

  const renderShape = () => {
    if (type === 'circle') {
      const radius = Math.min(size.width, size.height) / 2;
      return (
        <div
          className="absolute"
          style={{
            width: radius * 2,
            height: radius * 2,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: isSelected ? '2px solid #3b82f6' : '2px solid transparent'
          }}
        />
      );
    }
    return (
      <div
        className="absolute"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: type === 'rounded' ? '12px' : '0',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: isSelected ? '2px solid #3b82f6' : '2px solid transparent'
        }}
      />
    );
  };

  return (
    <div
      ref={shapeRef}
      className="absolute select-none"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center',
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isSelected ? 10 : 1
      }}
      onMouseDown={handleMouseDown}
    >
      {renderShape()}
      
      {isSelected && (
        <>
          {/* Resize handles */}
          <ResizeHandle position="top-left" onResize={handleResize} />
          <ResizeHandle position="top" onResize={handleResize} />
          <ResizeHandle position="top-right" onResize={handleResize} />
          <ResizeHandle position="right" onResize={handleResize} />
          <ResizeHandle position="bottom-right" onResize={handleResize} />
          <ResizeHandle position="bottom" onResize={handleResize} />
          <ResizeHandle position="bottom-left" onResize={handleResize} />
          <ResizeHandle position="left" onResize={handleResize} />
          
          {/* Rotation handle */}
          <div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-500 rounded-full cursor-grab hover:bg-blue-600 flex items-center justify-center"
            style={{ zIndex: 20 }}
            onMouseDown={handleRotate}
          >
            <RotateCw className="w-4 h-4 text-white" />
          </div>
          
          {/* Delete button */}
          <button
            className="absolute -top-8 -right-8 w-6 h-6 bg-red-500 rounded-full hover:bg-red-600 flex items-center justify-center"
            style={{ zIndex: 20 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        </>
      )}
    </div>
  );
};

const ParcelPrototype1 = () => {
  const [shapes, setShapes] = useState([
    {
      id: 1,
      position: { x: 100, y: 100 },
      size: { width: 150, height: 150 },
      rotation: 0,
      type: 'rectangle'
    }
  ]);
  const [selectedId, setSelectedId] = useState(null);
  const [nextId, setNextId] = useState(2);

  const addShape = (type) => {
    const newShape = {
      id: nextId,
      position: { x: Math.random() * 400 + 50, y: Math.random() * 300 + 50 },
      size: { width: 150, height: 150 },
      rotation: 0,
      type
    };
    setShapes([...shapes, newShape]);
    setNextId(nextId + 1);
    setSelectedId(newShape.id);
  };

  const updateShape = (id, updates) => {
    setShapes(shapes.map(shape => 
      shape.id === id ? { ...shape, ...updates } : shape
    ));
  };

  const deleteShape = (id) => {
    setShapes(shapes.filter(shape => shape.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Parcel Prototype 1 - Shape Manipulation</h1>
        
        <div className="mb-4 space-x-2">
          <button
            onClick={() => addShape('rectangle')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Square className="inline w-4 h-4 mr-2" />
            Add Rectangle
          </button>
          <button
            onClick={() => addShape('rounded')}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            <Square className="inline w-4 h-4 mr-2" />
            Add Rounded Rectangle
          </button>
          <button
            onClick={() => addShape('circle')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <Circle className="inline w-4 h-4 mr-2" />
            Add Circle
          </button>
        </div>
        
        <div 
          className="relative bg-white rounded-lg shadow-lg" 
          style={{ height: '600px' }}
          onClick={() => setSelectedId(null)}
        >
          {shapes.map(shape => (
            <Shape
              key={shape.id}
              data={shape}
              isSelected={selectedId === shape.id}
              onSelect={() => setSelectedId(shape.id)}
              onDelete={() => deleteShape(shape.id)}
              onRotate={(rotation) => updateShape(shape.id, { rotation })}
              onMove={(position) => updateShape(shape.id, { position })}
              onResize={(size) => updateShape(shape.id, { size })}
            />
          ))}
        </div>
        
        {selectedId && (
          <div className="mt-4 p-4 bg-white rounded shadow">
            <h3 className="font-semibold mb-2">Selected Shape Properties</h3>
            {shapes.filter(s => s.id === selectedId).map(shape => (
              <div key={shape.id} className="text-sm text-gray-600">
                <p>Position: x: {Math.round(shape.position.x)}, y: {Math.round(shape.position.y)}</p>
                <p>Size: {Math.round(shape.size.width)} × {Math.round(shape.size.height)}</p>
                <p>Rotation: {Math.round(shape.rotation)}°</p>
                <p>Type: {shape.type}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParcelPrototype1;