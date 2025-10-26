import { Group, Line, Circle } from 'react-konva';
import Konva from 'konva';
import { LineProps } from '../types/shapeProps';

export default function DraggableLine({
  id,
  name,
  x,
  y,
  width,
  fill,
  stroke,
  strokeWidth = 2,
  strokeDasharray,
  opacity = 1,
  rotation,
  isSelected,
  onSelect,
  onTransformEnd,
}: LineProps) {
  // Calculate endpoints based on x, y, width, rotation
  const x1 = x;
  const y1 = y;
  const x2 = x + width * Math.cos((rotation || 0) * Math.PI / 180);
  const y2 = y + width * Math.sin((rotation || 0) * Math.PI / 180);

  const handleLineDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    const dx = node.x();
    const dy = node.y();

    // Move both endpoints by the same delta
    if (onTransformEnd) {
      onTransformEnd({
        x: x1 + dx,
        y: y1 + dy,
        width,
        rotation,
      });
    }

    node.position({ x: 0, y: 0 });
  };

  const handlePoint1DragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const newX1 = e.target.x();
    const newY1 = e.target.y();

    // Calculate new width and rotation
    const newWidth = Math.sqrt(Math.pow(x2 - newX1, 2) + Math.pow(y2 - newY1, 2));
    const newRotation = Math.atan2(y2 - newY1, x2 - newX1) * 180 / Math.PI;

    if (onTransformEnd) {
      onTransformEnd({
        x: newX1,
        y: newY1,
        width: Math.max(10, newWidth),
        rotation: newRotation,
      });
    }
  };

  const handlePoint2DragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const newX2 = e.target.x();
    const newY2 = e.target.y();

    // Calculate new width and rotation
    const newWidth = Math.sqrt(Math.pow(newX2 - x1, 2) + Math.pow(newY2 - y1, 2));
    const newRotation = Math.atan2(newY2 - y1, newX2 - x1) * 180 / Math.PI;

    if (onTransformEnd) {
      onTransformEnd({
        x: x1,
        y: y1,
        width: Math.max(10, newWidth),
        rotation: newRotation,
      });
    }
  };

  return (
    <Group>
      <Line
        id={id}
        name={name}
        points={[x1, y1, x2, y2]}
        stroke={isSelected ? '#3b82f6' : (stroke || fill)}
        strokeWidth={isSelected ? strokeWidth + 1 : strokeWidth}
        strokeDasharray={strokeDasharray}
        opacity={opacity}
        draggable
        onDragEnd={handleLineDragEnd}
        onClick={onSelect}
        onTap={onSelect}
        lineCap="round"
        lineJoin="round"
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

      {/* Endpoint circles - only visible when selected */}
      {isSelected && (
        <>
          <Circle
            x={x1}
            y={y1}
            radius={6}
            fill="#3b82f6"
            stroke="#ffffff"
            strokeWidth={2}
            draggable
            onDragEnd={handlePoint1DragEnd}
            onMouseEnter={(e) => {
              const container = e.target.getStage()?.container();
              if (container) {
                container.style.cursor = 'pointer';
              }
            }}
            onMouseLeave={(e) => {
              const container = e.target.getStage()?.container();
              if (container) {
                container.style.cursor = 'default';
              }
            }}
          />
          <Circle
            x={x2}
            y={y2}
            radius={6}
            fill="#3b82f6"
            stroke="#ffffff"
            strokeWidth={2}
            draggable
            onDragEnd={handlePoint2DragEnd}
            onMouseEnter={(e) => {
              const container = e.target.getStage()?.container();
              if (container) {
                container.style.cursor = 'pointer';
              }
            }}
            onMouseLeave={(e) => {
              const container = e.target.getStage()?.container();
              if (container) {
                container.style.cursor = 'default';
              }
            }}
          />
        </>
      )}
    </Group>
  );
}

