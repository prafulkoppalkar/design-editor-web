import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HistoryState, CanvasSnapshot } from '../types/canvas';

const MAX_HISTORY_SIZE = 50;

const initialState: HistoryState = {
  past: [],
  present: { elements: [], canvasBackground: '#ffffff', canvasWidth: 1080, canvasHeight: 1080 },
  future: [],
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    recordHistory: (state, action: PayloadAction<CanvasSnapshot>) => {
      state.past.push(state.present);

      if (state.past.length > MAX_HISTORY_SIZE) {
        state.past.shift();
      }

      state.present = action.payload;

      state.future = [];
    },

    undo: (state) => {
      if (state.past.length === 0) return;

      state.future.unshift(state.present);

      const previous = state.past.pop();
      if (previous) {
        state.present = previous;
      }
    },

    redo: (state) => {
      if (state.future.length === 0) return;

      state.past.push(state.present);

      const next = state.future.shift();
      if (next) {
        state.present = next;
      }
    },

    clearHistory: (state) => {
      state.past = [];
      state.present = { elements: [], canvasBackground: '#ffffff', canvasWidth: 1080, canvasHeight: 1080 };
      state.future = [];
    },

    initHistory: (state, action: PayloadAction<CanvasSnapshot>) => {
      state.present = action.payload;
      state.past = [];
      state.future = [];
    },
  },
});

export const { recordHistory, undo, redo, clearHistory, initHistory } = historySlice.actions;

export default historySlice.reducer;

