import { LucideIcon } from 'lucide-react';

export interface Point {
  x: number;
  y: number;
  z: number;
}

export interface BaseShape {
  id: string;
  type: string;
  color: string;
  rotation: number;
  x: number;
  y: number;
  z: number;
  rotatable: boolean;
  scalable: boolean;
}

export interface Rectangle extends BaseShape {
  id: string;
  type: 'rectangle';
  color: string;
  rotation: number;
  width: number;
  height: number;
  depth: number;
  rotatable: boolean;
  scalable: boolean;
  position: { x: number; y: number; z: number };
}

export type Cylinder = {
  id: string;
  type: 'cylinder';
  color: string;
  rotation: number;
  position: { x: number; y: number; z: number };
  radius: number;
  height: number;
  rotatable: boolean;
  scalable: boolean;
};

export interface Sphere extends BaseShape {
  type: 'sphere';
  radius: number;
}

export interface Pyramid extends BaseShape {
  type: 'pyramid';
  baseWidth: number;
  height: number;
}

export interface Cube extends BaseShape {
  type: 'cube';
  width: number;
  height: number;
  depth: number;
}

export interface Cone extends BaseShape {
  type: 'cone';
  radius: number;
  height: number;
}

export type Shape = Rectangle | Cylinder | Sphere | Pyramid | Cube | Cone;

export interface ShapeDefinition {
  type: string;
  label: string;
  icon: LucideIcon;
  color: string;
  rotatable: boolean;
  scalable: boolean;
  defaultProps: Record<string, any>;
}

export type DraggingShape = {
  id: string;
  x: number;
  y: number;
  z: number;
  width?: number;
  height?: number;
  radius?: number;
  color?: string;
  type: 'rectangle' | 'circle';
};

export interface CanvasViewerState {
  shapes: {
    items: Shape[];
    selectedShape: Shape | null;
    history: Shape[][];
    historyIndex: number;
  };
  ui: {
    viewMode: string;
    zoom: number;
    showGrid: boolean;
    snapToGrid: boolean;
    isToolboxOpen: boolean;
    activeTab: string;
  };
}