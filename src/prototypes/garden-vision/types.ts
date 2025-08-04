export interface DetectedItem {
  id: string;
  type: 'parcel' | 'zone' | 'fruit' | 'vegetable' | 'tree';
  name: string;
  confidence: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  color: string;
}

export interface DetectedParcel {
  id: string;
  type: 'parcel';
  name: string;
  confidence: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  color: string;
  zones: DetectedZone[];
}

export interface DetectedZone {
  id: string;
  type: 'zone';
  name: string;
  confidence: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  color: string;
  items: DetectedCrop[];
}

export interface DetectedCrop {
  id: string;
  type: 'fruit' | 'vegetable' | 'tree';
  name: string;
  confidence: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  color: string;
  count?: number;
}

export interface RecognitionResult {
  success: boolean;
  imageUrl: string;
  detectedItems: DetectedItem[];
  detectedParcels: DetectedParcel[];
  processingTime: number;
  timestamp: Date;
}

export interface CameraSettings {
  resolution: 'low' | 'medium' | 'high';
  autoFocus: boolean;
  flash: boolean;
  facingMode: 'user' | 'environment';
}

export interface GridCell {
  x: number;
  y: number;
  width: number;
  height: number;
  item?: DetectedItem;
  parcel?: DetectedParcel;
  zone?: DetectedZone;
}