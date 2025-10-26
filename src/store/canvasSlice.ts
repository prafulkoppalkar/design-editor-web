import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CanvasElement, CanvasState } from '../types/canvas';

const initialState: CanvasState = {
  elements: [],
  selectedElementId: null,
  activeTool: null,
  canvasWidth: 1080,
  canvasHeight: 1080,
  zoom: 1,
  canvasBackground: '#ffffff',
};

const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    addElement: (state, action: PayloadAction<CanvasElement>) => {
      state.elements.push(action.payload);
    },

    updateElement: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<CanvasElement> }>
    ) => {
      const { id, changes } = action.payload;
      const index = state.elements.findIndex((el) => el.id === id);
      if (index !== -1) {
        state.elements[index] = { ...state.elements[index], ...changes };
      }
    },

    deleteElement: (state, action: PayloadAction<string>) => {
      state.elements = state.elements.filter((el) => el.id !== action.payload);

      if (state.selectedElementId === action.payload) {
        state.selectedElementId = null;
      }
    },

    selectElement: (state, action: PayloadAction<string>) => {
      state.selectedElementId = action.payload;
    },

    deselectElement: (state) => {
      state.selectedElementId = null;
    },

    setActiveTool: (state, action: PayloadAction<string | null>) => {
      state.activeTool = action.payload;
    },

    clearCanvas: (state) => {
      state.elements = [];
      state.selectedElementId = null;
    },

    restoreElements: (state, action: PayloadAction<{ elements: CanvasElement[]; canvasBackground: string; canvasWidth: number; canvasHeight: number }>) => {
      state.elements = action.payload.elements;
      state.canvasBackground = action.payload.canvasBackground;
      state.canvasWidth = action.payload.canvasWidth;
      state.canvasHeight = action.payload.canvasHeight;
      state.selectedElementId = null;
    },

    setCanvasDimensions: (
      state,
      action: PayloadAction<{ width: number; height: number }>
    ) => {
      state.canvasWidth = action.payload.width;
      state.canvasHeight = action.payload.height;
    },

    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = Math.max(0.1, Math.min(4, action.payload));
    },

    zoomIn: (state) => {
      const zoomLevels = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];
      const currentIndex = zoomLevels.findIndex((z) => z >= state.zoom);
      if (currentIndex < zoomLevels.length - 1) {
        state.zoom = zoomLevels[currentIndex + 1];
      }
    },

    zoomOut: (state) => {
      const zoomLevels = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];
      const currentIndex = zoomLevels.findIndex((z) => z >= state.zoom);
      if (currentIndex > 0) {
        state.zoom = zoomLevels[currentIndex - 1];
      }
    },
  
    resetZoom: (state) => {
      state.zoom = 1;
    },

    renameElement: (state, action: PayloadAction<{ id: string; name: string }>) => {
      const { id, name } = action.payload;
      const element = state.elements.find((el) => el.id === id);
      if (element) {
        element.name = name;
      }
    },

    reorderElements: (state, action: PayloadAction<CanvasElement[]>) => {
      state.elements = action.payload;
    },

    setCanvasBackground: (state, action: PayloadAction<string>) => {
      state.canvasBackground = action.payload;
    },
  },
});

export const {
  addElement,
  updateElement,
  deleteElement,
  selectElement,
  deselectElement,
  setActiveTool,
  clearCanvas,
  restoreElements,
  setCanvasDimensions,
  setZoom,
  zoomIn,
  zoomOut,
  resetZoom,
  renameElement,
  reorderElements,
  setCanvasBackground,
} = canvasSlice.actions;

export default canvasSlice.reducer;

