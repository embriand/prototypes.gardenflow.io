import { 
  TreePine, TreeDeciduous, Sprout, Apple, Banana, Grape, 
  Carrot, Fish, Beef, Salad, Armchair, Lamp, Sofa, Table2
} from 'lucide-react';
import { Item } from './types';

export const fruitData: Item[] = [
  { 
    id: 6, 
    name: 'Apple', 
    icon: Apple, 
    description: 'Fresh red apple', 
    category: 'fruit',
    hasNotification: false, 
    isVisible: true,
    properties: { condition: 'Good', age: 'XX years', height: 'Xm', care: 'Regular' } 
  },
  { 
    id: 7, 
    name: 'Banana', 
    icon: Banana, 
    description: 'Yellow banana bunch', 
    category: 'fruit',
    hasNotification: false, 
    isVisible: true,
    properties: { condition: 'Good', age: 'XX years', height: 'Xm', care: 'Regular' } 
  },
  { 
    id: 8, 
    name: 'Grape', 
    icon: Grape, 
    description: 'Purple grape cluster', 
    category: 'fruit',
    hasNotification: false, 
    isVisible: true,
    properties: { condition: 'Good', age: 'XX years', height: 'Xm', care: 'Regular' } 
  }
];

export const treeData: Item[] = [
  { 
    id: 1, 
    name: 'Pine Tree', 
    icon: TreePine, 
    description: 'Tall evergreen conifer', 
    category: 'tree',
    hasNotification: true, 
    isVisible: true,
    properties: { condition: 'Good', age: 'XX years', height: 'Xm', care: 'Regular' } 
  },
  { 
    id: 2, 
    name: 'Oak Tree', 
    icon: TreeDeciduous, 
    description: 'Mighty deciduous tree', 
    category: 'tree',
    hasNotification: false, 
    isVisible: true,
    properties: { condition: 'Good', age: 'XX years', height: 'Xm', care: 'Regular' } 
  },
  { 
    id: 3, 
    name: 'Maple Tree', 
    icon: TreeDeciduous, 
    description: 'Beautiful autumn colors', 
    category: 'tree',
    hasNotification: false, 
    isVisible: true,
    properties: { condition: 'Good', age: 'XX years', height: 'Xm', care: 'Regular' } 
  },
  { 
    id: 4, 
    name: 'Young Tree', 
    icon: Sprout, 
    description: 'Young growing tree', 
    category: 'tree',
    hasNotification: false, 
    isVisible: true,
    properties: { condition: 'Good', age: 'XX years', height: 'Xm', care: 'Regular' } 
  },
  { 
    id: 5, 
    name: 'Forest Tree', 
    icon: TreePine, 
    description: 'Dense forest tree', 
    category: 'tree',
    hasNotification: false, 
    isVisible: true,
    properties: { condition: 'Good', age: 'XX years', height: 'Xm', care: 'Regular' } 
  }
];

export const vegetableData: Item[] = [
  { 
    id: 9, 
    name: 'Carrot', 
    icon: Carrot, 
    description: 'Orange root vegetable', 
    category: 'vegetable',
    hasNotification: false, 
    isVisible: true,
    properties: { condition: 'Good', age: 'XX years', height: 'Xm', care: 'Regular' } 
  },
  { 
    id: 10, 
    name: 'Fish', 
    icon: Fish, 
    description: 'Fresh fish', 
    category: 'vegetable',
    hasNotification: false, 
    isVisible: true,
    properties: { condition: 'Good', age: 'XX years', height: 'Xm', care: 'Regular' } 
  },
  { 
    id: 11, 
    name: 'Beef', 
    icon: Beef, 
    description: 'Fresh meat', 
    category: 'vegetable',
    hasNotification: false, 
    isVisible: true,
    properties: { condition: 'Good', age: 'XX years', height: 'Xm', care: 'Regular' } 
  },
  { 
    id: 12, 
    name: 'Salad', 
    icon: Salad, 
    description: 'Green salad mix', 
    category: 'vegetable',
    hasNotification: false, 
    isVisible: true,
    properties: { condition: 'Good', age: 'XX years', height: 'Xm', care: 'Regular' } 
  }
];

export const furnitureData: Item[] = [
  { 
    id: 13, 
    name: 'Chair', 
    icon: Armchair, 
    description: 'Comfortable armchair', 
    category: 'furniture',
    hasNotification: false, 
    isVisible: true,
    properties: { condition: 'Good', age: 'XX years', height: 'Xm', care: 'Regular' } 
  },
  { 
    id: 14, 
    name: 'Lamp', 
    icon: Lamp, 
    description: 'Modern lamp', 
    category: 'furniture',
    hasNotification: false, 
    isVisible: true,
    properties: { condition: 'Good', age: 'XX years', height: 'Xm', care: 'Regular' } 
  },
  { 
    id: 15, 
    name: 'Sofa', 
    icon: Sofa, 
    description: 'Cozy sofa', 
    category: 'furniture',
    hasNotification: false, 
    isVisible: true,
    properties: { condition: 'Good', age: 'XX years', height: 'Xm', care: 'Regular' } 
  },
  { 
    id: 16, 
    name: 'Table', 
    icon: Table2, 
    description: 'Dining table', 
    category: 'furniture',
    hasNotification: false, 
    isVisible: true,
    properties: { condition: 'Good', age: 'XX years', height: 'Xm', care: 'Regular' } 
  }
];

export const allItems = [...treeData, ...fruitData, ...vegetableData, ...furnitureData];

export const getCategoryColor = (category: Item['category']): string => {
  switch (category) {
    case 'tree':
      return 'bg-emerald-500';
    case 'fruit':
      return 'bg-red-500';
    case 'vegetable':
      return 'bg-orange-500';
    case 'furniture':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};