import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ProductItem } from '../../models';

interface UIState {
  view: 'gantt' | 'calendar';
  currentYear: number;
  selectedFamily: string | null;
  selectedParcel: string | null;
  searchTerm: string;
  showFilters: boolean;
  showAddForm: boolean;
  showInventory: boolean;
  showCompanionDialog: boolean;
  showRotationDialog: boolean;
  showHarvestTracker: boolean;
  selectedCrop: ProductItem | null;
  isEditing: boolean;
  showMultipleCropsView: boolean;
  showWeekNumbers: boolean;

  viewMode: '2d' | '3d' | 'flat';
  zoom: number;
  showGrid: boolean;
  snapToGrid: boolean;
  isToolboxOpen: boolean;
  activeTab: string;
}

const initialState: UIState = {
  view: 'gantt',
  currentYear: new Date().getFullYear(),
  selectedFamily: null,
  selectedParcel: null,
  searchTerm: '',
  showFilters: false,
  showAddForm: false,
  showInventory: false,
  showCompanionDialog: false,
  showRotationDialog: false,
  showHarvestTracker: false,
  selectedCrop: null,
  isEditing: false,
  showMultipleCropsView: false,
  showWeekNumbers: true,

  viewMode: 'flat',
  zoom: 1,
  showGrid: true,
  snapToGrid: true,
  isToolboxOpen: true,
  activeTab: 'shapes',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {

    setViewMode: (state, action: PayloadAction<'2d' | '3d' | 'flat'>) => {
      state.viewMode = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
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

    setView: (state, action: PayloadAction<'gantt' | 'calendar'>) => {
      state.view = action.payload;
      // Auto-disable multiple crops view when switching to calendar
      if (action.payload === 'calendar') {
        state.showMultipleCropsView = false;
      }
    },
    setCurrentYear: (state, action: PayloadAction<number>) => {
      state.currentYear = action.payload;
    },
    setSelectedFamily: (state, action: PayloadAction<string | null>) => {
      console.log('UI Slice - Setting selected family:', action.payload);
      state.selectedFamily = action.payload;
    },
    setSelectedParcel: (state, action: PayloadAction<string | null>) => {
      console.log('UI Slice - Setting selected parcel:', action.payload);
      state.selectedParcel = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      console.log('UI Slice - Setting search term:', action.payload);
      state.searchTerm = action.payload;
    },
    toggleFilters: (state) => {
      state.showFilters = !state.showFilters;
      // Don't reset filters when closing - let user keep their selections
    },
    setShowAddForm: (state, action: PayloadAction<boolean>) => {
      state.showAddForm = action.payload;
      if (action.payload) {
        state.showInventory = false;
        state.showCompanionDialog = false;
        state.showRotationDialog = false;
        state.selectedCrop = null;
        state.isEditing = false;
      }
    },
    setShowInventory: (state, action: PayloadAction<boolean>) => {
      state.showInventory = action.payload;
      if (action.payload) {
        state.showAddForm = false;
        state.showCompanionDialog = false;
        state.showRotationDialog = false;
        state.selectedCrop = null;
        state.isEditing = false;
      }
    },
    // ADD the missing rotation dialog action
    setShowRotationDialog: (state, action: PayloadAction<boolean>) => {
      state.showRotationDialog = action.payload;
      if (action.payload) {
        state.showAddForm = false;
        state.showInventory = false;
        state.selectedCrop = null;
        state.isEditing = false;
        state.showCompanionDialog = false;
      }
    },
    setShowCompanionDialog: (state, action: PayloadAction<boolean>) => {
      state.showCompanionDialog = action.payload;
      if (action.payload) {
        state.showAddForm = false;
        state.showInventory = false;
        state.selectedCrop = null;
        state.isEditing = false;
        state.showRotationDialog = false;
        state.showHarvestTracker = false;
      }
    },
    setShowHarvestTracker: (state, action: PayloadAction<boolean>) => {
      state.showHarvestTracker = action.payload;
      if (action.payload) {
        state.showAddForm = false;
        state.showInventory = false;
        state.selectedCrop = null;
        state.isEditing = false;
        state.showRotationDialog = false;
        state.showCompanionDialog = false;
      }
    },
    setSelectedCrop: (state, action: PayloadAction<ProductItem | null>) => {
      state.selectedCrop = action.payload;
      if (action.payload) {
        state.showAddForm = false;
        state.showInventory = false;
        state.showRotationDialog = false;
        state.showCompanionDialog = false;
        state.isEditing = false;
      }
    },
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    resetUI: (state) => {
      state.showAddForm = false;
      state.showInventory = false;
      state.showRotationDialog = false;
      state.showCompanionDialog = false;
      state.selectedCrop = null;
      state.isEditing = false;
    },
    
    // Clear filters action
    clearFilters: (state) => {
      state.selectedFamily = null;
      state.selectedParcel = null;
      state.searchTerm = '';
    },
    
    // New reducers for multiple crops view
    toggleMultipleCropsView: (state) => {
      state.showMultipleCropsView = !state.showMultipleCropsView;
    },
    setMultipleCropsView: (state, action: PayloadAction<boolean>) => {
      state.showMultipleCropsView = action.payload;
    },
    
    // Toggle between week numbers and dates display
    toggleWeekNumbers: (state) => {
      state.showWeekNumbers = !state.showWeekNumbers;
    },
  },
});

export const {
  setView,
  setCurrentYear,
  setSelectedFamily,
  setSelectedParcel,
  setSearchTerm,
  toggleFilters,
  setShowAddForm,
  setShowInventory,
  setShowCompanionDialog,
  setShowRotationDialog,
  setShowHarvestTracker,
  setSelectedCrop,
  setIsEditing,
  resetUI,
  clearFilters,

  setViewMode,
  setZoom,
  toggleGrid,
  toggleSnapToGrid,
  toggleToolbox,
  setActiveTab,
  
  // Export the new actions
  toggleMultipleCropsView,
  setMultipleCropsView,
  toggleWeekNumbers,
} = uiSlice.actions;

export default uiSlice.reducer;