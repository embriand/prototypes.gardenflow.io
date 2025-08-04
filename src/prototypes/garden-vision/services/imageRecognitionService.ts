import { RecognitionResult, DetectedItem, DetectedParcel } from '../types';
import { ITEM_TYPES, COLORS, PROCESSING_CONFIG } from '../constants';
import { SimpleParcelDetector } from './simpleParcelDetector';
import { memoryMonitor, withMemoryCheck } from '../utils/memoryMonitor';
import { optimizeImageForProcessing } from '../utils/imageMemoryOptimizer';

export class ImageRecognitionService {
  private static instance: ImageRecognitionService;
  private isProcessing = false;
  private processingStartTime: number | null = null;
  
  // Safety configuration
  private readonly MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
  private readonly MAX_PROCESSING_TIME = 10000; // 10 seconds
  private readonly MAX_DIMENSION = 800; // 800px max
  private readonly MAX_DETECTED_ITEMS = 30; // Limit detected items
  
  private constructor() {
    // Start memory monitoring
    memoryMonitor.startMonitoring(3000); // Check every 3 seconds
    
    // Setup memory callbacks
    memoryMonitor.onWarning((stats) => {
      console.warn('⚠️ Memory usage warning:', Math.round(stats.percentage) + '%');
    });
    
    memoryMonitor.onCritical((stats) => {
      console.error('🚨 Critical memory usage:', Math.round(stats.percentage) + '%');
      this.emergencyCleanup();
    });
  }
  
  static getInstance(): ImageRecognitionService {
    if (!ImageRecognitionService.instance) {
      ImageRecognitionService.instance = new ImageRecognitionService();
    }
    return ImageRecognitionService.instance;
  }
  
  /**
   * Emergency cleanup when memory is critical
   */
  private emergencyCleanup(): void {
    try {
      this.isProcessing = false;
      this.processingStartTime = null;
      
      // Force garbage collection
      memoryMonitor.forceGarbageCollection();
      
      console.log('🚨 Emergency cleanup completed');
    } catch (error) {
      console.error('Emergency cleanup failed:', error);
    }
  }
  
  async processImage(imageDataUrl: string): Promise<RecognitionResult> {
    // Safety checks
    if (this.isProcessing) {
      throw new Error('Another image is already being processed. Please wait.');
    }
    
    if (!imageDataUrl || typeof imageDataUrl !== 'string') {
      throw new Error('Invalid image data provided');
    }
    
    // Check memory before processing (use lenient check for image processing)
    if (!memoryMonitor.isMemoryUsageSafeForImageProcessing()) {
      console.warn('⚠️ Memory usage high, forcing cleanup before processing...');
      memoryMonitor.forceGarbageCollection();
      
      // Wait a moment for cleanup
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check again after cleanup
      if (!memoryMonitor.isMemoryUsageSafeForImageProcessing()) {
        throw new Error('Insufficient memory available for image processing. Please close other tabs or restart your browser.');
      }
    }
    
    this.isProcessing = true;
    this.processingStartTime = Date.now();
    
    try {
      const startTime = Date.now();
      
      // Validate and optimize image for memory efficiency
      console.log('🔧 Optimizing image for memory-efficient processing...');
      const optimizedImageUrl = await optimizeImageForProcessing(imageDataUrl);
      console.log('✅ Image optimization completed');
      
      // Save image for testing if in development mode
      if (process.env.NODE_ENV === 'development') {
        this.saveImageForTestingSafe(optimizedImageUrl);
      }
      
      // Check timeout
      if (Date.now() - startTime > this.MAX_PROCESSING_TIME) {
        throw new Error('Processing timeout reached');
      }
      
      // Simulate processing delay (reduced)
      await this.delay(Math.min(PROCESSING_CONFIG.MOCK_DELAY, 1000));
      
      // Analyze the actual image for colors, shapes, and patterns
      const imageAnalysis = await this.analyzeImageContentSafe(optimizedImageUrl);
      
      // Check timeout again
      if (Date.now() - startTime > this.MAX_PROCESSING_TIME) {
        throw new Error('Processing timeout reached during analysis');
      }
      
      // Generate realistic detection results based on image analysis
      const detectedItems = this.generateRealisticDetectionsSafe(imageAnalysis);
      const detectedParcels = this.groupItemsIntoParcelsSafe(detectedItems);
      
      const processingTime = (Date.now() - startTime) / 1000;
      
      return {
        success: true,
        imageUrl: optimizedImageUrl,
        detectedItems,
        detectedParcels,
        processingTime,
        timestamp: new Date()
      };
    } catch (error: any) {
      console.error('Image recognition failed:', error);
      throw new Error(`Image recognition failed: ${error.message}`);
    } finally {
      this.isProcessing = false;
      this.processingStartTime = null;
      
      // Force garbage collection after processing
      memoryMonitor.forceGarbageCollection();
    }
  }
  
