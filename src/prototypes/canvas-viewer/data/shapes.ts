import { ShapeDefinition, Shape } from '../../../types/shapes';
import { Square, Circle, Hexagon, Triangle, Cuboid as Cube, Cone, Pyramid } from 'lucide-react';

export const SHAPES: ShapeDefinition[] = [
  {
    type: 'rectangle',
    label: 'Rectangle',
    icon: Square,
    color: '#6366f1',
    rotatable: true,
    scalable: true,
    defaultProps: {
      width: 100,
      height: 50,
      depth: 30,
    }
  },
  {
    type: 'cylinder',
    label: 'Cylinder',
    icon: Circle,
    color: '#22d3ee',
    rotatable: true,
    scalable: true,
    defaultProps: {
      radius: 30,
      height: 60,
    }
  },
  {
    type: 'sphere',
    label: 'Sphere',
    icon: Circle,
    color: '#f472b6',
    rotatable: false,
    scalable: true,
    defaultProps: {
      radius: 40,
    }
  },
  {
    type: 'pyramid',
    label: 'Pyramid',
    icon: Triangle,
    color: '#fbbf24',
    rotatable: true,
    scalable: true,
    defaultProps: {
      baseWidth: 80,
      height: 100,
    }
  },
  {
    type: 'cube',
    label: 'Cube',
    icon: Cube,
    color: '#34d399',
    rotatable: true,
    scalable: true,
    defaultProps: {
      width: 60,
      height: 60,
      depth: 60,
    }
  },
  {
    type: 'cone',
    label: 'Cone',
    icon: Cone,
    color: '#fb7185',
    rotatable: true,
    scalable: true,
    defaultProps: {
      radius: 40,
      height: 80,
    }
  },
];