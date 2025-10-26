import { CanvasElement } from '../types/canvas';
import DraggableRect from '../atoms/DraggableRect';
import DraggableCircle from '../atoms/DraggableCircle';
import DraggablePolygon from '../atoms/DraggablePolygon';
import DraggableStar from '../atoms/DraggableStar';
import DraggableLine from '../atoms/DraggableLine';
import DraggableArrow from '../atoms/DraggableArrow';
import DraggableText from '../atoms/DraggableText';
import DraggableImage from '../atoms/DraggableImage';

interface ShapeFactoryProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  onTransformEnd?: (attrs: any) => void;
  onTextEdit?: (text: string) => void;
}

export const renderShape = ({
  element,
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd,
  onTextEdit,
}: ShapeFactoryProps) => {
  const commonProps = {
    id: element.id,
    name: element.id,
    x: element.x,
    y: element.y,
    rotation: element.rotation,
    fill: element.fill,
    stroke: element.stroke,
    strokeWidth: element.strokeWidth,
    strokeDasharray: element.strokeDasharray,
    opacity: element.opacity,
    isSelected,
    onSelect,
    onDragEnd,
    onTransformEnd,
  };

  switch (element.type) {
    case 'rectangle':
      return (
        <DraggableRect
          key={element.id}
          {...commonProps}
          width={element.width || 200}
          height={element.height || 150}
        />
      );

    case 'circle':
      return (
        <DraggableCircle
          key={element.id}
          {...commonProps}
          radius={element.radius || 75}
          radiusX={element.radiusX}
          radiusY={element.radiusY}
        />
      );

    case 'triangle':
      return (
        <DraggablePolygon
          key={element.id}
          {...commonProps}
          radius={element.radius || 75}
          sides={3}
          scaleX={element.scaleX}
          scaleY={element.scaleY}
        />
      );

    case 'pentagon':
      return (
        <DraggablePolygon
          key={element.id}
          {...commonProps}
          radius={element.radius || 75}
          sides={5}
          scaleX={element.scaleX}
          scaleY={element.scaleY}
        />
      );

    case 'hexagon':
      return (
        <DraggablePolygon
          key={element.id}
          {...commonProps}
          radius={element.radius || 75}
          sides={6}
          scaleX={element.scaleX}
          scaleY={element.scaleY}
        />
      );

    case 'star':
      return (
        <DraggableStar
          key={element.id}
          {...commonProps}
          innerRadius={element.innerRadius || 40}
          outerRadius={element.outerRadius || 80}
          scaleX={element.scaleX}
          scaleY={element.scaleY}
        />
      );

    case 'line':
      return (
        <DraggableLine
          key={element.id}
          {...commonProps}
          width={element.width || 200}
        />
      );

    case 'arrow':
      return (
        <DraggableArrow
          key={element.id}
          {...commonProps}
          width={element.width || 200}
        />
      );

    case 'text':
      return (
        <DraggableText
          key={element.id}
          {...commonProps}
          text={element.text || 'Enter your Text'}
          fontSize={element.fontSize || 24}
          fontFamily={element.fontFamily || 'Arial'}
          fontStyle={element.fontStyle || 'normal'}
          fontWeight={element.fontWeight || 400}
          width={element.width || 50}
          onTextEdit={onTextEdit}
        />
      );

    case 'image':
      return (
        <DraggableImage
          key={element.id}
          {...commonProps}
          width={element.width || 300}
          height={element.height || 225}
          imageUrl={element.imageUrl || ''}
          imageFilter={element.imageFilter}
          imageFilterIntensity={element.imageFilterIntensity}
        />
      );

    default:
      console.warn(`Unknown element type: ${element.type}`);
      return null;
  }
};

