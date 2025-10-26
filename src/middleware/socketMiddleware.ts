import { Middleware } from '@reduxjs/toolkit';
import { socketService } from '../services/socketService';
import { setActiveUsers, updateDesignName } from '../store/designSlice';
import { reorderElements, setCanvasBackground, setCanvasDimensions } from '../store/canvasSlice';
import { setIsProcessingRemoteUpdate, getIsProcessingRemoteUpdate } from '../store/remoteUpdateFlag';

/**
 * Socket Middleware - Handles Socket.io events
 *
 * RESPONSIBILITIES:
 * 1. Emit Socket events when local Redux actions occur
 * 2. Listen for Socket events and dispatch Redux actions
 * 3. Filter out own updates using clientId comparison
 */

export const socketMiddleware: Middleware = (store) => {
  let currentDesignId: string | null = null;

  return (next) => (action: any) => {
    const state = store.getState();
    const clientId = state.design.clientId;
    const designId = state.design.currentDesign?._id;
    const isConnected = socketService.isConnected();

    // EMIT: Send Socket events for local changes (but NOT for remote updates)
    if (clientId && designId && isConnected && !getIsProcessingRemoteUpdate()) {
      const timestamp = Date.now();

      if (action.type === 'canvas/addElement') {
        socketService.emitElementAdd(designId, clientId, timestamp, action.payload);
      }

      if (action.type === 'canvas/updateElement') {
        const { id, changes } = action.payload;
        socketService.emitElementUpdate(designId, clientId, timestamp, id, changes);
      }

      if (action.type === 'canvas/deleteElement') {
        socketService.emitElementDelete(designId, clientId, timestamp, action.payload);
      }

      if (action.type === 'canvas/setCanvasBackground') {
        socketService.emitBackgroundChange(designId, clientId, timestamp, action.payload);
      }

      if (action.type === 'canvas/setCanvasDimensions') {
        const { width, height } = action.payload;
        socketService.emitResize(designId, clientId, timestamp, width, height);
      }
    }

    // Pass action through Redux
    const result = next(action);

    // EMIT: For undo/redo, emit the full design update to sync with other windows
    // We check for canvas/restoreElements because that's what gets called during undo/redo
    if (clientId && designId && isConnected && !getIsProcessingRemoteUpdate()) {
      if (action.type === 'canvas/restoreElements') {
        const newState = store.getState();
        const timestamp = Date.now();
        console.log('📤 Emitting design:update after undo/redo');
        socketService.emitUpdate(designId, clientId, timestamp, {
          elements: newState.canvas.elements,
          canvasBackground: newState.canvas.canvasBackground,
          width: newState.canvas.canvasWidth,
          height: newState.canvas.canvasHeight,
        });
      }
    }

    // LISTEN: Setup Socket listeners when design changes
    const newState = store.getState();
    const newDesignId = newState.design.currentDesign?._id;
    const newClientId = newState.design.clientId;

    // If design was cleared (newDesignId is null), reset currentDesignId
    if (!newDesignId && currentDesignId !== null) {
      currentDesignId = null;
    }

    // If design changed (including from null to a new design), set up listeners
    if (newDesignId && newDesignId !== currentDesignId) {
      currentDesignId = newDesignId;
      setupSocketListeners(store, newDesignId, newClientId);
    }

    return result;
  };
};

/**
 * Setup all Socket event listeners
 */
