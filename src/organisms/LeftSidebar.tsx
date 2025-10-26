import { Image, Shapes, Grid3x3, Layers, Maximize2, Palette } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  icon: React.ElementType;
}

const tools: Tool[] = [
  { id: 'elements', name: 'Elements', icon: Shapes },
  { id: 'photos', name: 'Photos', icon: Image },
  { id: 'background', name: 'Background', icon: Grid3x3 },
  { id: 'layers', name: 'Layers', icon: Layers },
  { id: 'styles', name: 'Styles', icon: Palette },
  { id: 'resize', name: 'Resize', icon: Maximize2 },
];

interface LeftSidebarProps {
  onToolClick: (toolType: string) => void;
  activeToolType: string | null;
}

export default function LeftSidebar({ onToolClick, activeToolType }: LeftSidebarProps) {
  return (
    <div className="flex h-full w-[63px] flex-col bg-white">
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = activeToolType === tool.id;

        return (
          <button
            key={tool.id}
            onClick={() => onToolClick(tool.id)}
            className={`flex flex-col items-center justify-center gap-1 border-b border-gray-200 py-4 transition-colors ${
              isActive
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-700'}`} />
            <span className={`text-[10px] ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
              {tool.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

