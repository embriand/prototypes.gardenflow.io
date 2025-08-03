import { configureStore } from '@reduxjs/toolkit';

// Only import what CanvasViewer needs
import shapesReducer from './shapesSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    shapes: shapesReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;