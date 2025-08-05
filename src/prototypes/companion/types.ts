// Define types for our data models
export interface Plant {
  id: number;
  name: string;
  type: string;
  image: string;
  season: string;
  family: string;
}

export interface Companion {
  plant1Id: number;
  plant2Id: number;
  type: 'companion' | 'non-companion';
  notes: string;
  benefit?: string;
  detriment?: string;
  strength?: 'low' | 'medium' | 'strong';
  severity?: 'low' | 'medium' | 'high';
}

export interface ChangeHistoryItem {
  action: 'add-relationship' | 'remove-relationship' | 'update-relationship';
  data: any;
  timestamp: number;
}

export interface CompanionProps {
  // Add any props if needed for the component
}