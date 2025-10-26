import { RegularPolygon } from 'react-konva';
import Konva from 'konva';
import { PolygonProps } from '../types/shapeProps';

export default function DraggablePolygon({
  id,
  name,
  x,
  y,
  radius,
  sides,
  fill,
  stroke,
  strokeWidth = 0,
  strokeDasharray,
  opacity = 1,
  rotation,
  scaleX = 1,
  scaleY = 1,
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd,
}: PolygonProps) {
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    onDragEnd(node.x(), node.y());
  };

  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const node = e.target;

    if (onTransformEnd) {
      onTransformEnd({
        x: node.x(),
        y: node.y(),
        scaleX: node.scaleX(),
        scaleY: node.scaleY(),
        rotation: node.rotation(),
      });
    }
  };

  return (
    <RegularPolygon
      id={id}
      name={name}
      x={x}
      y={y}
      sides={sides}
      radius={radius}
      scaleX={scaleX}
      scaleY={scaleY}
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

