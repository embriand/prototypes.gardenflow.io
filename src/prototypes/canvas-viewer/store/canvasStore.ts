import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';
import { Shape } from '../types';

// Shapes slice
interface ShapesState {
  items: Shape[];
  selectedShape: Shape | null;
  history: Shape[][];
  historyIndex: number;
}

const initialShapesState: ShapesState = {
  items: [],
  selectedShape: null,
  history: [[]],
  historyIndex: 0,
};

const shapesSlice = createSlice({
  name: 'shapes',
  initialState: initialShapesState,
  reducers: {
    addShape: (state, action: PayloadAction<Shape>) => {
      state.items.push(action.payload);
    },
    removeShape: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(shape => shape.id !== action.payload);
      if (state.selectedShape?.id === action.payload) {
        state.selectedShape = null;
      }
    },
    setSelectedShape: (state, action: PayloadAction<Shape | null>) => {
      state.selectedShape = action.payload;
    },
    updateShape: (state, action: PayloadAction<Shape>) => {
      const index = state.items.findIndex(shape => shape.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        if (state.selectedShape?.id === action.payload.id) {
          state.selectedShape = action.payload;
        }
      }
    },
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex -= 1;
        state.items = [...state.history[state.historyIndex]];
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex += 1;
        state.items = [...state.history[state.historyIndex]];
      }
    },
    addToHistory: (state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push([...state.items]);
      state.history = newHistory;
      state.historyIndex = newHistory.length - 1;
    },
  },
});

// UI slice
interface UIState {
  viewMode: string;
  zoom: number;
  showGrid: boolean;
  snapToGrid: boolean;
  isToolboxOpen: boolean;
  activeTab: string;
}

const initialUIState: UIState = {
  viewMode: 'design',
  zoom: 1,
  showGrid: true,
  snapToGrid: true,
  isToolboxOpen: true,
  activeTab: 'shapes',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState: initialUIState,
  reducers: {
    setViewMode: (state, action: PayloadAction<string>) => {
      state.viewMode = action.payload;
    },
    toggleGrid: (state) => {
      state.showGrid = !state.showGrid;
    },
    toggleSnapToGrid: (state) => {
      state.snapToGrid = !state.snapToGrid;
    },
    toggleToolbox: (state) => {
      state.isToolboxOpen = !state.isToolboxOpen;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
  },
});

// Export actions
export const { addShape, removeShape, setSelectedShape, updateShape, undo, redo } = shapesSlice.actions;
export const { setViewMode, toggleGrid, toggleSnapToGrid, toggleToolbox, setActiveTab, setZoom } = uiSlice.actions;

// Create store
export const canvasStore = configureStore({
  reducer: {
    shapes: shapesSlice.reducer,
    ui: uiSlice.reducer,
  },
});

export type RootState = ReturnType<typeof canvasStore.getState>;
export type AppDispatch = typeof canvasStore.dispatch;