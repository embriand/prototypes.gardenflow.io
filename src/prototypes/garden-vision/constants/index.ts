export const CAMERA_SETTINGS = {
  RESOLUTIONS: {
    LOW: { width: 640, height: 480 },
    MEDIUM: { width: 1280, height: 720 },
    HIGH: { width: 1920, height: 1080 }
  },
  FACING_MODES: {
    USER: 'user' as const,
    ENVIRONMENT: 'environment' as const
  }
} as const;

export const GRID_CONFIG = {
  SIZE: 20,
  CELL_SIZE: {
    WIDTH: 500,
    HEIGHT: 400
  }
} as const;

export const ITEM_TYPES = {
  PARCEL: 'parcel' as const,
  ZONE: 'zone' as const,
  FRUIT: 'fruit' as const,
  VEGETABLE: 'vegetable' as const,
  TREE: 'tree' as const
} as const;

export const COLORS = {
  PARCEL: '#3B82F6',
  ZONE: '#8B5CF6',
  FRUIT: '#EF4444',
  VEGETABLE: '#F59E0B',
  TREE: '#10B981'
} as const;

export const PROCESSING_CONFIG = {
  MOCK_DELAY: 2000,
  IMAGE_QUALITY: 0.9,
  MAX_RETRIES: 3
} as const;

export const CAMERA_DEFAULTS = {
  facingMode: CAMERA_SETTINGS.FACING_MODES.ENVIRONMENT,
  resolution: 'medium' as const,
  autoFocus: true,
  flash: false
} as const;