const setupSocketListeners = (store: any, designId: string, clientId: string | null) => {
  console.log('🔌 Setting up Socket listeners for design:', designId);
  console.log('🔌 Socket connected?', socketService.isConnected());

  if (!socketService.isConnected()) {
    console.warn('⚠️ Socket not connected yet, listeners will be set up when connected');
    return;
  }

  // Remove old listeners to prevent duplicates
  socketService.removeAllListeners('design:user-joined');
  socketService.removeAllListeners('design:user-left');
  socketService.removeAllListeners('design:element-added');
  socketService.removeAllListeners('design:element-updated');
  socketService.removeAllListeners('design:element-deleted');
  socketService.removeAllListeners('design:background-changed');
  socketService.removeAllListeners('design:resized');
  socketService.removeAllListeners('design:name-changed');
  socketService.removeAllListeners('design:update-received');

  // Listen for user joined
  socketService.onUserJoined((data) => {
    if (data.designId === designId) {
      console.log('👤 User joined, active users:', data.activeUsers);
      store.dispatch(setActiveUsers(data.activeUsers));
    }
  });

  // Listen for user left
  socketService.onUserLeft((data) => {
    if (data.designId === designId) {
      console.log('👤 User left, active users:', data.activeUsers);
      store.dispatch(setActiveUsers(data.activeUsers));
    }
  });

  // Listen for element added
  socketService.onElementAdded((data) => {
    if (data.designId === designId && data.clientId !== clientId) {
      console.log('✅ Adding element from remote:', data.element.id);
      setIsProcessingRemoteUpdate(true);
      const state = store.getState();
      const elements = [...state.canvas.elements, data.element];
      store.dispatch(reorderElements(elements));
      setIsProcessingRemoteUpdate(false);
    }
  });

  // Listen for element updated
  socketService.onElementUpdated((data) => {
    if (data.designId === designId && data.clientId !== clientId) {
      console.log('✅ Updating element from remote:', data.elementId);
      setIsProcessingRemoteUpdate(true);
      const state = store.getState();
      const elements = state.canvas.elements.map((el: any) =>
        el.id === data.elementId ? { ...el, ...data.updates } : el
      );
      store.dispatch(reorderElements(elements));
      setIsProcessingRemoteUpdate(false);
    }
  });

  // Listen for element deleted
  socketService.onElementDeleted((data) => {
    if (data.designId === designId && data.clientId !== clientId) {
      console.log('✅ Deleting element from remote:', data.elementId);
      setIsProcessingRemoteUpdate(true);
      const state = store.getState();
      const elements = state.canvas.elements.filter((el: any) => el.id !== data.elementId);
      store.dispatch(reorderElements(elements));
      setIsProcessingRemoteUpdate(false);
    }
  });

  // Listen for background changed
  socketService.onBackgroundChanged((data) => {
    if (data.designId === designId && data.clientId !== clientId) {
      console.log('✅ Background changed from remote');
      setIsProcessingRemoteUpdate(true);
      store.dispatch(setCanvasBackground(data.canvasBackground));
      setIsProcessingRemoteUpdate(false);
    }
  });

  // Listen for canvas resized
  socketService.onCanvasResized((data) => {
    if (data.designId === designId && data.clientId !== clientId) {
      console.log('✅ Canvas resized from remote');
      setIsProcessingRemoteUpdate(true);
      store.dispatch(setCanvasDimensions({ width: data.width, height: data.height }));
      setIsProcessingRemoteUpdate(false);
    }
  });

  // Listen for design name changed
  socketService.onDesignNameChanged((data) => {
    if (data.designId === designId && data.clientId !== clientId) {
      console.log('✅ Design renamed from remote:', data.name);
      store.dispatch(updateDesignName(data.name));
    }
  });

  // Listen for full design update
  socketService.onDesignUpdate((data) => {
    if (data.designId === designId && data.clientId !== clientId) {
      console.log('✅ Full design update from remote');
      setIsProcessingRemoteUpdate(true);
      const changes = data.changes;
      if (changes.elements) {
        store.dispatch(reorderElements(changes.elements));
      }
      if (changes.canvasBackground) {
        store.dispatch(setCanvasBackground(changes.canvasBackground));
      }
      if (changes.width || changes.height) {
        store.dispatch(setCanvasDimensions({
          width: changes.width,
          height: changes.height,
        }));
      }
      setIsProcessingRemoteUpdate(false);
    }
  });

  console.log('✅ Socket listeners setup complete for design:', designId);
};

