import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Bell, Settings, Trash2, Share2, Download, Lock, X 
} from 'lucide-react';
import { 
  Item, DroppedItem, DragStartEvent, CanvasDropEvent,
  CircularLayoutActionsProps, CircularLayoutPropertiesProps
} from './types';
import { allItems, getCategoryColor } from './mockData';

const CircularLayoutActions = ({ radius, setShowDeleteConfirm }: CircularLayoutActionsProps) => {
  const actionButtons = [
    { icon: Bell, label: 'Notifications', onClick: () => alert('Notifications clicked') },
    { icon: Settings, label: 'Settings', onClick: () => alert('Settings clicked') },
    { icon: Share2, label: 'Share', onClick: () => alert('Share clicked') },
    { icon: Download, label: 'Download', onClick: () => alert('Download clicked') },
    { icon: Lock, label: 'Security', onClick: () => alert('Security clicked') },
    { icon: Trash2, label: 'Delete', onClick: () => setShowDeleteConfirm(true) }
  ];

  const angleStep = 360 / actionButtons.length;
  
  return actionButtons.map((button, index) => {
    const angle = (index * angleStep - 90) * (Math.PI / 180);
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    const Icon = button.icon;

    return (
      <div
        key={button.label}
        className="absolute transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
        }}
      >
        <button
          onClick={button.onClick}
          className="bg-gray-800 p-4 rounded-full border-2 border-emerald-500/30 hover:border-emerald-400/50 
                    transition-all duration-300 group"
          title={button.label}
        >
          <Icon className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300" />
        </button>
      </div>
    );
  });
};

const CircularLayoutProperties = ({ radius, properties }: CircularLayoutPropertiesProps) => {
  if (!properties) return null;

  const propertiesArray = Object.entries(properties);
  const angleStep = 360 / propertiesArray.length;
  
  return propertiesArray.map(([key, value], index) => {
    const angle = (index * angleStep - 90) * (Math.PI / 180);
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    return (
      <div
        key={key}
        className="absolute transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
        }}
      >
        <div className="bg-gray-800 p-3 rounded-full border-2 border-blue-500/30 hover:border-blue-400/50 
                      transition-all duration-300 group cursor-pointer w-16 h-16 flex items-center justify-center">
          <div className="text-center">
            <div className="text-blue-300 text-xs uppercase group-hover:text-blue-200 whitespace-nowrap">
              {key.replace(/([A-Z])/g, ' $1')}
            </div>
            <div className="text-white font-bold text-sm group-hover:text-blue-100 whitespace-nowrap">{value}</div>
          </div>
        </div>
      </div>
    );
  });
};

const DynamicSearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [droppedItems, setDroppedItems] = useState<Array<typeof allItems[0] & { x: number, y: number }>>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [itemStart, setItemStart] = useState({ x: 0, y: 0 });
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedItem = droppedItems.find(item => item.id === selectedId);
  const filteredItems = allItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setSelectedId(null);
      setShowActions(false);
      setShowSearchResults(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, itemId: number) => {
    e.stopPropagation();
  
    if ((e.target as HTMLElement).closest('button')) return;
  
    if (e.button === 2) { // Right click
      e.preventDefault();
      if (selectedId === itemId) {
        setShowActions(!showActions);
      } else {
        setSelectedId(itemId);
        setShowActions(true);
      }
      return;
    }
  
    setSelectedId(itemId);
    if (!isDragging) {
      setIsDragging(true);
      setShowActions(false);
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setDragStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        const item = droppedItems.find(i => i.id === itemId);
        if (item) {
          setItemStart({ x: item.x, y: item.y });
        }
      }
    }
  };  

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !selectedId || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = e.clientX - rect.left - dragStart.x;
    const deltaY = e.clientY - rect.top - dragStart.y;
    
    const newX = itemStart.x + (deltaX / rect.width) * 100;
    const newY = itemStart.y + (deltaY / rect.height) * 100;

    setDroppedItems(prev => prev.map(item =>
      item.id === selectedId
        ? { ...item, x: Math.min(Math.max(5, newX), 95), y: Math.min(Math.max(5, newY), 95) }
        : item
    ));
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', () => setIsDragging(false));
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', () => setIsDragging(false));
    };
  }, [isDragging, selectedId, dragStart, itemStart]);

  const handleDragStart = (e: DragStartEvent, item: Item) => {
    e.dataTransfer.setData('itemId', item.id.toString());
  };

  const handleCanvasDrop = (e: CanvasDropEvent) => {
    e.preventDefault();
    const itemId = parseInt(e.dataTransfer.getData('itemId'));
    const item = allItems.find(i => i.id === itemId);
    
    if (item && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const newItem: DroppedItem = { ...item, x, y };
      setDroppedItems(prev => [...prev, newItem]);
      setSelectedId(newItem.id);
      setShowActions(false);
    }
  };

  const handleDeleteItem = () => {
    setDroppedItems(prev => prev.filter(item => item.id !== selectedId));
    setSelectedId(null);
    setShowActions(false);
    setShowDeleteConfirm(false);
  };

  const handleClosePanel = () => {
    setSelectedId(null);
  };

  useEffect(() => {
    console.log('Component rendered');
  }, []);
  
  useEffect(() => {
    console.log('Search term updated:', searchTerm);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
            Dynamic Search Bar
          </h1>
          <p className="text-slate-600">
            AI-powered intelligent search with dynamic suggestions and interactive canvas
          </p>
          
          {/* Feature highlights */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Key Features:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Dynamic search with real-time filtering</li>
              <li>• Drag and drop functionality</li>
              <li>• Interactive circular layouts</li>
              <li>• Context menus and property panels</li>
              <li>• Multi-category item management</li>
            </ul>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-8 h-96 relative">
          <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 relative overflow-hidden">
            <div 
              ref={containerRef}
              className="w-full h-screen" 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleCanvasDrop}
              onContextMenu={(e) => e.preventDefault()}
              onClick={handleCanvasClick}
            >
              {/* Dropped Items */}
              {droppedItems.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedId === item.id;
                
                return (
                  <div
                    key={item.id}
                    data-item-id={item.id}
                    className={`absolute transition-transform duration-300 ${
                      isDragging ? 'cursor-grabbing' : isSelected ? 'cursor-grab' : 'cursor-pointer'
                    }`}
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      transform: `translate(-50%, -50%) ${isSelected ? 'scale(1.1)' : 'scale(1)'}`,
                    }}
                    onMouseDown={(e) => handleMouseDown(e, item.id)}
                  >
                    {isSelected && (
                      <div className="absolute w-96 h-96 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                        <svg className="absolute w-full h-full" viewBox="0 0 384 384">
                          <circle
                            cx="192"
                            cy="192"
                            r="120"
                            fill="none"
                            stroke={showActions ? '#10B981' : '#3B82F6'}
                            strokeWidth="2"
                            strokeDasharray="4 4"
                            className="opacity-30"
                          />
                        </svg>
                        {showActions ? (
                          <CircularLayoutActions radius={120} setShowDeleteConfirm={setShowDeleteConfirm} />
                        ) : (
                          <CircularLayoutProperties radius={120} properties={item.properties} />
                        )}
                      </div>
                    )}

                    {item.hasNotification && (
                      <>
                        <div className="absolute inset-0 rounded-full animate-ping bg-red-500/20" />
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-gray-900 z-20" />
                      </>
                    )}
                    
                    <div
                      className="relative z-10 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{
                        width: 76,
                        height: 76,
                        background: isSelected 
                          ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                          : 'linear-gradient(135deg, #15803d, #166534)'
                      }}
                    >
                      <Icon 
                        className="w-8 h-8" 
                        style={{
                          color: isSelected ? 'white' : '#86efac'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Property Panel - Only shown when item is selected */}
            {selectedItem && (
              <div className="absolute top-4 left-4 bg-gray-900/95 backdrop-blur-md rounded-lg border border-white/20 p-4 w-80">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-semibold">{selectedItem.name}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowActions(!showActions)}
                      className="text-white/60 hover:text-white/80 p-1.5 rounded-lg hover:bg-white/10"
                      title="Toggle actions"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-white/60 text-sm">Category</label>
                    <p className="text-white capitalize">{selectedItem.category}</p>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm">Description</label>
                    <p className="text-white">{selectedItem.description}</p>
                  </div>
                  {selectedItem.properties && Object.entries(selectedItem.properties).map(([key, value]) => (
                    <div key={key}>
                      <label className="text-white/60 text-sm capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </label>
                      <p className="text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-gray-900 p-6 rounded-lg border border-red-400/30 max-w-sm mx-4">
                  <h3 className="text-white text-lg font-semibold mb-4">Delete Item</h3>
                  <p className="text-white/80 mb-6">Are you sure you want to delete this item?</p>
                  <div className="flex justify-end gap-3">
                    <button 
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md"
                      onClick={handleDeleteItem}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Property Panel */}
            {selectedItem && (
              <div className="absolute top-24 right-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-4 w-64">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-semibold">Properties</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDeleteItem}
                      className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-400/10 flex items-center gap-1"
                      title="Delete item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleClosePanel}
                      className="text-white/60 hover:text-white/80 p-1.5 rounded-lg hover:bg-white/10"
                      title="Close panel"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-white/60 text-sm">Name</label>
                    <p className="text-white">{selectedItem.name}</p>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm">Category</label>
                    <p className="text-white capitalize">{selectedItem.category}</p>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm">Description</label>
                    <p className="text-white">{selectedItem.description}</p>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm">Position</label>
                    <p className="text-white">
                      X: {Math.round(selectedItem.x)}, Y: {Math.round(selectedItem.y)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Dock */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 z-50">
              <div className="max-w-xl mx-auto p-4">
                {/* Search Bar */}
                <div className="relative z-10">
                  <div className="flex items-center gap-2 bg-white/10 rounded-full p-2 backdrop-blur-md border border-white/20">
                    <Search className="w-6 h-6 text-white/60 ml-2" />
                    <input
                      type="text"
                      placeholder="Search items or categories..."
                      className="bg-transparent border-none outline-none flex-1 text-white placeholder-white/60 px-2"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowSearchResults(true);
                      }}
                      onClick={() => setShowSearchResults(true)}
                    />
                  </div>
                  
                  {/* Search Results */}
                  {searchTerm && showSearchResults && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 max-h-48 overflow-y-auto">
                      <div className="p-2 space-y-2">
                        {filteredItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <div
                              key={item.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, item)}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-grab active:cursor-grabbing"
                            >
                              <div className={`${getCategoryColor(item.category)} p-2 rounded-full`}>
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <p className="text-white font-semibold">{item.name}</p>
                                <p className="text-white/60 text-sm">
                                  <span className="capitalize">{item.category}</span> - {item.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>Dynamic Search Bar prototype • Interactive drag & drop interface</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DynamicSearchBar);