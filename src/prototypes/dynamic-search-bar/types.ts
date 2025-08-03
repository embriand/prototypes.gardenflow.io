import { LucideIcon } from 'lucide-react';

export interface Item {
  id: number;
  name: string;
  icon: LucideIcon;
  description: string;
  category: 'tree' | 'fruit' | 'vegetable' | 'furniture';
  hasNotification?: boolean;
  isVisible?: boolean;
  properties?: Record<string, React.ReactNode>;
}

export interface Position {
  x: number;
  y: number;
}

export type DroppedItem = Item & Position;

export interface DragStartEvent extends React.DragEvent<HTMLDivElement> {
  dataTransfer: DataTransfer;
}

export interface CanvasDropEvent extends React.DragEvent<HTMLDivElement> {
  dataTransfer: DataTransfer;
}

export interface CircularLayoutActionsProps {
  radius: number;
  setShowDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CircularLayoutPropertiesProps {
  radius: number;
  properties?: Record<string, React.ReactNode>;
}