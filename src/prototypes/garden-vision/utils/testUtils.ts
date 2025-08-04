/**
 * Test utilities for Garden Vision
 * Use these in the browser console to test and debug image recognition
 * TEMPORARILY DISABLED - ImageRecognitionService commented out for memory optimization
 */

// import { ImageRecognitionService } from '../services/imageRecognitionService';

// Make utilities available in browser console
if (false && typeof window !== 'undefined') {
  (window as any).GardenVisionTest = {
    // Get the recognition service instance
    // getService: () => ImageRecognitionService.getInstance(),
    
    // Get saved test images
    getTestImages: () => {
      // const service = ImageRecognitionService.getInstance();
      // return service.getTestImages();
      console.log('ImageRecognitionService temporarily disabled');
      return [];
    },
    
    // Process a test image by index
    processTestImage: async (index: number = 0) => {
      const service = ImageRecognitionService.getInstance();
      const testImages = service.getTestImages();
      
      if (testImages.length === 0) {
        console.error('No test images saved. Capture an image first.');
        return;
      }
      
      if (index >= testImages.length) {
        console.error(`Invalid index. Only ${testImages.length} images available.`);
        return;
      }
      
      const image = testImages[index];
      console.log(`🔍 Processing test image: ${image.filename}`);
      
      const result = await service.processImage(image.dataUrl);
      
      console.log('📊 Recognition Results:', {
        totalParcels: result.detectedItems.filter(item => item.type === 'parcel').length,
        totalZones: result.detectedItems.filter(item => item.type === 'zone').length,
        totalItems: result.detectedItems.length,
        processingTime: result.processingTime + 's',
        detectedParcels: result.detectedParcels
      });
      
      return result;
    },
    
    // Clear all test images
    clearTestImages: () => {
      const service = ImageRecognitionService.getInstance();
      service.clearTestImages();
    },
    
    // Visualize detection results
    visualizeResults: (result: any) => {
      if (!result || !result.imageUrl) {
        console.error('Invalid result object');
        return;
      }
      
      // Create a canvas to draw detection boxes
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the original image
        ctx?.drawImage(img, 0, 0);
        
        // Draw detection boxes
        if (ctx) {
          ctx.lineWidth = 2;
          
          result.detectedItems.forEach((item: any) => {
            // Set color based on type
            if (item.type === 'parcel') ctx.strokeStyle = '#3B82F6';
            else if (item.type === 'zone') ctx.strokeStyle = '#8B5CF6';
            else if (item.type === 'fruit') ctx.strokeStyle = '#EF4444';
            else if (item.type === 'vegetable') ctx.strokeStyle = '#F59E0B';
            else if (item.type === 'tree') ctx.strokeStyle = '#10B981';
            
            // Draw rectangle
            ctx.strokeRect(item.bbox.x, item.bbox.y, item.bbox.width, item.bbox.height);
            
            // Draw label
            ctx.fillStyle = ctx.strokeStyle;
            ctx.font = '12px Arial';
            ctx.fillText(item.name, item.bbox.x, item.bbox.y - 5);
          });
        }
        
        // Open result in new window
        const dataUrl = canvas.toDataURL();
        const win = window.open();
        if (win) {
          win.document.write(`<img src="${dataUrl}" style="max-width: 100%; height: auto;" />`);
        }
      };
      
      img.src = result.imageUrl;
    },
    
    // Test with custom parameters
    testWithParams: async (imageDataUrl: string, params: any = {}) => {
      console.log('🧪 Testing with custom parameters:', params);
      // This could be extended to allow custom detection parameters
      const service = ImageRecognitionService.getInstance();
      return await service.processImage(imageDataUrl);
    },
    
    // Debug last captured image
    debugLastImage: async () => {
      const service = ImageRecognitionService.getInstance();
      const testImages = service.getTestImages();
      
      if (testImages.length === 0) {
        console.error('No test images available');
        return;
      }
      
      const lastImage = testImages[testImages.length - 1];
      console.log('🔍 Debugging last captured image:', lastImage.filename);
      
      // Process with frontend service
      const frontendResult = await service.processImage(lastImage.dataUrl);
      console.log('🖥️ Frontend analysis:', {
        totalParcels: frontendResult.detectedItems.filter(i => i.type === 'parcel').length,
        items: frontendResult.detectedItems
      });
      
      return frontendResult;
    },
    
    // Analyze with backend (more accurate)
    analyzeWithBackend: async (imageIndex: number = -1) => {
      const service = ImageRecognitionService.getInstance();
      const testImages = service.getTestImages();
      
      if (testImages.length === 0) {
        console.error('No test images available');
        return;
      }
      
      const image = imageIndex === -1 
        ? testImages[testImages.length - 1] 
        : testImages[imageIndex];
        
      if (!image) {
        console.error('Image not found at index:', imageIndex);
        return;
      }
      
      console.log('🔍 Analyzing with backend:', image.filename);
      
      try {
        const response = await fetch('/v1/garden-vision/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          },
          body: JSON.stringify({
            imageData: image.dataUrl
          })
        });
        
        const result = await response.json();
        
        if (result.success) {
          console.log('🚀 Backend analysis results:', {
            imageSize: result.metadata.width + 'x' + result.metadata.height,
            colorAnalysis: result.analysis.colorAnalysis,
            parcelsFound: result.analysis.parcels.length,
            recommendations: result.analysis.recommendations
          });
          
          // Visualize parcels
          if (result.analysis.parcels.length > 0) {
            console.table(result.analysis.parcels.map((p: any, i: number) => ({
              Parcel: `P${i + 1}`,
              X: p.x,
              Y: p.y,
              Width: p.width,
              Height: p.height,
              Confidence: Math.round(p.confidence * 100) + '%'
            })));
          }
          
          return result;
        } else {
          console.error('❌ Backend analysis failed:', result.error);
          return result;
        }
      } catch (error) {
        console.error('❌ Failed to connect to backend:', error);
        return { success: false, error: 'Connection failed' };
      }
    }
  };
  
  console.log(`
🌱 Garden Vision Test Utilities Loaded!

Available commands:
- GardenVisionTest.getTestImages() - List saved test images
- GardenVisionTest.processTestImage(0) - Process first saved image (frontend)
- GardenVisionTest.analyzeWithBackend() - Analyze last image with backend AI
- GardenVisionTest.visualizeResults(result) - Visualize detection results
- GardenVisionTest.debugLastImage() - Debug last captured image
- GardenVisionTest.clearTestImages() - Clear all saved images

Tip: Use analyzeWithBackend() for more accurate parcel detection!
  `);
}

export {};