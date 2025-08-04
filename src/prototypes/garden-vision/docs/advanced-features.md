# Garden Vision - Advanced Features & AI Integration

## Overview
This document outlines the advanced features and AI integration capabilities for Garden Vision, including OCR (Optical Character Recognition), shape detection, semantic segmentation, and object detection using state-of-the-art client-side AI libraries.

---

## 🧩 Technology Stack

### Core AI Libraries
```typescript
// Visual Recognition
import cv from 'opencv.js';                    // Shape detection (rectangles, circles, lines)
import * as deeplab from '@tensorflow-models/deeplab';  // Semantic segmentation
import { InferenceSession } from 'onnxruntime-web';     // ONNX runtime for YOLOv8

// OCR & Text Recognition
import { createWorker } from 'tesseract.js';     // Printed text recognition
import * as tf from '@tensorflow/tfjs';          // TensorFlow.js runtime
```

### AI Model Integration
```typescript
// Model configuration
export const AI_MODELS = {
  DEEPLAB: {
    model: 'pascal',
    quantizationBytes: 2,
    url: 'https://tfhub.dev/tensorflow/tfjs-model/deeplabv3/1/default/1'
  },
  YOLO: {
    modelUrl: '/models/yolov8n.onnx',
    labels: ['apple', 'banana', 'orange', 'broccoli', 'carrot', 'tomato', /* ... */]
  },
  TROCR: {
    modelUrl: '/models/trocr-handwritten.onnx',
    languages: ['eng', 'fra']
  }
};
```

---

## 🔍 Enhanced Detection Pipeline

### Advanced Analysis Workflow
```typescript
interface AdvancedAnalysisResult {
  shapes: DetectedItem[];           // Geometric shapes (parcels, zones)
  objects: DetectedItem[];          // Fruits, vegetables, trees
  text: DetectedItem[];            // OCR results (printed & handwritten)
  semanticSegmentation: SegmentationMap;  // Soil, vegetation, paths
  associations: ItemAssociation[];  // Text-to-shape relationships
  metadata: AnalysisMetadata;
}

// Enhanced detection pipeline
export class AdvancedImageRecognitionService {
  private deepLabModel: tf.GraphModel | null = null;
  private yoloSession: InferenceSession | null = null;
  private ocrWorker: Tesseract.Worker | null = null;

  async analyzeImage(imageDataUrl: string): Promise<AdvancedAnalysisResult> {
    const startTime = performance.now();
    
    try {
      // 1. Preprocess image
      const preprocessed = await this.preprocessImage(imageDataUrl);
      
      // 2. Run parallel analysis
      const [shapes, objects, text, segmentation] = await Promise.all([
        this.detectShapesWithOpenCV(preprocessed),
        this.detectObjectsWithYOLO(preprocessed),
        this.recognizeTextWithOCR(preprocessed),
        this.performSemanticSegmentation(preprocessed)
      ]);
      
      // 3. Associate text labels to shapes
      const associations = this.associateLabelsToShapes(text, shapes);
      
      // 4. Enhance shapes with labels
      const enhancedShapes = this.enhanceShapesWithLabels(shapes, associations);
      
      return {
        shapes: enhancedShapes,
        objects,
        text,
        semanticSegmentation: segmentation,
        associations,
        metadata: {
          processingTime: performance.now() - startTime,
          imageSize: preprocessed.dimensions,
          modelsUsed: ['opencv', 'yolo', 'tesseract', 'deeplab'],
          confidence: this.calculateOverallConfidence([...enhancedShapes, ...objects])
        }
      };
    } catch (error) {
      throw new AnalysisError(`Advanced analysis failed: ${error.message}`);
    }
  }
}
```

---

## 📐 Shape Detection with OpenCV

