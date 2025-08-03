// Mock data for the Enhanced Parcel Zone Crops prototype
import type { DroppedGarden } from './types';

// Enhanced mock data with proper hierarchical proportions - Russian nesting dolls style
export const mockCanvasObjects = {
  garden: {
    id: 'garden-1',
    name: 'Main Garden Area',
    type: 'garden' as const,
    x: 50,
    y: 80,
    width: 1200,
    height: 500,
    widthMeters: 30,
    heightMeters: 12.5,
    parcels: [{
      id: 'parcel-1',
      name: 'Vegetable Garden',
      type: 'parcel' as const,
      x: 80,  // 30px padding from garden
      y: 120, // 40px padding from garden (space for garden header)
      width: 1140, // garden width - 60px padding
      height: 420, // garden height - 80px padding
      area: 357.5,
      zones: [
        {
          id: 'zone-1',
          name: 'Root Vegetables',
          type: 'zone' as const,
          x: 110,  // 30px padding from parcel
          y: 160,  // 40px padding from parcel (space for parcel header)
          width: 540,  // roughly half parcel width - padding
          height: 340, // parcel height - 80px padding
          area: 183.6,
          crops: [
            {
              id: 'crop-1',
              name: 'Tomatoes',
              type: 'crop' as const,
              x: 130,  // 20px padding from zone
              y: 220,  // 40px padding from zone (space for zone header)
              width: 120, // much smaller, just enough for label
              height: 70, // much smaller, just enough for label
              variety: 'Cherry',
              plantingDate: '2024-03-15',
              status: 'healthy',
              health: 95,
              growth: 78,
              quantity: 12
            },
            {
              id: 'crop-2',
              name: 'Carrots',
              type: 'crop' as const,
              x: 270,  // next to crop-1 with 20px spacing
              y: 220,
              width: 120,
              height: 70,
              variety: 'Orange',
              plantingDate: '2024-03-20',
              status: 'needs-attention',
              health: 65,
              growth: 45,
              quantity: 24
            },
            {
              id: 'crop-3',
              name: 'Potatoes',
              type: 'crop' as const,
              x: 410,
              y: 220,
              width: 120,
              height: 70,
              variety: 'Russet',
              plantingDate: '2024-03-10',
              status: 'healthy',
              health: 88,
              growth: 65,
              quantity: 18
            },
            {
              id: 'crop-4',
              name: 'Onions',
              type: 'crop' as const,
              x: 130,
              y: 310,  // below crop-1 with 20px spacing
              width: 120,
              height: 70,
              variety: 'Yellow',
              plantingDate: '2024-04-05',
              status: 'healthy',
              health: 82,
              growth: 55,
              quantity: 30
            },
            {
              id: 'crop-9',
              name: 'Beets',
              type: 'crop' as const,
              x: 270,
              y: 310,
              width: 120,
              height: 70,
              variety: 'Red',
              plantingDate: '2024-04-10',
              status: 'healthy',
              health: 78,
              growth: 42,
              quantity: 16
            },
            {
              id: 'crop-10',
              name: 'Radish',
              type: 'crop' as const,
              x: 410,
              y: 310,
              width: 120,
              height: 70,
              variety: 'Cherry Belle',
              plantingDate: '2024-04-12',
              status: 'ready-harvest',
              health: 92,
              growth: 100,
              quantity: 20
            }
          ]
        },
        {
          id: 'zone-2',
          name: 'Leafy Greens',
          type: 'zone' as const,
          x: 670,  // next to zone-1 with 20px spacing
          y: 160,
          width: 520,  // remaining parcel width - padding
          height: 340,
          area: 176.8,
          crops: [
            {
              id: 'crop-5',
              name: 'Lettuce',
              type: 'crop' as const,
              x: 690,  // 20px padding from zone (670 + 20)
              y: 220,  // 30px padding from zone (160 + 30)
              width: 120,
              height: 70,
              variety: 'Romaine',
              plantingDate: '2024-04-01',
              status: 'ready-harvest',
              health: 88,
              growth: 100,
              quantity: 8
            },
            {
              id: 'crop-6',
              name: 'Spinach',
              type: 'crop' as const,
              x: 830,  // next to crop-5 with 20px spacing (690 + 120 + 20)
              y: 220,
              width: 120,
              height: 70,
              variety: 'Baby Leaf',
              plantingDate: '2024-04-15',
              status: 'healthy',
              health: 82,
              growth: 55,
              quantity: 6
            },
            {
              id: 'crop-7',
              name: 'Kale',
              type: 'crop' as const,
              x: 970,  // next to crop-6 with 20px spacing (830 + 120 + 20)
              y: 220,
              width: 120,
              height: 70,
              variety: 'Curly',
              plantingDate: '2024-04-12',
              status: 'healthy',
              health: 90,
              growth: 60,
              quantity: 5
            },
            {
              id: 'crop-8',
              name: 'Swiss Chard',
              type: 'crop' as const,
              x: 690,
              y: 310,  // below crop-5 with 20px spacing (190 + 70 + 20)
              width: 120,
              height: 70,
              variety: 'Rainbow',
              plantingDate: '2024-04-08',
              status: 'ready-harvest',
              health: 95,
              growth: 100,
              quantity: 4
            },
            {
              id: 'crop-11',
              name: 'Arugula',
              type: 'crop' as const,
              x: 830,
              y: 310,  // below crop-6 with 20px spacing
              width: 120,
              height: 70,
              variety: 'Wild',
              plantingDate: '2024-04-18',
              status: 'healthy',
              health: 85,
              growth: 38,
              quantity: 12
            },
            {
              id: 'crop-12',
              name: 'Cabbage',
              type: 'crop' as const,
              x: 970,
              y: 310,  // below crop-7 with 20px spacing
              width: 120,
              height: 70,
              variety: 'Green',
              plantingDate: '2024-03-25',
              status: 'healthy',
              health: 91,
              growth: 72,
              quantity: 3
            }
          ]
        }
    ]
      }]
  } as DroppedGarden
};