/**
 * Simple parcel detection focused on finding actual rectangular garden beds
 */

interface Parcel {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

export class SimpleParcelDetector {
  /**
   * Detect parcels using a grid-based approach with contrast detection
   */
  static detectParcels(imageData: ImageData): Parcel[] {
    const { data, width, height } = imageData;
    const parcels: Parcel[] = [];
    
    // Parameters for detection
    const minParcelSize = 30; // Minimum size in pixels
    const maxParcelSize = Math.min(width, height) / 4; // Max 1/4 of image
    const contrastThreshold = 50; // Minimum contrast to detect edge
    
    // Scan the image in a grid pattern
    const stepSize = 20;
    
    for (let y = stepSize; y < height - stepSize; y += stepSize) {
      for (let x = stepSize; x < width - stepSize; x += stepSize) {
        // Check if this could be a parcel corner
        if (this.isCornerCandidate(data, width, height, x, y, contrastThreshold)) {
          // Try to find the parcel boundaries
          const parcel = this.expandParcel(data, width, height, x, y, minParcelSize, maxParcelSize, contrastThreshold);
          
          if (parcel && this.isValidParcel(parcel, parcels)) {
            parcels.push(parcel);
          }
        }
      }
    }
    
    // Sort parcels by position (top to bottom, left to right)
    parcels.sort((a, b) => {
      if (Math.abs(a.y - b.y) < 20) {
        return a.x - b.x;
      }
      return a.y - b.y;
    });
    
    console.log(`🎯 Simple detector found ${parcels.length} parcels`);
    return parcels;
  }
  
  /**
   * Check if a point could be a corner of a parcel
   */
  private static isCornerCandidate(
    data: Uint8ClampedArray, 
    width: number, 
    height: number, 
    x: number, 
    y: number,
    threshold: number
  ): boolean {
    // Get pixel at position
    const idx = (y * width + x) * 4;
    const centerColor = this.getAverageColor(data, idx);
    
    // Check contrast in multiple directions
    const directions = [
      { dx: 10, dy: 0 },   // Right
      { dx: 0, dy: 10 },   // Down
      { dx: -10, dy: 0 },  // Left
      { dx: 0, dy: -10 }   // Up
    ];
    
    let contrastCount = 0;
    
    for (const dir of directions) {
      const nx = x + dir.dx;
      const ny = y + dir.dy;
      
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = (ny * width + nx) * 4;
        const neighborColor = this.getAverageColor(data, nIdx);
        
        if (Math.abs(centerColor - neighborColor) > threshold) {
          contrastCount++;
        }
      }
    }
    
    // Corner should have contrast in at least 2 directions
    return contrastCount >= 2;
  }
  
  /**
   * Expand from a corner to find parcel boundaries
   */
  private static expandParcel(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    startX: number,
    startY: number,
    minSize: number,
    maxSize: number,
    threshold: number
  ): Parcel | null {
    // Find right edge
    let rightEdge = startX;
    for (let x = startX; x < Math.min(startX + maxSize, width - 10); x += 5) {
      if (this.hasVerticalEdge(data, width, height, x, startY, threshold)) {
        rightEdge = x;
      } else if (x > startX + minSize) {
        break;
      }
    }
    
    // Find bottom edge
    let bottomEdge = startY;
    for (let y = startY; y < Math.min(startY + maxSize, height - 10); y += 5) {
      if (this.hasHorizontalEdge(data, width, height, startX, y, threshold)) {
        bottomEdge = y;
      } else if (y > startY + minSize) {
        break;
      }
    }
    
    const parcelWidth = rightEdge - startX;
    const parcelHeight = bottomEdge - startY;
    
    // Check if it's a valid rectangle
    if (parcelWidth >= minSize && parcelHeight >= minSize &&
        parcelWidth <= maxSize && parcelHeight <= maxSize) {
      
      // Verify it's roughly rectangular by checking corners
      const confidence = this.calculateRectangleConfidence(
        data, width, height, startX, startY, parcelWidth, parcelHeight, threshold
      );
      
      if (confidence > 0.5) {
        return {
          x: startX,
          y: startY,
          width: parcelWidth,
          height: parcelHeight,
          confidence
        };
      }
    }
    
    return null;
  }
  
