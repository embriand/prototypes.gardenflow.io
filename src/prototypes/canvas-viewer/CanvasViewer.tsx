import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/canvasStore';
import { addShape, removeShape, setSelectedShape, updateShape, undo, redo } from '../../store/shapesSlice';
import { setViewMode, toggleGrid, toggleSnapToGrid, toggleToolbox, setActiveTab } from '../../store/slices/uiSlice';
import { Toolbox } from './components/Toolbox/Toolbox';
import { Toolbar } from './components/Canvas/Toolbar';
import { Canvas } from './components/Canvas/Canvas';
import { StatusBar } from './components/Canvas/StatusBar';

import { Shape } from '../../types/shapes';

import './CanvasViewer.css';

const GRID_SIZE = 20;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

type DraggingShape = {
  id: string;
  x: number;
  y: number;
  z: number;
  width?: number;
  height?: number;
  radius?: number;
  color?: string;
  type: 'rectangle' | 'circle';
};

const CanvasViewer = () => {
  const dispatch = useDispatch();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Redux state
  const {
    items: objects,
    selectedShape: selectedObject,
    history,
    historyIndex
  } = useSelector((state: RootState) => state.shapes);
  
  const {
    viewMode,
    zoom,
    showGrid,
    snapToGrid,
    isToolboxOpen,
    activeTab
  } = useSelector((state: RootState) => state.ui);

  // Local state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [cursorStyle, setCursorStyle] = useState('default');
  const [draggingNewShape, setDraggingNewShape] = useState<any>(null);

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    if (!showGrid) return;
    
    ctx.save();
    ctx.strokeStyle = '#dddddd';
    ctx.lineWidth = 0.5 / zoom;

    const gridSize = snapToGrid ? GRID_SIZE : GRID_SIZE / 2;
    
    for (let x = 0; x <= CANVAS_WIDTH; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }

    for (let y = 0; y <= CANVAS_HEIGHT; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }
    ctx.restore();
  };

  const isPointInObject = (x: number, y: number, obj: any) => {
    if (obj.type === 'rectangle') {
      return x >= obj.x && x <= obj.x + obj.width && 
             y >= obj.y && y <= obj.y + obj.height;
    } else {
      const dx = x - (obj.x + obj.radius);
      const dy = y - (obj.y + obj.radius);
      return Math.sqrt(dx * dx + dy * dy) <= obj.radius;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const scaleX = (canvasRef.current?.width || 0) / rect.width / zoom;
    const scaleY = (canvasRef.current?.height || 0) / rect.height / zoom;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const clickedObject = objects.find(obj => isPointInObject(x, y, obj)) as DraggingShape | null;
    
    if (clickedObject) {
      dispatch(setSelectedShape(clickedObject as Shape));
      setIsDragging(true);
      setDragOffset({
        x: x - (clickedObject?.x || 0),
        y: y - (clickedObject?.y || 0)
      });
    } else {
      dispatch(setSelectedShape(null));
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const scaleX = (canvasRef.current?.width || 0) / rect.width / zoom;
    const scaleY = (canvasRef.current?.height || 0) / rect.height / zoom;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const hoveredObject = objects.find(obj => isPointInObject(x, y, obj));
    setCursorStyle(hoveredObject || isDragging ? 'grab' : 'default');

    if (isDragging && selectedObject) {
      const newX = snapToGrid ? Math.round((x - dragOffset.x) / GRID_SIZE) * GRID_SIZE : x - dragOffset.x;
      const newY = snapToGrid ? Math.round((y - dragOffset.y) / GRID_SIZE) * GRID_SIZE : y - dragOffset.y;

      const updatedShape = {
        ...selectedObject,
        x: newX,
        y: newY
      };

      dispatch(updateShape(updatedShape));
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      // Add current state to history when dragging ends
      dispatch({ type: 'shapes/addToHistory' });
    }
    setIsDragging(false);
    setCursorStyle('default');
  };

  const handleShapeDragStart = (shape: any) => {
    setDraggingNewShape({
      ...shape,
      id: Date.now().toString(),
      x: 0,
      y: 0,
      z: 0
    });
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggingNewShape) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const scaleX = (canvasRef.current?.width || 0) / rect.width / zoom;
      const scaleY = (canvasRef.current?.height || 0) / rect.height / zoom;
      
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      
      const newX = snapToGrid ? Math.round(x / GRID_SIZE) * GRID_SIZE : x;
      const newY = snapToGrid ? Math.round(y / GRID_SIZE) * GRID_SIZE : y;
      
      setDraggingNewShape((prev: DraggingShape | null) => prev ? ({
        ...prev,
        x: newX - ((prev?.width ?? prev?.radius ?? 0) / 2),
        y: newY - ((prev.height ?? prev.radius ?? 0) / 2)
      }) : null);
    }
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const shapeData = JSON.parse(e.dataTransfer.getData('application/json'));
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const scaleX = (canvasRef.current?.width || 0) / rect.width / zoom;
      const scaleY = (canvasRef.current?.height || 0) / rect.height / zoom;
      
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      
      const newX = snapToGrid ? Math.round(x / GRID_SIZE) * GRID_SIZE : x;
      const newY = snapToGrid ? Math.round(y / GRID_SIZE) * GRID_SIZE : y;

      const newShape = {
        ...shapeData,
        id: Date.now().toString(),
        x: newX - (shapeData.width || shapeData.radius) / 2,
        y: newY - (shapeData.height || shapeData.radius) / 2,
        z: 0,
        rotation: 0,
      };

      dispatch(addShape(newShape));
      setDraggingNewShape(null);
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };

  const handleDeleteObject = () => {
    if (selectedObject) {
      dispatch(removeShape(selectedObject.id));
    }
  };

  const handleRotateObject = () => {
    if (selectedObject && selectedObject.rotatable) {
      const updatedShape = {
        ...selectedObject,
        rotation: (selectedObject.rotation || 0) + 90
      };
      dispatch(updateShape(updatedShape));
      dispatch({ type: 'shapes/addToHistory' });
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')!;
      ctx.save();
      
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = '#eeeeee';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.scale(zoom, zoom);
      
      drawGrid(ctx);

      objects.forEach(obj => {
        ctx.save();
        if (obj.rotation) {
          const centerX = ('x' in obj ? obj.x : 0) + ('width' in obj ? obj.width : 'radius' in obj ? obj.radius : 0) / 2;
          const centerY = 'y' in obj ? obj.y + ('height' in obj ? obj.height : obj.radius) / 2 : 0;
          ctx.translate(centerX, centerY);
          ctx.rotate((obj.rotation * Math.PI) / 180);
          ctx.translate(-centerX, -centerY);
        }
        
        if (obj.type === 'rectangle') {
          ctx.fillStyle = obj.color;
          ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
          
          if (selectedObject && selectedObject.id === obj.id) {
            ctx.strokeStyle = '#0066ff';
            ctx.lineWidth = 2 / zoom;
            ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
          }
        } else {
          ctx.fillStyle = obj.color;
          ctx.beginPath();
          if ('radius' in obj) {
            if ('y' in obj && 'radius' in obj) {
              ctx.arc(obj.x + obj.radius, obj.y + obj.radius, obj.radius, 0, Math.PI * 2);
            }
          }
          ctx.fill();
          
          if (selectedObject && selectedObject.id === obj.id) {
            ctx.strokeStyle = '#0066ff';
            ctx.lineWidth = 2 / zoom;
            ctx.stroke();
          }
        }
        
        ctx.restore();
      });

      if (draggingNewShape) {
        ctx.globalAlpha = 0.5;
        if (draggingNewShape.type === 'rectangle') {
          ctx.fillStyle = draggingNewShape.color;
          ctx.fillRect(
            draggingNewShape.x,
            draggingNewShape.y,
            draggingNewShape.width,
            draggingNewShape.height
          );
        } else {
          ctx.fillStyle = draggingNewShape.color;
          ctx.beginPath();
          ctx.arc(
            draggingNewShape.x + draggingNewShape.radius,
            draggingNewShape.y + draggingNewShape.radius,
            draggingNewShape.radius,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      ctx.restore();
    }
  }, [viewMode, objects, selectedObject, draggingNewShape, zoom, showGrid]);

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-gray-100">
      <div className="relative flex gap-4 max-w-7xl mx-auto">
        <Toolbox
          isOpen={isToolboxOpen}
          activeTab={activeTab}
          showGrid={showGrid}
          snapToGrid={snapToGrid}
          viewMode={viewMode}
          onClose={() => dispatch(toggleToolbox())}
          onTabChange={(tab) => dispatch(setActiveTab(tab))}
          onShapeDragStart={handleShapeDragStart}
          onToggleGrid={() => dispatch(toggleGrid())}
          onToggleSnap={() => dispatch(toggleSnapToGrid())}
          onViewModeChange={(mode) => dispatch(setViewMode(mode))}
        />

        <div className="flex-1 game-panel rounded-lg overflow-hidden">
          <Toolbar
            isToolboxOpen={isToolboxOpen}
            historyIndex={historyIndex}
            historyLength={history.length}
            zoom={zoom}
            selectedObject={selectedObject}
            onOpenToolbox={() => dispatch(toggleToolbox())}
            onUndo={() => dispatch(undo())}
            onRedo={() => dispatch(redo())}
            onZoom={(delta) => dispatch({ type: 'ui/setZoom', payload: Math.max(0.5, Math.min(2, zoom + delta)) })}
            onRotate={handleRotateObject}
            onDelete={handleDeleteObject}
          />

          <Canvas
            canvasRef={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            isDragging={isDragging}
            cursorStyle={cursorStyle}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDragOver={handleCanvasDragOver}
            onDrop={handleCanvasDrop}
          />

          <StatusBar
            viewMode={viewMode}
            selectedObject={selectedObject}
          />
        </div>
      </div>
    </div>
  );
};

export default CanvasViewer;