import { Ellipse } from 'react-konva';
import Konva from 'konva';
import { CircleProps } from '../types/shapeProps';

export default function DraggableCircle({
  id,
  name,
  x,
  y,
  radius,
  radiusX,
  radiusY,
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
}: CircleProps) {
  const rx = radiusX ?? radius;
  const ry = radiusY ?? radius;

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    onDragEnd(node.x(), node.y());
  };

  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    const newRadiusX = Math.max(10, rx * scaleX);
    const newRadiusY = Math.max(10, ry * scaleY);

    node.scaleX(1);
    node.scaleY(1);

    if (onTransformEnd) {
      onTransformEnd({
        x: node.x(),
        y: node.y(),
        radiusX: newRadiusX,
        radiusY: newRadiusY,
        rotation: node.rotation(),
      });
    }
  };

  return (
    <Ellipse
      id={id}
      name={name}
      x={x}
      y={y}
      radiusX={rx}
      radiusY={ry}
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

