# Garden Vision - Implementation Guide

## Overview
This guide provides detailed implementation instructions for the Garden Vision component, including architecture decisions, service patterns, and integration approaches specific to the GardenFlow application.

---

## 🏗️ Architecture Overview

### Component Hierarchy
```
GardenVision (index.tsx)
├── CameraModal
│   ├── CameraService
│   ├── UI Components (IconButton, LoadingSpinner)
│   └── Permission Handling
├── ResultsModal
│   ├── ImageRecognitionService
│   ├── Grid Visualization
│   └── Results List
└── Shared Services
    ├── CameraService (Singleton)
    ├── ImageRecognitionService (Singleton)
    └── GridUtils
```

### Design Patterns Used
- **Singleton Pattern**: For camera and recognition services
- **Observer Pattern**: For state management with React hooks
- **Factory Pattern**: For creating detected items
- **Strategy Pattern**: For different detection algorithms
- **Command Pattern**: For camera operations

---

## 🔧 Service Implementation

### CameraService Implementation

#### Singleton Service Pattern
```typescript
// services/cameraService.ts
class CameraService {
  private static instance: CameraService;
  private stream: MediaStream | null = null;
  private isInitialized = false;

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): CameraService {
    if (!CameraService.instance) {
      CameraService.instance = new CameraService();
    }
    return CameraService.instance;
  }

  public async requestCameraPermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: CAMERA_DEFAULTS
      });
      
      // Store stream for later use
      this.stream = stream;
      this.isInitialized = true;
      
      return true;
    } catch (error) {
      console.error('Camera permission denied:', error);
      return false;
    }
  }

  public cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
      this.isInitialized = false;
    }
  }
}

export const cameraService = CameraService.getInstance();
```

#### Camera Configuration
```typescript
// constants/index.ts
export const CAMERA_DEFAULTS = {
  video: {
    facingMode: 'environment',
    width: { ideal: 1280 },
    height: { ideal: 720 },
    aspectRatio: { ideal: 16/9 }
  },
  audio: false
};

export const CAMERA_RESOLUTIONS = {
  LOW: { width: 640, height: 480 },
  MEDIUM: { width: 1280, height: 720 },
  HIGH: { width: 1920, height: 1080 }
};
```

---

### ImageRecognitionService Implementation

#### Real Image Analysis Algorithm
```typescript
// services/imageRecognitionService.ts
class ImageRecognitionService {
  private static instance: ImageRecognitionService;

  public async processImage(imageDataUrl: string): Promise<AnalysisResult> {
    const startTime = performance.now();
    
    try {
      // 1. Load image into canvas
      const imageData = await this.loadImageData(imageDataUrl);
      
      // 2. Perform color analysis
      const colorAnalysis = this.analyzeColors(imageData);
      
      // 3. Detect shapes and patterns
      const shapeAnalysis = this.detectShapes(imageData);
      
      // 4. Generate realistic detections
      const detectedItems = this.generateRealisticDetections({
        colorAnalysis,
        shapeAnalysis,
        imageData
      });
      
      const processingTime = performance.now() - startTime;
      
      return {
        success: true,
        detectedItems,
        processingTime,
        metadata: {
          imageSize: `${imageData.width}x${imageData.height}`,
          totalItems: detectedItems.length,
          confidence: this.calculateOverallConfidence(detectedItems)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        processingTime: performance.now() - startTime
      };
    }
  }

  private analyzeColors(imageData: ImageData): ColorAnalysis {
    const { data, width, height } = imageData;
    const regions = {
      green: 0,    // Vegetation
      brown: 0,    // Soil
      structural: 0 // Paths, boundaries
    };
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      if (this.isGreenish(r, g, b)) {
        regions.green++;
      } else if (this.isBrownish(r, g, b)) {
        regions.brown++;
      } else if (this.isStructural(r, g, b)) {
        regions.structural++;
      }
    }
    
    const totalPixels = (data.length / 4);
    return {
      greenRatio: regions.green / totalPixels,
      brownRatio: regions.brown / totalPixels,
      structuralRatio: regions.structural / totalPixels,
      dominantColors: this.extractDominantColors(data)
    };
  }

  private detectShapes(imageData: ImageData): ShapeAnalysis {
    // Simplified shape detection
    const shapes = {
      rectangles: this.detectRectangles(imageData),
      circles: this.detectCircles(imageData),
      lines: this.detectLines(imageData)
    };
    
    return {
      shapes,
      patterns: this.detectPatterns(shapes),
      gridStructure: this.detectGridStructure(shapes)
    };
  }

  private generateRealisticDetections(analysis: ImageAnalysis): DetectedItem[] {
    const items: DetectedItem[] = [];
    const { colorAnalysis, shapeAnalysis, imageData } = analysis;
    
    // Generate parcels based on rectangular shapes
    const parcels = this.generateParcels(shapeAnalysis, imageData);
    items.push(...parcels);
    
    // Generate zones within parcels
    const zones = this.generateZones(parcels, colorAnalysis, imageData);
    items.push(...zones);
    
    // Generate individual plants
    const plants = this.generatePlants(zones, colorAnalysis, imageData);
    items.push(...plants);
    
    return items;
  }
}
```

