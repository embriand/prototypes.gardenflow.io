/**
 * Image Memory Optimizer for Garden Vision
 * Optimizes image processing to work within memory constraints
 */

import { memoryMonitor } from './memoryMonitor';

export interface ImageOptimizationResult {
  optimizedImageUrl: string;
  originalSize: { width: number; height: number; bytes: number };
  optimizedSize: { width: number; height: number; bytes: number };
  compressionRatio: number;
  resized: boolean;
  quality: number;
}

export class ImageMemoryOptimizer {
  private static instance: ImageMemoryOptimizer;

  private constructor() {}

  public static getInstance(): ImageMemoryOptimizer {
    if (!ImageMemoryOptimizer.instance) {
      ImageMemoryOptimizer.instance = new ImageMemoryOptimizer();
    }
    return ImageMemoryOptimizer.instance;
  }

  /**
   * Optimize image for memory-efficient processing
   */
  public async optimizeImageForProcessing(imageDataUrl: string): Promise<ImageOptimizationResult> {
    try {
      console.log('🔧 Starting image optimization for memory efficiency...');
      
      // Load original image
      const originalImage = await this.loadImage(imageDataUrl);
      const originalBytes = this.estimateImageSizeInBytes(imageDataUrl);
      
      // Determine optimization strategy based on current memory usage
      const memoryStats = memoryMonitor.getCurrentMemoryUsage();
      const optimizationLevel = this.determineOptimizationLevel(memoryStats, originalBytes);
      
      console.log(`📊 Memory stats: ${memoryStats ? Math.round(memoryStats.percentage) + '%' : 'unknown'}, Optimization level: ${optimizationLevel}`);
      
      // Apply optimization
      const optimized = await this.applyOptimization(originalImage, optimizationLevel);
      
      const result: ImageOptimizationResult = {
        optimizedImageUrl: optimized.dataUrl,
        originalSize: {
          width: originalImage.width,
          height: originalImage.height,
          bytes: originalBytes
        },
        optimizedSize: {
          width: optimized.width,
          height: optimized.height,
          bytes: optimized.bytes
        },
        compressionRatio: Math.round((1 - optimized.bytes / originalBytes) * 100),
        resized: optimized.width !== originalImage.width || optimized.height !== originalImage.height,
        quality: optimized.quality
      };
      
      console.log(`✅ Image optimized: ${result.originalSize.width}x${result.originalSize.height} → ${result.optimizedSize.width}x${result.optimizedSize.height} (${result.compressionRatio}% reduction)`);
      
      return result;
    } catch (error: any) {
      throw new Error(`Image optimization failed: ${error.message}`);
    }
  }

  /**
   * Prepare memory for image processing
   */
  public async prepareMemoryForProcessing(): Promise<boolean> {
    try {
      console.log('🧹 Preparing memory for image processing...');
      
      // Force garbage collection
      memoryMonitor.forceGarbageCollection();
      
      // Wait for cleanup
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Check if memory is now available
      const isReady = memoryMonitor.isMemoryUsageSafeForImageProcessing();
      
      if (isReady) {
        console.log('✅ Memory prepared successfully for processing');
      } else {
        console.warn('⚠️ Memory preparation incomplete, but proceeding with caution');
      }
      
      return isReady;
    } catch (error) {
      console.error('Memory preparation failed:', error);
      return false;
    }
  }

