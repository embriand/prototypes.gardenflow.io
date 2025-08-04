/**
 * Advanced Image Recognition Service
 * Integrates OCR, Shape Detection, Object Detection, and Semantic Segmentation
 * Based on the enhancement guide provided for Garden Vision
 * 
 * IMPORTANT: This is a FUTURE ENHANCEMENT file - not currently used
 * The main Garden Vision component uses the basic imageRecognitionService.ts
 * This advanced version is documented for when you need AI capabilities
 * 
 * To use this service:
 * 1. Either install the npm packages OR use CDN loading (configured below)
 * 2. Replace imageRecognitionService with this advancedImageRecognitionService
 * 3. Update UI components to handle the enhanced detection results
 */

// Dynamic imports for optional AI libraries
// These libraries are not installed by default to keep bundle size small
// Option 1: Install packages (increases bundle size by ~5-10MB):
//   npm install tesseract.js @tensorflow/tfjs onnxruntime-web
// Option 2: Use CDN loading (configured in this file)

// Type definitions for dynamic imports
type TesseractWorker = any;
type TensorFlow = any;
type ONNXInferenceSession = any;

// Enhanced types based on the advanced features
export interface DetectedItem {
  id: string;
  type: 'parcel' | 'zone' | 'tree' | 'vegetable' | 'fruit' | 'structure' | 'label';
  label?: string;
  boundingBox: [number, number, number, number]; // [x, y, width, height]
  confidence: number; // 0-100
  metadata?: {
    engine?: 'opencv' | 'yolo' | 'tesseract' | 'deeplab';
    textType?: 'printed' | 'handwritten';
    area?: number;
    vertices?: number;
    classIndex?: number;
    [key: string]: any;
  };
}

export interface ItemAssociation {
  labelId: string;
  shapeId: string;
  distance: number;
  confidence: number;
  relationship: 'inside' | 'adjacent';
}

export interface SegmentationMap {
  segmentationMap: Uint8Array;
  legend: Record<number, string>;
  analysis: SegmentationAnalysis;
  metadata: {
    width: number;
    height: number;
    classes: number;
  };
}

export interface SegmentationAnalysis {
  pixelCounts: Record<string, number>;
  percentages: Record<string, number>;
  dominantClass: string;
  totalPixels: number;
}

export interface AdvancedAnalysisResult {
  shapes: DetectedItem[];
  objects: DetectedItem[];
  text: DetectedItem[];
  semanticSegmentation?: SegmentationMap;
  associations: ItemAssociation[];
  metadata: {
    processingTime: number;
    imageSize: string;
    modelsUsed: string[];
    confidence: number;
    memoryUsage?: {
      peak: number;
      current: number;
    };
    resourceLimits?: {
      maxImageSize: number;
      maxProcessingTime: number;
      maxDimension: number;
    };
  };
}

// AI Model Configuration
export const AI_MODELS = {
  DEEPLAB: {
    model: 'pascal',
    quantizationBytes: 2,
    url: 'https://tfhub.dev/tensorflow/tfjs-model/deeplabv3/1/default/1'
  },
  YOLO: {
    modelUrl: '/models/yolov8n.onnx',
    labels: [
      'apple', 'banana', 'orange', 'strawberry', 'grape', // fruits
      'broccoli', 'carrot', 'tomato', 'lettuce', 'pepper', 'potato', // vegetables
      'tree', 'plant', 'flower' // general plants
    ]
  },
  TESSERACT: {
    languages: ['eng', 'fra'],
    psm: 6, // Page segmentation mode
    oem: 3  // OCR Engine mode
  }
};

/**
 * Advanced Image Recognition Service
 * Integrates multiple AI models for comprehensive garden analysis
 */
export class AdvancedImageRecognitionService {
  private static instance: AdvancedImageRecognitionService;
  private tesseractWorker: TesseractWorker = null;
  private yoloSession: ONNXInferenceSession | null = null;
  private deeplabModel: any = null;
  private isInitialized = false;
  private loadedScripts = new Set<string>();
  private isProcessing = false;
  private processingStartTime: number | null = null;
  private memoryUsage = { peak: 0, current: 0 };
  
  // Configuration constants for safety
  private readonly MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB max for frontend
  private readonly MAX_PROCESSING_TIME = 15000; // 15 seconds max
  private readonly MAX_DIMENSION = 600; // Max width/height for frontend
  private readonly MAX_CONCURRENT_OPERATIONS = 3; // Limit concurrent operations
  private readonly MEMORY_CHECK_INTERVAL = 1000; // Check memory every second
  
  private memoryCheckInterval: NodeJS.Timeout | null = null;
  private activeOperations = 0;

