import { Parcel, Zone, Crop } from './types';

export const mockParcels: Parcel[] = [
  {
    uuid: 'parcel-1',
    name: 'Potager Nord',
    width: 100,
    height: 50,
    zones: []
  },
  {
    uuid: 'parcel-2',
    name: 'Potager Sud',
    width: 80,
    height: 60,
    zones: []
  },
  {
    uuid: 'parcel-3',
    name: 'Serre',
    width: 40,
    height: 20,
    zones: []
  }
];

export const mockZones: Zone[] = [
  // Potager Nord zones
  {
    uuid: 'zone-1-1',
    name: 'Zone A',
    parcelUuid: 'parcel-1',
    width: 30,
    height: 50,
    positionX: 0,
    positionY: 0
  },
  {
    uuid: 'zone-1-2',
    name: 'Zone B',
    parcelUuid: 'parcel-1',
    width: 30,
    height: 50,
    positionX: 35,
    positionY: 0
  },
  {
    uuid: 'zone-1-3',
    name: 'Zone C',
    parcelUuid: 'parcel-1',
    width: 30,
    height: 50,
    positionX: 70,
    positionY: 0
  },
  // Potager Sud zones
  {
    uuid: 'zone-2-1',
    name: 'Rang 1',
    parcelUuid: 'parcel-2',
    width: 80,
    height: 15,
    positionX: 0,
    positionY: 0
  },
  {
    uuid: 'zone-2-2',
    name: 'Rang 2',
    parcelUuid: 'parcel-2',
    width: 80,
    height: 15,
    positionX: 0,
    positionY: 20
  },
  {
    uuid: 'zone-2-3',
    name: 'Rang 3',
    parcelUuid: 'parcel-2',
    width: 80,
    height: 15,
    positionX: 0,
    positionY: 40
  },
  // Serre zones
  {
    uuid: 'zone-3-1',
    name: 'Table 1',
    parcelUuid: 'parcel-3',
    width: 18,
    height: 20,
    positionX: 0,
    positionY: 0
  },
  {
    uuid: 'zone-3-2',
    name: 'Table 2',
    parcelUuid: 'parcel-3',
    width: 18,
    height: 20,
    positionX: 22,
    positionY: 0
  },
  // Empty zones - zones without crops
  {
    uuid: 'zone-1-4',
    name: 'Zone D (En repos)',
    parcelUuid: 'parcel-1',
    width: 30,
    height: 50,
    positionX: 105,
    positionY: 0
  },
  {
    uuid: 'zone-2-4',
    name: 'Rang 4 (Préparation)',
    parcelUuid: 'parcel-2',
    width: 80,
    height: 15,
    positionX: 0,
    positionY: 60
  },
  {
    uuid: 'zone-2-5',
    name: 'Rang 5 (Jachère)',
    parcelUuid: 'parcel-2',
    width: 80,
    height: 15,
    positionX: 0,
    positionY: 80
  },
  {
    uuid: 'zone-3-3',
    name: 'Table 3 (Disponible)',
    parcelUuid: 'parcel-3',
    width: 18,
    height: 20,
    positionX: 44,
    positionY: 0
  }
];