### OpenCV Integration
```typescript
// OpenCV shape detection implementation
class OpenCVShapeDetector {
  private cv: any;

  constructor() {
    this.cv = cv; // OpenCV.js instance
  }

  async detectShapes(imageData: ImageData): Promise<DetectedItem[]> {
    const src = this.cv.matFromImageData(imageData);
    const gray = new this.cv.Mat();
    const edges = new this.cv.Mat();
    const contours = new this.cv.MatVector();
    const hierarchy = new this.cv.Mat();

    try {
      // Convert to grayscale
      this.cv.cvtColor(src, gray, this.cv.COLOR_RGBA2GRAY);
      
      // Edge detection
      this.cv.Canny(gray, edges, 50, 150);
      
      // Find contours
      this.cv.findContours(edges, contours, hierarchy, this.cv.RETR_EXTERNAL, this.cv.CHAIN_APPROX_SIMPLE);
      
      const shapes: DetectedItem[] = [];
      
      for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        const area = this.cv.contourArea(contour);
        
        // Filter small contours
        if (area < 1000) continue;
        
        // Approximate polygon
        const approx = new this.cv.Mat();
        const epsilon = 0.02 * this.cv.arcLength(contour, true);
        this.cv.approxPolyDP(contour, approx, epsilon, true);
        
        const boundingRect = this.cv.boundingRect(contour);
        const shape = this.classifyShape(approx, boundingRect, area);
        
        if (shape) {
          shapes.push({
            id: crypto.randomUUID(),
            type: shape.type,
            boundingBox: [boundingRect.x, boundingRect.y, boundingRect.width, boundingRect.height],
            confidence: shape.confidence,
            metadata: {
              area,
              vertices: approx.rows,
              perimeter: this.cv.arcLength(contour, true)
            }
          });
        }
        
        approx.delete();
        contour.delete();
      }
      
      return shapes;
    } finally {
      // Cleanup OpenCV matrices
      [src, gray, edges, contours, hierarchy].forEach(mat => mat.delete());
    }
  }

  private classifyShape(approx: any, boundingRect: any, area: number): { type: string; confidence: number } | null {
    const vertices = approx.rows;
    const aspectRatio = boundingRect.width / boundingRect.height;
    
    // Rectangle detection (parcels)
    if (vertices === 4) {
      const rectangularity = area / (boundingRect.width * boundingRect.height);
      if (rectangularity > 0.85) {
        return {
          type: aspectRatio > 1.5 ? 'parcel' : 'zone',
          confidence: Math.min(95, rectangularity * 100)
        };
      }
    }
    
    // Circle detection (trees)
    if (vertices > 8) {
      const circularity = (4 * Math.PI * area) / Math.pow(this.cv.arcLength(approx, true), 2);
      if (circularity > 0.7) {
        return {
          type: 'tree',
          confidence: Math.min(95, circularity * 100)
        };
      }
    }
    
    // Irregular shapes (zones)
    if (vertices >= 5 && vertices <= 8) {
      return {
        type: 'zone',
        confidence: 75
      };
    }
    
    return null;
  }
}
```

---

## 📖 OCR & Text Recognition

### Multi-Language OCR Implementation
```typescript
// Advanced OCR service with multiple engines
class AdvancedOCRService {
  private tesseractWorker: Tesseract.Worker | null = null;
  private trOCRSession: InferenceSession | null = null;

  async initializeOCR(): Promise<void> {
    // Initialize Tesseract for printed text
    this.tesseractWorker = await createWorker({
      logger: m => console.log('Tesseract:', m)
    });
    await this.tesseractWorker.loadLanguage('eng+fra');
    await this.tesseractWorker.initialize('eng+fra');
    
    // Initialize TrOCR for handwritten text (if available)
    try {
      this.trOCRSession = await InferenceSession.create('/models/trocr-handwritten.onnx');
    } catch (error) {
      console.warn('TrOCR model not available, using Tesseract only');
    }
  }

  async recognizeText(imageDataUrl: string): Promise<DetectedItem[]> {
    if (!this.tesseractWorker) {
      await this.initializeOCR();
    }

    const results: DetectedItem[] = [];

    // Printed text recognition with Tesseract
    try {
      const { data: { words } } = await this.tesseractWorker!.recognize(imageDataUrl);
      
      const printedText = words
        .filter(word => word.confidence > 60) // Filter low confidence
        .map(word => ({
          id: crypto.randomUUID(),
          type: 'label' as const,
          label: word.text.trim(),
          boundingBox: [
            word.bbox.x0,
            word.bbox.y0,
            word.bbox.x1 - word.bbox.x0,
            word.bbox.y1 - word.bbox.y0
          ] as [number, number, number, number],
          confidence: word.confidence,
          metadata: {
            engine: 'tesseract',
            textType: 'printed',
            fontSize: word.bbox.y1 - word.bbox.y0
          }
        }));
      
      results.push(...printedText);
    } catch (error) {
      console.error('Tesseract OCR failed:', error);
    }

    // Handwritten text recognition with TrOCR (if available)
    if (this.trOCRSession) {
      try {
        const handwrittenText = await this.recognizeHandwritten(imageDataUrl);
        results.push(...handwrittenText);
      } catch (error) {
        console.error('TrOCR failed:', error);
      }
    }

    return results;
  }

  private async recognizeHandwritten(imageDataUrl: string): Promise<DetectedItem[]> {
    // Implementation for handwritten text recognition
    // This would use the TrOCR ONNX model
    return []; // Placeholder
  }

  async cleanup(): Promise<void> {
    if (this.tesseractWorker) {
      await this.tesseractWorker.terminate();
      this.tesseractWorker = null;
    }
  }
}
```

