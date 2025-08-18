export interface Parcel {
  uuid: string;
  name: string;
  zones: Zone[];
  width: number;
  height: number;
}

export interface Zone {
  uuid: string;
  name: string;
  parcelUuid: string;
  width: number;
  height: number;
  positionX: number;
  positionY: number;
}

export interface Crop {
  uuid: string;
  name: string;
  variety?: string;
  family: string;
  color: string;
  parcelUuid: string;
  zoneUuid: string;
  sowStartWeek?: number;
  sowEndWeek?: number;
  cultureStartWeek?: number;
  cultureEndWeek?: number;
  harvestStartWeek?: number;
  harvestEndWeek?: number;
  year: number;
  quantity: number;
}

export interface CropPhase {
  type: 'sow' | 'culture' | 'harvest';
  startWeek: number;
  endWeek: number;
  color: string;
}

export type ViewMode = 'week' | 'month' | 'season';
export type TimelineMode = 'compact' | 'expanded' | 'phases';