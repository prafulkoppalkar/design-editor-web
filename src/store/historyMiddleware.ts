import { Middleware } from '@reduxjs/toolkit';
import { recordHistory } from './historySlice';
import { restoreElements } from './canvasSlice';
import { markAsUnsaved } from './designSlice';
import { getIsProcessingRemoteUpdate } from './remoteUpdateFlag';

const HISTORY_ACTIONS = [
  'canvas/addElement',
  'canvas/updateElement',
  'canvas/deleteElement',
  'canvas/clearCanvas',
  'canvas/reorderElements',
  'canvas/setCanvasBackground',
  'canvas/setCanvasDimensions',
];

const SKIP_HISTORY_ACTIONS = [
  'canvas/restoreElements',
];

let isRestoringFromHistory = false;

export const historyMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  const nextState = store.getState();

  if (typeof action === 'object' && action !== null && 'type' in action) {
    const actionType = action.type as string;

    if (actionType === 'history/undo' || actionType === 'history/redo') {
      isRestoringFromHistory = true;
      const historyState = store.getState().history;
      store.dispatch(restoreElements(historyState.present));
      isRestoringFromHistory = false;
      store.dispatch(markAsUnsaved());
    } else if (HISTORY_ACTIONS.includes(actionType) && !isRestoringFromHistory && !SKIP_HISTORY_ACTIONS.includes(actionType) && !getIsProcessingRemoteUpdate()) {
      store.dispatch(recordHistory({
        elements: nextState.canvas.elements,
        canvasBackground: nextState.canvas.canvasBackground,
        canvasWidth: nextState.canvas.canvasWidth,
        canvasHeight: nextState.canvas.canvasHeight,
      }));
      store.dispatch(markAsUnsaved());
    }
  }

  return result;
};

