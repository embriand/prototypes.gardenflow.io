import React, { useState, useEffect } from 'react';
import { Settings, Layers, MapPin, ChevronDown, ChevronRight, Package, Box } from 'lucide-react';

// Types
interface Item {
  id: string;
  name: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  condition: string;
  quantity: number;
}

interface BoxData {
  id: string;
  type: string;
  material: string;
  capacity: string;
  items: Item[];
}

interface Parcel {
  id: string;
  type: string;
  status: 'In Transit' | 'Processing' | 'Ready' | 'Completed';
  boxes: BoxData[];
}

interface Position {
  x: number;
  y: number;
}

interface DroppedElement {
  type: string;
  data: any;
  position: Position;
  uniqueId: string;
  rotation: number;
}

// Constants and Utility Components
const GRID_SIZE = 20; // Size of grid cells in pixels
const MIN_DISTANCE = 100; // Minimum distance between parcels

// Utility Components
interface RarityBadgeProps {
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
}

const RarityBadge: React.FC<RarityBadgeProps> = ({ rarity }) => {
  const colors = {
    Common: "bg-slate-500",
    Uncommon: "bg-green-500",
    Rare: "bg-blue-500",
    Epic: "bg-purple-500",
    Legendary: "bg-amber-500"
  };
  
  return (
    <span className={`${colors[rarity]} px-1.5 py-0.5 rounded-full text-xs font-medium truncate text-white`}>
      {rarity}
    </span>
  );
};

interface StatusBadgeProps {
  status: 'In Transit' | 'Processing' | 'Ready' | 'Completed';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const colors = {
    "In Transit": "bg-blue-500/20 text-blue-400",
    "Processing": "bg-purple-500/20 text-purple-400",
    "Ready": "bg-green-500/20 text-green-400",
    "Completed": "bg-slate-500/20 text-slate-400"
  };

  return (
    <span className={`px-1.5 py-0.5 ${colors[status]} text-xs rounded-full truncate`}>
      {status}
    </span>
  );
};

// Sample parcels data
const sampleParcels: Parcel[] = [
  {
    id: "PARCEL_X92",
    type: "Priority Cargo",
    status: "In Transit",
    boxes: [
      {
        id: "BOX_A1",
        type: "Reinforced Container",
        material: "Carbon Fiber",
        capacity: "80%",
        items: [
          { 
            id: "ITEM_001", 
            name: "Ancient Scroll",
            rarity: "Rare",
            condition: "Pristine",
            quantity: 1
          },
          { 
            id: "ITEM_002",
            name: "Crystal Shard",
            rarity: "Uncommon",
            condition: "Damaged",
            quantity: 3
          }
        ]
      },
      {
        id: "BOX_B2",
        type: "Secure Vault",
        material: "Titanium",
        capacity: "45%",
        items: [
          { 
            id: "ITEM_003",
            name: "Golden Compass",
            rarity: "Epic",
            condition: "Good",
            quantity: 1
          }
        ]
      }
    ]
  },
  {
    id: "PARCEL_Y47",
    type: "Special Delivery",
    status: "Processing",
    boxes: [
      {
        id: "BOX_C3",
        type: "Magic Container",
        material: "Enchanted Steel",
        capacity: "95%",
        items: [
          { 
            id: "ITEM_004", 
            name: "Dragon Scale",
            rarity: "Legendary",
            condition: "Perfect",
            quantity: 5
          },
          { 
            id: "ITEM_005",
            name: "Mystic Orb",
            rarity: "Epic",
            condition: "Pristine",
            quantity: 2
          }
        ]
      }
    ]
  }
];

interface DraggableItemProps {
  item: Item;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
}

