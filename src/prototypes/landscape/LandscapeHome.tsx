import React, { useState, useEffect } from "react";
import type { LandscapeProps, Products, DraggableItem, Canvas, BackgroundImage } from './types';


  const mockItems = {
    trees: [
      {
        id: "tree1",
        name: "Tree 1",
        image: `
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 64 64">
            <circle cx="32" cy="20" r="16" fill="#4CAF50" />
            <rect x="28" y="36" width="8" height="20" fill="#795548" />
          </svg>
        `,
        category: "tree",
      },
      {
        id: "tree2",
        name: "Tree 2",
        image: `
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 64 64">
            <ellipse cx="32" cy="22" rx="18" ry="14" fill="#8BC34A" />
            <rect x="30" y="36" width="4" height="24" fill="#6D4C41" />
          </svg>
        `,
        category: "tree",
      },
      {
        id: "tree3",
        name: "Tree 3",
        image: `
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 64 64">
            <path d="M32 4C18 4 8 16 8 24c0 12 16 20 24 20s24-8 24-20c0-8-10-20-24-20z" fill="#388E3C" />
            <rect x="28" y="40" width="8" height="20" fill="#5D4037" />
          </svg>
        `,
        category: "tree",
      },
      {
        id: "tree4",
        name: "Tree 4",
        image: `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <path fill="#228B22" d="M50 20c-15 10-20 25-20 35c0 15 15 30 20 30s20-15 20-30c0-10-5-25-20-35z"/>
                <path fill="#8B4513" d="M50 85c-5-5-10-20-10-30c0-15 10-30 10-30s10 15 10 30c0 10-5 25-10 30z"/>
                <ellipse cx="50" cy="45" rx="15" ry="25" fill="#2E8B57"/>
                <path fill="#A0522D" d="M45 85v-10a5 5 0 0 1 10 0v10z"/>
                </svg>
        `,
        category: "tree",
        },
    ],
    furniture: [
      {
        id: "furniture1",
        name: "Furniture 1",
        image: `
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 64 64">
            <rect x="10" y="20" width="44" height="24" fill="#FFC107" />
            <rect x="12" y="44" width="8" height="16" fill="#795548" />
            <rect x="44" y="44" width="8" height="16" fill="#795548" />
          </svg>
        `,
        category: "furniture",
      },
      {
        id: "furniture2",
        name: "Furniture 2",
        image: `
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 64 64">
            <rect x="8" y="24" width="48" height="16" fill="#FF9800" />
            <rect x="12" y="40" width="4" height="12" fill="#6D4C41" />
            <rect x="48" y="40" width="4" height="12" fill="#6D4C41" />
          </svg>
        `,
        category: "furniture",
      },
      {
        id: "furniture3",
        name: "Furniture 3",
        image: `
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 64 64">
            <rect x="16" y="16" width="32" height="20" fill="#FF5722" />
            <rect x="20" y="36" width="4" height="16" fill="#4E342E" />
            <rect x="40" y="36" width="4" height="16" fill="#4E342E" />
          </svg>
        `,
        category: "furniture",
      },
    ],
  };
  
  

