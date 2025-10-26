import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { undo, redo } from '../store/historySlice';

export const useUndoRedo = () => {
  const dispatch = useAppDispatch();
  const { past, future } = useAppSelector((state) => state.history);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const handleUndo = useCallback(() => {
    if (!canUndo) return;
    dispatch(undo());
  }, [canUndo, dispatch]);

  const handleRedo = useCallback(() => {
    if (!canRedo) return;
    dispatch(redo());
  }, [canRedo, dispatch]);

  return {
    undo: handleUndo,
    redo: handleRedo,
    canUndo,
    canRedo,
  };
};

