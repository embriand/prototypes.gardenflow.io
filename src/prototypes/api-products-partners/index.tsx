import React, { useState, useEffect } from "react";
import { AlertCircle, Link, Save, Trash2 } from "lucide-react";

interface ApiConfig {
  id: string;
  name: string;
  baseUrl: string;
  endpoint: string;
  authType: "none" | "basic" | "token";
  username?: string;
  password?: string;
  apiKey?: string;
  isActive: boolean;
}

interface ProductItem {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  images: string[];
  thumbnail: string;
}

interface CanvasItem {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  image: string;
  type: "flat" | "2d"; 
  category: "tree" | "furniture" | "bush";
  rotation?: number;
}


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

const ApiProductsPartners: React.FC = () => {
  const [canvases, setCanvases] = useState<any[]>(() => {
    const saved = localStorage.getItem("api-products-partners-canvases");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedCanvas, setSelectedCanvas] = useState<number | null>(null);
  const [draggedItem, setDraggedItem] = useState<any | null>(null);

  const [selectedItem, setSelectedItem] = useState<CanvasItem | null>(null);
  const [isTreePanelOpen, setIsTreePanelOpen] = useState(true);
  const [isFurniturePanelOpen, setIsFurniturePanelOpen] = useState(true);

  const [is2DMode, setIs2DMode] = useState(false);

  const backgroundImages = [
    { id: "house", name: "Maison", src: "/images/wall.png" },
    { id: "wall", name: "Mur", src: "/images/home.png" },
    { id: "garden", name: "Jardin", src: "/images/wall.png" },
  ];

  useEffect(() => {
    localStorage.setItem("api-products-partners-canvases", JSON.stringify(canvases));
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
    const updatedCanvases: CanvasItem[] = canvases.map((canvas: any) =>
      canvas.id === selectedCanvas
        ? {
      ...canvas,
      items: canvas.items.map((item: CanvasItem) =>
        item.id === updatedItem.id ? updatedItem : item
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
            items: canvas.items.filter((item: CanvasItem) => item.id !== selectedItem.id),
          }
        : canvas
    );

    setCanvases(updatedCanvases);
    setSelectedItem(null);
  };

  const handleResizeItem = (property: "width" | "height", value: number) => {
    if (!selectedItem || !selectedCanvas) return;

    const updatedItem = { ...selectedItem, [property]: value };
    const updatedCanvases: CanvasItem[] = canvases.map((canvas: any) =>
      canvas.id === selectedCanvas
        ? {
      ...canvas,
      items: canvas.items.map((item: CanvasItem) =>
        item.id === updatedItem.id ? updatedItem : item
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
    event: React.MouseEvent<HTMLDivElement, MouseEvent>;
    item: CanvasItem;
    corner: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  }

  const handleResizeStart = ({ event, item, corner }: ResizeEvent) => {
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

  // API Configuration state
  const [apiConfigs, setApiConfigs] = useState<ApiConfig[]>(() => {
    const savedConfigs = localStorage.getItem("api-products-partners-configurations");
    return savedConfigs ? JSON.parse(savedConfigs) : [];
  });

  const [isApiPanelOpen, setIsApiPanelOpen] = useState(false);
  const [currentApiConfig, setCurrentApiConfig] = useState<Partial<ApiConfig>>({});
  const [fetchedProducts, setFetchedProducts] = useState<ProductItem[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const [selectedApiConfig, setSelectedApiConfig] = useState<ApiConfig | null>(null);

  useEffect(() => {
    localStorage.setItem("api-products-partners-configurations", JSON.stringify(apiConfigs));
  }, [apiConfigs]);

  const handleAddApiConfig = () => {
    const newConfig: ApiConfig = {
      id: `api-${Date.now()}`,
      name: currentApiConfig.name || "New API Source",
      baseUrl: currentApiConfig.baseUrl || "",
      endpoint: currentApiConfig.endpoint || "/products",
      authType: currentApiConfig.authType || "none",
      isActive: true,
    };

    if (currentApiConfig.authType === "basic") {
      newConfig.username = currentApiConfig.username;
      newConfig.password = currentApiConfig.password;
    }

    if (currentApiConfig.authType === "token") {
      newConfig.apiKey = currentApiConfig.apiKey;
    }

    setApiConfigs([...apiConfigs, newConfig]);
    setCurrentApiConfig({});
  };

  const handleFetchProducts = async (config: ApiConfig) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
  
      if (config.authType === "basic") {
        headers["Authorization"] = `Basic ${btoa(`${config.username}:${config.password}`)}`;
      }
  
      if (config.authType === "token") {
        headers["Authorization"] = `Bearer ${config.apiKey}`;
      }
  
      const response = await fetch(`${config.baseUrl}${config.endpoint}`, { method: "GET", headers });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setFetchedProducts(data.products || []);
      setApiError(null);
    } catch (error) {
      console.error("API Fetch Error:", error);
      setApiError(error instanceof Error ? error.message : "Unknown error occurred");
      setFetchedProducts([]);
    }
  };
  

  const handleDeleteApiConfig = (configId: string) => {
    setApiConfigs(apiConfigs.filter(config => config.id !== configId));
  };

  const renderApiConfigPanel = () => (
    <div className="p-4 border rounded shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-4">API Products & Partners Configuration</h2>
      
      <div className="space-y-4">
        <input
          type="text"
          placeholder="API Source Name"
          value={currentApiConfig.name || ""}
          onChange={(e) => setCurrentApiConfig({...currentApiConfig, name: e.target.value})}
          className="w-full p-2 border rounded"
        />
        
        <input
          type="text"
          placeholder="Base URL (https://api.example.com)"
          value={currentApiConfig.baseUrl || ""}
          onChange={(e) => setCurrentApiConfig({...currentApiConfig, baseUrl: e.target.value})}
          className="w-full p-2 border rounded"
        />
        
        <input
          type="text"
          placeholder="Endpoint (/products)"
          value={currentApiConfig.endpoint || ""}
          onChange={(e) => setCurrentApiConfig({...currentApiConfig, endpoint: e.target.value})}
          className="w-full p-2 border rounded"
        />
        
        <select
          value={currentApiConfig.authType || "none"}
          onChange={(e) => setCurrentApiConfig({...currentApiConfig, authType: e.target.value as ApiConfig['authType']})}
          className="w-full p-2 border rounded"
        >
          <option value="none">No Authentication</option>
          <option value="basic">Basic Authentication</option>
          <option value="token">Token Authentication</option>
        </select>
        
        {currentApiConfig.authType === "basic" && (
          <>
            <input
              type="text"
              placeholder="Username"
              value={currentApiConfig.username || ""}
              onChange={(e) => setCurrentApiConfig({...currentApiConfig, username: e.target.value})}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={currentApiConfig.password || ""}
              onChange={(e) => setCurrentApiConfig({...currentApiConfig, password: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </>
        )}
        
        {currentApiConfig.authType === "token" && (
          <input
            type="text"
            placeholder="API Token"
            value={currentApiConfig.apiKey || ""}
            onChange={(e) => setCurrentApiConfig({...currentApiConfig, apiKey: e.target.value})}
            className="w-full p-2 border rounded"
          />
        )}
        
        <div className="flex space-x-2">
          <button 
            onClick={handleAddApiConfig}
            className="flex items-center bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            <Save size={16} className="mr-2" /> Save Configuration
          </button>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Partner API Configurations</h3>
        {apiConfigs.map(config => (
          <div key={config.id} className="flex items-center justify-between p-2 border rounded mb-2">
            <span>{config.name} - {config.baseUrl}</span>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedApiConfig(config);
                  handleFetchProducts(config);
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                <Link size={16} />
              </button>
              <button
                onClick={() => handleDeleteApiConfig(config.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {apiError && (
        <div className="mt-4 p-2 bg-red-100 border border-red-400 rounded flex items-center text-red-700">
          <AlertCircle size={16} className="mr-2" />
          {apiError}
        </div>
      )}
      
      {fetchedProducts.length > 0 && selectedApiConfig && (
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2">Partner Products from {selectedApiConfig.name}</h3>
          <div className="grid grid-cols-2 gap-2">
            {fetchedProducts.map(product => (
              <div key={product.id} className="p-2 border rounded">
                <h4 className="text-sm font-medium">{product.title}</h4>
                <p className="text-xs text-gray-500">{product.description}</p>
                {product.images && product.images[0] && (
                  <img src={product.images[0]} alt={product.title} className="w-full h-16 object-cover mt-1 rounded" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-10">
        <h1 className="text-2xl font-bold">API Products & Partners Management</h1>
      </header>
      
      <div className="flex flex-1">
        <aside className="w-1/4 bg-white p-4 border-r shadow-md flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Canvas Management</h2>
            <button
              onClick={createNewCanvas}
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-500 w-full"
            >
              Create New Canvas
            </button>
            <div className="mt-4 overflow-y-auto h-32">
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
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-500 w-full mt-4"
            >
              {is2DMode ? "Flat Mode" : "2D Mode"}
            </button>
          </div>

          {/* Trees Panel */}
          <div>
            <h2
              className="text-lg font-semibold cursor-pointer"
              onClick={() => setIsTreePanelOpen(!isTreePanelOpen)}
            >
              Trees
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
              Furniture
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
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          {selectedCanvas !== null ? (
            <div
              className="w-full h-full bg-white border rounded shadow p-4 relative"
              onDragOver={(event: React.DragEvent<HTMLDivElement>) => event.preventDefault()}
              onDrop={(event: React.DragEvent<HTMLDivElement>) => handleDrop(event, selectedCanvas!)}
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
                onDragOver={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
                onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e, selectedCanvas!)}
              >
                {canvases[selectedCanvas].items.map((item: CanvasItem) => (
                  <div
                    key={item.id}
                    style={{
                      position: "absolute",
                      left: item.x,
                      top: item.y,
                      width: item.width,
                      height: item.height,
                      cursor: "move",
                      border: selectedItem?.id === item.id ? "2px dashed blue" : "none",
                      backgroundColor: "transparent",
                      display: is2DMode ? "flex" : undefined,
                      alignItems: "flex-end",
                    }}
                    draggable
                    onDragEnd={(event: React.DragEvent<HTMLDivElement>) => {
                      const rect = event.currentTarget.parentElement!.getBoundingClientRect();
                      const x = event.clientX - rect.left;
                      const y = event.clientY - rect.top;
                      updateItem({ ...item, x, y });
                    }}
                    onClick={(e: React.MouseEvent<HTMLDivElement>) => {
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
                        transform: `scale(${item.width / 100}, ${item.height / 100})`,
                        transformOrigin: 'top left',
                      }}
                    />
                    {selectedItem?.id === item.id && (
                      <>
                        {/* Resize handles */}
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
                          onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleResizeStart({ event: e, item, corner: "top-left" })}
                        />
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
                          onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleResizeStart({ event: e, item, corner: "top-right" })}
                        />
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
                          onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleResizeStart({ event: e, item, corner: "bottom-left" })}
                        />
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
                          onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleResizeStart({ event: e, item, corner: "bottom-right" })}
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Select a canvas or create a new one.</p>
          )}
        </main>
        
        {/* Right Panel */}
        <aside className="w-1/4 bg-white p-4 border-l shadow-md flex flex-col space-y-4">
          {/* Item Properties */}
          <div className="group">
            <h2 className="text-lg font-semibold cursor-pointer border-b pb-2">
              Item Properties
              <span className="ml-2 text-gray-500 group-hover:rotate-180 transition-transform">
                &#9654;
              </span>
            </h2>
            <div className="max-h-0 overflow-hidden group-hover:max-h-[400px] transition-all">
              {selectedItem && (
                <div className="p-4 border rounded mt-4 shadow">
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium">Width</label>
                      <input
                        type="number"
                        value={selectedItem.width}
                        onChange={(e) => handleResizeItem("width", Number(e.target.value))}
                        className="border rounded p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Height</label>
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
                    Delete Item
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Background Manager */}
          <div className="group">
            <h2 className="text-lg font-semibold cursor-pointer border-b pb-2">
              Background Manager
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
                <h3 className="text-md font-medium mt-4">Available Backgrounds</h3>
                <div className="mt-2 space-y-2">
                  {backgroundImages.map((bg) => (
                    <div
                      key={bg.id}
                      onClick={() => selectBackground(bg.src)}
                      className="p-2 border rounded shadow cursor-pointer hover:bg-gray-200"
                    >
                      <div className="w-full h-12 bg-gray-300 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-600">{bg.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* API Configuration */}
          <div className="group">
            <h2 
              className="text-lg font-semibold cursor-pointer border-b pb-2"
              onClick={() => setIsApiPanelOpen(!isApiPanelOpen)}
            >
              API Products & Partners
              <span className="ml-2 text-gray-500 group-hover:rotate-180 transition-transform">&#9654;</span>
            </h2>
            
            {isApiPanelOpen && renderApiConfigPanel()}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ApiProductsPartners;