  /**
   * Load image element from data URL
   */
  private loadImage(dataUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        reject(new Error('Image loading timeout'));
      }, 10000);

      img.onload = () => {
        clearTimeout(timeout);
        resolve(img);
      };

      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Failed to load image'));
      };

      img.src = dataUrl;
    });
  }

  /**
   * Estimate image size in bytes from data URL
   */
  private estimateImageSizeInBytes(dataUrl: string): number {
    try {
      const base64 = dataUrl.split(',')[1];
      if (!base64) return 0;
      
      // Base64 encoding adds ~33% overhead, so actual image size is ~75% of base64 length
      return Math.round(base64.length * 0.75);
    } catch (error) {
      return 0;
    }
  }

  /**
   * Determine optimization level based on memory usage and image size
   */
  private determineOptimizationLevel(memoryStats: any, imageSizeBytes: number): 'low' | 'medium' | 'high' | 'aggressive' {
    const memoryPercentage = memoryStats?.percentage || 50;
    const imageSizeMB = imageSizeBytes / (1024 * 1024);
    
    // Aggressive optimization for high memory usage or large images
    if (memoryPercentage > 85 || imageSizeMB > 5) {
      return 'aggressive';
    }
    
    // High optimization for medium-high memory usage or medium-large images
    if (memoryPercentage > 75 || imageSizeMB > 3) {
      return 'high';
    }
    
    // Medium optimization for medium memory usage or medium images
    if (memoryPercentage > 60 || imageSizeMB > 1.5) {
      return 'medium';
    }
    
    // Low optimization for low memory usage and small images
    return 'low';
  }

  /**
   * Apply optimization based on level
   */
  private async applyOptimization(
    image: HTMLImageElement, 
    level: 'low' | 'medium' | 'high' | 'aggressive'
  ): Promise<{ dataUrl: string; width: number; height: number; bytes: number; quality: number }> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Canvas context not available');
    }

    // Determine target dimensions and quality based on optimization level
    const { maxDimension, quality } = this.getOptimizationSettings(level);
    
    // Calculate new dimensions
    const ratio = Math.min(maxDimension / image.width, maxDimension / image.height, 1);
    const newWidth = Math.round(image.width * ratio);
    const newHeight = Math.round(image.height * ratio);
    
    // Set canvas size
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    // Draw and compress image
    ctx.drawImage(image, 0, 0, newWidth, newHeight);
    
    // Apply additional optimizations for aggressive mode
    if (level === 'aggressive') {
      // Apply slight blur to reduce detail and improve compression
      ctx.filter = 'blur(0.5px)';
      ctx.drawImage(canvas, 0, 0);
      ctx.filter = 'none';
    }
    
    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    const bytes = this.estimateImageSizeInBytes(dataUrl);
    
    return {
      dataUrl,
      width: newWidth,
      height: newHeight,
      bytes,
      quality: Math.round(quality * 100)
    };
  }

  /**
   * Get optimization settings for each level
   */
  private getOptimizationSettings(level: 'low' | 'medium' | 'high' | 'aggressive'): { maxDimension: number; quality: number } {
    switch (level) {
      case 'low':
        return { maxDimension: 1200, quality: 0.85 };
      case 'medium':
        return { maxDimension: 1000, quality: 0.75 };
      case 'high':
        return { maxDimension: 800, quality: 0.65 };
      case 'aggressive':
        return { maxDimension: 600, quality: 0.55 };
      default:
        return { maxDimension: 1000, quality: 0.75 };
    }
  }

  /**
   * Check if image needs optimization
   */
  public shouldOptimizeImage(imageDataUrl: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      try {
        const image = await this.loadImage(imageDataUrl);
        const bytes = this.estimateImageSizeInBytes(imageDataUrl);
        const sizeMB = bytes / (1024 * 1024);
        
        // Optimize if image is larger than 1MB or dimensions > 1000px
        const needsOptimization = sizeMB > 1 || image.width > 1000 || image.height > 1000;
        
        resolve(needsOptimization);
      } catch (error) {
        resolve(true); // Optimize by default if we can't determine
      }
    });
  }
}

// Export singleton instance
export const imageMemoryOptimizer = ImageMemoryOptimizer.getInstance();

/**
 * Utility function to optimize image with memory preparation
 */
export const optimizeImageForProcessing = async (imageDataUrl: string): Promise<string> => {
  try {
    // Prepare memory first
    await imageMemoryOptimizer.prepareMemoryForProcessing();
    
    // Check if optimization is needed
    const needsOptimization = await imageMemoryOptimizer.shouldOptimizeImage(imageDataUrl);
    
    if (!needsOptimization) {
      console.log('📸 Image already optimized, using original');
      return imageDataUrl;
    }
    
    // Optimize image
    const result = await imageMemoryOptimizer.optimizeImageForProcessing(imageDataUrl);
    return result.optimizedImageUrl;
  } catch (error: any) {
    console.warn('Image optimization failed, using original:', error.message);
    return imageDataUrl;
  }
};