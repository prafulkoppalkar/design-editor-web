import { useRef } from 'react';
import { Text } from 'react-konva';
import Konva from 'konva';
import { TextProps } from '../types/shapeProps';

export default function DraggableText({
  id,
  name,
  x,
  y,
  text,
  fontSize,
  fontFamily = 'Arial',
  fontStyle = 'normal',
  fontWeight = 400,
  fill,
  stroke,
  strokeWidth = 0,
  opacity = 1,
  rotation,
  width = 200,
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd,
  onTextEdit,
}: TextProps) {
  const textRef = useRef<Konva.Text>(null);
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    onDragEnd(node.x(), node.y());
  };

  const handleTransform = () => {
    const node = textRef.current;
    if (!node) return;

    // Update width based on scale, reset scaleX to 1
    const newWidth = Math.max(20, node.width() * node.scaleX());
    node.width(newWidth);
    node.scaleX(1);
  };

  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const node = e.target;

    if (onTransformEnd) {
      onTransformEnd({
        x: node.x(),
        y: node.y(),
        rotation: node.rotation(),
        width: node.width(),
      });
    }
  };

  const handleDoubleClick = () => {
    if (!onTextEdit) return;

    const textNode = textRef.current;
    if (!textNode) return;

    const stage = textNode.getStage();
    if (!stage) return;

    // Hide text node
    textNode.hide();

    // Create textarea
    const textPosition = textNode.absolutePosition();
    const stageBox = stage.container().getBoundingClientRect();

    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    textarea.value = text;
    textarea.style.position = 'absolute';
    textarea.style.top = `${stageBox.top + textPosition.y}px`;
    textarea.style.left = `${stageBox.left + textPosition.x}px`;
    textarea.style.width = `${textNode.width()}px`;
    textarea.style.fontSize = `${fontSize}px`;
    textarea.style.fontFamily = fontFamily;
    textarea.style.fontStyle = fontStyle;
    textarea.style.fontWeight = fontWeight.toString();
    textarea.style.border = '2px solid #3b82f6';
    textarea.style.padding = '4px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'white';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.lineHeight = '1.2';
    textarea.style.transformOrigin = 'left top';
    textarea.style.textAlign = 'left';
    textarea.style.color = fill;

    textarea.focus();
    textarea.select();

    const removeTextarea = () => {
      textarea.parentNode?.removeChild(textarea);
      textNode.show();
      stage.draw();
    };

    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const newText = textarea.value;
        removeTextarea();
        // Update text after removing textarea to avoid race condition
        setTimeout(() => {
          onTextEdit(newText);
        }, 0);
      }
      if (e.key === 'Escape') {
        removeTextarea();
      }
    });

    textarea.addEventListener('blur', () => {
      const newText = textarea.value;
      removeTextarea();
      // Update text after removing textarea to avoid race condition
      setTimeout(() => {
        onTextEdit(newText);
      }, 0);
    });
  };

  // Build combined fontStyle that includes weight
  const buildFontStyle = (): string => {
    const isBold = fontWeight >= 700;
    const isItalic = fontStyle === 'italic';

    if (isBold && isItalic) return 'bold italic';
    if (isBold) return 'bold';
    if (isItalic) return 'italic';
    return 'normal';
  };

  return (
    <Text
      ref={textRef}
      id={id}
      name={name}
      x={x}
      y={y}
      text={text}
      fontSize={fontSize}
      fontFamily={fontFamily}
      fontStyle={buildFontStyle()}
      fill={fill}
      stroke={isSelected ? '#3b82f6' : stroke}
      strokeWidth={isSelected ? 1 : strokeWidth}
      opacity={opacity}
      rotation={rotation}
      width={width}
      draggable
      onDragEnd={handleDragEnd}
      onTransform={handleTransform}
      onTransformEnd={handleTransformEnd}
      onClick={onSelect}
      onTap={onSelect}
      onDblClick={handleDoubleClick}
      onDblTap={handleDoubleClick}
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

