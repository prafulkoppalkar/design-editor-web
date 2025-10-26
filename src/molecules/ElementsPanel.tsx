import CollapsibleSection from './CollapsibleSection';
import { textPresets, linePresets, shapePresets, ShapePreset } from '../data/shapePresets';
import { useAppDispatch, useAppSelector } from '../store';
import { addElement } from '../store/canvasSlice';

export default function ElementsPanel() {
  const dispatch = useAppDispatch();
  const elements = useAppSelector((state) => state.canvas.elements);

  const handleAddShape = (preset: ShapePreset) => {
    const typeCount = elements.filter((el) => el.type === preset.type).length + 1;

    const newElement = {
      id: `elem_${Date.now()}`,
      type: preset.type,
      name: `${preset.name}-${typeCount}`,
      x: 540,
      y: 540,
      rotation: 0,
      ...preset.defaultProps,
    };

    dispatch(addElement(newElement));
    console.log('Added element:', newElement);
  };

  return (
    <div>
      <CollapsibleSection title="Text" defaultOpen={true}>
        <div className="grid grid-cols-4 gap-2">
          {textPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleAddShape(preset)}
              className="flex aspect-square items-center justify-center rounded border border-gray-200 bg-white transition-all hover:border-gray-400 hover:bg-gray-50"
              title={preset.name}
            >
              <span className="text-2xl font-bold text-gray-600">{preset.icon}</span>
            </button>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Lines" defaultOpen={true}>
        <div className="grid grid-cols-4 gap-2">
          {linePresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleAddShape(preset)}
              className="flex aspect-square items-center justify-center rounded border border-gray-200 bg-white transition-all hover:border-gray-400 hover:bg-gray-50"
              title={preset.name}
            >
              <span className="text-2xl text-gray-600">{preset.icon}</span>
            </button>
          ))}
        </div>
      </CollapsibleSection>
      
      <CollapsibleSection title="Shapes" defaultOpen={true}>
        <div className="grid grid-cols-4 gap-2">
          {shapePresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleAddShape(preset)}
              className="flex aspect-square items-center justify-center rounded border border-gray-200 bg-white transition-all hover:border-gray-400 hover:bg-gray-50"
              title={preset.name}
            >
              <span className="text-3xl text-gray-400">{preset.icon}</span>
            </button>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );
}

