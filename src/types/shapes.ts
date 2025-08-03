import { DivideIcon as LucideIcon } from 'lucide-react';

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
    position: { x: number; y: number; z: number }; // Added position property
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

export interface ShapeDefinition {
  type: string;
  label: string;
  icon: typeof LucideIcon;
  color: string;
  rotatable: boolean;
  scalable: boolean;
  defaultProps: Partial<Shape>;
}

export type Shape = Rectangle | Cylinder | Sphere | Pyramid;