// Draggable Item Component
const DraggableItem: React.FC<DraggableItemProps> = ({ item, onDragStart }) => (
  <div
    draggable
    onDragStart={(e) => {
      e.dataTransfer.setData('application/json', JSON.stringify({
        type: 'ITEM',
        data: item
      }));
      (e.target as HTMLElement).classList.add('opacity-50');
      if (onDragStart) onDragStart(e);
    }}
    onDragEnd={(e) => {
      (e.target as HTMLElement).classList.remove('opacity-50');
    }}
    className="bg-slate-900/50 p-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-move ring-2 ring-transparent hover:ring-green-500/30 active:ring-green-500/50"
  >
    <Layers className="text-slate-400 shrink-0" size={14} />
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-1.5 overflow-hidden">
        <span className="text-xs font-medium truncate text-white">{item.name}</span>
        <RarityBadge rarity={item.rarity} />
        <span className="ml-auto text-xs font-medium text-slate-400 shrink-0">x{item.quantity}</span>
      </div>
      <div className="flex items-center gap-1.5 mt-0.5 overflow-hidden">
        <span className="text-xs text-slate-400 truncate">{item.id}</span>
        <ChevronRight className="text-slate-600 shrink-0" size={10} />
        <span className="text-xs text-slate-400 truncate">{item.condition}</span>
      </div>
    </div>
  </div>
);

interface DraggableBoxProps {
  box: BoxData;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
}

