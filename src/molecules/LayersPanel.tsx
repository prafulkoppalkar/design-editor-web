import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { reorderElements } from '../store/canvasSlice';
import LayerItem from '../atoms/LayerItem';
import { CanvasElement } from '../types/canvas';

export default function LayersPanel() {
  const dispatch = useAppDispatch();
  const elements = useAppSelector((state) => state.canvas.elements);
  const selectedElementId = useAppSelector((state) => state.canvas.selectedElementId);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, element: CanvasElement) => {
    const index = elements.findIndex((el) => el.id === element.id);
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', element.id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    // Create new array with reordered elements
    const newElements = [...elements];
    const draggedElement = newElements[draggedIndex];
    newElements.splice(draggedIndex, 1);
    newElements.splice(dropIndex, 0, draggedElement);

    dispatch(reorderElements(newElements));
    setDraggedIndex(null);
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-gray-200 px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-700">Elements on your active page:</h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        {elements.length === 0 ? (
          <div className="flex h-full items-center justify-center p-8 text-center">
            <p className="text-sm text-gray-500">No elements on canvas yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {[...elements].reverse().map((element, reverseIndex) => {
              const index = elements.length - 1 - reverseIndex;
              return (
                <div
                  key={element.id}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`transition-colors ${
                    dragOverIndex === index ? 'bg-blue-50 border-t-2 border-blue-400' : ''
                  }`}
                >
                  <LayerItem
                    element={element}
                    isSelected={element.id === selectedElementId}
                    onDragStart={handleDragStart}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

