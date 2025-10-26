import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Undo, Redo, Trash2, Download, MessageCircle, ArrowLeft, Save, Info, Users } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store';
import { deleteElement } from '../store/canvasSlice';
import { useUndoRedo } from '../hooks/useUndoRedo';
import { useCanvasContext } from '../context/CanvasContext';
import { exportCanvasToPNG } from '../utils/exportCanvas';
import { setSaveStatus, setSaveError, updateDesignName, clearUnsaved, setIsSaving } from '../store/designSlice';
import { updateDesign } from '../services/designApi';
import { socketService } from '../services/socketService';

interface TopToolbarProps {
  onCommentsClick?: () => void;
  isCommentsOpen?: boolean;
}

export default function TopToolbar({ onCommentsClick, isCommentsOpen = false }: TopToolbarProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const selectedElementId = useAppSelector((state) => state.canvas.selectedElementId);
  const canvasBackground = useAppSelector((state) => state.canvas.canvasBackground);
  const canvasWidth = useAppSelector((state) => state.canvas.canvasWidth);
  const canvasHeight = useAppSelector((state) => state.canvas.canvasHeight);
  const currentDesign = useAppSelector((state) => state.design.currentDesign);
  const clientId = useAppSelector((state) => state.design.clientId);
  const saveStatus = useAppSelector((state) => state.design.saveStatus);
  const hasUnsavedChanges = useAppSelector((state) => state.design.hasUnsavedChanges);
  const isSavingState = useAppSelector((state) => state.design.isSaving);
  const elements = useAppSelector((state) => state.canvas.elements);
  const activeUsers = useAppSelector((state) => state.design.activeUsers);
  const isSocketConnected = useAppSelector((state) => state.design.isSocketConnected);
  const { undo, redo, canUndo, canRedo } = useUndoRedo();
  const { stageRef } = useCanvasContext();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [showNothingToSaveToast, setShowNothingToSaveToast] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keyboard shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keyboard shortcuts if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      // Cmd+Z (Mac) or Ctrl+Z (Windows/Linux) for Undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Cmd+Shift+Z (Mac) or Ctrl+Shift+Z (Windows/Linux) for Redo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }

      // Cmd+Y (alternative Redo shortcut)
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const handleDelete = () => {
    if (selectedElementId) {
      dispatch(deleteElement(selectedElementId));
    }
  };

  const handleDownload = () => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `canvas-${timestamp}.png`;
    exportCanvasToPNG(stageRef.current, canvasBackground, filename);
  };

  const handleSave = async () => {
    // If no unsaved changes, show toast
    if (!hasUnsavedChanges) {
      setShowNothingToSaveToast(true);
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      toastTimeoutRef.current = setTimeout(() => {
        setShowNothingToSaveToast(false);
      }, 3000);
      return;
    }

    if (!currentDesign || !clientId) return;

    dispatch(setIsSaving(true));
    dispatch(setSaveStatus('saving'));

    try {
      // Emit Socket event for design update (WebSocket only - no HTTP API)
      socketService.emitUpdate(
        currentDesign._id,
        clientId,
        Date.now(),
        {
          elements,
          canvasBackground,
          width: canvasWidth,
          height: canvasHeight,
        }
      );

      console.log('✅ Design saved via WebSocket');
      dispatch(clearUnsaved());
      dispatch(setSaveStatus('saved'));
      dispatch(setIsSaving(false));
      // Reset to idle after 2 seconds
      setTimeout(() => {
        dispatch(setSaveStatus('idle'));
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save design';
      console.error('❌ Save failed:', errorMessage);
      dispatch(setSaveStatus('error'));
      dispatch(setSaveError(errorMessage));
      dispatch(setIsSaving(false));
      // Reset to idle after 3 seconds
      setTimeout(() => {
        dispatch(setSaveStatus('idle'));
      }, 3000);
    }
  };

  const handleBackToDesigns = () => {
    navigate('/home');
  };

  const startEditingName = () => {
    if (currentDesign) {
      setEditingName(currentDesign.name);
      setIsEditingName(true);
      // Focus input after state update
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const saveNameChange = async () => {
    if (!currentDesign || !editingName.trim()) {
      setIsEditingName(false);
      return;
    }

    if (editingName === currentDesign.name) {
      setIsEditingName(false);
      return;
    }

    try {
      await updateDesign(currentDesign._id, { name: editingName });
      dispatch(updateDesignName(editingName));

      // Emit Socket event for name change
      if (clientId) {
        socketService.emitNameChange(
          currentDesign._id,
          clientId,
          Date.now(),
          editingName
        );
      }

      setIsEditingName(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to rename design';
      dispatch(setSaveError(errorMessage));
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveNameChange();
    } else if (e.key === 'Escape') {
      setIsEditingName(false);
    }
  };

  return (
    <div className="flex h-[60px] w-full items-center justify-between border-b border-gray-200 bg-white px-4">
      {/* Left Section - Back Button + Design Name */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleBackToDesigns}
          className="rounded p-2 text-gray-700 hover:bg-gray-100 transition-colors"
          title="Back to Designs"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Separator */}
        <div className="h-6 w-px bg-gray-300"></div>

        {/* Design Name - Inline Edit */}
        {currentDesign && (
          <div className="flex items-center gap-2">
            {isEditingName ? (
              <div className="relative inline-flex">
                {/* Hidden span to measure text width */}
                <span className="absolute invisible whitespace-nowrap text-sm font-medium px-2 py-1">
                  {editingName || 'Design'}
                </span>
                {/* Input with dynamic width */}
                <input
                  ref={inputRef}
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={saveNameChange}
                  onKeyDown={handleNameKeyDown}
                  className="text-sm font-medium text-gray-900 border border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-xs"
                  style={{
                    width: `${Math.max(editingName.length * 8 + 16, 80)}px`,
                    maxWidth: '300px'
                  }}
                />
              </div>
            ) : (
              <span
                onClick={startEditingName}
                className="text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                title="Click to rename"
              >
                {currentDesign.name}
              </span>
            )}

            {/* Active Users Display - Right next to design name */}
            {isSocketConnected && activeUsers > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-full border border-blue-200">
                <Users className="h-3 w-3 text-blue-600" />
                <span className="text-xs font-medium text-blue-600">
                  {activeUsers}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Center Section - Save Status */}
      <div className="flex items-center gap-4">
        {saveStatus !== 'idle' && (
          <div className="flex items-center gap-2">
            {saveStatus === 'saving' && (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                <span className="text-sm text-gray-600">Saving...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <span className="text-sm text-green-600 font-medium">✓ Saved</span>
            )}
            {saveStatus === 'error' && (
              <span className="text-sm text-red-600 font-medium">✗ Save failed</span>
            )}
          </div>
        )}
      </div>

      {/* Right Section - Undo/Redo/Delete/Save/Comments/Download */}
      <div className="flex items-center gap-2">
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`rounded p-2 transition-colors ${
            canUndo
              ? 'hover:bg-gray-100'
              : 'cursor-not-allowed opacity-40'
          }`}
          title={canUndo ? 'Undo (Cmd+Z)' : 'Nothing to undo'}
        >
          <Undo className="h-5 w-5 text-gray-700" />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className={`rounded p-2 transition-colors ${
            canRedo
              ? 'hover:bg-gray-100'
              : 'cursor-not-allowed opacity-40'
          }`}
          title={canRedo ? 'Redo (Cmd+Shift+Z)' : 'Nothing to redo'}
        >
          <Redo className="h-5 w-5 text-gray-700" />
        </button>

        {/* Separator */}
        <div className="h-6 w-px bg-gray-300"></div>

        <button
          onClick={handleDelete}
          disabled={!selectedElementId}
          className={`rounded p-2 transition-colors ${
            selectedElementId
              ? 'text-gray-700 hover:bg-gray-200'
              : 'cursor-not-allowed opacity-40 text-gray-400'
          }`}
          title={selectedElementId ? 'Delete selected element' : 'Select an element to delete'}
        >
          <Trash2 className="h-5 w-5" />
        </button>

        {/* Separator */}
        <div className="h-6 w-px bg-gray-300"></div>

        <button
          onClick={handleSave}
          disabled={isSavingState}
          className="flex items-center gap-2 rounded px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
          title="Save design"
        >
          {isSavingState ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
              <span className="text-sm font-medium">Saving...</span>
            </>
          ) : (
            <>
              {hasUnsavedChanges && (
                <span className="inline-block w-2 h-2 rounded-full bg-orange-500" title="Unsaved changes" />
              )}
              <Save className="h-5 w-5" />
              <span className="text-sm font-medium">Save</span>
            </>
          )}
        </button>

        {/* Separator */}
        <div className="h-6 w-px bg-gray-300"></div>

        <button
          onClick={onCommentsClick}
          className={`rounded p-2 transition-colors ${
            isCommentsOpen
              ? 'bg-blue-100 text-blue-600'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
          title="Comments"
        >
          <MessageCircle className="h-5 w-5" />
        </button>

        {/* Separator */}
        <div className="h-6 w-px bg-gray-300"></div>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 rounded px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
          title="Download"
        >
          <Download className="h-5 w-5" />
          <span className="text-sm font-medium">Download</span>
        </button>
      </div>

      {/* "Nothing to save" Toast - Below Save Button */}
      {showNothingToSaveToast && (
        <div className="absolute top-[60px] right-20 bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-lg text-sm font-medium animate-fade-in-out z-50 flex items-center gap-2 text-gray-700">
          <Info className="h-4 w-4 text-blue-500" />
          <span>Nothing to save</span>
        </div>
      )}
    </div>
  );
}