---

## 🎨 UI Component Implementation

### Modal Component Pattern
```typescript
// components/ui/Modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  className = '' 
}) => {
  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`relative bg-white rounded-lg shadow-xl ${className}`}>
        {children}
      </div>
    </div>
  );
};
```

### Camera Modal Implementation
```typescript
// CameraModal.tsx
export const CameraModal: React.FC<CameraModalProps> = ({ 
  isOpen, 
  onClose, 
  onCapture 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize camera when modal opens
  useEffect(() => {
    if (isOpen) {
      initializeCamera();
    } else {
      cleanup();
    }

    return cleanup;
  }, [isOpen]);

  const initializeCamera = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const permissionGranted = await cameraService.requestCameraPermission();
      
      if (!permissionGranted) {
        setError('Camera access denied. Please grant permission and try again.');
        return;
      }

      // Get camera stream and attach to video element
      const stream = await cameraService.getStream();
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (error) {
      setError('Failed to access camera. Please check your device settings.');
      console.error('Camera initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to data URL
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    
    // Pass to parent component
    onCapture(imageDataUrl);
    
    // Close modal
    onClose();
  };

  const cleanup = () => {
    cameraService.cleanup();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full h-full max-w-none max-h-none">
      <div className="relative w-screen h-screen bg-black">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4">
          <h2 className="text-white text-lg font-semibold">Garden Vision</h2>
          <IconButton
            icon={<X className="w-6 h-6" />}
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20"
          />
        </div>

        {/* Camera View */}
        <div className="relative w-full h-full flex items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
              <LoadingSpinner className="text-white" />
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
              <ErrorMessage message={error} className="text-white" />
            </div>
          )}

          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />

          {/* Camera grid overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full border border-white border-opacity-30">
              {/* Rule of thirds grid */}
              <div className="absolute top-1/3 left-0 right-0 border-t border-white border-opacity-30" />
              <div className="absolute top-2/3 left-0 right-0 border-t border-white border-opacity-30" />
              <div className="absolute left-1/3 top-0 bottom-0 border-l border-white border-opacity-30" />
              <div className="absolute left-2/3 top-0 bottom-0 border-l border-white border-opacity-30" />
            </div>
          </div>

          {/* Hidden canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center">
          <IconButton
            icon={<Camera className="w-8 h-8" />}
            onClick={captureImage}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-6 rounded-full"
            disabled={isLoading || !!error}
          />
        </div>
      </div>
    </Modal>
  );
};
```

---

## 🔗 Integration with GardenFlow

### Footer Integration
```typescript
// In Footer.tsx or main layout component
import { GardenVision } from '@/components/prototypes/garden-vision';

export const Footer: React.FC = () => {
  return (
    <footer className="relative">
      {/* Existing footer content */}
      
      {/* Garden Vision positioned next to weather widget */}
      <div className="fixed top-20 right-20 z-50">
        <GardenVision />
      </div>
    </footer>
  );
};
```

### State Management Integration
```typescript
// If using Redux or Context for global state
const useGardenVisionState = () => {
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
  
  const addAnalysis = useCallback((result: AnalysisResult) => {
    setAnalysisHistory(prev => [result, ...prev].slice(0, 10)); // Keep last 10
  }, []);

  const clearHistory = useCallback(() => {
    setAnalysisHistory([]);
  }, []);

  return {
    analysisHistory,
    addAnalysis,
    clearHistory
  };
};
```

---

## 📱 Responsive Design Implementation

