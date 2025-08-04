import { useState, useCallback, useEffect } from 'react';

// Interfaces
import type { GardenBox, GardenStats, SavedLayout, LayoutDirection } from '../models';

const TOTAL_AREA = 400; // m²
const GARDEN_WIDTH = 20; // 20m width
const GARDEN_LENGTH = 20; // 20m length (20 x 20 = 400m²)
const MAX_BOX_WIDTH = 0.8; // 80 cm max per row
const MIN_BOX_WIDTH = 0.6; // 60 cm min per row
const PATH_WIDTH = 0.5; // 50 cm paths
const MIN_BOX_LENGTH = 1.5; // 1.5m minimum length
const MAX_BOX_LENGTH = 2.5; // 2.5m maximum length
const STORAGE_KEY = 'garden-layouts';

export const useGardenOptimizer = () => {
  const [boxes, setBoxes] = useState<GardenBox[]>([]);
  const [stats, setStats] = useState<GardenStats>({
    cultivatedArea: 0,
    pathArea: 0,
    boxCount: 0,
    freeArea: TOTAL_AREA
  });
  const [bestLayout, setBestLayout] = useState<GardenStats | null>(null);
  const [isOptimal, setIsOptimal] = useState(false);
  const [direction, setDirection] = useState<LayoutDirection>('horizontal');
  const [savedLayouts, setSavedLayouts] = useState<SavedLayout[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSavedLayouts(JSON.parse(stored));
    }
  }, []);

  const calculateLayout = () => {
    const newBoxes: GardenBox[] = [];
    let cultivatedArea = 0;
    let pathArea = 0;

    // Use fixed dimensions based on direction
    const mainLength = direction === 'horizontal' ? GARDEN_LENGTH : GARDEN_WIDTH;
    const crossLength = direction === 'horizontal' ? GARDEN_WIDTH : GARDEN_LENGTH;

    let currentMain = PATH_WIDTH; // Start position on main axis
    let currentCross = PATH_WIDTH; // Start position on cross axis

    while (currentCross + PATH_WIDTH <= crossLength) {
      currentMain = PATH_WIDTH; // Reset main axis position for new row/column
      
      // Calculate optimal box width for this row/column
      const boxWidth = Math.max(
        MIN_BOX_WIDTH,
        Math.min(MAX_BOX_WIDTH, MIN_BOX_WIDTH + Math.random() * 0.2)
      );

      while (currentMain + boxWidth + PATH_WIDTH <= mainLength) {
        // Calculate optimal box length for available space
        const maxPossibleLength = Math.min(
          MAX_BOX_LENGTH,
          crossLength - currentCross - PATH_WIDTH
        );
        
        const boxLength = Math.max(
          MIN_BOX_LENGTH,
          Math.min(maxPossibleLength, MIN_BOX_LENGTH + Math.random() * 1)
        );

        const box: GardenBox = {
          id: Date.now() + newBoxes.length,
          x: direction === 'horizontal' ? currentMain : currentCross,
          y: direction === 'horizontal' ? currentCross : currentMain,
          width: direction === 'horizontal' ? boxWidth : boxLength,
          length: direction === 'horizontal' ? boxLength : boxWidth
        };

        const boxArea = boxWidth * boxLength;
        const pathAroundBox = (2 * boxWidth + 2 * boxLength) * PATH_WIDTH;

        cultivatedArea += boxArea;
        pathArea += pathAroundBox;

        newBoxes.push(box);
        currentMain += boxWidth + PATH_WIDTH;
      }

      currentCross += (direction === 'horizontal' ? MAX_BOX_LENGTH : MAX_BOX_WIDTH) + PATH_WIDTH;
    }

    const freeArea = TOTAL_AREA - (cultivatedArea + pathArea);
    const efficiency = cultivatedArea / (cultivatedArea + pathArea);
    
    const currentStats = {
      cultivatedArea,
      pathArea,
      boxCount: newBoxes.length,
      freeArea
    };

    // Update best layout if current layout is more efficient
    if (!bestLayout || efficiency > (bestLayout.cultivatedArea / (bestLayout.cultivatedArea + bestLayout.pathArea))) {
      setBestLayout(currentStats);
      setIsOptimal(true);
    } else {
      setIsOptimal(false);
    }

    return { boxes: newBoxes, stats: currentStats };
  };

  const createOptimizedLayout = useCallback(() => {
    const { boxes: newBoxes, stats: newStats } = calculateLayout();
    setBoxes(newBoxes);
    setStats(newStats);
  }, [direction]);

  const saveCurrentLayout = useCallback(() => {
    const timestamp = new Date().toISOString();
    const newLayout: SavedLayout = {
      id: timestamp,
      name: `Layout ${savedLayouts.length + 1}`,
      direction,
      boxes,
      stats,
      timestamp
    };

    const updatedLayouts = [...savedLayouts, newLayout];
    setSavedLayouts(updatedLayouts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLayouts));
  }, [boxes, stats, direction, savedLayouts]);

  const loadLayout = useCallback((layoutId: string) => {
    const layout = savedLayouts.find(l => l.id === layoutId);
    if (layout) {
      setBoxes(layout.boxes);
      setStats(layout.stats);
      setDirection(layout.direction);
    }
  }, [savedLayouts]);

  const toggleDirection = useCallback(() => {
    setDirection(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
  }, []);

  return {
    boxes,
    stats,
    bestLayout,
    createOptimizedLayout,
    isOptimal,
    direction,
    toggleDirection,
    savedLayouts,
    saveCurrentLayout,
    loadLayout
  };
};