  /**
   * Validate image before processing (simplified since optimizer handles sizing)
   */
  private async validateAndOptimizeImage(imageDataUrl: string): Promise<string> {
    try {
      // Basic validation
      if (!imageDataUrl || !imageDataUrl.startsWith('data:image/')) {
        throw new Error('Invalid image format');
      }
      
      // Extract base64 data
      const base64Data = imageDataUrl.replace(/^data:image\/\w+;base64,/, '');
      const buffer = atob(base64Data);
      
      // Check file size (more lenient)
      if (buffer.length > this.MAX_IMAGE_SIZE) {
        console.warn(`⚠️ Large image detected: ${Math.round(buffer.length / (1024 * 1024))}MB`);
        // Let the optimizer handle size reduction instead of rejecting
      }
      
      return imageDataUrl;
    } catch (error: any) {
      throw new Error(`Image validation failed: ${error.message}`);
    }
  }
  
  /**
   * Load image element safely
   */
  private loadImageElement(imageDataUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        reject(new Error('Image loading timeout'));
      }, 5000);
      
      img.onload = () => {
        clearTimeout(timeout);
        resolve(img);
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Failed to load image'));
      };
      
      img.src = imageDataUrl;
    });
  }
  
  /**
   * Resize image to fit within maximum dimensions
   */
  private async resizeImage(img: HTMLImageElement, maxDimension: number): Promise<string> {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Cannot create canvas context');
      }
      
      // Calculate new dimensions
      const ratio = Math.min(maxDimension / img.width, maxDimension / img.height);
      const newWidth = Math.round(img.width * ratio);
      const newHeight = Math.round(img.height * ratio);
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Draw resized image
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      // Convert back to data URL with compression
      const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      console.log(`📐 Resized image from ${img.width}x${img.height} to ${newWidth}x${newHeight}`);
      
      return resizedDataUrl;
    } catch (error: any) {
      throw new Error(`Image resizing failed: ${error.message}`);
    }
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private saveImageForTestingSafe(imageDataUrl: string): void {
    try {
      // Skip if memory usage is high
      if (!memoryMonitor.isMemoryUsageSafe()) {
        console.warn('⚠️ Skipping test image save due to high memory usage');
        return;
      }
      
      // Create a link element to download the image
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `garden-vision-test-${timestamp}.jpg`;
      link.href = imageDataUrl;
      
      // Log the data URL for manual testing (truncated)
      console.log('📸 Test image captured:', {
        filename: link.download,
        dataSize: Math.round(imageDataUrl.length / 1024) + 'KB',
        timestamp: new Date().toISOString()
      });
      
      // Auto-download in development (optional)
      // link.click(); // Disabled to prevent spam
      
      // Save to localStorage with size limits
      try {
        const savedImages = JSON.parse(localStorage.getItem('garden-vision-test-images') || '[]');
        
        // Check total size before adding
        const totalSize = savedImages.reduce((sum: number, img: any) => sum + (img.dataUrl?.length || 0), 0);
        const maxTotalSize = 2 * 1024 * 1024; // 2MB total limit
        
        if (totalSize + imageDataUrl.length > maxTotalSize) {
          // Remove oldest images to make room
          while (savedImages.length > 0 && totalSize + imageDataUrl.length > maxTotalSize) {
            const removed = savedImages.shift();
            console.log('🗑️ Removed old test image:', removed.filename);
          }
        }
        
        savedImages.push({
          timestamp: new Date().toISOString(),
          filename: link.download,
          dataUrl: imageDataUrl
        });
        
        // Keep only last 2 images (reduced from 3)
        if (savedImages.length > 2) {
          savedImages.shift();
        }
        
        localStorage.setItem('garden-vision-test-images', JSON.stringify(savedImages));
      } catch (e) {
        console.warn('Could not save to localStorage:', e);
      }
    } catch (error) {
      console.error('Failed to save test image:', error);
    }
  }
  
  private async analyzeImageContentSafe(imageDataUrl: string): Promise<ImageAnalysis> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      // Add timeout
      const timeout = setTimeout(() => {
        reject(new Error('Image analysis timeout'));
      }, 8000);
      
      img.onload = () => {
        try {
          clearTimeout(timeout);
          
          // Check memory before processing (use lenient check)
          if (!memoryMonitor.isMemoryUsageSafeForImageProcessing()) {
            console.warn('⚠️ Memory usage high during analysis, forcing cleanup...');
            memoryMonitor.forceGarbageCollection();
            
            // Still proceed with analysis if possible
            if (!memoryMonitor.isMemoryUsageSafeForImageProcessing()) {
              reject(new Error('Insufficient memory for image analysis. Please try with a smaller image.'));
              return;
            }
          }
          
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          
          const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
          if (!imageData) {
            resolve({ colorRegions: [], shapes: [], patterns: [], dimensions: { width: 0, height: 0 } });
            return;
          }
          
          // Use safe detection methods with memory checks
          const analysis: ImageAnalysis = {
            colorRegions: this.detectColorRegionsSafe(imageData),
            shapes: this.detectShapesSafe(imageData),
            patterns: this.detectPatternsSafe(imageData),
            dimensions: { width: canvas.width, height: canvas.height }
          };
          
          resolve(analysis);
        } catch (error: any) {
          clearTimeout(timeout);
          reject(new Error(`Image analysis failed: ${error.message}`));
        }
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Failed to load image for analysis'));
      };
      
      img.src = imageDataUrl;
    });
  }

  private detectColorRegionsSafe(imageData: ImageData): ColorRegion[] {
    const regions: ColorRegion[] = [];
    
    try {
      if (!imageData || !imageData.data || !imageData.width || !imageData.height) {
        return regions;
      }
      
      const { data, width, height } = imageData;
      const visited = new Set<string>();
      
      // Use a more conservative grid-based approach
      const gridSize = Math.min(width, height) / 15; // Larger grid for performance
      const sampleStep = Math.max(10, Math.floor(gridSize / 8)); // Larger steps
      const maxRegions = 15; // Limit number of regions
      
      // Sample the image in a grid pattern with early termination
      for (let y = sampleStep; y < height - sampleStep && regions.length < maxRegions; y += sampleStep) {
        for (let x = sampleStep; x < width - sampleStep && regions.length < maxRegions; x += sampleStep) {
          try {
            // Check memory periodically (use lenient check)
            if (x % (sampleStep * 5) === 0 && !memoryMonitor.isMemoryUsageSafeForImageProcessing()) {
              console.warn('⚠️ High memory usage detected, forcing cleanup during processing...');
              memoryMonitor.forceGarbageCollection();
              
              // Continue processing unless memory is critically low
              if (!memoryMonitor.isMemoryUsageSafe()) {
                console.warn('⚠️ Stopping color region detection due to critical memory constraints');
                break;
              }
            }
            
            const key = `${x},${y}`;
            if (visited.has(key)) continue;
            
            const idx = (y * width + x) * 4;
            if (idx + 3 >= data.length) continue;
            
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            
            // Detect different region types with better thresholds
            if (this.isGreenish(r, g, b)) {
              const region = this.detectConnectedRegionSafe(imageData, x, y, visited, 'vegetation');
              if (region && region.area > gridSize * gridSize * 0.3) {
                regions.push(region);
              }
            } else if (this.isBrownish(r, g, b)) {
              const region = this.detectConnectedRegionSafe(imageData, x, y, visited, 'soil');
              if (region && region.area > gridSize * gridSize * 0.2) {
                regions.push(region);
              }
            } else if (this.isStructural(r, g, b)) {
              const region = this.detectConnectedRegionSafe(imageData, x, y, visited, 'structure');
              if (region && region.area > gridSize * gridSize * 0.1) {
                regions.push(region);
              }
            }
          } catch (error) {
            console.warn('Failed to process pixel at', x, y, ':', error);
          }
        }
      }
      
      console.log(`🔍 Detected ${regions.length} color regions in ${width}x${height} image`);
      return regions;
    } catch (error: any) {
      console.error('Color region detection failed:', error);
      return [];
    }
  }

  private detectShapesSafe(imageData: ImageData): Shape[] {
    try {
      if (!imageData || !imageData.width || !imageData.height) {
        return [];
      }
      
      // Check memory before shape detection (use lenient check)
      if (!memoryMonitor.isMemoryUsageSafeForImageProcessing()) {
        console.warn('⚠️ Memory usage high, forcing cleanup before shape detection...');
        memoryMonitor.forceGarbageCollection();
        
        // Skip only if critically low
        if (!memoryMonitor.isMemoryUsageSafe()) {
          console.warn('⚠️ Skipping shape detection due to critical memory constraints');
          return [];
        }
      }
      
      // Use the simple parcel detector with timeout protection
      const detectPromise = new Promise<any[]>((resolve, reject) => {
        try {
          const parcels = SimpleParcelDetector.detectParcels(imageData);
          resolve(parcels);
        } catch (error) {
          reject(error);
        }
      });
      
      const timeoutPromise = new Promise<any[]>((_, reject) => {
        setTimeout(() => reject(new Error('Shape detection timeout')), 5000);
      });
      
      // This is a workaround since we can't use await in this context
      // We'll use the direct approach with error handling
      let parcels: any[] = [];
      try {
        parcels = SimpleParcelDetector.detectParcels(imageData);
        // Limit number of parcels
        parcels = parcels.slice(0, 10);
      } catch (error) {
        console.error('Simple parcel detection failed:', error);
        return [];
      }
      
      // Convert to Shape format
      const shapes: Shape[] = parcels.map(parcel => {
        try {
          return {
            type: 'rectangle' as const,
            bbox: {
              x: Math.max(0, parcel.x),
              y: Math.max(0, parcel.y),
              width: Math.max(1, parcel.width),
              height: Math.max(1, parcel.height)
            },
            confidence: Math.max(0, Math.min(1, parcel.confidence))
          };
        } catch (error) {
          console.warn('Failed to convert parcel to shape:', error);
          return null;
        }
      }).filter(Boolean);
      
      console.log(`📐 Simple detector found ${shapes.length} parcels`);
      return shapes;
    } catch (error: any) {
      console.error('Shape detection failed:', error);
      return [];
    }
  }

  private detectEdges(imageData: ImageData): Uint8Array {
    const { data, width, height } = imageData;
    const edges = new Uint8Array(width * height);
    
    // Simple edge detection using color differences
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        
        // Get current pixel
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        
        // Compare with neighbors
        let maxDiff = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            
            const nIdx = ((y + dy) * width + (x + dx)) * 4;
            const dr = Math.abs(data[nIdx] - r);
            const dg = Math.abs(data[nIdx + 1] - g);
            const db = Math.abs(data[nIdx + 2] - b);
            
            maxDiff = Math.max(maxDiff, dr + dg + db);
          }
        }
        
        // Mark as edge if significant difference
        edges[y * width + x] = maxDiff > 100 ? 255 : 0;
      }
    }
    
    return edges;
  }

  private findRectangularRegions(edges: Uint8Array, width: number, height: number): Array<{x: number, y: number, width: number, height: number}> {
    const rectangles: Array<{x: number, y: number, width: number, height: number}> = [];
    const visited = new Set<number>();
    
    // Scan for potential rectangle corners
    for (let y = 10; y < height - 10; y += 5) {
      for (let x = 10; x < width - 10; x += 5) {
        const idx = y * width + x;
        
        if (edges[idx] > 0 && !visited.has(idx)) {
          // Try to trace a rectangle from this point
          const rect = this.traceRectangle(edges, x, y, width, height, visited);
          
          if (rect && rect.width > 20 && rect.height > 20) {
            rectangles.push(rect);
          }
        }
      }
    }
    
    // Merge overlapping rectangles
    return this.mergeOverlappingRectangles(rectangles);
  }

  private traceRectangle(edges: Uint8Array, startX: number, startY: number, width: number, height: number, visited: Set<number>): {x: number, y: number, width: number, height: number} | null {
    // Find the bounds of a potential rectangle
    let minX = startX, maxX = startX;
    let minY = startY, maxY = startY;
    
    // Trace horizontally
    for (let x = startX; x < width && x < startX + 200; x++) {
      const idx = startY * width + x;
      if (edges[idx] > 0) {
        maxX = x;
        visited.add(idx);
      } else if (x > startX + 20) {
        break;
      }
    }
    
    // Trace vertically
    for (let y = startY; y < height && y < startY + 200; y++) {
      const idx = y * width + startX;
      if (edges[idx] > 0) {
        maxY = y;
        visited.add(idx);
      } else if (y > startY + 20) {
        break;
      }
    }
    
    const rectWidth = maxX - minX;
    const rectHeight = maxY - minY;
    
    // Check if it's a reasonable rectangle
    if (rectWidth > 20 && rectHeight > 20 && rectWidth < 300 && rectHeight < 300) {
      return {
        x: minX,
        y: minY,
        width: rectWidth,
        height: rectHeight
      };
    }
    
    return null;
  }

  private mergeOverlappingRectangles(rectangles: Array<{x: number, y: number, width: number, height: number}>): Array<{x: number, y: number, width: number, height: number}> {
    const merged: Array<{x: number, y: number, width: number, height: number}> = [];
    const used = new Set<number>();
    
    for (let i = 0; i < rectangles.length; i++) {
      if (used.has(i)) continue;
      
      let rect = { ...rectangles[i] };
      used.add(i);
      
      // Check for overlaps with other rectangles
      for (let j = i + 1; j < rectangles.length; j++) {
        if (used.has(j)) continue;
        
        const other = rectangles[j];
        
        // Check if rectangles overlap
        if (rect.x < other.x + other.width &&
            rect.x + rect.width > other.x &&
            rect.y < other.y + other.height &&
            rect.y + rect.height > other.y) {
          
          // Merge rectangles
          const newX = Math.min(rect.x, other.x);
          const newY = Math.min(rect.y, other.y);
          const newMaxX = Math.max(rect.x + rect.width, other.x + other.width);
          const newMaxY = Math.max(rect.y + rect.height, other.y + other.height);
          
          rect = {
            x: newX,
            y: newY,
            width: newMaxX - newX,
            height: newMaxY - newY
          };
          
          used.add(j);
        }
      }
      
      merged.push(rect);
    }
    
    return merged;
  }

  private detectPatternsSafe(imageData: ImageData): Pattern[] {
    try {
      if (!imageData || !imageData.width || !imageData.height) {
        return [];
      }
      
      // Simplified pattern detection for memory efficiency
      const patterns: Pattern[] = [];
      
      // Basic pattern detection based on image dimensions
      const { width, height } = imageData;
      const aspectRatio = width / height;
      
      if (aspectRatio > 1.2) {
        patterns.push({ type: 'rows', confidence: 0.7, orientation: 'horizontal' });
      } else if (aspectRatio < 0.8) {
        patterns.push({ type: 'rows', confidence: 0.7, orientation: 'vertical' });
      } else {
        patterns.push({ type: 'grid', confidence: 0.6, spacing: Math.min(width, height) / 10 });
      }
      
      return patterns;
    } catch (error: any) {
      console.error('Pattern detection failed:', error);
      return [];
    }
  }
  
  private isGreenish(r: number, g: number, b: number): boolean {
    return g > r && g > b && g > 80; // Green dominant and bright enough
  }

  private isBrownish(r: number, g: number, b: number): boolean {
    return r > 100 && g > 60 && b < 80 && r > g && g > b; // Brown-ish colors
  }

  private isStructural(r: number, g: number, b: number): boolean {
    // Gray, concrete, or structured colors
    const avg = (r + g + b) / 3;
    const variance = Math.abs(r - avg) + Math.abs(g - avg) + Math.abs(b - avg);
    return variance < 30; // Low color variance indicates structural elements
  }

  private detectConnectedRegionSafe(
    imageData: ImageData, 
    startX: number, 
    startY: number, 
    visited: Set<string>,
    type: 'vegetation' | 'soil' | 'structure'
  ): ColorRegion | null {
    try {
      const { width, height, data } = imageData;
      
      if (!data || startX < 0 || startX >= width || startY < 0 || startY >= height) {
        return null;
      }
      
      // Define region bounds
      let minX = startX, maxX = startX;
      let minY = startY, maxY = startY;
      let pixelCount = 0;
      
      // Reduced sampling for performance
      const maxRadius = Math.min(width, height) / 15; // Smaller radius
      const step = 8; // Larger step
      const maxPixels = 100; // Limit pixel count
      
      for (let radius = 0; radius < maxRadius && pixelCount < maxPixels; radius += step) {
        for (let angle = 0; angle < Math.PI * 2 && pixelCount < maxPixels; angle += 0.2) { // Larger angle step
          const x = Math.round(startX + radius * Math.cos(angle));
          const y = Math.round(startY + radius * Math.sin(angle));
          
          if (x < 0 || x >= width || y < 0 || y >= height) continue;
          
          const key = `${x},${y}`;
          if (!visited.has(key)) {
            visited.add(key);
            pixelCount++;
            
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
          }
        }
      }
      
      const idx = (startY * width + startX) * 4;
      
      if (idx + 3 >= data.length) {
        return null;
      }
      
      return {
        bbox: { 
          x: minX, 
          y: minY, 
          width: Math.max(1, maxX - minX), 
          height: Math.max(1, maxY - minY)
        },
        area: pixelCount * step * step,
        type,
        dominantColor: { 
          r: data[idx] || 0, 
          g: data[idx + 1] || 0, 
          b: data[idx + 2] || 0
        }
      };
    } catch (error: any) {
      console.warn('Connected region detection failed:', error);
      return null;
    }
  }

  private generateRealisticDetectionsSafe(analysis: ImageAnalysis): DetectedItem[] {
    const detectedItems: DetectedItem[] = [];
    let itemId = 1;
    
    try {
      // Log analysis details for debugging
      console.log('📊 Image Analysis:', {
        imageSize: `${analysis.dimensions.width}x${analysis.dimensions.height}`,
        colorRegions: analysis.colorRegions?.length || 0,
        shapes: analysis.shapes?.length || 0,
        patterns: analysis.patterns?.length || 0
      });
      
      // First, use detected shapes as primary parcels (limited)
      const validShapes = (analysis.shapes || []).filter(s => s && s.confidence > 0.6);
      console.log(`🏗️ Processing ${validShapes.length} detected shapes from edge detection`);
      
      // Create parcels from shapes (limited to prevent memory issues)
      const maxParcels = Math.min(10, validShapes.length); // Reduced from 50 to 10
      validShapes.slice(0, maxParcels).forEach((shape, index) => {
        try {
          if (!shape || !shape.bbox) return;
          
          // Ensure bbox is within image bounds and valid
          const boundedBbox = {
            x: Math.max(0, Math.min(shape.bbox.x || 0, analysis.dimensions.width - (shape.bbox.width || 1))),
            y: Math.max(0, Math.min(shape.bbox.y || 0, analysis.dimensions.height - (shape.bbox.height || 1))),
            width: Math.min(shape.bbox.width || 1, analysis.dimensions.width - (shape.bbox.x || 0)),
            height: Math.min(shape.bbox.height || 1, analysis.dimensions.height - (shape.bbox.y || 0))
          };
          
          if (boundedBbox.width > 10 && boundedBbox.height > 10) {
            detectedItems.push({
              id: (itemId++).toString(),
              type: ITEM_TYPES.PARCEL,
              name: `Parcel ${String.fromCharCode(65 + Math.floor(index / 26))}${(index % 26 + 1)}`,
              confidence: Math.max(0, Math.min(1, shape.confidence)),
              bbox: boundedBbox,
              color: COLORS.PARCEL
            });
          }
        } catch (error) {
          console.warn('Failed to process shape:', error);
        }
      });
      
      // Generate zones within parcels from vegetation regions (limited)
      const vegetationRegions = (analysis.colorRegions || []).filter(r => r && r.type === 'vegetation');
      const maxZones = Math.min(3, vegetationRegions.length); // Reduced from 4 to 3
      vegetationRegions.slice(0, maxZones).forEach((region, index) => {
        try {
          if (!region || !region.bbox) return;
          
          const zoneTypes = ['Tomato Zone', 'Lettuce Zone', 'Herb Zone'];
          detectedItems.push({
            id: (itemId++).toString(),
            type: ITEM_TYPES.ZONE,
            name: zoneTypes[index % zoneTypes.length],
            confidence: Math.max(0.5, Math.min(1, 0.8 + Math.random() * 0.15)),
            bbox: region.bbox,
            color: COLORS.ZONE
          });
        } catch (error) {
          console.warn('Failed to process vegetation region:', error);
        }
      });
      
      // Generate individual plants/crops (significantly limited)
      const smallRegions = (analysis.colorRegions || []).filter(r => r && r.area < 500 && r.type === 'vegetation');
      const maxCrops = Math.min(5, smallRegions.length); // Reduced from 8 to 5
      smallRegions.slice(0, maxCrops).forEach((region, index) => {
        try {
          if (!region || !region.bbox) return;
          
          const cropTypes = [
            { name: 'Tomatoes', type: ITEM_TYPES.FRUIT },
            { name: 'Lettuce', type: ITEM_TYPES.VEGETABLE },
            { name: 'Carrots', type: ITEM_TYPES.VEGETABLE },
            { name: 'Herbs', type: ITEM_TYPES.VEGETABLE },
            { name: 'Peppers', type: ITEM_TYPES.VEGETABLE }
          ];
          
          const crop = cropTypes[index % cropTypes.length];
          const color = crop.type === ITEM_TYPES.FRUIT ? COLORS.FRUIT : COLORS.VEGETABLE;
          
          detectedItems.push({
            id: (itemId++).toString(),
            type: crop.type,
            name: crop.name,
            confidence: Math.max(0.5, Math.min(1, 0.75 + Math.random() * 0.2)),
            bbox: region.bbox,
            color
          });
        } catch (error) {
          console.warn('Failed to process small region:', error);
        }
      });
      
      // Enforce maximum limit
      const limitedItems = detectedItems.slice(0, this.MAX_DETECTED_ITEMS);
      
      if (detectedItems.length > this.MAX_DETECTED_ITEMS) {
        console.warn(`⚠️ Limited detected items from ${detectedItems.length} to ${this.MAX_DETECTED_ITEMS}`);
      }
      
      return limitedItems;
    } catch (error: any) {
      console.error('Realistic detection generation failed:', error);
      return [];
    }
  }

  private groupItemsIntoParcelsSafe(detectedItems: DetectedItem[]): DetectedParcel[] {
    try {
      if (!detectedItems || detectedItems.length === 0) {
        return [];
      }
      
      const parcels = detectedItems.filter(item => item && item.type === ITEM_TYPES.PARCEL);
      const zones = detectedItems.filter(item => item && item.type === ITEM_TYPES.ZONE);
      const crops = detectedItems.filter(item => 
        item && (
          item.type === ITEM_TYPES.FRUIT || 
          item.type === ITEM_TYPES.VEGETABLE || 
          item.type === ITEM_TYPES.TREE
        )
      );
      
      return parcels.map(parcel => {
        try {
          if (!parcel || !parcel.bbox) {
            return { ...parcel, zones: [] };
          }
          
          // Find zones that are within this parcel
          const parcelZones = zones.filter(zone => {
            try {
              return zone && zone.bbox && this.isItemWithinBoundsSafe(zone.bbox, parcel.bbox);
            } catch (error) {
              return false;
            }
          }).map(zone => {
            try {
              // Find crops within this zone
              const zoneCrops = crops.filter(crop => {
                try {
                  return crop && crop.bbox && this.isItemWithinBoundsSafe(crop.bbox, zone.bbox);
                } catch (error) {
                  return false;
                }
              }).map(crop => {
                try {
                  return {
                    ...crop,
                    count: Math.floor(Math.random() * 3) + 1 // Random count 1-3 (reduced)
                  };
                } catch (error) {
                  return crop;
                }
              });
              
              return {
                ...zone,
                items: zoneCrops
              };
            } catch (error) {
              console.warn('Failed to process zone:', error);
              return { ...zone, items: [] };
            }
          });
          
          return {
            ...parcel,
            zones: parcelZones
          };
        } catch (error) {
          console.warn('Failed to process parcel:', error);
          return { ...parcel, zones: [] };
        }
      });
    } catch (error: any) {
      console.error('Grouping items into parcels failed:', error);
      return [];
    }
  }

  private isItemWithinBoundsSafe(itemBbox: any, parentBbox: any): boolean {
    try {
      if (!itemBbox || !parentBbox) return false;
      if (typeof itemBbox.x !== 'number' || typeof itemBbox.y !== 'number' ||
          typeof itemBbox.width !== 'number' || typeof itemBbox.height !== 'number') return false;
      if (typeof parentBbox.x !== 'number' || typeof parentBbox.y !== 'number' ||
          typeof parentBbox.width !== 'number' || typeof parentBbox.height !== 'number') return false;
      
      return itemBbox.x >= parentBbox.x &&
             itemBbox.y >= parentBbox.y &&
             itemBbox.x + itemBbox.width <= parentBbox.x + parentBbox.width &&
             itemBbox.y + itemBbox.height <= parentBbox.y + parentBbox.height;
    } catch (error) {
      return false;
    }
  }

  // Utility method to retrieve saved test images
  public getTestImages(): Array<{timestamp: string, filename: string, dataUrl: string}> {
    try {
      const savedImages = localStorage.getItem('garden-vision-test-images');
      return savedImages ? JSON.parse(savedImages) : [];
    } catch (error) {
      console.error('Failed to retrieve test images:', error);
      return [];
    }
  }

  // Utility to clear test images
  public clearTestImages(): void {
    try {
      localStorage.removeItem('garden-vision-test-images');
      console.log('🧹 Test images cleared');
    } catch (error) {
      console.error('Failed to clear test images:', error);
    }
  }
  
  /**
   * Get service status and memory information
   */
  public getServiceStatus(): {
    isProcessing: boolean;
    memoryStatus: 'safe' | 'warning' | 'critical';
    processingTime: number | null;
    limits: {
      maxImageSize: number;
      maxProcessingTime: number;
      maxDimension: number;
      maxDetectedItems: number;
    };
  } {
    const memoryStatus = memoryMonitor.isMemoryUsageCritical() ? 'critical' :
                        memoryMonitor.isMemoryUsageWarning() ? 'warning' : 'safe';
    
    return {
      isProcessing: this.isProcessing,
      memoryStatus,
      processingTime: this.processingStartTime ? Date.now() - this.processingStartTime : null,
      limits: {
        maxImageSize: this.MAX_IMAGE_SIZE,
        maxProcessingTime: this.MAX_PROCESSING_TIME,
        maxDimension: this.MAX_DIMENSION,
        maxDetectedItems: this.MAX_DETECTED_ITEMS
      }
    };
  }
  
  /**
   * Force cleanup and reset service state
   */
  public forceReset(): void {
    try {
      this.emergencyCleanup();
      this.clearTestImages();
      console.log('🔄 Service reset completed');
    } catch (error) {
      console.error('Service reset failed:', error);
    }
  }
}

// Type definitions for image analysis
interface ImageAnalysis {
  colorRegions: ColorRegion[];
  shapes: Shape[];
  patterns: Pattern[];
  dimensions: { width: number; height: number };
}

interface ColorRegion {
  bbox: { x: number; y: number; width: number; height: number };
  area: number;
  type: 'vegetation' | 'soil' | 'structure';
  dominantColor: { r: number; g: number; b: number };
}

interface Shape {
  type: 'rectangle' | 'circle' | 'polygon';
  bbox: { x: number; y: number; width: number; height: number };
  confidence: number;
}

interface Pattern {
  type: 'rows' | 'grid' | 'scattered';
  confidence: number;
  orientation?: string;
  spacing?: number;
}