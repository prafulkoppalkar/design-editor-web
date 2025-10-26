import { useAppSelector, useAppDispatch } from '../store';
import { updateElement } from '../store/canvasSlice';
import { Palette } from 'lucide-react';

export default function StylesPanel() {
  const dispatch = useAppDispatch();
  const selectedElementId = useAppSelector((state) => state.canvas.selectedElementId);
  const elements = useAppSelector((state) => state.canvas.elements);

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  if (!selectedElementId || !selectedElement) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <div className="rounded-full bg-gray-100 p-6 mb-4">
          <Palette className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Element Selected</h3>
        <p className="text-sm text-gray-500 max-w-xs">
          Select an element on the canvas to edit its styling properties.
        </p>
      </div>
    );
  }

  const handleChange = (property: string, value: any) => {
    dispatch(updateElement({ id: selectedElementId, changes: { [property]: value } }));
  };

  const isShape = ['rectangle', 'circle', 'triangle', 'star', 'pentagon', 'hexagon'].includes(selectedElement.type);
  const isText = selectedElement.type === 'text';
  const isLine = ['line', 'arrow'].includes(selectedElement.type);
  const isImage = selectedElement.type === 'image';

  // TODO: Have element to styles config and fetch it from Metadata API
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-white">
      {isShape && (
        <div className="border-b border-gray-200 p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Shape Styling</h3>
          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-gray-700">Fill Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedElement.fill || '#000000'}
                onChange={(e) => handleChange('fill', e.target.value)}
                className="h-10 w-16 cursor-pointer rounded border border-gray-300"
              />
              <span className="text-xs text-gray-600">{selectedElement.fill}</span>
            </div>
          </div>
          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-gray-700">Stroke Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedElement.stroke || '#000000'}
                onChange={(e) => handleChange('stroke', e.target.value)}
                className="h-10 w-16 cursor-pointer rounded border border-gray-300"
              />
              <span className="text-xs text-gray-600">{selectedElement.stroke}</span>
            </div>
          </div>
          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Stroke Width: {selectedElement.strokeWidth || 0}px
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={selectedElement.strokeWidth || 0}
              onChange={(e) => handleChange('strokeWidth', Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Opacity */}
          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Opacity: {Math.round((selectedElement.opacity || 1) * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={selectedElement.opacity || 1}
              onChange={(e) => handleChange('opacity', Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}

      {isText && (
        <div className="border-b border-gray-200 p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Text Styling</h3>

          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-gray-700">Font Size</label>
            <input
              type="number"
              value={selectedElement.fontSize || 16}
              onChange={(e) => handleChange('fontSize', Number(e.target.value))}
              min="8"
              max="72"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-gray-700">Font Family</label>
            <select
              value={selectedElement.fontFamily || 'Arial'}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier">Courier</option>
              <option value="Georgia">Georgia</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-gray-700">Font Weight</label>
            <select
              value={selectedElement.fontWeight || 400}
              onChange={(e) => handleChange('fontWeight', Number(e.target.value))}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value={300}>Light (300)</option>
              <option value={400}>Normal (400)</option>
              <option value={500}>Medium (500)</option>
              <option value={600}>Semibold (600)</option>
              <option value={700}>Bold (700)</option>
              <option value={800}>Extra Bold (800)</option>
              <option value={900}>Black (900)</option>
            </select>
          </div>

          {/* Font Style */}
          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-gray-700">Font Style</label>
            <select
              value={selectedElement.fontStyle || 'normal'}
              onChange={(e) => handleChange('fontStyle', e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="normal">Normal</option>
              <option value="italic">Italic</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-gray-700">Text Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedElement.fill || '#000000'}
                onChange={(e) => handleChange('fill', e.target.value)}
                className="h-10 w-16 cursor-pointer rounded border border-gray-300"
              />
              <span className="text-xs text-gray-600">{selectedElement.fill}</span>
            </div>
          </div>

          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Opacity: {Math.round((selectedElement.opacity || 1) * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={selectedElement.opacity || 1}
              onChange={(e) => handleChange('opacity', Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}

      {isLine && (
        <div className="border-b border-gray-200 p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Line Styling</h3>

          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-gray-700">Stroke Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedElement.stroke || '#000000'}
                onChange={(e) => handleChange('stroke', e.target.value)}
                className="h-10 w-16 cursor-pointer rounded border border-gray-300"
              />
              <span className="text-xs text-gray-600">{selectedElement.stroke}</span>
            </div>
          </div>

          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Thickness: {selectedElement.strokeWidth || 1}px
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={selectedElement.strokeWidth || 1}
              onChange={(e) => handleChange('strokeWidth', Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Opacity: {Math.round((selectedElement.opacity || 1) * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={selectedElement.opacity || 1}
              onChange={(e) => handleChange('opacity', Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}
      {isImage && (
        <div className="border-b border-gray-200 p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Image Styling</h3>
          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Opacity: {Math.round((selectedElement.opacity || 1) * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={selectedElement.opacity || 1}
              onChange={(e) => handleChange('opacity', Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-gray-700">Filter</label>
            <select
              value={selectedElement.imageFilter || 'none'}
              onChange={(e) => {
                const filterValue = e.target.value === 'none' ? undefined : e.target.value;
                handleChange('imageFilter', filterValue);
                // Set default intensity when filter is selected
                if (filterValue && !selectedElement.imageFilterIntensity) {
                  handleChange('imageFilterIntensity', 50);
                }
              }}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="none">None</option>
              <option value="blur">Blur</option>
              <option value="brightness">Brightness</option>
              <option value="contrast">Contrast</option>
              <option value="grayscale">Grayscale</option>
              <option value="sepia">Sepia</option>
            </select>
          </div>

          {selectedElement.imageFilter && selectedElement.imageFilter !== 'none' && (
            <div className="mb-3">
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Filter Intensity: {selectedElement.imageFilterIntensity || 50}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={selectedElement.imageFilterIntensity || 50}
                onChange={(e) => handleChange('imageFilterIntensity', Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