const LandscapeHome: React.FC<LandscapeProps> = () => {
  const [canvases, setCanvases] = useState<Canvas[]>(() => {
    const saved = localStorage.getItem("landscape-canvases");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedCanvas, setSelectedCanvas] = useState<number | null>(null);
  
  const [draggedItem, setDraggedItem] = useState<any | null>(null);
  const [selectedItem, setSelectedItem] = useState<Products | null>(null);
  const [isTreePanelOpen, setIsTreePanelOpen] = useState(true);
  const [isFurniturePanelOpen, setIsFurniturePanelOpen] = useState(true);

  const [is2DMode, setIs2DMode] = useState(false);

  const backgroundImages: BackgroundImage[] = [
    { id: "house", name: "Maison", src: "/images/wall.png" },
    { id: "wall", name: "Mur", src: "/images/home.png" },
    { id: "garden", name: "Jardin", src: "/images/wall.png" },
  ];

  useEffect(() => {
    localStorage.setItem("landscape-canvases", JSON.stringify(canvases));
  }, [canvases]);

  const createNewCanvas = () => {
    const newCanvas = {
      id: canvases.length,
      name: `Canvas ${canvases.length + 1}`,
      items: [],
      background: null,
    };
    setCanvases([...canvases, newCanvas]);
    setSelectedCanvas(newCanvas.id);
  };

  const handleBackgroundChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCanvas) return;
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedCanvases = canvases.map((canvas) =>
          canvas.id === selectedCanvas
            ? { ...canvas, background: e.target?.result as string }
            : canvas
        );
        setCanvases(updatedCanvases);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleDragStart = (item: any) => {
    setDraggedItem(item);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, canvasId: number) => {
    event.preventDefault();
    if (!draggedItem) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newItem = {
      id: `${draggedItem.id}-${Date.now()}`,
      name: draggedItem.name,
      category: draggedItem.category,
      x,
      y,
      width: 50,
      height: 100,
      image: draggedItem.image,
      type: draggedItem.type,
    };

    const updatedCanvases = canvases.map((canvas) =>
      canvas.id === canvasId
        ? { ...canvas, items: [...canvas.items, newItem] }
        : canvas
    );

    setCanvases(updatedCanvases);
    setDraggedItem(null);
  };

  const handleSelectItem = (item: any) => {
    setSelectedItem(item);
  };

  const updateItem = (updatedItem: any) => {
    const updatedCanvases = canvases.map((canvas: { id: number; items: Products[] }) =>
      canvas.id === selectedCanvas
      ? {
        ...canvas,
        items: canvas.items.map((item: Products) =>
          item.products_uuid === updatedItem.id ? updatedItem : item
        ),
        }
      : canvas
    );
    setCanvases(updatedCanvases);
    setSelectedItem(updatedItem);
  };

  const deleteSelectedItem = () => {
    if (!selectedItem || selectedCanvas === null) return;

    const updatedCanvases = canvases.map((canvas) =>
      canvas.id === selectedCanvas
        ? {
            ...canvas,
            items: canvas.items.filter((item: Products) => item.products_uuid !== selectedItem.products_uuid),
          }
        : canvas
    );

    setCanvases(updatedCanvases);
    setSelectedItem(null);
  };

  const handleResizeItem = (property: "width" | "height", value: number) => {
    if (!selectedItem || !selectedCanvas) return;

    const updatedItem = { ...selectedItem, [property]: value };
    const updatedCanvases = canvases.map((canvas: { id: number; items: Products[] }) =>
      canvas.id === selectedCanvas
      ? {
        ...canvas,
        items: canvas.items.map((item: Products) =>
          item.products_uuid === updatedItem.products_uuid ? updatedItem : item
        ),
        }
      : canvas
    );

    setCanvases(updatedCanvases);
    setSelectedItem(updatedItem);
  };

  const toggle2DMode = () => {
    setIs2DMode(!is2DMode);
  };

  const selectBackground = (backgroundSrc: string) => {
    const updatedCanvases = canvases.map((canvas) =>
      canvas.id === selectedCanvas
        ? { ...canvas, background: backgroundSrc }
        : canvas
    );
    setCanvases(updatedCanvases);
  };

  interface ResizeEvent {
    clientX: number;
    clientY: number;
    preventDefault: () => void;
    stopPropagation: () => void;
  }

  interface Item {
    id: string;
    name: string;
    category: string;
    x: number;
    y: number;
    width: number;
    height: number;
    image: string;
    type?: string;
  }

  const handleResizeStart = (
    event: ResizeEvent,
    item: Item,
    corner: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const initialX = event.clientX;
    const initialY = event.clientY;
    const initialWidth = item.width;
    const initialHeight = item.height;
  
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - initialX;
      const dy = e.clientY - initialY;
  
      let newWidth = initialWidth;
      let newHeight = initialHeight;
  
      if (corner.includes("right")) newWidth += dx;
      if (corner.includes("left")) newWidth -= dx;
      if (corner.includes("bottom")) newHeight += dy;
      if (corner.includes("top")) newHeight -= dy;
  
      updateItem({ ...item, width: Math.max(newWidth, 10), height: Math.max(newHeight, 10) });
    };
  
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="mb-8 p-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
          Landscape Designer
        </h1>
        <p className="text-slate-600">
          Advanced landscape design tool with drag-and-drop functionality for 2D garden planning
        </p>
        
        {/* Feature highlights */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Key Features:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Drag-and-drop canvas designer</li>
            <li>• Tree and furniture placement</li>
            <li>• 2D/Flat mode switching</li>
            <li>• Background management</li>
            <li>• Canvas management system</li>
          </ul>
        </div>
      </div>

      <div className="h-screen flex flex-col bg-gray-100">
        <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-10">
          <h1 className="text-2xl font-bold">Gestion des Plans</h1>
        </header>
      
      <div className="flex flex-1">
        <aside className="w-1/4 bg-white p-4 border-r shadow-md flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Gestion des plans</h2>
            <button
              onClick={createNewCanvas}
              className="btn-success w-full"
            >
              Créer un nouveau plan
            </button>
            <div className="mt-4 overflow-y-auto h-60">
              {canvases.map((canvas) => (
                <div
                  key={canvas.id}
                  onClick={() => setSelectedCanvas(canvas.id)}
                  className={`px-4 py-2 rounded cursor-pointer mb-2 ${
                    selectedCanvas === canvas.id
                      ? "bg-green-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {canvas.name}
                </div>
              ))}
            </div>
            <button
              onClick={toggle2DMode}
              className="btn-primary w-full mt-4"
            >
              {is2DMode ? "Mode Plat" : "Mode 2D"}
            </button>
          </div>

  {/* Trees Panel */}
  <div>
    <h2
      className="text-lg font-semibold cursor-pointer"
      onClick={() => setIsTreePanelOpen(!isTreePanelOpen)}
    >
      Arbres
    </h2>
    {isTreePanelOpen && (
      <div className="mt-2 space-y-2">
        {mockItems.trees.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => handleDragStart(item)}
            className="bg-gray-100 p-2 rounded shadow cursor-pointer"
            dangerouslySetInnerHTML={{ __html: item.image }}
          />
        ))}
      </div>
    )}
  </div>

  {/* Furniture Panel */}
  <div>
    <h2
      className="text-lg font-semibold cursor-pointer"
      onClick={() => setIsFurniturePanelOpen(!isFurniturePanelOpen)}
    >
      Meubles
    </h2>
    {isFurniturePanelOpen && (
      <div className="mt-2 space-y-2">
        {mockItems.furniture.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => handleDragStart(item)}
            className="bg-gray-100 p-2 rounded shadow cursor-pointer"
            dangerouslySetInnerHTML={{ __html: item.image }}
          />
        ))}
      </div>
    )}
  </div>
</aside>


        {/* Main Canvas */}
<main
  className="flex-1 flex items-center justify-center bg-gray-50"
  style={{
    backgroundImage:
      is2DMode && selectedCanvas !== null && canvases[selectedCanvas]?.background
        ? `url(${canvases[selectedCanvas]?.background})`
        : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {selectedCanvas !== null ? (
    <div
      className="w-full h-full bg-white border rounded shadow p-4 relative"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => handleDrop(event, selectedCanvas)}
    >
      <div
        id={`canvas-${selectedCanvas}`}
        className="relative w-full h-full bg-gray-200 border rounded shadow"
        style={{
          backgroundImage: canvases[selectedCanvas]?.background
            ? `url(${canvases[selectedCanvas]?.background})`
            : "",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, selectedCanvas)}
      ></div>

      {canvases[selectedCanvas].items.map((item: Item) => (
        <div
          key={item.id}
          style={{
            position: "absolute",
            left: item.x,
            top: item.y,
            width: item.width,
            height: item.height,
            cursor: "move",
            border: selectedItem?.products_uuid === item.id ? "2px dashed blue" : "none",
            backgroundColor: "transparent", // Set transparent background
            display: is2DMode ? "flex" : undefined,
            alignItems: "flex-end",
            // backgroundColor: is2DMode ? "lightgray" : "lightgray",
            // display: is2DMode ? "flex" : undefined,
          }}
          draggable
          onDragEnd={(event) => {
            const rect = event.currentTarget.parentElement!.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            updateItem({ ...item, x, y });
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleSelectItem(item);
          }}
          className="cursor-pointer flex items-center justify-center text-white rounded"
        >
          <div
                dangerouslySetInnerHTML={{ __html: item.image }}
                style={{
                    width: '100%',
                    height: '100%',
                    transform: `scale(${item.width / 100}, ${item.height / 100})`, // Adjust scale
                    transformOrigin: 'top left', // Maintain scaling from the top-left corner
                }}
                />
          {/* {item.name} */}
          {selectedItem?.products_uuid === item.id && (
            <>
              {/* Top-left Resizer */}
              <div
                style={{
                  position: "absolute",
                  top: -4,
                  left: -4,
                  width: 8,
                  height: 8,
                  backgroundColor: "blue",
                  cursor: "nwse-resize",
                }}
                onMouseDown={(e) => handleResizeStart(e, item, "top-left")}
              />
              {/* Top-right Resizer */}
              <div
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  width: 8,
                  height: 8,
                  backgroundColor: "blue",
                  cursor: "nesw-resize",
                }}
                onMouseDown={(e) => handleResizeStart(e, item, "top-right")}
              />
              {/* Bottom-left Resizer */}
              <div
                style={{
                  position: "absolute",
                  bottom: -4,
                  left: -4,
                  width: 8,
                  height: 8,
                  backgroundColor: "blue",
                  cursor: "nesw-resize",
                }}
                onMouseDown={(e) => handleResizeStart(e, item, "bottom-left")}
              />
              {/* Bottom-right Resizer */}
              <div
                style={{
                  position: "absolute",
                  bottom: -4,
                  right: -4,
                  width: 8,
                  height: 8,
                  backgroundColor: "blue",
                  cursor: "nwse-resize",
                }}
                onMouseDown={(e) => handleResizeStart(e, item, "bottom-right")}
              />
            </>
          )}

        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500">Sélectionnez un plan ou créez-en un nouveau.</p>
  )}
</main>


        {/* Right-hand Side Panel */}
        <aside className="w-1/4 bg-white p-4 border-l shadow-md flex flex-col space-y-4">
        {/* Item Properties Drawer */}
        <div className="group">
        <h2 className="text-lg font-semibold cursor-pointer border-b pb-2">
    Propriétés de l'élément
    <span className="ml-2 text-gray-500 group-hover:rotate-180 transition-transform">
      &#9654;
    </span>
  </h2>
  <div className="max-h-0 overflow-hidden group-hover:max-h-[400px] transition-all">
    {selectedItem && (
      <div className="p-4 border rounded mt-4 shadow">
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium">Largeur</label>
            <input
              type="number"
              value={selectedItem.width}
              onChange={(e) => handleResizeItem("width", Number(e.target.value))}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Hauteur</label>
            <input
              type="number"
              value={selectedItem.height}
              onChange={(e) => handleResizeItem("height", Number(e.target.value))}
              className="border rounded p-2 w-full"
            />
          </div>
        </div>
        <button
          onClick={deleteSelectedItem}
          className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 mt-4"
        >
          Supprimer l'élément
        </button>
      </div>
    )}
         </div>
    </div>

    {/* Background Manager Drawer */}
    <div className="group">
        <h2 className="text-lg font-semibold cursor-pointer border-b pb-2">
        Gestion de Fond
        <span className="ml-2 text-gray-500 group-hover:rotate-180 transition-transform">&#9654;</span>
        </h2>
        <div className="max-h-0 overflow-hidden group-hover:max-h-[400px] transition-all">
            <div className="p-4 border rounded mt-4 shadow">
                <input
                type="file"
                accept="image/*"
                onChange={handleBackgroundChange}
                className="mt-2"
                />
                <h3 className="text-md font-medium mt-4">Fonds disponibles</h3>
                <div className="mt-2 space-y-2">
                {backgroundImages.map((bg) => (
                    <div
                    key={bg.id}
                    onClick={() => selectBackground(bg.src)}
                    className="p-2 border rounded shadow cursor-pointer hover:bg-gray-200"
                    >
                    <img
                        src={bg.src}
                        alt={bg.name}
                        className="w-full h-20 object-cover rounded"
                    />
                    <p className="text-center mt-2">{bg.name}</p>
                    </div>
                ))}
                </div>
            </div>
        </div>
    </div>
    </aside>

      </div>
    </div>
    </div>
  );
};

export default LandscapeHome;
