// Garden Planning Models
export interface GardenBox {
  id: number;
  x: number;
  y: number;
  width: number;
  length: number;
}

export interface GardenStats {
  cultivatedArea: number;
  pathArea: number;
  boxCount: number;
  freeArea: number;
}

export type LayoutDirection = 'horizontal' | 'vertical';

export interface SavedLayout {
  id: string;
  name: string;
  direction: LayoutDirection;
  boxes: GardenBox[];
  stats: GardenStats;
  timestamp: string;
}

export interface SavedLayoutsProps {
  layouts: SavedLayout[];
  onLoad: (layoutId: string) => void;
}