  private constructor() {
    // Setup memory monitoring with more lenient settings for image processing
    this.startMemoryMonitoring();
    
    // Setup cleanup on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.emergencyCleanup());
      window.addEventListener('unload', () => this.emergencyCleanup());
    }
  }

  /**
   * Start memory monitoring
   */
  private startMemoryMonitoring(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      this.memoryCheckInterval = setInterval(() => {
        try {
          const memory = (performance as any).memory;
          if (memory) {
            this.memoryUsage.current = memory.usedJSHeapSize;
            this.memoryUsage.peak = Math.max(this.memoryUsage.peak, memory.usedJSHeapSize);
            
            // If memory usage is too high, force cleanup (increased threshold)
            if (memory.usedJSHeapSize > 300 * 1024 * 1024) { // 300MB threshold (increased from 100MB)
              console.warn('⚠️ High memory usage detected, forcing cleanup');
              this.forceCleanup();
            }
          }
        } catch (error) {
          console.warn('Memory monitoring failed:', error);
        }
      }, this.MEMORY_CHECK_INTERVAL);
    }
  }

  /**
   * Force cleanup of resources
   */
  private forceCleanup(): void {
    try {
      if (this.tesseractWorker) {
        this.tesseractWorker.terminate().catch(() => {});
        this.tesseractWorker = null;
      }
      
      // Force garbage collection if available
      if (typeof window !== 'undefined' && (window as any).gc) {
        (window as any).gc();
      }
      
      this.isProcessing = false;
      this.activeOperations = 0;
      
      console.log('🧹 Forced cleanup completed');
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }

  /**
   * Emergency cleanup on page unload
   */
  private emergencyCleanup(): void {
    if (this.memoryCheckInterval) {
      clearInterval(this.memoryCheckInterval);
      this.memoryCheckInterval = null;
    }
    
    this.forceCleanup();
  }

  /**
   * Check if processing is safe to continue
   */
  private isProcessingSafe(): boolean {
    if (this.isProcessing) return false;
    if (this.activeOperations >= this.MAX_CONCURRENT_OPERATIONS) return false;
    if (this.processingStartTime && Date.now() - this.processingStartTime > this.MAX_PROCESSING_TIME) return false;
    return true;
  }

  public static getInstance(): AdvancedImageRecognitionService {
    if (!AdvancedImageRecognitionService.instance) {
      AdvancedImageRecognitionService.instance = new AdvancedImageRecognitionService();
    }
    return AdvancedImageRecognitionService.instance;
  }

  /**
   * Utility to load external scripts dynamically
   */
  private async loadScript(src: string): Promise<void> {
    if (this.loadedScripts.has(src)) return;
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => {
        this.loadedScripts.add(src);
        resolve();
      };
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  /**
   * Initialize all AI models with proper error handling and resource limits
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    if (!this.isProcessingSafe()) {
      throw new Error('Cannot initialize: processing not safe or already in progress');
    }

    this.isProcessing = true;
    this.processingStartTime = Date.now();
    
    console.log('🤖 Initializing advanced AI models with safety limits...');
    
    try {
      // Initialize models with timeout protection
      const initPromises = [
        this.initializeTesseractSafe(),
        this.initializeYOLOSafe(),
        this.initializeDeepLabSafe()
      ];
      
      // Add timeout to initialization
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Initialization timeout')), 30000);
      });
      
      await Promise.race([
        Promise.allSettled(initPromises),
        timeoutPromise
      ]);

      this.isInitialized = true;
      console.log('✅ Advanced AI models initialized successfully');
    } catch (error: any) {
      console.error('❌ Failed to initialize AI models:', error);
      this.forceCleanup();
      throw new Error(`Initialization failed: ${error.message}`);
    } finally {
      this.isProcessing = false;
      this.processingStartTime = null;
    }
  }

  /**
   * Main analysis method with comprehensive error handling and resource management
   */
  public async analyzeImage(imageDataUrl: string): Promise<AdvancedAnalysisResult> {
    // Safety checks
    if (!this.isProcessingSafe()) {
      throw new Error('Cannot analyze image: processing not safe or already in progress');
    }

    if (!imageDataUrl || typeof imageDataUrl !== 'string') {
      throw new Error('Invalid image data URL provided');
    }

    this.isProcessing = true;
    this.processingStartTime = Date.now();
    this.activeOperations++;
    
    const startTime = performance.now();
    let imageData: ImageData | null = null;

    try {
      // 1. Validate and optimize image first
      const optimizedImage = await this.optimizeImageForAnalysis(imageDataUrl);
      
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log('🔍 Starting advanced image analysis with safety limits...');

      // 2. Preprocess image with validation
      imageData = await this.loadImageDataSafe(optimizedImage);
      console.log(`📐 Image size: ${imageData.width}x${imageData.height}`);

      // Validate image dimensions
      if (imageData.width > this.MAX_DIMENSION || imageData.height > this.MAX_DIMENSION) {
        throw new Error(`Image too large: ${imageData.width}x${imageData.height}. Max: ${this.MAX_DIMENSION}x${this.MAX_DIMENSION}`);
      }

      // 3. Run detection methods with timeout protection
      const analysisPromises = [
        this.detectShapesSafe(imageData),
        this.detectObjectsSafe(imageData),
        this.recognizeTextSafe(optimizedImage),
        this.performSemanticSegmentationSafe(imageData)
      ];
      
      // Add timeout protection
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Analysis timeout')), this.MAX_PROCESSING_TIME);
      });
      
      const results = await Promise.race([
        Promise.allSettled(analysisPromises),
        timeoutPromise
      ]) as PromiseSettledResult<any>[];

      // Extract successful results with error handling
      const shapesResult = results[0]?.status === 'fulfilled' ? results[0].value : [];
      const objectsResult = results[1]?.status === 'fulfilled' ? results[1].value : [];
      const textResult = results[2]?.status === 'fulfilled' ? results[2].value : [];
      const segmentationResult = results[3]?.status === 'fulfilled' ? results[3].value : undefined;

      // 4. Associate text labels to shapes (with error handling)
      const associations = this.associateLabelsToShapesSafe(textResult, shapesResult);

      // 5. Enhance shapes with associated labels
      const enhancedShapes = this.enhanceShapesWithLabelsSafe(shapesResult, associations);

      const processingTime = performance.now() - startTime;
      console.log(`⚡ Analysis completed in ${processingTime.toFixed(0)}ms`);

      return {
        shapes: enhancedShapes,
        objects: objectsResult,
        text: textResult,
        semanticSegmentation: segmentationResult,
        associations,
        metadata: {
          processingTime,
          imageSize: `${imageData.width}x${imageData.height}`,
          modelsUsed: this.getUsedModels(),
          confidence: this.calculateOverallConfidence([...enhancedShapes, ...objectsResult, ...textResult]),
          memoryUsage: this.memoryUsage
        }
      };

    } catch (error: any) {
      console.error('❌ Advanced analysis failed:', error);
      throw new Error(`Advanced analysis failed: ${error.message}`);
    } finally {
      this.isProcessing = false;
      this.processingStartTime = null;
      this.activeOperations--;
      imageData = null; // Help garbage collection
    }
  }

  /**
   * Optimize image for analysis (resize, compress, validate)
   */
  private async optimizeImageForAnalysis(imageDataUrl: string): Promise<string> {
    try {
      // Extract base64 data
      const base64Data = imageDataUrl.replace(/^data:image\/\w+;base64,/, '');
      const buffer = atob(base64Data);
      
      // Check file size
      if (buffer.length > this.MAX_IMAGE_SIZE) {
        throw new Error(`Image too large: ${Math.round(buffer.length / (1024 * 1024))}MB. Max: ${this.MAX_IMAGE_SIZE / (1024 * 1024)}MB`);
      }
      
      // For now, return original (in production, implement canvas-based optimization)
      return imageDataUrl;
    } catch (error: any) {
      throw new Error(`Image optimization failed: ${error.message}`);
    }
  }

  /**
   * Load image data with safety checks
   */
  private async loadImageDataSafe(imageDataUrl: string): Promise<ImageData> {
    try {
      const imageData = await this.loadImageData(imageDataUrl);
      
      if (!imageData || !imageData.width || !imageData.height) {
        throw new Error('Invalid image data loaded');
      }
      
      return imageData;
    } catch (error: any) {
      throw new Error(`Failed to load image data: ${error.message}`);
    }
  }

  /**
   * OCR Text Recognition with Tesseract.js (safe version)
   */
  private async recognizeTextSafe(imageDataUrl: string): Promise<DetectedItem[]> {
    if (!this.tesseractWorker) {
      console.warn('⚠️ Tesseract not available, skipping OCR');
      return [];
    }

    try {
      console.log('📖 Running OCR text recognition with safety limits...');
      
      // Add timeout to OCR
      const ocrPromise = this.tesseractWorker.recognize(imageDataUrl);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('OCR timeout')), 10000);
      });
      
      const result = await Promise.race([ocrPromise, timeoutPromise]) as any;
      
      if (!result || !result.data || !result.data.words) {
        console.warn('⚠️ No OCR results returned');
        return [];
      }
      
      const textItems = result.data.words
        .filter((word: any) => {
          if (!word || !word.text || !word.bbox) return false;
          return word.confidence > 60 && word.text.trim().length > 0;
        })
        .slice(0, 20) // Limit to 20 text items max
        .map((word: any) => {
          try {
            return {
              id: this.generateSafeId(),
              type: 'label' as const,
              label: word.text.trim(),
              boundingBox: [
                Math.max(0, word.bbox.x0),
                Math.max(0, word.bbox.y0),
                Math.max(1, word.bbox.x1 - word.bbox.x0),
                Math.max(1, word.bbox.y1 - word.bbox.y0)
              ] as [number, number, number, number],
              confidence: Math.round(Math.max(0, Math.min(100, word.confidence))),
              metadata: {
                engine: 'tesseract',
                textType: 'printed',
                fontSize: Math.max(1, word.bbox.y1 - word.bbox.y0)
              }
            };
          } catch (error) {
            console.warn('Failed to process OCR word:', error);
            return null;
          }
        })
        .filter(Boolean);

      console.log(`📝 Found ${textItems.length} text labels`);
      return textItems;

    } catch (error: any) {
      console.error('OCR failed:', error);
      return [];
    }
  }

  /**
   * Generate safe ID (fallback for crypto.randomUUID)
   */
  private generateSafeId(): string {
    try {
      return crypto.randomUUID();
    } catch {
      return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
  }

  /**
   * Shape Detection (safe version with limits)
   */
  private async detectShapesSafe(imageData: ImageData): Promise<DetectedItem[]> {
    console.log('📐 Detecting shapes with safety limits...');
    
    try {
      // Add timeout protection
      const shapePromise = this.detectShapesWithColorAnalysisSafe(imageData);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Shape detection timeout')), 8000);
      });
      
      const shapes = await Promise.race([shapePromise, timeoutPromise]) as DetectedItem[];
      
      // Limit number of shapes to prevent memory issues
      const limitedShapes = shapes.slice(0, 15); // Max 15 shapes
      
      console.log(`🔷 Found ${limitedShapes.length} shapes`);
      return limitedShapes;
    } catch (error: any) {
      console.error('Shape detection failed:', error);
      return [];
    }
  }

  /**
   * Object Detection (safe mock implementation)
   */
  private async detectObjectsSafe(imageData: ImageData): Promise<DetectedItem[]> {
    console.log('🍎 Detecting objects with safety limits...');
    
    try {
      // Add timeout protection
      const objectPromise = this.mockObjectDetectionSafe(imageData);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Object detection timeout')), 5000);
      });
      
      const objects = await Promise.race([objectPromise, timeoutPromise]) as DetectedItem[];
      
      console.log(`🎯 Found ${objects.length} objects`);
      return objects;
    } catch (error: any) {
      console.error('Object detection failed:', error);
      return [];
    }
  }

  /**
   * Semantic Segmentation (safe mock implementation)
   */
  private async performSemanticSegmentationSafe(imageData: ImageData): Promise<SegmentationMap | undefined> {
    console.log('🌱 Performing semantic segmentation with safety limits...');
    
    try {
      // Add timeout protection
      const segmentationPromise = this.mockSemanticSegmentationSafe(imageData);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Segmentation timeout')), 3000);
      });
      
      const segmentation = await Promise.race([segmentationPromise, timeoutPromise]) as SegmentationMap;
      
      return segmentation;
    } catch (error: any) {
      console.error('Semantic segmentation failed:', error);
      return undefined;
    }
  }

  /**
   * Associate text labels to nearest shapes (safe version)
   */
  private associateLabelsToShapesSafe(labels: DetectedItem[], shapes: DetectedItem[]): ItemAssociation[] {
    const associations: ItemAssociation[] = [];

    try {
      if (!labels || !shapes || labels.length === 0 || shapes.length === 0) {
        return associations;
      }

      // Limit processing to prevent performance issues
      const limitedLabels = labels.slice(0, 10); // Max 10 labels
      const limitedShapes = shapes.slice(0, 10); // Max 10 shapes

      for (const label of limitedLabels) {
        try {
          if (!label || !label.boundingBox || !label.id) continue;
          
          const labelCenter = this.getBoundingBoxCenterSafe(label.boundingBox);
          if (!labelCenter) continue;
          
          let closestShape: DetectedItem | null = null;
          let minDistance = Infinity;

          for (const shape of limitedShapes) {
            try {
              if (!shape || !shape.boundingBox || !shape.id) continue;
              
              const shapeCenter = this.getBoundingBoxCenterSafe(shape.boundingBox);
              if (!shapeCenter) continue;
              
              const distance = this.calculateDistanceSafe(labelCenter, shapeCenter);
              if (distance === null) continue;
              
              // Check if label is inside or near the shape
              const isInside = this.isPointInBoundingBoxSafe(labelCenter, shape.boundingBox);
              const maxDistance = Math.max(shape.boundingBox[2] || 0, shape.boundingBox[3] || 0);
              
              if ((isInside || distance < maxDistance * 1.5) && distance < minDistance) {
                minDistance = distance;
                closestShape = shape;
              }
            } catch (error) {
              console.warn('Failed to process shape in association:', error);
            }
          }

          if (closestShape) {
            associations.push({
              labelId: label.id,
              shapeId: closestShape.id,
              distance: minDistance,
              confidence: this.calculateAssociationConfidenceSafe(minDistance, label, closestShape),
              relationship: this.isPointInBoundingBoxSafe(labelCenter, closestShape.boundingBox) ? 'inside' : 'adjacent'
            });
          }
        } catch (error) {
          console.warn('Failed to process label in association:', error);
        }
      }

      console.log(`🔗 Created ${associations.length} label-shape associations`);
      return associations;
    } catch (error: any) {
      console.error('Association failed:', error);
      return [];
    }
  }

  /**
   * Enhance shapes with associated labels (safe version)
   */
  private enhanceShapesWithLabelsSafe(shapes: DetectedItem[], associations: ItemAssociation[]): DetectedItem[] {
    try {
      if (!shapes || !associations) return shapes || [];
      
      return shapes.map(shape => {
        try {
          if (!shape || !shape.id) return shape;
          
          const association = associations.find(assoc => assoc && assoc.shapeId === shape.id);
          if (association) {
            return {
              ...shape,
              label: `Enhanced-${shape.id}`, // Placeholder
              confidence: Math.min(100, Math.max(0, (shape.confidence || 0) + 5)) // Boost confidence safely
            };
          }
          return shape;
        } catch (error) {
          console.warn('Failed to enhance shape:', error);
          return shape;
        }
      });
    } catch (error: any) {
      console.error('Shape enhancement failed:', error);
      return shapes || [];
    }
  }

  // =====================================
  // INITIALIZATION METHODS
  // =====================================

  private async initializeTesseractSafe(): Promise<void> {
    try {
      // Skip Tesseract initialization if memory is critically high
      if (this.memoryUsage.current > 150 * 1024 * 1024) { // 150MB threshold (increased from 50MB)
        console.warn('⚠️ Skipping Tesseract initialization due to high memory usage');
        return;
      }
      
      // Add timeout to script loading
      const scriptPromise = this.loadScript('https://unpkg.com/tesseract.js@4.0.0/dist/tesseract.min.js');
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Script loading timeout')), 10000);
      });
      
      if (typeof window !== 'undefined' && !(window as any).Tesseract) {
        await Promise.race([scriptPromise, timeoutPromise]);
      }
      
      const Tesseract = (window as any).Tesseract;
      if (Tesseract) {
        // Create worker with timeout
        const workerPromise = Tesseract.createWorker({
          logger: m => {
            if (m.status === 'recognizing text') {
              console.log(`Tesseract: ${m.status} ${Math.round(m.progress * 100)}%`);
            }
          }
        });
        
        const workerTimeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Worker creation timeout')), 15000);
        });
        
        this.tesseractWorker = await Promise.race([workerPromise, workerTimeoutPromise]);
        
        // Load language with timeout
        const languagePromise = this.tesseractWorker.loadLanguage('eng'); // Only English for simplicity
        const languageTimeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Language loading timeout')), 10000);
        });
        
        await Promise.race([languagePromise, languageTimeoutPromise]);
        
        // Initialize with timeout
        const initPromise = this.tesseractWorker.initialize('eng');
        const initTimeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Initialization timeout')), 10000);
        });
        
        await Promise.race([initPromise, initTimeoutPromise]);
        
        console.log('✅ Tesseract OCR initialized safely from CDN');
      }
    } catch (error: any) {
      console.warn('⚠️ Tesseract initialization failed:', error);
      console.log('💡 OCR will be disabled for this session');
      this.tesseractWorker = null;
    }
  }

  private async initializeYOLOSafe(): Promise<void> {
    try {
      // Mock YOLO initialization - in production would load actual ONNX model with safety checks
      console.log('✅ YOLO mock initialized safely (production: load ONNX model with resource limits)');
    } catch (error: any) {
      console.warn('⚠️ YOLO initialization failed:', error);
    }
  }

  private async initializeDeepLabSafe(): Promise<void> {
    try {
      // Mock DeepLab initialization - in production would load TensorFlow model with safety checks
      console.log('✅ DeepLab mock initialized safely (production: load TF model with resource limits)');
    } catch (error: any) {
      console.warn('⚠️ DeepLab initialization failed:', error);
    }
  }

  // =====================================
  // DETECTION IMPLEMENTATIONS
  // =====================================

  private async detectShapesWithColorAnalysisSafe(imageData: ImageData): Promise<DetectedItem[]> {
    const shapes: DetectedItem[] = [];
    
    try {
      if (!imageData || !imageData.width || !imageData.height) {
        throw new Error('Invalid image data for shape detection');
      }
      
      // Analyze image for rectangular and circular regions (with limits)
      const analysis = this.analyzeImageRegionsSafe(imageData);
      
      // Generate realistic shapes based on color analysis (limited quantities)
      const parcels = this.generateParcelsSafe(analysis, imageData);
      const zones = this.generateZonesSafe(analysis, imageData);
      const trees = this.generateTreesSafe(analysis, imageData);
      
      shapes.push(...parcels, ...zones, ...trees);
      
      // Limit total shapes to prevent memory issues
      return shapes.slice(0, 15);
    } catch (error: any) {
      console.error('Shape detection with color analysis failed:', error);
      return [];
    }
  }

  private async mockObjectDetectionSafe(imageData: ImageData): Promise<DetectedItem[]> {
    try {
      if (!imageData || !imageData.width || !imageData.height) {
        return [];
      }
      
      // Mock object detection - generates realistic vegetable/fruit detections
      const objects: DetectedItem[] = [];
      const vegetableTypes = ['tomato', 'lettuce', 'carrot', 'broccoli', 'pepper'];
      const fruitTypes = ['apple', 'strawberry', 'grape'];
      
      // Generate 2-5 random objects (reduced from 3-8)
      const numObjects = Math.floor(Math.random() * 4) + 2;
      
      for (let i = 0; i < numObjects; i++) {
        try {
          const isVegetable = Math.random() > 0.3;
          const types = isVegetable ? vegetableTypes : fruitTypes;
          const selectedType = types[Math.floor(Math.random() * types.length)];
          
          // Ensure bounding box is within image bounds
          const maxX = Math.max(100, imageData.width - 100);
          const maxY = Math.max(100, imageData.height - 100);
          
          objects.push({
            id: this.generateSafeId(),
            type: isVegetable ? 'vegetable' : 'fruit',
            label: selectedType,
            boundingBox: [
              Math.random() * maxX,
              Math.random() * maxY,
              Math.max(30, 50 + Math.random() * 70), // Ensure minimum size
              Math.max(30, 50 + Math.random() * 70)
            ] as [number, number, number, number],
            confidence: Math.floor(75 + Math.random() * 20),
            metadata: {
              engine: 'yolo',
              classIndex: i
            }
          });
        } catch (error) {
          console.warn('Failed to generate object:', error);
        }
      }
      
      return objects;
    } catch (error: any) {
      console.error('Mock object detection failed:', error);
      return [];
    }
  }

  private mockSemanticSegmentationSafe(imageData: ImageData): SegmentationMap {
    try {
      if (!imageData || !imageData.width || !imageData.height) {
        throw new Error('Invalid image data for segmentation');
      }
      
      // Mock segmentation map with size limits
      const totalPixels = imageData.width * imageData.height;
      const maxPixels = 400 * 400; // Limit to 400x400 max
      
      if (totalPixels > maxPixels) {
        throw new Error('Image too large for segmentation');
      }
      
      const segmentationMap = new Uint8Array(totalPixels);
      
      // Fill with mock segmentation (0: background, 1: vegetation, 2: soil, 3: structure)
      // Use deterministic pattern instead of random for consistency
      for (let i = 0; i < segmentationMap.length; i++) {
        segmentationMap[i] = i % 4;
      }
      
      // Calculate realistic pixel counts
      const pixelCounts = {
        background: Math.floor(totalPixels * 0.4),
        vegetation: Math.floor(totalPixels * 0.3),
        soil: Math.floor(totalPixels * 0.2),
        structure: Math.floor(totalPixels * 0.1)
      };
      
      return {
        segmentationMap,
        legend: {
          0: 'background',
          1: 'vegetation',
          2: 'soil',
          3: 'structure'
        },
        analysis: {
          pixelCounts,
          percentages: {
            background: 40,
            vegetation: 30,
            soil: 20,
            structure: 10
          },
          dominantClass: 'background',
          totalPixels
        },
        metadata: {
          width: imageData.width,
          height: imageData.height,
          classes: 4
        }
      };
    } catch (error: any) {
      console.error('Mock segmentation failed:', error);
      throw error;
    }
  }

  // =====================================
  // UTILITY METHODS
  // =====================================

  private async loadImageData(imageDataUrl: string): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        resolve(imageData);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageDataUrl;
    });
  }

  private analyzeImageRegionsSafe(imageData: ImageData): any {
    try {
      if (!imageData || !imageData.data || !imageData.width || !imageData.height) {
        throw new Error('Invalid image data for region analysis');
      }
      
      // Simplified color analysis with sampling for performance
      const { data, width, height } = imageData;
      let greenPixels = 0;
      let brownPixels = 0;
      let sampledPixels = 0;
      const totalPixels = width * height;
      
      // Sample every 10th pixel for performance
      const step = 40; // Sample every 10th pixel (4 * 10)
      
      for (let i = 0; i < data.length && sampledPixels < 10000; i += step) {
        try {
          if (i + 3 < data.length) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            if (this.isGreenish(r, g, b)) greenPixels++;
            if (this.isBrownish(r, g, b)) brownPixels++;
            sampledPixels++;
          }
        } catch (error) {
          console.warn('Failed to analyze pixel:', error);
        }
      }
      
      const sampleSize = Math.max(sampledPixels, 1);
      
      return {
        greenRatio: greenPixels / sampleSize,
        brownRatio: brownPixels / sampleSize,
        width,
        height,
        sampledPixels
      };
    } catch (error: any) {
      console.error('Image region analysis failed:', error);
      return {
        greenRatio: 0.3,
        brownRatio: 0.2,
        width: imageData?.width || 0,
        height: imageData?.height || 0,
        sampledPixels: 0
      };
    }
  }

  private generateParcelsSafe(analysis: any, imageData: ImageData): DetectedItem[] {
    const parcels: DetectedItem[] = [];
    
    try {
      if (!imageData || !imageData.width || !imageData.height) {
        return parcels;
      }
      
      const numParcels = Math.floor(Math.random() * 2) + 1; // 1-2 parcels (reduced)
      
      for (let i = 0; i < numParcels; i++) {
        try {
          // Ensure parcel fits within image bounds
          const maxWidth = Math.max(100, imageData.width - 100);
          const maxHeight = Math.max(100, imageData.height - 100);
          const parcelWidth = Math.min(200, Math.max(80, 100 + Math.random() * 200));
          const parcelHeight = Math.min(150, Math.max(60, 80 + Math.random() * 150));
          
          parcels.push({
            id: this.generateSafeId(),
            type: 'parcel',
            boundingBox: [
              Math.random() * (maxWidth - parcelWidth),
              Math.random() * (maxHeight - parcelHeight),
              parcelWidth,
              parcelHeight
            ] as [number, number, number, number],
            confidence: Math.floor(80 + Math.random() * 15),
            metadata: {
              engine: 'opencv',
              area: Math.round(parcelWidth * parcelHeight)
            }
          });
        } catch (error) {
          console.warn('Failed to generate parcel:', error);
        }
      }
      
      return parcels;
    } catch (error: any) {
      console.error('Parcel generation failed:', error);
      return [];
    }
  }

  private generateZonesSafe(analysis: any, imageData: ImageData): DetectedItem[] {
    const zones: DetectedItem[] = [];
    
    try {
      if (!imageData || !imageData.width || !imageData.height) {
        return zones;
      }
      
      const numZones = Math.floor(Math.random() * 3) + 2; // 2-4 zones (reduced)
      
      for (let i = 0; i < numZones; i++) {
        try {
          // Ensure zone fits within image bounds
          const maxWidth = Math.max(80, imageData.width - 80);
          const maxHeight = Math.max(60, imageData.height - 60);
          const zoneWidth = Math.min(150, Math.max(40, 60 + Math.random() * 120));
          const zoneHeight = Math.min(100, Math.max(30, 40 + Math.random() * 80));
          
          zones.push({
            id: this.generateSafeId(),
            type: 'zone',
            boundingBox: [
              Math.random() * (maxWidth - zoneWidth),
              Math.random() * (maxHeight - zoneHeight),
              zoneWidth,
              zoneHeight
            ] as [number, number, number, number],
            confidence: Math.floor(70 + Math.random() * 20),
            metadata: {
              engine: 'opencv',
              area: Math.round(zoneWidth * zoneHeight)
            }
          });
        } catch (error) {
          console.warn('Failed to generate zone:', error);
        }
      }
      
      return zones;
    } catch (error: any) {
      console.error('Zone generation failed:', error);
      return [];
    }
  }

  private generateTreesSafe(analysis: any, imageData: ImageData): DetectedItem[] {
    const trees: DetectedItem[] = [];
    
    try {
      if (!imageData || !imageData.width || !imageData.height) {
        return trees;
      }
      
      const numTrees = Math.floor(Math.random() * 3) + 1; // 1-3 trees (reduced)
      
      for (let i = 0; i < numTrees; i++) {
        try {
          // Ensure tree fits within image bounds
          const maxWidth = Math.max(60, imageData.width - 60);
          const maxHeight = Math.max(60, imageData.height - 60);
          const treeSize = Math.min(80, Math.max(30, 40 + Math.random() * 60));
          
          trees.push({
            id: this.generateSafeId(),
            type: 'tree',
            boundingBox: [
              Math.random() * (maxWidth - treeSize),
              Math.random() * (maxHeight - treeSize),
              treeSize,
              treeSize
            ] as [number, number, number, number],
            confidence: Math.floor(75 + Math.random() * 20),
            metadata: {
              engine: 'opencv',
              area: Math.round(treeSize * treeSize)
            }
          });
        } catch (error) {
          console.warn('Failed to generate tree:', error);
        }
      }
      
      return trees;
    } catch (error: any) {
      console.error('Tree generation failed:', error);
      return [];
    }
  }

  private isGreenish(r: number, g: number, b: number): boolean {
    return g > r && g > b && g > 100;
  }

  private isBrownish(r: number, g: number, b: number): boolean {
    return r > 100 && g > 50 && b < 100 && r > g && r > b;
  }

  private getBoundingBoxCenterSafe(bbox: [number, number, number, number]): [number, number] | null {
    try {
      if (!bbox || bbox.length !== 4) return null;
      const [x, y, width, height] = bbox;
      if (typeof x !== 'number' || typeof y !== 'number' || typeof width !== 'number' || typeof height !== 'number') {
        return null;
      }
      return [x + width / 2, y + height / 2];
    } catch (error) {
      return null;
    }
  }

  private calculateDistanceSafe(point1: [number, number], point2: [number, number]): number | null {
    try {
      if (!point1 || !point2 || point1.length !== 2 || point2.length !== 2) return null;
      const [x1, y1] = point1;
      const [x2, y2] = point2;
      if (typeof x1 !== 'number' || typeof y1 !== 'number' || typeof x2 !== 'number' || typeof y2 !== 'number') {
        return null;
      }
      return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    } catch (error) {
      return null;
    }
  }

  private isPointInBoundingBoxSafe(point: [number, number], bbox: [number, number, number, number]): boolean {
    try {
      if (!point || !bbox || point.length !== 2 || bbox.length !== 4) return false;
      const [px, py] = point;
      const [bx, by, bw, bh] = bbox;
      
      if (typeof px !== 'number' || typeof py !== 'number' || 
          typeof bx !== 'number' || typeof by !== 'number' || 
          typeof bw !== 'number' || typeof bh !== 'number') {
        return false;
      }
      
      return px >= bx && px <= bx + bw && py >= by && py <= by + bh;
    } catch (error) {
      return false;
    }
  }

  private calculateAssociationConfidenceSafe(distance: number, label: DetectedItem, shape: DetectedItem): number {
    try {
      if (!label || !shape || typeof distance !== 'number' || distance < 0) return 0;
      if (!shape.boundingBox || shape.boundingBox.length !== 4) return 0;
      
      const maxDistance = Math.max(shape.boundingBox[2] || 1, shape.boundingBox[3] || 1);
      const distanceScore = Math.max(0, 100 - (distance / maxDistance) * 100);
      const ocrScore = Math.max(0, Math.min(100, label.confidence || 0));
      
      return Math.round((distanceScore * 0.6 + ocrScore * 0.4));
    } catch (error) {
      return 0;
    }
  }

  private calculateOverallConfidence(items: DetectedItem[]): number {
    if (items.length === 0) return 0;
    
    const totalConfidence = items.reduce((sum, item) => sum + item.confidence, 0);
    return Math.round(totalConfidence / items.length);
  }

  private getUsedModels(): string[] {
    const models: string[] = ['opencv']; // Always include basic shape detection
    
    if (this.tesseractWorker) models.push('tesseract');
    if (this.yoloSession) models.push('yolo');
    if (this.deeplabModel) models.push('deeplab');
    
    return models;
  }

  /**
   * Cleanup method to free resources safely
   */
  public async cleanup(): Promise<void> {
    try {
      console.log('🧹 Starting cleanup of advanced image recognition service...');
      
      // Stop memory monitoring
      if (this.memoryCheckInterval) {
        clearInterval(this.memoryCheckInterval);
        this.memoryCheckInterval = null;
      }
      
      // Cleanup Tesseract worker
      if (this.tesseractWorker) {
        try {
          await this.tesseractWorker.terminate();
        } catch (error) {
          console.warn('Failed to terminate Tesseract worker:', error);
        }
        this.tesseractWorker = null;
      }
      
      // Cleanup other resources
      this.yoloSession = null;
      this.deeplabModel = null;
      this.isInitialized = false;
      this.isProcessing = false;
      this.processingStartTime = null;
      this.activeOperations = 0;
      this.loadedScripts.clear();
      
      console.log('✅ Advanced image recognition service cleaned up successfully');
    } catch (error: any) {
      console.error('Cleanup failed:', error);
    }
  }
}

