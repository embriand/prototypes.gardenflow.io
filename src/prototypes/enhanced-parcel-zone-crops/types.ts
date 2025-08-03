// Types for the Enhanced Parcel Zone Crops prototype

export interface DroppedGarden {
  id: string;
  name: string;
  type: 'garden';
  x: number;
  y: number;
  width: number;
  height: number;
  widthMeters: number;
  heightMeters: number;
  parcels: DroppedParcel[];
}

export interface DroppedParcel {
  id: string;
  name: string;
  type: 'parcel';
  x: number;
  y: number;
  width: number;
  height: number;
  area: number;
  zones: DroppedZone[];
}

export interface DroppedZone {
  id: string;
  name: string;
  type: 'zone';
  x: number;
  y: number;
  width: number;
  height: number;
  area: number;
  crops: DroppedCrop[];
}

export interface DroppedCrop {
  id: string;
  name: string;
  type: 'crop';
  x: number;
  y: number;
  width: number;
  height: number;
  variety?: string;
  plantingDate?: string;
  status?: 'healthy' | 'needs-attention' | 'ready-harvest';
  health?: number;
  growth?: number;
  quantity?: number;
}