export const mockCrops: Crop[] = [
  // Potager Nord - Zone A
  {
    uuid: 'crop-1',
    name: 'Tomates',
    variety: 'Cœur de bœuf',
    family: 'Solanacées',
    color: 'bg-red-200',
    parcelUuid: 'parcel-1',
    zoneUuid: 'zone-1-1',
    sowStartWeek: 8,
    sowEndWeek: 10,
    cultureStartWeek: 12,
    cultureEndWeek: 28,
    harvestStartWeek: 26,
    harvestEndWeek: 38,
    year: 2025,
    quantity: 20
  },
  {
    uuid: 'crop-2',
    name: 'Haricots',
    variety: 'Verts nains',
    family: 'Fabacées',
    color: 'bg-green-200',
    parcelUuid: 'parcel-1',
    zoneUuid: 'zone-1-1',
    sowStartWeek: 18,
    sowEndWeek: 20,
    cultureStartWeek: 20,
    cultureEndWeek: 30,
    harvestStartWeek: 28,
    harvestEndWeek: 34,
    year: 2025,
    quantity: 50
  },
  // Potager Nord - Zone B
  {
    uuid: 'crop-3',
    name: 'Courgettes',
    variety: 'Black Beauty',
    family: 'Cucurbitacées',
    color: 'bg-yellow-200',
    parcelUuid: 'parcel-1',
    zoneUuid: 'zone-1-2',
    sowStartWeek: 14,
    sowEndWeek: 16,
    cultureStartWeek: 18,
    cultureEndWeek: 36,
    harvestStartWeek: 26,
    harvestEndWeek: 40,
    year: 2025,
    quantity: 10
  },
  // Potager Nord - Zone C
  {
    uuid: 'crop-4',
    name: 'Pommes de terre',
    variety: 'Charlotte',
    family: 'Solanacées',
    color: 'bg-amber-200',
    parcelUuid: 'parcel-1',
    zoneUuid: 'zone-1-3',
    sowStartWeek: 12,
    sowEndWeek: 14,
    cultureStartWeek: 14,
    cultureEndWeek: 32,
    harvestStartWeek: 30,
    harvestEndWeek: 34,
    year: 2025,
    quantity: 100
  },
  // Potager Sud - Rang 1
  {
    uuid: 'crop-5',
    name: 'Carottes',
    variety: 'Nantaise',
    family: 'Apiacées',
    color: 'bg-orange-200',
    parcelUuid: 'parcel-2',
    zoneUuid: 'zone-2-1',
    sowStartWeek: 10,
    sowEndWeek: 12,
    cultureStartWeek: 12,
    cultureEndWeek: 24,
    harvestStartWeek: 22,
    harvestEndWeek: 26,
    year: 2025,
    quantity: 200
  },
  {
    uuid: 'crop-6',
    name: 'Radis',
    variety: '18 jours',
    family: 'Brassicacées',
    color: 'bg-pink-200',
    parcelUuid: 'parcel-2',
    zoneUuid: 'zone-2-1',
    sowStartWeek: 8,
    sowEndWeek: 9,
    cultureStartWeek: 9,
    cultureEndWeek: 12,
    harvestStartWeek: 11,
    harvestEndWeek: 13,
    year: 2025,
    quantity: 100
  },
  // Potager Sud - Rang 2
  {
    uuid: 'crop-7',
    name: 'Salades',
    variety: 'Batavia',
    family: 'Astéracées',
    color: 'bg-lime-200',
    parcelUuid: 'parcel-2',
    zoneUuid: 'zone-2-2',
    sowStartWeek: 12,
    sowEndWeek: 14,
    cultureStartWeek: 16,
    cultureEndWeek: 24,
    harvestStartWeek: 22,
    harvestEndWeek: 26,
    year: 2025,
    quantity: 30
  },
  // Potager Sud - Rang 3
  {
    uuid: 'crop-8',
    name: 'Poireaux',
    variety: "D'hiver",
    family: 'Alliacées',
    color: 'bg-teal-200',
    parcelUuid: 'parcel-2',
    zoneUuid: 'zone-2-3',
    sowStartWeek: 6,
    sowEndWeek: 8,
    cultureStartWeek: 20,
    cultureEndWeek: 45,
    harvestStartWeek: 40,
    harvestEndWeek: 48,
    year: 2025,
    quantity: 80
  },
  // Serre - Table 1
  {
    uuid: 'crop-9',
    name: 'Tomates cerises',
    variety: 'Sweet 100',
    family: 'Solanacées',
    color: 'bg-red-300',
    parcelUuid: 'parcel-3',
    zoneUuid: 'zone-3-1',
    sowStartWeek: 6,
    sowEndWeek: 8,
    cultureStartWeek: 10,
    cultureEndWeek: 40,
    harvestStartWeek: 24,
    harvestEndWeek: 42,
    year: 2025,
    quantity: 15
  },
  // Serre - Table 2
  {
    uuid: 'crop-10',
    name: 'Aubergines',
    variety: 'Violette de Barbentane',
    family: 'Solanacées',
    color: 'bg-purple-200',
    parcelUuid: 'parcel-3',
    zoneUuid: 'zone-3-2',
    sowStartWeek: 8,
    sowEndWeek: 10,
    cultureStartWeek: 14,
    cultureEndWeek: 38,
    harvestStartWeek: 28,
    harvestEndWeek: 40,
    year: 2025,
    quantity: 12
  },
  // Late season test crop
  {
    uuid: 'crop-11',
    name: 'Mâche',
    variety: "D'hiver",
    family: 'Valérianacées',
    color: 'bg-emerald-200',
    parcelUuid: 'parcel-2',
    zoneUuid: 'zone-2-2',
    sowStartWeek: 36,
    sowEndWeek: 38,
    cultureStartWeek: 38,
    cultureEndWeek: 52,
    harvestStartWeek: 48,
    harvestEndWeek: 52,
    year: 2025,
    quantity: 40
  }
];

// Helper to attach zones to parcels
export const getParcelsWithZones = (): Parcel[] => {
  return mockParcels.map(parcel => ({
    ...parcel,
    zones: mockZones.filter(zone => zone.parcelUuid === parcel.uuid)
  }));
};