---

## 🎯 Object Detection with YOLO

### YOLOv8 Integration
```typescript
// YOLOv8 object detection for fruits and vegetables
class YOLOObjectDetector {
  private session: InferenceSession | null = null;
  private labels: string[] = [];

  async initialize(): Promise<void> {
    try {
      this.session = await InferenceSession.create('/models/yolov8n.onnx');
      this.labels = AI_MODELS.YOLO.labels;
      console.log('YOLOv8 model loaded successfully');
    } catch (error) {
      console.error('Failed to load YOLOv8 model:', error);
      throw error;
    }
  }

  async detectObjects(imageData: ImageData): Promise<DetectedItem[]> {
    if (!this.session) {
      await this.initialize();
    }

    try {
      // Preprocess image for YOLO
      const input = this.preprocessForYOLO(imageData);
      
      // Run inference
      const results = await this.session!.run({ images: input });
      const output = results.output0.data as Float32Array;
      
      // Post-process results
      return this.postprocessYOLOResults(output, imageData.width, imageData.height);
    } catch (error) {
      console.error('YOLO inference failed:', error);
      return [];
    }
  }

  private preprocessForYOLO(imageData: ImageData): tf.Tensor {
    // Convert ImageData to tensor and normalize for YOLO
    const tensor = tf.browser.fromPixels(imageData)
      .resizeNearestNeighbor([640, 640])
      .cast('float32')
      .div(255.0)
      .expandDims(0);
    
    return tensor;
  }

  private postprocessYOLOResults(
    output: Float32Array, 
    originalWidth: number, 
    originalHeight: number
  ): DetectedItem[] {
    const detections: DetectedItem[] = [];
    const numDetections = output.length / 85; // 85 = 4 (bbox) + 1 (conf) + 80 (classes)
    
    for (let i = 0; i < numDetections; i++) {
      const offset = i * 85;
      const confidence = output[offset + 4];
      
      // Filter low confidence detections
      if (confidence < 0.5) continue;
      
      // Get class scores
      const classScores = output.slice(offset + 5, offset + 85);
      const maxScore = Math.max(...classScores);
      const classIndex = classScores.indexOf(maxScore);
      
      // Final confidence
      const finalConfidence = confidence * maxScore;
      if (finalConfidence < 0.6) continue;
      
      // Convert bounding box coordinates
      const centerX = output[offset] * originalWidth / 640;
      const centerY = output[offset + 1] * originalHeight / 640;
      const width = output[offset + 2] * originalWidth / 640;
      const height = output[offset + 3] * originalHeight / 640;
      
      const x = centerX - width / 2;
      const y = centerY - height / 2;
      
      detections.push({
        id: crypto.randomUUID(),
        type: this.getItemType(this.labels[classIndex]),
        label: this.labels[classIndex],
        boundingBox: [x, y, width, height],
        confidence: Math.round(finalConfidence * 100),
        metadata: {
          engine: 'yolo',
          classIndex,
          rawConfidence: confidence
        }
      });
    }
    
    return detections;
  }

  private getItemType(label: string): 'fruit' | 'vegetable' | 'tree' {
    const fruits = ['apple', 'banana', 'orange', 'strawberry', 'grape'];
    const vegetables = ['broccoli', 'carrot', 'tomato', 'lettuce', 'pepper'];
    
    if (fruits.includes(label.toLowerCase())) return 'fruit';
    if (vegetables.includes(label.toLowerCase())) return 'vegetable';
    return 'tree'; // Default for other plant items
  }
}
```

