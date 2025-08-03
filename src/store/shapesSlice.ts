import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Shape } from '../types/shapes';

interface ShapesState {
  items: Shape[];
  selectedShape: Shape | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  history: Shape[][];
  historyIndex: number;
}

const initialState: ShapesState = {
  items: [],
  selectedShape: null,
  status: 'idle',
  error: null,
  history: [],
  historyIndex: -1,
};

export const shapesSlice = createSlice({
  name: 'shapes',
  initialState,
  reducers: {
    setSelectedShape: (state, action: PayloadAction<Shape | null>) => {
      state.selectedShape = action.payload;
    },
    updateShape: (state, action: PayloadAction<Shape>) => {
      const index = state.items.findIndex(shape => shape.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        state.selectedShape = action.payload;
      }
    },
    addShape: (state, action: PayloadAction<Shape>) => {
      state.items.push(action.payload);
      // Add to history
      state.history = [...state.history.slice(0, state.historyIndex + 1), [...state.items]];
      state.historyIndex = state.history.length - 1;
    },
    removeShape: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(shape => shape.id !== action.payload);
      if (state.selectedShape?.id === action.payload) {
        state.selectedShape = null;
      }
      // Add to history
      state.history = [...state.history.slice(0, state.historyIndex + 1), [...state.items]];
      state.historyIndex = state.history.length - 1;
    },
    addToHistory: (state) => {
      state.history = [...state.history.slice(0, state.historyIndex + 1), [...state.items]];
      state.historyIndex = state.history.length - 1;
    },
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex--;
        state.items = [...state.history[state.historyIndex]];
        // Clear selection when undoing
        state.selectedShape = null;
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        state.items = [...state.history[state.historyIndex]];
        // Clear selection when redoing
        state.selectedShape = null;
      }
    },
  },
});

export const {
  setSelectedShape,
  updateShape,
  addShape,
  removeShape,
  addToHistory,
  undo,
  redo,
} = shapesSlice.actions;

export default shapesSlice.reducer;