import React from 'react';
import { X, Eye, Grid, Layers, TreePine, Apple, Leaf } from 'lucide-react';
import { RecognitionResult, DetectedItem, DetectedParcel, GridCell } from './types';

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: RecognitionResult | null;
  isProcessing?: boolean;
  error?: string | null;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  isOpen,
  onClose,
  result,
  isProcessing,
  error
}) => {
  const [activeTab, setActiveTab] = React.useState<'grid' | 'list'>('grid');
  const [imageDimensions, setImageDimensions] = React.useState<{width: number, height: number}>({width: 1, height: 1});
  const imageRef = React.useRef<HTMLImageElement>(null);

  if (!isOpen || !result) return null;

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'parcel':
        return <Grid size={16} />;
      case 'zone':
        return <Layers size={16} />;
      case 'tree':
        return <TreePine size={16} />;
      case 'fruit':
        return <Apple size={16} />;
      case 'vegetable':
        return <Leaf size={16} />;
      default:
        return <Grid size={16} />;
    }
  };

  const getItemTypeColor = (type: string) => {
    switch (type) {
      case 'parcel':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'zone':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'tree':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'fruit':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'vegetable':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const generateGridData = (): GridCell[] => {
    const gridSize = 20; // 20x20 grid
    const cells: GridCell[] = [];
    
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const cellWidth = imageDimensions.width / gridSize;
        const cellHeight = imageDimensions.height / gridSize;
        
        const cell: GridCell = {
          x: x * cellWidth,
          y: y * cellHeight,
          width: cellWidth,
          height: cellHeight
        };
        
        // Find items that intersect with this cell
        const item = result.detectedItems.find(item => {
          const itemCenterX = item.bbox.x + item.bbox.width / 2;
          const itemCenterY = item.bbox.y + item.bbox.height / 2;
          
          return itemCenterX >= cell.x && 
                 itemCenterX < cell.x + cell.width &&
                 itemCenterY >= cell.y && 
                 itemCenterY < cell.y + cell.height;
        });
        
        if (item) {
          cell.item = item;
        }
        
        cells.push(cell);
      }
    }
    
    return cells;
  };

  const gridData = generateGridData();

  const getCellBackgroundColor = (cell: GridCell) => {
    if (!cell.item) return 'bg-gray-50';
    
    const alpha = cell.item.confidence * 0.6 + 0.2; // 20% to 80% opacity
    
    switch (cell.item.type) {
      case 'parcel':
        return `bg-blue-200 bg-opacity-${Math.round(alpha * 100)}`;
      case 'zone':
        return `bg-purple-200 bg-opacity-${Math.round(alpha * 100)}`;
      case 'tree':
        return `bg-green-200 bg-opacity-${Math.round(alpha * 100)}`;
      case 'fruit':
        return `bg-red-200 bg-opacity-${Math.round(alpha * 100)}`;
      case 'vegetable':
        return `bg-orange-200 bg-opacity-${Math.round(alpha * 100)}`;
      default:
        return 'bg-gray-200';
    }
  };

  const groupedItems = result.detectedItems.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, DetectedItem[]>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Eye size={24} />
              <div>
                <h2 className="text-xl font-bold">Garden Vision Results</h2>
                <p className="text-green-100">
                  Analysis completed in {result.processingTime}s • {result.detectedItems.length} items detected
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - Image */}
          <div className="w-1/2 bg-gray-100 flex items-center justify-center p-4">
            <div className="relative max-w-full max-h-full">
              <img
                ref={imageRef}
                src={result.imageUrl}
                alt="Analyzed garden"
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement;
                  setImageDimensions({
                    width: img.naturalWidth,
                    height: img.naturalHeight
                  });
                }}
              />
              
              {/* Overlay detected items */}
              <div className="absolute inset-0 overflow-hidden">
                {result.detectedItems.map((item) => {
                  // Calculate percentage based on actual image dimensions
                  const left = (item.bbox.x / imageDimensions.width) * 100;
                  const top = (item.bbox.y / imageDimensions.height) * 100;
                  const width = (item.bbox.width / imageDimensions.width) * 100;
                  const height = (item.bbox.height / imageDimensions.height) * 100;
                  
                  // Skip items that would be outside bounds
                  if (left < 0 || top < 0 || left + width > 100 || top + height > 100) {
                    return null;
                  }
                  
                  return (
                    <div
                      key={item.id}
                      className="absolute border-2 border-dashed"
                      style={{
                        left: `${left}%`,
                        top: `${top}%`,
                        width: `${width}%`,
                        height: `${height}%`,
                        borderColor: item.color,
                        backgroundColor: `${item.color}20`
                      }}
                    >
                      <div 
                        className="absolute -top-5 left-0 px-1 py-0.5 text-xs font-medium text-white rounded whitespace-nowrap"
                        style={{ 
                          backgroundColor: item.color,
                          fontSize: '10px',
                          lineHeight: '1.2'
                        }}
                      >
                        {item.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel - Analysis */}
          <div className="w-1/2 bg-white flex flex-col">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('grid')}
                  className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 ${
                    activeTab === 'grid'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid size={16} className="inline mr-2" />
                  Grid View
                </button>
                <button
                  onClick={() => setActiveTab('list')}
                  className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 ${
                    activeTab === 'list'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Layers size={16} className="inline mr-2" />
                  List View
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'grid' ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Garden Layout Grid</h3>
                  <p className="text-sm text-gray-600">
                    Interactive grid showing detected items and their positions
                  </p>
                  
                  {/* Grid Visualization */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-20 gap-0 w-full h-64 border border-gray-300">
                      {gridData.map((cell, index) => (
                        <div
                          key={index}
                          className={`border-r border-b border-gray-200 ${getCellBackgroundColor(cell)} hover:bg-opacity-80 transition-colors cursor-pointer`}
                          style={{
                            backgroundColor: cell.item ? `${cell.item.color}40` : undefined
                          }}
                          title={cell.item ? `${cell.item.name} (${Math.round(cell.item.confidence * 100)}%)` : ''}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Legend</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(groupedItems).map(([type, items]) => (
                        <div key={type} className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: items[0].color }}
                          />
                          <span className="text-sm capitalize">{type}s ({items.length})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Detected Items</h3>
                  
                  {Object.entries(groupedItems).map(([type, items]) => (
                    <div key={type} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        {getItemIcon(type)}
                        <span className="ml-2 capitalize">{type}s ({items.length})</span>
                      </h4>
                      
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 bg-white rounded-lg border"
                          >
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: item.color }}
                              />
                              <div>
                                <div className="font-medium text-gray-900">{item.name}</div>
                                <div className="text-sm text-gray-500">
                                  Position: {Math.round(item.bbox.x)}, {Math.round(item.bbox.y)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getItemTypeColor(item.type)}`}>
                                {Math.round(item.confidence * 100)}% confident
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};