---

## 🌱 Semantic Segmentation

### DeepLab Integration
```typescript
// Semantic segmentation for soil, vegetation, and paths
class SemanticSegmentationService {
  private model: tf.GraphModel | null = null;

  async initialize(): Promise<void> {
    try {
      this.model = await deeplab.load(AI_MODELS.DEEPLAB);
      console.log('DeepLab model loaded successfully');
    } catch (error) {
      console.error('Failed to load DeepLab model:', error);
      throw error;
    }
  }

  async segmentImage(imageData: ImageData): Promise<SegmentationMap> {
    if (!this.model) {
      await this.initialize();
    }

    try {
      const segmentation = await this.model!.segment(imageData);
      
      return {
        segmentationMap: segmentation.segmentationMap,
        legend: segmentation.legend,
        analysis: this.analyzeSegmentation(segmentation),
        metadata: {
          width: segmentation.width,
          height: segmentation.height,
          classes: Object.keys(segmentation.legend).length
        }
      };
    } catch (error) {
      console.error('Semantic segmentation failed:', error);
      throw error;
    }
  }

  private analyzeSegmentation(segmentation: any): SegmentationAnalysis {
    const { segmentationMap, legend } = segmentation;
    const pixelCounts: Record<string, number> = {};
    const totalPixels = segmentationMap.length;
    
    // Count pixels for each class
    for (const pixel of segmentationMap) {
      const className = legend[pixel] || 'unknown';
      pixelCounts[className] = (pixelCounts[className] || 0) + 1;
    }
    
    // Calculate percentages
    const percentages: Record<string, number> = {};
    for (const [className, count] of Object.entries(pixelCounts)) {
      percentages[className] = (count / totalPixels) * 100;
    }
    
    return {
      pixelCounts,
      percentages,
      dominantClass: Object.entries(percentages)
        .reduce((a, b) => a[1] > b[1] ? a : b)[0],
      totalPixels
    };
  }
}
```

---

## 🔗 Label-Shape Association

### Smart Association Algorithm
```typescript
// Associate text labels to nearest shapes
class LabelAssociationService {
  associateLabelsToShapes(
    labels: DetectedItem[],
    shapes: DetectedItem[]
  ): ItemAssociation[] {
    const associations: ItemAssociation[] = [];
    
    for (const label of labels) {
      const labelCenter = this.getBoundingBoxCenter(label.boundingBox);
      
      // Find closest shape
      let closestShape: DetectedItem | null = null;
      let minDistance = Infinity;
      
      for (const shape of shapes) {
        const shapeCenter = this.getBoundingBoxCenter(shape.boundingBox);
        const distance = this.calculateDistance(labelCenter, shapeCenter);
        
        // Check if label is inside or very close to shape
        const isInside = this.isPointInBoundingBox(labelCenter, shape.boundingBox);
        const maxDistance = Math.max(shape.boundingBox[2], shape.boundingBox[3]); // Use shape size as max distance
        
        if ((isInside || distance < maxDistance) && distance < minDistance) {
          minDistance = distance;
          closestShape = shape;
        }
      }
      
      if (closestShape) {
        associations.push({
          labelId: label.id,
          shapeId: closestShape.id,
          distance: minDistance,
          confidence: this.calculateAssociationConfidence(minDistance, label, closestShape),
          relationship: this.determineRelationship(label, closestShape)
        });
      }
    }
    
    return associations;
  }

  private getBoundingBoxCenter(bbox: [number, number, number, number]): [number, number] {
    return [bbox[0] + bbox[2] / 2, bbox[1] + bbox[3] / 2];
  }

  private calculateDistance(point1: [number, number], point2: [number, number]): number {
    return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2));
  }

  private isPointInBoundingBox(point: [number, number], bbox: [number, number, number, number]): boolean {
    return point[0] >= bbox[0] && 
           point[0] <= bbox[0] + bbox[2] && 
           point[1] >= bbox[1] && 
           point[1] <= bbox[1] + bbox[3];
  }

  private calculateAssociationConfidence(
    distance: number, 
    label: DetectedItem, 
    shape: DetectedItem
  ): number {
    // Base confidence on distance and OCR confidence
    const maxDistance = Math.max(shape.boundingBox[2], shape.boundingBox[3]);
    const distanceScore = Math.max(0, 100 - (distance / maxDistance) * 100);
    const ocrScore = label.confidence;
    
    return Math.round((distanceScore * 0.6 + ocrScore * 0.4));
  }

  private determineRelationship(label: DetectedItem, shape: DetectedItem): string {
    const labelCenter = this.getBoundingBoxCenter(label.boundingBox);
    const isInside = this.isPointInBoundingBox(labelCenter, shape.boundingBox);
    
    return isInside ? 'inside' : 'adjacent';
  }
}
```

