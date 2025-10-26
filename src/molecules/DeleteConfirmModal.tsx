import { X } from 'lucide-react';

interface DeleteConfirmModalProps {
  designName: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function DeleteConfirmModal({
  designName,
  onConfirm,
  onCancel,
  isLoading,
}: DeleteConfirmModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full mx-4">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">Delete Design</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-700 mb-1">
            Are you sure you want to delete <span className="font-semibold">"{designName}"</span>?
          </p>
          <p className="text-xs text-gray-500">This action cannot be undone.</p>
        </div>
        <div className="flex gap-2 p-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-3 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

