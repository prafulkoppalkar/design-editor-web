import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { removeDesignFromList, setError } from '../store/designSlice';
import { deleteDesign, renameDesign, Design } from '../services/designApi';
import { Trash2, Edit2, MoreVertical } from 'lucide-react';
import RenameDesignModal from './RenameDesignModal';
import DeleteConfirmModal from './DeleteConfirmModal';

interface DesignCardProps {
  design: Design;
  onMenuOpen?: () => void;
}

export default function DesignCard({ design, onMenuOpen }: DesignCardProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleOpen = () => {
    navigate(`/editor/${design._id}`);
  };

  const handleRename = async (newName: string) => {
    setIsRenaming(true);
    try {
      await renameDesign(design._id, newName);
      // Can just update the name here instead of reloading
      window.location.reload();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to rename design';
      dispatch(setError(errorMessage));
    } finally {
      setIsRenaming(false);
      setShowRenameModal(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteDesign(design._id);
      dispatch(removeDesignFromList(design._id));
      setShowDeleteModal(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete design';
      dispatch(setError(errorMessage));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        onClick={handleOpen}
        className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer group overflow-visible"
      >
        <div
          className="w-full h-32 flex items-center justify-center relative overflow-hidden"
          style={{ background: design.canvasBackground }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all">
            <span className="text-gray-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              {design.width} × {design.height}
            </span>
          </div>
        </div>

       
        <div className="p-3">
          <div className="flex items-start justify-between gap-1 mb-1">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{design.name}</h3>

              <p className="text-xs text-gray-500 truncate">
                Updated {formatDate(design.updatedAt)}
              </p>
            </div>

            <div className="relative flex-shrink-0" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!showMenu && onMenuOpen) {
                    onMenuOpen();
                  }
                  setShowMenu(!showMenu);
                }}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div
                  className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-2xl z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowRenameModal(true);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100"
                  >
                    <Edit2 className="w-4 h-4" />
                    Rename
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteModal(true);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
    
        </div>
      </div>

      {showRenameModal && (
        <RenameDesignModal
          design={design}
          onRename={handleRename}
          onClose={() => setShowRenameModal(false)}
          isLoading={isRenaming}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          designName={design.name}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          isLoading={isDeleting}
        />
      )}
    </>
  );
}

