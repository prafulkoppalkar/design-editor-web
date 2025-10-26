import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { setCanvasDimensions } from '../store/canvasSlice';
import { groupedPresets, ResizePreset } from '../data/resizePresets';

export default function ResizePanel() {
  const dispatch = useAppDispatch();
  const canvasWidth = useAppSelector((state) => state.canvas.canvasWidth);
  const canvasHeight = useAppSelector((state) => state.canvas.canvasHeight);

  const [width, setWidth] = useState(canvasWidth);
  const [height, setHeight] = useState(canvasHeight);

  useEffect(() => {
    setWidth(canvasWidth);
    setHeight(canvasHeight);
  }, [canvasWidth, canvasHeight]);

  const handleResize = () => {
    dispatch(setCanvasDimensions({ width, height }));
  };

  const handlePresetClick = (preset: ResizePreset) => {
    setWidth(preset.width);
    setHeight(preset.height);
    dispatch(setCanvasDimensions({ width: preset.width, height: preset.height }));
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 p-2">
        <div className="flex gap-1 items-end">
          <div className="flex-1">
            <label className="mb-0.5 block text-xs font-medium text-gray-700">
              W
            </label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
              min="1"
            />
          </div>

          <div className="flex-1">
            <label className="mb-0.5 block text-xs font-medium text-gray-700">
              H
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
              min="1"
            />
          </div>

          <button
            onClick={handleResize}
            className="rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700 h-7"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-3 gap-1.5">
          {Object.values(groupedPresets)
            .flat()
            .map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetClick(preset)}
                className="flex flex-col items-center justify-center rounded border border-gray-200 bg-white p-2 transition-all hover:border-blue-500 hover:bg-blue-50"
                title={`${preset.width}x${preset.height}px`}
              >
                <span className="mb-0.5 text-lg">{preset.icon}</span>
                <span className="text-xs font-medium text-gray-700">
                  {preset.name}
                </span>
                <span className="text-xs text-gray-500">
                  {preset.width}×{preset.height}
                </span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

