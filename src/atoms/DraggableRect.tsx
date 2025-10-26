import { Rect } from 'react-konva';
import Konva from 'konva';
import { RectangleProps } from '../types/shapeProps';

export default function DraggableRect({
  id,
  name,
  x,
  y,
  width,
  height,
  fill,
  stroke,
  strokeWidth = 0,
  strokeDasharray,
  opacity = 1,
  rotation,
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd,
}: RectangleProps) {
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    onDragEnd(node.x(), node.y());
  };

  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    if (onTransformEnd) {
      onTransformEnd({
        x: node.x(),
        y: node.y(),
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(5, node.height() * scaleY),
        rotation: node.rotation(),
      });
    }
  };

  return (
    <Rect
      id={id}
      name={name}
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      stroke={isSelected ? '#3b82f6' : stroke}
      strokeWidth={isSelected ? 2 : strokeWidth}
      strokeDasharray={strokeDasharray}
      opacity={opacity}
      rotation={rotation}
      draggable
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
      onClick={onSelect}
      onTap={onSelect}
      onMouseEnter={(e) => {
        const container = e.target.getStage()?.container();
        if (container) {
          container.style.cursor = 'move';
        }
      }}
      onMouseLeave={(e) => {
        const container = e.target.getStage()?.container();
        if (container) {
          container.style.cursor = 'default';
        }
      }}
    />
  );
}

