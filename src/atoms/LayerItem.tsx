import { useState, useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { CanvasElement } from '../types/canvas';
import { useAppDispatch } from '../store';
import { selectElement, deleteElement, renameElement } from '../store/canvasSlice';

interface LayerItemProps {
  element: CanvasElement;
  isSelected: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, element: CanvasElement) => void;
}

export default function LayerItem({ element, isSelected, onDragStart }: LayerItemProps) {
  const dispatch = useAppDispatch();
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(element.name || `Figure-${element.type}`);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get element type icon
  const getTypeIcon = () => {
    switch (element.type) {
      case 'rectangle':
        return '▭';
      case 'circle':
        return '●';
      case 'triangle':
        return '▲';
      case 'star':
        return '★';
      case 'pentagon':
        return '⬠';
      case 'hexagon':
        return '⬢';
      case 'line':
        return '─';
      case 'arrow':
        return '→';
      case 'text':
        return 'T';
      default:
        return '◆';
    }
  };

  // Focus input when entering rename mode
  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const handleRenameStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenaming(true);
  };

  const handleRenameSave = () => {
    if (newName.trim()) {
      dispatch(renameElement({ id: element.id, name: newName.trim() }));
    } else {
      setNewName(element.name || `Figure-${element.type}`);
    }
    setIsRenaming(false);
  };

  const handleRenameCancel = () => {
    setNewName(element.name || `Figure-${element.type}`);
    setIsRenaming(false);
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRenameSave();
    } else if (e.key === 'Escape') {
      handleRenameCancel();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(deleteElement(element.id));
  };

  const handleSelect = () => {
    dispatch(selectElement(element.id));
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        onDragStart(e, element);
      }}
      onClick={handleSelect}
      className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
        isSelected
          ? 'bg-blue-100 border-l-2 border-blue-500'
          : 'hover:bg-gray-50 border-l-2 border-transparent'
      }`}
    >
      <div className="flex-shrink-0 text-gray-400 cursor-grab active:cursor-grabbing">
        ⋮⋮
      </div>

      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-600 text-sm font-bold">
        {getTypeIcon()}
      </div>

      {isRenaming ? (
        <input
          ref={inputRef}
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={handleRenameSave}
          onKeyDown={handleRenameKeyDown}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      ) : (
        <span
          onDoubleClick={handleRenameStart}
          className="flex-1 text-sm text-gray-700 truncate hover:text-gray-900 cursor-text"
        >
          {element.name || `Figure-${element.type}`}
        </span>
      )}

      <button
        onClick={handleDelete}
        className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 transition-colors"
        title="Delete element"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