// Draggable Box Component
const DraggableBox: React.FC<DraggableBoxProps> = ({ box, onDragStart }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-800/50 rounded-lg overflow-hidden">
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('application/json', JSON.stringify({
            type: 'BOX',
            data: box
          }));
          (e.target as HTMLElement).classList.add('opacity-50');
          if (onDragStart) onDragStart(e);
        }}
        onDragEnd={(e) => {
          (e.target as HTMLElement).classList.remove('opacity-50');
        }}
        className="w-full bg-slate-800 p-2 flex items-center gap-1.5 hover:bg-slate-700 transition-colors cursor-move ring-2 ring-transparent hover:ring-blue-500/30 active:ring-blue-500/50"
      >
        <Box className="text-blue-400 shrink-0" size={16} />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-blue-400 text-xs truncate">{box.id}</h3>
          <p className="text-xs text-slate-400 truncate">{box.type}</p>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <div className="text-xs text-slate-400">{box.capacity}</div>
          <div className="text-xs text-slate-500">{box.material}</div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="p-1 rounded hover:bg-slate-600/50"
        >
          <ChevronDown 
            className={`text-slate-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
            size={14}
          />
        </button>
      </div>
      
      {isOpen && (
        <div className="p-1.5 space-y-1.5">
          {box.items?.map(item => (
            <DraggableItem 
              key={item.id} 
              item={item} 
              onDragStart={onDragStart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface DraggableParcelProps {
  parcel: Parcel;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
}

// Draggable Parcel Component
const DraggableParcel: React.FC<DraggableParcelProps> = ({ parcel, onDragStart }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('application/json', JSON.stringify({
            type: 'PARCEL',
            data: parcel
          }));
          (e.target as HTMLElement).classList.add('opacity-50');
          if (onDragStart) onDragStart(e);
        }}
        onDragEnd={(e) => {
          (e.target as HTMLElement).classList.remove('opacity-50');
        }}
        className="w-full bg-gradient-to-r from-slate-800 to-slate-900 p-2 flex items-center gap-2 hover:from-slate-700 hover:to-slate-800 transition-colors cursor-move ring-2 ring-transparent hover:ring-amber-500/30 active:ring-amber-500/50"
      >
        <Package className="text-amber-400 shrink-0" size={18} />
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-amber-400 truncate">{parcel.id}</h2>
          <p className="text-xs text-slate-400 truncate">{parcel.type}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <StatusBadge status={parcel.status} />
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="p-1 rounded hover:bg-slate-700/50"
          >
            <ChevronDown 
              className={`text-amber-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              size={16}
            />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-2 space-y-2">
          {parcel.boxes?.map(box => (
            <DraggableBox 
              key={box.id} 
              box={box}
              onDragStart={onDragStart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface ItemIconProps {
  item: Item;
  isParentSelected: boolean;
}

// Canvas Item Components
const ItemIcon: React.FC<ItemIconProps> = ({ item, isParentSelected }) => (
  <div className={`flex items-center gap-1 rounded px-2 py-1 transition-colors
    ${isParentSelected 
      ? 'bg-green-500/30 border border-green-400/50' 
      : 'bg-green-500/20 border border-green-500/50'}`}
  >
    <Layers className={`${isParentSelected ? 'text-green-400' : 'text-green-500/80'}`} size={14} />
    <span className={`${isParentSelected ? 'text-green-400' : 'text-green-500/80'} text-xs`}>
      {item.name}
    </span>
  </div>
);

interface BoxZoneProps {
  box: BoxData;
  offset?: Position;
  isParentSelected: boolean;
}

const BoxZone: React.FC<BoxZoneProps> = ({ box, offset = { x: 0, y: 0 }, isParentSelected }) => (
  <div 
    style={{ 
      position: 'relative',
      left: offset.x,
      top: offset.y,
      transition: 'all 0.2s ease-out',
    }}
    className={`border-2 ${isParentSelected ? 'border-blue-400 bg-blue-500/20' : 'border-blue-500/50 bg-blue-500/10'} rounded-lg p-3 mb-2`}
  >
    <div className="flex items-center gap-2 mb-2">
      <Box className={`${isParentSelected ? 'text-blue-400' : 'text-blue-500/80'}`} size={16} />
      <span className={`${isParentSelected ? 'text-blue-400' : 'text-blue-500/80'} font-medium text-sm`}>
        {box.id}
      </span>
    </div>
    <div className="flex flex-wrap gap-2">
      {box.items?.map(item => (
        <ItemIcon key={item.id} item={item} isParentSelected={isParentSelected} />
      ))}
    </div>
  </div>
);

interface ParcelPolygonProps {
  parcel: Parcel;
  position: Position;
  onMove: (parcelId: string, newPosition: Position) => void;
  onRotate?: (parcelId: string, newRotation: number) => void;
  isSelected: boolean;
  onSelect: (parcelId: string) => void;
}

const ParcelPolygon: React.FC<ParcelPolygonProps> = ({ parcel, position, onMove, onRotate, isSelected, onSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);

  // Snap position to grid
  const snapToGrid = (pos: Position): Position => ({
    x: Math.round(pos.x / GRID_SIZE) * GRID_SIZE,
    y: Math.round(pos.y / GRID_SIZE) * GRID_SIZE
  });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 0) { // Left click only
      onSelect(parcel.id);
      setIsDragging(true);
      setStartPos({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && isSelected) {
      const newX = e.clientX - startPos.x;
      const newY = e.clientY - startPos.y;
      const snappedPos = snapToGrid({ x: newX, y: newY });
      onMove(parcel.id, snappedPos);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isSelected && e.key.toLowerCase() === 'r') {
        const newRotation = (rotation + 90) % 360;
        setRotation(newRotation);
        onRotate?.(parcel.id, newRotation);
      }
    };

    if (isSelected) {
      window.addEventListener('keydown', handleKeyPress);
    }
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isSelected, rotation, parcel.id, onRotate]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  return (
    <div 
      style={{ 
        position: 'absolute',
        left: position.x,
        top: position.y,
        minWidth: '200px',
        minHeight: '200px',
        transform: `rotate(${rotation}deg) scale(${isDragging ? 1.02 : 1})`,
        transition: 'transform 0.2s ease-out, border-color 0.2s ease-out, box-shadow 0.2s ease-out',
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isSelected ? 10 : 1
      }}
      className={`border-2 border-dashed rounded-lg p-4
                 ${isSelected 
                   ? 'border-amber-400 bg-amber-500/20 shadow-lg ring-2 ring-amber-400/50' 
                   : 'border-amber-500/50 bg-amber-500/10 hover:border-amber-500/80'}`}
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center gap-2 mb-4">
        <Package className={`${isSelected ? 'text-amber-400' : 'text-amber-500/80'}`} size={20} />
        <span className={`font-bold ${isSelected ? 'text-amber-400' : 'text-amber-500/80'}`}>
          {parcel.id}
        </span>
        {isSelected && (
          <span className="text-xs text-amber-400/70 ml-auto">
            Press 'R' to rotate
          </span>
        )}
      </div>
      {parcel.boxes?.map((box, index) => (
        <BoxZone 
          key={box.id} 
          box={box} 
          offset={{ x: 20 * index, y: 40 * index }}
          isParentSelected={isSelected}
        />
      ))}
    </div>
  );
};

// Main Panel Component
const CollapsibleDrawersPanel: React.FC = () => {
  const [openSections, setOpenSections] = useState<string[]>(['properties']);
  const [droppedElements, setDroppedElements] = useState<DroppedElement[]>([]);
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).classList.add('dragging');
  };

  const checkCollision = (pos: Position, currentId?: string): boolean => {
    return droppedElements.some(element => {
      if (element.uniqueId === currentId) return false;
      
      const dx = pos.x - element.position.x;
      const dy = pos.y - element.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      return distance < MIN_DISTANCE;
    });
  };

  const handleCanvasDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropPoint = {
      x: e.clientX - e.currentTarget.getBoundingClientRect().left,
      y: e.clientY - e.currentTarget.getBoundingClientRect().top
    };

    const snappedPoint = {
      x: Math.round(dropPoint.x / GRID_SIZE) * GRID_SIZE,
      y: Math.round(dropPoint.y / GRID_SIZE) * GRID_SIZE
    };

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      
      if (!checkCollision(snappedPoint)) {
        setDroppedElements(prev => [...prev, { 
          ...data, 
          position: snappedPoint,
          uniqueId: `${data.type === 'PARCEL' ? data.data.id : data.data.id}_${Date.now()}`,
          rotation: 0
        }]);
      }
    } catch (error) {
      console.error('Error parsing dropped data:', error);
    }
  };

  const handleParcelMove = (parcelId: string, newPosition: Position) => {
    if (!checkCollision(newPosition, parcelId)) {
      setDroppedElements(prev =>
        prev.map(element =>
          element.uniqueId === parcelId
            ? { ...element, position: newPosition }
            : element
        )
      );
    }
  };

  const handleParcelRotate = (parcelId: string, newRotation: number) => {
    setDroppedElements(prev =>
      prev.map(element =>
        element.uniqueId === parcelId
          ? { ...element, rotation: newRotation }
          : element
      )
    );
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setSelectedParcelId(null);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Drawer Panel */}
      <div className={`bg-slate-900 shadow-lg h-full transition-all duration-300 ${
        isDrawerOpen ? 'w-64' : 'w-10'
      } overflow-y-auto`}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className="w-10 h-10 flex items-center justify-center hover:bg-slate-800"
        >
          <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${
            isDrawerOpen ? 'rotate-180' : ''
          }`} />
        </button>

        {isDrawerOpen && (
          <div className="border-b border-slate-800">
            <button
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/50"
              onClick={() => toggleSection('properties')}
            >
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-slate-400" />
                <span className="font-medium text-slate-200">Properties</span>
              </div>
              {openSections.includes('properties') ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>
            {openSections.includes('properties') && (
              <div className="p-3 space-y-2">
                {sampleParcels.map(parcel => (
                  <DraggableParcel 
                    key={parcel.id} 
                    parcel={parcel}
                    onDragStart={handleDragStart}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Canvas Area */}
      <div
        className="flex-1 bg-slate-800 p-4 relative"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleCanvasDrop}
        onClick={handleCanvasClick}
        style={{
          backgroundImage: 'radial-gradient(circle, #4a5568 1px, transparent 1px)',
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`
        }}
      >
        {droppedElements.map((element) => {
          if (element.type === 'PARCEL') {
            return (
              <ParcelPolygon
                key={element.uniqueId}
                parcel={{ ...element.data, id: element.uniqueId }}
                position={element.position}
                onMove={handleParcelMove}
                onRotate={handleParcelRotate}
                isSelected={selectedParcelId === element.uniqueId}
                onSelect={setSelectedParcelId}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default CollapsibleDrawersPanel;