---

## 🎨 Enhanced UI Integration

### Advanced Results Display
```typescript
// Enhanced results modal with AI features
interface AdvancedResultsProps {
  result: AdvancedAnalysisResult;
  onClose: () => void;
}

export const AdvancedResultsModal: React.FC<AdvancedResultsProps> = ({ result, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'shapes' | 'objects' | 'text' | 'segmentation'>('overview');

  return (
    <Modal isOpen onClose={onClose} className="max-w-6xl max-h-[90vh] overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header with tabs */}
        <div className="border-b border-gray-200 p-4">
          <h2 className="text-xl font-semibold mb-4">Garden Analysis Results</h2>
          <div className="flex space-x-4">
            {['overview', 'shapes', 'objects', 'text', 'segmentation'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  activeTab === tab 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {activeTab === 'overview' && <OverviewTab result={result} />}
          {activeTab === 'shapes' && <ShapesTab shapes={result.shapes} />}
          {activeTab === 'objects' && <ObjectsTab objects={result.objects} />}
          {activeTab === 'text' && <TextTab text={result.text} />}
          {activeTab === 'segmentation' && <SegmentationTab segmentation={result.semanticSegmentation} />}
        </div>

        {/* Footer with actions */}
        <div className="border-t border-gray-200 p-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Processing time: {result.metadata.processingTime.toFixed(0)}ms | 
            Overall confidence: {result.metadata.confidence}%
          </div>
          <div className="space-x-2">
            <button
              onClick={() => exportResults(result)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Export Results
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Individual tab components
const OverviewTab: React.FC<{ result: AdvancedAnalysisResult }> = ({ result }) => (
  <div className="grid grid-cols-2 gap-6">
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Detection Summary</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{result.shapes.length}</div>
          <div className="text-sm text-blue-800">Shapes Detected</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{result.objects.length}</div>
          <div className="text-sm text-green-800">Objects Found</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{result.text.length}</div>
          <div className="text-sm text-purple-800">Text Labels</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{result.associations.length}</div>
          <div className="text-sm text-orange-800">Associations</div>
        </div>
      </div>
    </div>
    
    <div>
      <h3 className="text-lg font-semibold mb-4">AI Models Used</h3>
      <div className="space-y-2">
        {result.metadata.modelsUsed.map(model => (
          <div key={model} className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="capitalize">{model}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);
```

---

## 📊 Performance Optimization

