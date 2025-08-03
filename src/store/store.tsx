import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Existing reducers
import shapesReducer from './shapesSlice';
import taskReducer from './taskSlice';
import actionReducer from './actionSlice';
import projectsReducer from './slices/projectsSlice';
import inventoryReducer from './inventorySlice';
import cropsReducer from './slices/cropsSlice';
import templatesReducer from './slices/templatesSlice';
import parcelsReducer from './slices/parcelsSlice';
import gardensReducer from './slices/gardensSlice';
import uiReducer from './slices/uiSlice';

// New authentication reducers
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import roleReducer from './slices/roleSlice';
import permissionReducer from './slices/permissionSlice';
import profileReducer from './slices/profileSlice';

// Companion plant management reducers
import companionReducer from './slices/companionSlice';
import plantReducer from './slices/plantSlice';
import companionInventoryReducer from './slices/inventorySlice';

// GoodPal AI Agent reducer
import goodpalReducer from '../components/goodpal/store/GoodPalSlice';

// Studio+ Parcels reducer
import studioPlusParcelsReducer from './parcelsSlice';

// Studio+ Canvas Positioning reducer
import canvasPositioningReducer from './slices/canvasPositioningSlice';

// Plots reducer
import plotsReducer from './slices/plotsSlice';

// Tours reducer
import tourReducer from './slices/tourSlice';

// Custom middleware to handle API errors
const errorMiddleware = () => (next: any) => (action: any) => {
  // Check if the action is a rejected action from createAsyncThunk
  if (action.type.endsWith('/rejected')) {
    // Log the error for debugging
    console.error('API Error:', action.error);
    
    // You can add global error handling here
    // For example, showing a global notification for network errors
    if (action.error.name === 'NetworkError') {
      console.error('Network Error');
    }
  }
  return next(action);
};

// Configure persist options
const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    // Existing persisted slices
    'crops', 
    'templates', 
    'parcels', 
    'gardens', 
    'tasks', 
    'actions', 
    'projects', 
    'inventory',
    // New persisted slices
    'auth',
    'profile',
    // Companion management slices
    'companions',
    'plants',
    'companionInventory',
    // Studio+ slices
    'studioPlusParcels',
    'canvasPositioning',
    // Tours slice (user progress and settings)
    'tours'
  ], 
  blacklist: [
    'ui', // Never persist UI state
    'users', // Don't persist users list (fetch fresh)
    'roles', // Don't persist roles (fetch fresh)
    'permissions', // Don't persist permissions (fetch fresh)
    'goodpal' // Don't persist chat state (always start fresh)
  ],
  // 🆕 Add transform to optimize large arrays and fix state corruption
  transforms: [
    // Transform to limit the size of arrays being persisted and fix corruption
    {
      in: (inboundState: any, key: string) => {
        // Limit the size of large arrays to prevent performance issues
        if (key === 'crops' && inboundState?.items?.length > 1000) {
          return {
            ...inboundState,
            items: inboundState.items.slice(-1000) // Keep only the last 1000 items
          };
        }
        return inboundState;
      },
      out: (outboundState: any, key: string) => {
        // Fix inventory state corruption during rehydration
        if (key === 'inventory' && outboundState) {
          return {
            ...outboundState,
            items: Array.isArray(outboundState.items) ? outboundState.items : [],
            loading: false,
            error: null
          };
        }
        
        // Fix studioPlusParcels state corruption during rehydration
        if (key === 'studioPlusParcels' && outboundState) {
          return {
            ...outboundState,
            parcels: Array.isArray(outboundState.parcels) ? outboundState.parcels : [],
            zones: outboundState.zones || {},
            crops: outboundState.crops || {},
            searchResults: outboundState.searchResults || {
              parcels: [],
              zones: [],
              crops: [],
              totalCount: 0
            },
            loading: false,
            error: null
          };
        }
        
        // Fix canvasPositioning state corruption during rehydration
        if (key === 'canvasPositioning' && outboundState) {
          return {
            ...outboundState,
            project: outboundState.project || null,
            parcels: Array.isArray(outboundState.parcels) ? outboundState.parcels : [],
            zones: outboundState.zones || {},
            crops: outboundState.crops || {},
            loading: outboundState.loading || {
              project: false,
              parcels: false,
              zones: false,
              crops: false,
              positioning: false,
              complete: false,
            },
            errors: outboundState.errors || {
              project: null,
              parcels: null,
              zones: null,
              crops: null,
              positioning: null,
            },
            ui: outboundState.ui || {
              selectedParcel: null,
              selectedZone: null,
              selectedCrop: null,
              isDragging: false,
              dragType: null,
              highlightedZones: [],
              showUnpositioned: true,
            },
            canvas: outboundState.canvas || {
              scale: 1.0,
              panX: 0,
              panY: 0,
              gridVisible: true,
              snapToGrid: true,
              metricUnit: 'meter',
            },
          };
        }
        
        return outboundState;
      },
    }
  ]
};

const rootReducer = combineReducers({
  // Existing reducers
  crops: cropsReducer,
  templates: templatesReducer,
  parcels: parcelsReducer,
  gardens: gardensReducer,
  shapes: shapesReducer,
  ui: uiReducer,
  tasks: taskReducer,
  actions: actionReducer,
  projects: projectsReducer,
  inventory: inventoryReducer,
  
  // New authentication reducers
  auth: authReducer,
  users: userReducer,
  roles: roleReducer,
  permissions: permissionReducer,
  profile: profileReducer,
  
  // Companion plant management reducers
  companions: companionReducer,
  plants: plantReducer,
  companionInventory: companionInventoryReducer,
  
  // GoodPal AI Agent
  goodpal: goodpalReducer,
  
  // Studio+ Parcels
  studioPlusParcels: studioPlusParcelsReducer,
  
  // Studio+ Canvas Positioning
  canvasPositioning: canvasPositioningReducer,
  
  // Plots
  plots: plotsReducer,
  
  // Tours
  tours: tourReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: process.env.NODE_ENV === 'production' ? false : {
        // Ignore these action types for redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // 🆕 Ignore certain paths that might contain non-serializable data
        ignoredPaths: [
          'register', 
          'rehydrate',
          // Ignore large arrays that might contain functions or non-serializable data
          'crops.items',
          'templates.items',
          'parcels.items',
          'projects.items',
          'inventory.items',
          'companions.items',
          'plants.items',
          'tasks.items',
          'actions.items'
        ],
        // 🆕 Increase warning threshold to prevent performance warnings
        warnAfter: 256, // Increased even more to reduce warnings
      },
      // 🆕 Configure immutableCheck to handle large states
      immutableCheck: process.env.NODE_ENV === 'production' ? false : {
        warnAfter: 256, // Increase from default 32ms to 256ms
        // Ignore paths with large arrays that cause performance issues
        ignoredPaths: [
          'crops.items',
          'templates.items', 
          'parcels.items',
          'projects.items',
          'inventory.items',
          'shapes.items',
          'tasks.items',
          'companions.items',
          'plants.items',
          'actions.items'
        ],
      },
      // 🆕 Add actionCreatorCheck configuration
      actionCreatorCheck: {},
    }).concat(errorMiddleware),
  // 🆕 Optimize devTools for production
  devTools: process.env.NODE_ENV !== 'production' ? {
    maxAge: 50, // Limit the number of actions stored in devtools
    trace: false, // Disable action stack traces for better performance
    traceLimit: 25,
  } : false,
});

export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;