### Mobile-First Approach
```scss
// Mobile styles (default)
.garden-vision-icon {
  position: fixed;
  top: 1rem;
  right: 1rem;
  width: 3rem;
  height: 3rem;
  z-index: 50;
}

.camera-modal {
  width: 100vw;
  height: 100vh;
  
  .camera-controls {
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
  }
}

// Tablet and larger
@media (min-width: 768px) {
  .garden-vision-icon {
    top: 5rem;
    right: 5rem;
    width: 4rem;
    height: 4rem;
  }
  
  .results-modal {
    max-width: 90vw;
    max-height: 90vh;
  }
}

// Desktop
@media (min-width: 1024px) {
  .results-modal {
    max-width: 80vw;
    max-height: 80vh;
  }
}
```

### Touch-Friendly Controls
```typescript
// Touch gesture handling for mobile
const useTouchGestures = (onCapture: () => void) => {
  const handleTouchStart = useCallback((event: TouchEvent) => {
    // Implement touch-to-capture functionality
    if (event.touches.length === 1) {
      // Single tap to capture
      onCapture();
    }
  }, [onCapture]);

  useEffect(() => {
    const element = document.getElementById('camera-view');
    if (element) {
      element.addEventListener('touchstart', handleTouchStart);
      return () => element.removeEventListener('touchstart', handleTouchStart);
    }
  }, [handleTouchStart]);
};
```

---

## 🔒 Security Implementation

### Camera Permission Best Practices
```typescript
// Secure camera access pattern
const secureRequestCameraAccess = async (): Promise<boolean> => {
  // 1. Check if running in secure context
  if (!window.isSecureContext) {
    console.warn('Camera access requires HTTPS in production');
    return false;
  }

  // 2. Check if getUserMedia is available
  if (!navigator.mediaDevices?.getUserMedia) {
    console.warn('Camera API not supported');
    return false;
  }

  // 3. Check current permission status
  try {
    const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
    
    if (permission.state === 'denied') {
      console.warn('Camera permission previously denied');
      return false;
    }
  } catch (error) {
    // Permission API not supported, continue with getUserMedia
  }

  // 4. Request camera access
  try {
    const stream = await navigator.mediaDevices.getUserMedia(CAMERA_DEFAULTS);
    // Store stream securely
    return true;
  } catch (error) {
    console.error('Camera access denied:', error);
    return false;
  }
};
```

### Data Privacy Implementation
```typescript
// Privacy-first image handling
class PrivacyAwareImageService {
  processImage(imageDataUrl: string): Promise<AnalysisResult> {
    // 1. Process locally only - no external API calls
    // 2. Clear image data after processing
    // 3. Don't store images permanently
    
    return new Promise((resolve) => {
      // Process image
      const result = this.analyzeLocally(imageDataUrl);
      
      // Clear image data immediately after processing
      this.clearImageData(imageDataUrl);
      
      resolve(result);
    });
  }

  private clearImageData(imageDataUrl: string): void {
    // Clear canvas data
    // Remove any temporary storage
    // Ensure no image data persists
  }
}
```

---

## ⚡ Performance Optimization

### Web Workers for Heavy Processing
```typescript
// workers/imageProcessor.ts
self.onmessage = function(e) {
  const { imageData, config } = e.data;
  
  // Perform heavy image processing in worker
  const result = processImageData(imageData, config);
  
  // Send result back to main thread
  self.postMessage(result);
};

// In main thread
const useWebWorkerProcessing = () => {
  const workerRef = useRef<Worker>();

  useEffect(() => {
    workerRef.current = new Worker('/workers/imageProcessor.js');
    
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const processImage = useCallback((imageData: ImageData): Promise<AnalysisResult> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Worker not available'));
        return;
      }

      workerRef.current.onmessage = (e) => {
        resolve(e.data);
      };

      workerRef.current.onerror = (error) => {
        reject(error);
      };

      workerRef.current.postMessage({ imageData });
    });
  }, []);

  return { processImage };
};
```

### Memory Management
```typescript
// Efficient memory usage patterns
class MemoryEfficientProcessor {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  processImage(imageDataUrl: string): Promise<AnalysisResult> {
    return new Promise((resolve, reject) => {
      // Create canvas only when needed
      this.initializeCanvas();
      
      const img = new Image();
      img.onload = () => {
        try {
          const result = this.process(img);
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          // Always cleanup
          this.cleanup();
        }
      };
      
      img.onerror = () => {
        this.cleanup();
        reject(new Error('Failed to load image'));
      };
      
      img.src = imageDataUrl;
    });
  }

  private cleanup(): void {
    if (this.canvas) {
      // Clear canvas
      this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvas = null;
      this.ctx = null;
    }
  }
}
```