  /**
   * Check for vertical edge at position
   */
  private static hasVerticalEdge(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    x: number,
    y: number,
    threshold: number
  ): boolean {
    let edgeStrength = 0;
    const checkLength = 30;
    
    for (let dy = 0; dy < checkLength && y + dy < height; dy += 5) {
      const idx1 = ((y + dy) * width + Math.max(0, x - 5)) * 4;
      const idx2 = ((y + dy) * width + Math.min(width - 1, x + 5)) * 4;
      
      const color1 = this.getAverageColor(data, idx1);
      const color2 = this.getAverageColor(data, idx2);
      
      if (Math.abs(color1 - color2) > threshold) {
        edgeStrength++;
      }
    }
    
    return edgeStrength > checkLength / 10;
  }
  
  /**
   * Check for horizontal edge at position
   */
  private static hasHorizontalEdge(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    x: number,
    y: number,
    threshold: number
  ): boolean {
    let edgeStrength = 0;
    const checkLength = 30;
    
    for (let dx = 0; dx < checkLength && x + dx < width; dx += 5) {
      const idx1 = (Math.max(0, y - 5) * width + (x + dx)) * 4;
      const idx2 = (Math.min(height - 1, y + 5) * width + (x + dx)) * 4;
      
      const color1 = this.getAverageColor(data, idx1);
      const color2 = this.getAverageColor(data, idx2);
      
      if (Math.abs(color1 - color2) > threshold) {
        edgeStrength++;
      }
    }
    
    return edgeStrength > checkLength / 10;
  }
  
  /**
   * Calculate confidence that this is a real rectangle
   */
  private static calculateRectangleConfidence(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    x: number,
    y: number,
    rectWidth: number,
    rectHeight: number,
    threshold: number
  ): number {
    let score = 0;
    let checks = 0;
    
    // Check all four edges
    // Top edge
    for (let dx = 0; dx < rectWidth; dx += 10) {
      if (this.hasHorizontalEdge(data, width, height, x + dx, y, threshold)) {
        score++;
      }
      checks++;
    }
    
    // Bottom edge
    for (let dx = 0; dx < rectWidth; dx += 10) {
      if (this.hasHorizontalEdge(data, width, height, x + dx, y + rectHeight, threshold)) {
        score++;
      }
      checks++;
    }
    
    // Left edge
    for (let dy = 0; dy < rectHeight; dy += 10) {
      if (this.hasVerticalEdge(data, width, height, x, y + dy, threshold)) {
        score++;
      }
      checks++;
    }
    
    // Right edge
    for (let dy = 0; dy < rectHeight; dy += 10) {
      if (this.hasVerticalEdge(data, width, height, x + rectWidth, y + dy, threshold)) {
        score++;
      }
      checks++;
    }
    
    return score / checks;
  }
  
  /**
   * Check if parcel overlaps with existing parcels
   */
  private static isValidParcel(candidate: Parcel, existing: Parcel[]): boolean {
    for (const parcel of existing) {
      // Check for significant overlap
      const overlapX = Math.max(0, Math.min(candidate.x + candidate.width, parcel.x + parcel.width) - Math.max(candidate.x, parcel.x));
      const overlapY = Math.max(0, Math.min(candidate.y + candidate.height, parcel.y + parcel.height) - Math.max(candidate.y, parcel.y));
      
      const overlapArea = overlapX * overlapY;
      const candidateArea = candidate.width * candidate.height;
      
      // Reject if more than 30% overlap
      if (overlapArea > candidateArea * 0.3) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Get average grayscale value at pixel
   */
  private static getAverageColor(data: Uint8ClampedArray, idx: number): number {
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    return (r + g + b) / 3;
  }
}