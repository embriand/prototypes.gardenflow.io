import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Shape } from '../types';

// State interface
interface CanvasState {
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

// Actions
type CanvasAction =
  | { type: 'ADD_SHAPE'; payload: Shape }
  | { type: 'REMOVE_SHAPE'; payload: string }
  | { type: 'SET_SELECTED_SHAPE'; payload: Shape | null }
  | { type: 'UPDATE_SHAPE'; payload: Shape }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'ADD_TO_HISTORY' }
  | { type: 'SET_VIEW_MODE'; payload: string }
  | { type: 'TOGGLE_GRID' }
  | { type: 'TOGGLE_SNAP_TO_GRID' }
  | { type: 'TOGGLE_TOOLBOX' }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'SET_ZOOM'; payload: number };

// Initial state
const initialState: CanvasState = {
  shapes: {
    items: [],
    selectedShape: null,
    history: [[]],
    historyIndex: 0,
  },
  ui: {
    viewMode: 'design',
    zoom: 1,
    showGrid: true,
    snapToGrid: true,
    isToolboxOpen: true,
    activeTab: 'shapes',
  },
};

// Reducer
function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {
    case 'ADD_SHAPE':
      return {
        ...state,
        shapes: {
          ...state.shapes,
          items: [...state.shapes.items, action.payload],
        },
      };
    
    case 'REMOVE_SHAPE':
      return {
        ...state,
        shapes: {
          ...state.shapes,
          items: state.shapes.items.filter(shape => shape.id !== action.payload),
          selectedShape: state.shapes.selectedShape?.id === action.payload ? null : state.shapes.selectedShape,
        },
      };
    
    case 'SET_SELECTED_SHAPE':
      return {
        ...state,
        shapes: {
          ...state.shapes,
          selectedShape: action.payload,
        },
      };
    
    case 'UPDATE_SHAPE':
      const updatedItems = state.shapes.items.map(shape =>
        shape.id === action.payload.id ? action.payload : shape
      );
      return {
        ...state,
        shapes: {
          ...state.shapes,
          items: updatedItems,
          selectedShape: state.shapes.selectedShape?.id === action.payload.id ? action.payload : state.shapes.selectedShape,
        },
      };
    
    case 'UNDO':
      if (state.shapes.historyIndex > 0) {
        const newIndex = state.shapes.historyIndex - 1;
        return {
          ...state,
          shapes: {
            ...state.shapes,
            historyIndex: newIndex,
            items: [...state.shapes.history[newIndex]],
          },
        };
      }
      return state;
    
    case 'REDO':
      if (state.shapes.historyIndex < state.shapes.history.length - 1) {
        const newIndex = state.shapes.historyIndex + 1;
        return {
          ...state,
          shapes: {
            ...state.shapes,
            historyIndex: newIndex,
            items: [...state.shapes.history[newIndex]],
          },
        };
      }
      return state;
    
    case 'ADD_TO_HISTORY':
      const newHistory = state.shapes.history.slice(0, state.shapes.historyIndex + 1);
      newHistory.push([...state.shapes.items]);
      return {
        ...state,
        shapes: {
          ...state.shapes,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        },
      };
    
    case 'SET_VIEW_MODE':
      return {
        ...state,
        ui: {
          ...state.ui,
          viewMode: action.payload,
        },
      };
    
    case 'TOGGLE_GRID':
      return {
        ...state,
        ui: {
          ...state.ui,
          showGrid: !state.ui.showGrid,
        },
      };
    
    case 'TOGGLE_SNAP_TO_GRID':
      return {
        ...state,
        ui: {
          ...state.ui,
          snapToGrid: !state.ui.snapToGrid,
        },
      };
    
    case 'TOGGLE_TOOLBOX':
      return {
        ...state,
        ui: {
          ...state.ui,
          isToolboxOpen: !state.ui.isToolboxOpen,
        },
      };
    
    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        ui: {
          ...state.ui,
          activeTab: action.payload,
        },
      };
    
    case 'SET_ZOOM':
      return {
        ...state,
        ui: {
          ...state.ui,
          zoom: action.payload,
        },
      };
    
    default:
      return state;
  }
}

// Context
const CanvasContext = createContext<{
  state: CanvasState;
  dispatch: React.Dispatch<CanvasAction>;
} | null>(null);

// Provider component
export const CanvasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(canvasReducer, initialState);

  return (
    <CanvasContext.Provider value={{ state, dispatch }}>
      {children}
    </CanvasContext.Provider>
  );
};

// Custom hook
export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
};

// Action creators (for convenience)
export const canvasActions = {
  addShape: (shape: Shape) => ({ type: 'ADD_SHAPE' as const, payload: shape }),
  removeShape: (id: string) => ({ type: 'REMOVE_SHAPE' as const, payload: id }),
  setSelectedShape: (shape: Shape | null) => ({ type: 'SET_SELECTED_SHAPE' as const, payload: shape }),
  updateShape: (shape: Shape) => ({ type: 'UPDATE_SHAPE' as const, payload: shape }),
  undo: () => ({ type: 'UNDO' as const }),
  redo: () => ({ type: 'REDO' as const }),
  addToHistory: () => ({ type: 'ADD_TO_HISTORY' as const }),
  setViewMode: (mode: string) => ({ type: 'SET_VIEW_MODE' as const, payload: mode }),
  toggleGrid: () => ({ type: 'TOGGLE_GRID' as const }),
  toggleSnapToGrid: () => ({ type: 'TOGGLE_SNAP_TO_GRID' as const }),
  toggleToolbox: () => ({ type: 'TOGGLE_TOOLBOX' as const }),
  setActiveTab: (tab: string) => ({ type: 'SET_ACTIVE_TAB' as const, payload: tab }),
  setZoom: (zoom: number) => ({ type: 'SET_ZOOM' as const, payload: zoom }),
};