---

## 🧪 Testing Implementation

### Unit Test Structure
```typescript
// __tests__/imageRecognitionService.test.ts
describe('ImageRecognitionService', () => {
  let service: ImageRecognitionService;

  beforeEach(() => {
    service = ImageRecognitionService.getInstance();
  });

  describe('processImage', () => {
    it('should process valid image successfully', async () => {
      const mockImageDataUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...';
      
      const result = await service.processImage(mockImageDataUrl);
      
      expect(result.success).toBe(true);
      expect(result.detectedItems).toBeDefined();
      expect(result.processingTime).toBeGreaterThan(0);
    });

    it('should handle invalid image gracefully', async () => {
      const invalidImageDataUrl = 'invalid-data-url';
      
      const result = await service.processImage(invalidImageDataUrl);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('color analysis', () => {
    it('should detect green vegetation correctly', () => {
      const greenPixel = [50, 150, 50]; // RGB
      const result = service.isGreenish(...greenPixel);
      expect(result).toBe(true);
    });

    it('should detect brown soil correctly', () => {
      const brownPixel = [139, 69, 19]; // RGB
      const result = service.isBrownish(...brownPixel);
      expect(result).toBe(true);
    });
  });
});
```

### Integration Test Examples
```typescript
// __tests__/GardenVision.integration.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GardenVision } from '../index';

// Mock camera API
const mockGetUserMedia = jest.fn();
Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: mockGetUserMedia
  }
});

describe('GardenVision Integration', () => {
  beforeEach(() => {
    mockGetUserMedia.mockClear();
  });

  it('should complete full workflow successfully', async () => {
    // Mock successful camera access
    mockGetUserMedia.mockResolvedValue(new MediaStream());

    render(<GardenVision />);
    
    // Click camera icon
    const cameraIcon = screen.getByRole('button', { name: /camera/i });
    fireEvent.click(cameraIcon);

    // Wait for camera modal to open
    await waitFor(() => {
      expect(screen.getByText('Garden Vision')).toBeInTheDocument();
    });

    // Simulate image capture
    const captureButton = screen.getByRole('button', { name: /capture/i });
    fireEvent.click(captureButton);

    // Wait for results modal
    await waitFor(() => {
      expect(screen.getByText(/detected items/i)).toBeInTheDocument();
    });

    // Verify results are displayed
    expect(screen.getByText(/parcels/i)).toBeInTheDocument();
    expect(screen.getByText(/zones/i)).toBeInTheDocument();
  });

  it('should handle camera permission denial gracefully', async () => {
    // Mock permission denial
    mockGetUserMedia.mockRejectedValue(new Error('Permission denied'));

    render(<GardenVision />);
    
    const cameraIcon = screen.getByRole('button', { name: /camera/i });
    fireEvent.click(cameraIcon);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/camera access denied/i)).toBeInTheDocument();
    });
  });
});
```

---

## 📊 Monitoring and Analytics

### Performance Monitoring
```typescript
// Performance tracking implementation
class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  trackProcessingTime(operation: string, duration: number): void {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    
    this.metrics.get(operation)?.push(duration);
    
    // Keep only last 100 measurements
    const values = this.metrics.get(operation)!;
    if (values.length > 100) {
      values.shift();
    }
  }

  getAverageTime(operation: string): number {
    const values = this.metrics.get(operation) || [];
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  getP95Time(operation: string): number {
    const values = this.metrics.get(operation) || [];
    const sorted = [...values].sort((a, b) => a - b);
    const p95Index = Math.floor(sorted.length * 0.95);
    return sorted[p95Index] || 0;
  }
}

// Usage in service
const performanceMonitor = new PerformanceMonitor();

export const enhancedImageRecognitionService = {
  async processImage(imageDataUrl: string): Promise<AnalysisResult> {
    const startTime = performance.now();
    
    try {
      const result = await originalProcessImage(imageDataUrl);
      
      const duration = performance.now() - startTime;
      performanceMonitor.trackProcessingTime('image-processing', duration);
      
      return result;
    } catch (error) {
      // Track error metrics too
      performanceMonitor.trackProcessingTime('image-processing-error', performance.now() - startTime);
      throw error;
    }
  }
};
```

---

This implementation guide provides a comprehensive foundation for building and maintaining the Garden Vision component within the GardenFlow ecosystem, ensuring consistency, performance, and maintainability.