import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Pentagon } from 'lucide-react';

// Toolbox component
const Toolbox = ({ selectedTool, onToolSelect }) => (
  <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
    <div className="bg-white rounded-2xl shadow-lg px-4 py-2 flex items-center gap-2 border border-gray-200">
      <button
        onClick={() => onToolSelect('polygon')}
        className={`p-2 rounded-lg transition-all duration-200 hover:bg-gray-200 relative group
          ${selectedTool === 'polygon' ? 'bg-gray-200' : 'bg-transparent'}`}
      >
        <Pentagon 
          size={24} 
          className={selectedTool === 'polygon' ? 'text-blue-600' : 'text-gray-600'} 
        />
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Free Form Polygon
        </span>
      </button>
    </div>
  </div>
);

// PolygonShape component
const PolygonShape = ({ data, isSelected, onSelect, onDelete, onPointMove, onShapeMove }) => {
  const { points, position = { x: 0, y: 0 } } = data;
  const [selectedPointIndex, setSelectedPointIndex] = useState(null);
  const shapeRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleShapeMouseDown = (e) => {
    if (e.target === shapeRef.current || e.target.tagName === 'path') {
      e.stopPropagation();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
      onSelect();
    }
  };

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e) => {
        onShapeMove({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      };

      const handleMouseUp = () => {
        setIsDragging(false);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, onShapeMove]);

  return (
    <div
      ref={shapeRef}
      className="absolute"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: isSelected ? 10 : 1,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleShapeMouseDown}
    >
      <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
        <path
          d={`M ${points.map(p => `${p.x} ${p.y}`).join(' L ')} Z`}
          fill="white"
          stroke={isSelected ? 'blue' : 'gray'}
          strokeWidth="2"
          className="shadow-lg"
        />

        {isSelected && points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={6}
            fill={index === selectedPointIndex ? 'blue' : 'white'}
            stroke="blue"
            strokeWidth="2"
            className="cursor-move hover:fill-blue-200"
            onMouseDown={(e) => {
              e.stopPropagation();
              setSelectedPointIndex(index);
              const startX = e.clientX;
              const startY = e.clientY;
              
              const handlePointMove = (moveEvent) => {
                onPointMove(index, {
                  x: point.x + moveEvent.clientX - startX,
                  y: point.y + moveEvent.clientY - startY
                });
              };
              
              const handlePointUp = () => {
                window.removeEventListener('mousemove', handlePointMove);
                window.removeEventListener('mouseup', handlePointUp);
              };
              
              window.addEventListener('mousemove', handlePointMove);
              window.addEventListener('mouseup', handlePointUp);
            }}
          />
        ))}

        {isSelected && (
          <foreignObject x={points[0].x} y={points[0].y - 40} width={100} height={40}>
            <div className="flex gap-2 bg-white rounded-lg shadow-lg p-2">
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
          </foreignObject>
        )}
      </svg>
    </div>
  );
};

const Editor = () => {
  const [shapes, setShapes] = useState([]);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [numPoints, setNumPoints] = useState(8);
  const [selectedTool, setSelectedTool] = useState(null);
  const canvasRef = useRef(null);

  const simplifyPoints = (points, targetCount) => {
    if (points.length <= targetCount) return points;
    
    const step = (points.length - 1) / (targetCount - 1);
    const simplified = [];
    
    for (let i = 0; i < targetCount; i++) {
      const index = Math.min(Math.floor(i * step), points.length - 1);
      simplified.push(points[index]);
    }
    
    return simplified;
  };

  const handleMouseDown = (e) => {
    if (e.target === canvasRef.current && selectedTool === 'polygon') {
      const rect = canvasRef.current.getBoundingClientRect();
      const point = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      setIsDrawing(true);
      setCurrentPoints([point]);
      setMousePosition(point);
      setSelectedShapeId(null);
    }
  };

  const handleMouseMove = (e) => {
    if (selectedTool === 'polygon') {
      const rect = canvasRef.current.getBoundingClientRect();
      const currentPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      setMousePosition(currentPoint);

      if (isDrawing) {
        const lastPoint = currentPoints[currentPoints.length - 1];
        const dx = currentPoint.x - lastPoint.x;
        const dy = currentPoint.y - lastPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 20) {
          setCurrentPoints(prev => [...prev, currentPoint]);
        }
      }
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing || currentPoints.length < 3) {
      setIsDrawing(false);
      setCurrentPoints([]);
      return;
    }

    const simplifiedPoints = simplifyPoints(currentPoints, numPoints);
    const newShape = {
      id: Date.now(),
      points: simplifiedPoints,
      position: { x: 0, y: 0 }
    };

    setShapes(prev => [...prev, newShape]);
    setSelectedShapeId(newShape.id);
    setIsDrawing(false);
    setCurrentPoints([]);
  };

  // Drawing preview component
  const DrawingPreview = () => {
    if (!isDrawing || currentPoints.length === 0) return null;

    return (
      <svg 
        className="absolute top-0 left-0 w-full h-full" 
        style={{ pointerEvents: 'none', zIndex: 1000 }}
      >
        {/* Connection line */}
        <path
          d={`M ${currentPoints.map(p => `${p.x} ${p.y}`).join(' L ')} L ${mousePosition.x} ${mousePosition.y}`}
          fill="none"
          stroke="blue"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        
        {/* Placed points */}
        {currentPoints.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={4}
            fill="white"
            stroke="blue"
            strokeWidth="2"
          />
        ))}
        
        {/* Current mouse position */}
        <circle
          cx={mousePosition.x}
          cy={mousePosition.y}
          r={4}
          fill="white"
          stroke="blue"
          strokeWidth="2"
          opacity={0.5}
        />
      </svg>
    );
  };

  return (
    <div className="relative">
      {/* Points input control */}
      <div className="absolute top-4 left-4 z-20 bg-white p-4 rounded-lg shadow-lg">
        <label className="flex items-center gap-2">
          Points:
          <input
            type="number"
            min="3"
            max="20"
            value={numPoints}
            onChange={(e) => setNumPoints(Math.max(3, Math.min(20, parseInt(e.target.value) || 3)))}
            className="w-20 px-2 py-1 border rounded"
          />
        </label>
      </div>

      {/* Main canvas */}
      <div
        ref={canvasRef}
        className="w-full h-screen bg-gray-100 relative overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ cursor: selectedTool === 'polygon' ? 'crosshair' : 'default' }}
      >
        {/* Existing shapes */}
        {shapes.map(shape => (
          <PolygonShape
            key={shape.id}
            data={shape}
            isSelected={shape.id === selectedShapeId}
            onSelect={() => setSelectedShapeId(shape.id)}
            onDelete={() => {
              setShapes(shapes.filter(s => s.id !== shape.id));
              setSelectedShapeId(null);
            }}
            onPointMove={(index, newPos) => {
              setShapes(shapes.map(s => {
                if (s.id !== shape.id) return s;
                const newPoints = [...s.points];
                newPoints[index] = newPos;
                return { ...s, points: newPoints };
              }));
            }}
            onShapeMove={(newPosition) => {
              setShapes(shapes.map(s => {
                if (s.id !== shape.id) return s;
                return { ...s, position: newPosition };
              }));
            }}
          />
        ))}

        {/* Drawing preview */}
        <DrawingPreview />
      </div>

      {/* Toolbox */}
      <Toolbox 
        selectedTool={selectedTool}
        onToolSelect={setSelectedTool}
      />
    </div>
  );
};

export default Editor;