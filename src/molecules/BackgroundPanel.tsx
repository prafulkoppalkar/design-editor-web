import { useAppDispatch, useAppSelector } from '../store';
import { setCanvasBackground } from '../store/canvasSlice';
import { updateDesignCanvas } from '../store/designSlice';
import { backgroundPresets } from '../data/backgroundPresets';

export default function BackgroundPanel() {
  const dispatch = useAppDispatch();
  const canvasBackground = useAppSelector((state) => state.canvas.canvasBackground);

  const handleSelectBackground = (value: string) => {
    dispatch(setCanvasBackground(value));
    dispatch(updateDesignCanvas({ canvasBackground: value }));
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-gray-200 px-4 py-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Colors</h3>
        <div className="grid grid-cols-4 gap-2">
          {backgroundPresets
            .filter((preset) => preset.type === 'color')
            .map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectBackground(preset.value)}
                className={`h-12 rounded-lg border-2 transition-all ${
                  canvasBackground === preset.value
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ backgroundColor: preset.value }}
                title={preset.name}
              />
            ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Gradients</h3>
        <div className="grid grid-cols-2 gap-3">
          {backgroundPresets
            .filter((preset) => preset.type === 'gradient')
            .map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectBackground(preset.value)}
                className={`h-24 rounded-lg border-2 transition-all ${
                  canvasBackground === preset.value
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ background: preset.value }}
                title={preset.name}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

