import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import canvasReducer from './canvasSlice';
import historyReducer from './historySlice';
import uploadReducer from './uploadSlice';
import commentsReducer from './commentsSlice';
import designReducer from './designSlice';
import { historyMiddleware } from './historyMiddleware';
import { socketMiddleware } from '../middleware/socketMiddleware';

const makeStore = () => {
  return configureStore({
    reducer: {
      canvas: canvasReducer,
      history: historyReducer,
      upload: uploadReducer,
      comments: commentsReducer,
      design: designReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(historyMiddleware, socketMiddleware),
  });
};

export const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

