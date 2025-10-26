import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Design } from '../services/designApi';

interface DesignState {
  currentDesign: Design | null;
  designs: Design[];
  loading: boolean;
  error: string | null;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  saveError: string | null;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  clientId: string | null;
  activeUsers: number;
  isSocketConnected: boolean;
}

const initialState: DesignState = {
  currentDesign: null,
  designs: [],
  loading: false,
  error: null,
  saveStatus: 'idle',
  saveError: null,
  hasUnsavedChanges: false,
  isSaving: false,
  clientId: null,
  activeUsers: 0,
  isSocketConnected: false,
};

const designSlice = createSlice({
  name: 'design',
  initialState,
  reducers: {
    setCurrentDesign: (state, action: PayloadAction<Design>) => {
      state.currentDesign = action.payload;
      state.error = null;
    },

    setDesigns: (state, action: PayloadAction<Design[]>) => {
      state.designs = action.payload;
      state.error = null;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setSaveStatus: (state, action: PayloadAction<'idle' | 'saving' | 'saved' | 'error'>) => {
      state.saveStatus = action.payload;
    },

    setSaveError: (state, action: PayloadAction<string | null>) => {
      state.saveError = action.payload;
    },

    updateDesignName: (state, action: PayloadAction<string>) => {
      if (state.currentDesign) {
        state.currentDesign.name = action.payload;
      }
    },

    updateDesignElements: (state, action: PayloadAction<any[]>) => {
      if (state.currentDesign) {
        state.currentDesign.elements = action.payload;
      }
    },

    updateDesignCanvas: (
      state,
      action: PayloadAction<{
        width?: number;
        height?: number;
        canvasBackground?: string;
      }>
    ) => {
      if (state.currentDesign) {
        if (action.payload.width !== undefined) {
          state.currentDesign.width = action.payload.width;
        }
        if (action.payload.height !== undefined) {
          state.currentDesign.height = action.payload.height;
        }
        if (action.payload.canvasBackground !== undefined) {
          state.currentDesign.canvasBackground = action.payload.canvasBackground;
        }
      }
    },

    removeDesignFromList: (state, action: PayloadAction<string>) => {
      state.designs = state.designs.filter((d) => d._id !== action.payload);
    },

    updateDesignInList: (state, action: PayloadAction<Design>) => {
      const index = state.designs.findIndex((d) => d._id === action.payload._id);
      if (index !== -1) {
        state.designs[index] = action.payload;
      }
    },

    clearCurrentDesign: (state) => {
      state.currentDesign = null;
      state.error = null;
    },

    markAsUnsaved: (state) => {
      state.hasUnsavedChanges = true;
    },

    clearUnsaved: (state) => {
      state.hasUnsavedChanges = false;
    },

    setIsSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },

    setClientId: (state, action: PayloadAction<string>) => {
      state.clientId = action.payload;
    },

    setActiveUsers: (state, action: PayloadAction<number>) => {
      state.activeUsers = action.payload;
    },

    setSocketConnected: (state, action: PayloadAction<boolean>) => {
      state.isSocketConnected = action.payload;
    },

    updateDesignFromRemote: (state, action: PayloadAction<Partial<Design>>) => {
      if (state.currentDesign) {
        state.currentDesign = { ...state.currentDesign, ...action.payload };
      }
    },
  },
});

export const {
  setCurrentDesign,
  setDesigns,
  setLoading,
  setError,
  setSaveStatus,
  setSaveError,
  updateDesignName,
  updateDesignElements,
  updateDesignCanvas,
  removeDesignFromList,
  updateDesignInList,
  clearCurrentDesign,
  markAsUnsaved,
  clearUnsaved,
  setIsSaving,
  setClientId,
  setActiveUsers,
  setSocketConnected,
  updateDesignFromRemote,
} = designSlice.actions;

export default designSlice.reducer;