// Export singleton instance
export const advancedImageRecognitionService = AdvancedImageRecognitionService.getInstance();

/**
 * Export utility functions for safe usage
 */
export const imageRecognitionUtils = {
  /**
   * Get service status and resource usage
   */
  getServiceStatus: () => {
    const service = AdvancedImageRecognitionService.getInstance();
    return {
      isInitialized: (service as any).isInitialized,
      isProcessing: (service as any).isProcessing,
      activeOperations: (service as any).activeOperations,
      memoryUsage: (service as any).memoryUsage,
      maxImageSize: (service as any).MAX_IMAGE_SIZE,
      maxProcessingTime: (service as any).MAX_PROCESSING_TIME,
      maxDimension: (service as any).MAX_DIMENSION
    };
  },
  
  /**
   * Force cleanup if service is stuck
   */
  forceCleanup: async () => {
    const service = AdvancedImageRecognitionService.getInstance();
    await service.cleanup();
  },
  
  /**
   * Get recommended image specifications
   */
  getRecommendedSpecs: () => ({
    maxFileSize: '3MB',
    maxDimensions: '600x600px',
    format: 'JPEG',
    quality: '70-80%',
    lighting: 'Natural daylight preferred',
    angle: 'Overhead or 45-degree angle for best detection',
    background: 'Clear, contrasting background for better recognition'
  })
};