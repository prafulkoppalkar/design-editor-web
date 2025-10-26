import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  position?: 'left' | 'right'; // 'left' for default, 'right' for comments
}

export default function SidePanel({ isOpen, onClose, title, children, position = 'left' }: SidePanelProps) {
  if (!isOpen) return null;

  const isRight = position === 'right';

  return (
    <>
      <div
        className="fixed left-[60px] top-[60px] right-0 bottom-0 z-40 bg-black bg-opacity-20 transition-opacity"
        onClick={onClose}
      />

      <div
        className={`fixed top-[60px] z-50 h-[calc(100vh-60px)] w-[320px] bg-white shadow-xl ${
          isRight ? 'right-0' : 'left-[60px]'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="h-[calc(100%-53px)] overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </>
  );
}