### AI Model Loading Strategy
```typescript
// Lazy loading and caching strategy for AI models
class AIModelManager {
  private static instance: AIModelManager;
  private loadedModels: Map<string, any> = new Map();
  private loadingPromises: Map<string, Promise<any>> = new Map();

  static getInstance(): AIModelManager {
    if (!AIModelManager.instance) {
      AIModelManager.instance = new AIModelManager();
    }
    return AIModelManager.instance;
  }

  async loadModel(modelName: string): Promise<any> {
    // Return cached model if available
    if (this.loadedModels.has(modelName)) {
      return this.loadedModels.get(modelName);
    }

    // Return existing loading promise if in progress
    if (this.loadingPromises.has(modelName)) {
      return this.loadingPromises.get(modelName);
    }

    // Start loading
    const loadingPromise = this.loadModelInternal(modelName);
    this.loadingPromises.set(modelName, loadingPromise);

    try {
      const model = await loadingPromise;
      this.loadedModels.set(modelName, model);
      this.loadingPromises.delete(modelName);
      return model;
    } catch (error) {
      this.loadingPromises.delete(modelName);
      throw error;
    }
  }

  private async loadModelInternal(modelName: string): Promise<any> {
    switch (modelName) {
      case 'deeplab':
        return await deeplab.load(AI_MODELS.DEEPLAB);
      case 'yolo':
        return await InferenceSession.create(AI_MODELS.YOLO.modelUrl);
      case 'tesseract':
        const worker = await createWorker();
        await worker.loadLanguage('eng+fra');
        await worker.initialize('eng+fra');
        return worker;
      default:
        throw new Error(`Unknown model: ${modelName}`);
    }
  }

  // Preload models for better UX
  async preloadModels(): Promise<void> {
    const preloadPromises = ['deeplab', 'yolo', 'tesseract'].map(model => 
      this.loadModel(model).catch(error => 
        console.warn(`Failed to preload ${model}:`, error)
      )
    );
    
    await Promise.allSettled(preloadPromises);
  }
}
```

---

## 🔧 Configuration & Integration

### Enhanced Configuration
```typescript
// Enhanced constants with AI model settings
export const ADVANCED_CONFIG = {
  AI_MODELS: {
    DEEPLAB: {
      enabled: true,
      modelPath: '/models/deeplabv3_pascal.json',
      quantizationBytes: 2
    },
    YOLO: {
      enabled: true,
      modelPath: '/models/yolov8n.onnx',
      confidenceThreshold: 0.6,
      nmsThreshold: 0.4
    },
    TESSERACT: {
      enabled: true,
      languages: ['eng', 'fra'],
      psm: 6, // Page segmentation mode
      oem: 3  // OCR Engine mode
    }
  },
  
  PROCESSING: {
    enableGPU: true,
    maxImageSize: 1920,
    qualityThreshold: 0.8,
    enableParallelProcessing: true
  },
  
  UI: {
    showConfidenceScores: true,
    showBoundingBoxes: true,
    enableExport: true,
    showSegmentationOverlay: true
  }
};
```

### Integration with Existing Service
```typescript
// Update the main service to use advanced features
export class EnhancedGardenVisionService {
  private shapeDetector = new OpenCVShapeDetector();
  private ocrService = new AdvancedOCRService();
  private objectDetector = new YOLOObjectDetector();
  private segmentationService = new SemanticSegmentationService();
  private associationService = new LabelAssociationService();
  private modelManager = AIModelManager.getInstance();

  async processImage(imageDataUrl: string): Promise<AdvancedAnalysisResult> {
    // Preload models if not already loaded
    await this.modelManager.preloadModels();
    
    // Delegate to enhanced analysis
    return this.advancedImageRecognitionService.analyzeImage(imageDataUrl);
  }
}
```

---

## 📚 Documentation Updates

### Updated Types
```typescript
// Enhanced type definitions
interface DetectedItem {
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

interface ItemAssociation {
  labelId: string;
  shapeId: string;
  distance: number;
  confidence: number;
  relationship: 'inside' | 'adjacent';
}

interface SegmentationMap {
  segmentationMap: Uint8Array;
  legend: Record<number, string>;
  analysis: SegmentationAnalysis;
  metadata: {
    width: number;
    height: number;
    classes: number;
  };
}
```

This enhancement provides Garden Vision with state-of-the-art AI capabilities while maintaining privacy through client-side processing. The modular design allows for easy feature toggles and progressive enhancement based on device capabilities.