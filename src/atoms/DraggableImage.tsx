import { useEffect, useRef } from 'react';
import { Image as KonvaImage } from 'react-konva';
import Konva from 'konva';

interface DraggableImageProps {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity?: number;
  imageUrl: string;
  imageFilter?: string;
  imageFilterIntensity?: number;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  onTransformEnd?: (attrs: any) => void;
}

export default function DraggableImage({
  id,
  name,
  x,
  y,
  width,
  height,
  rotation,
  opacity = 1,
  imageUrl,
  imageFilter,
  imageFilterIntensity = 0,
  onSelect,
  onDragEnd,
  onTransformEnd,
}: DraggableImageProps) {
  const imageRef = useRef<Konva.Image>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  // Apply filters to image
  useEffect(() => {
    if (!imageRef.current || !imageObjRef.current) return;

    // Clear filters if no filter selected
    if (!imageFilter || imageFilter === 'none') {
      imageRef.current.filters([]);
      imageRef.current.getLayer()?.batchDraw();
      return;
    }

    const intensity = imageFilterIntensity / 100;
    const image = imageRef.current;

    // Build filters array based on selected filter
    const filters: any[] = [];

    switch (imageFilter) {
      case 'blur':
        filters.push(Konva.Filters.Blur);
        image.blurRadius(Math.max(0, intensity * 20));
        break;
      case 'brightness':
        filters.push(Konva.Filters.Brighten);
        image.brightness(Math.max(-1, Math.min(1, intensity)));
        break;
      case 'contrast':
        filters.push(Konva.Filters.Contrast);
        image.contrast(Math.max(-100, Math.min(100, intensity * 100)));
        break;
      case 'grayscale':
        filters.push(Konva.Filters.Grayscale);
        break;
      case 'sepia':
        filters.push(Konva.Filters.Sepia);
        break;
    }

    // Apply filters
    image.filters(filters);
    image.getLayer()?.batchDraw();
  }, [imageFilter, imageFilterIntensity]);

  // Load image
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => {
      imageObjRef.current = img;
      if (imageRef.current) {
        imageRef.current.image(img);
        imageRef.current.getLayer()?.batchDraw();
      }
    };
  }, [imageUrl]);

  const handleDragEnd = (e: any) => {
    onDragEnd(e.target.x(), e.target.y());
  };

  const handleTransformEnd = () => {
    if (imageRef.current) {
      const node = imageRef.current;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();

      onTransformEnd?.({
        x: node.x(),
        y: node.y(),
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(5, node.height() * scaleY),
        rotation: node.rotation(),
        scaleX: 1,
        scaleY: 1,
      });
    }
  };

  return (
    <KonvaImage
      ref={imageRef}
      id={id}
      name={name}
      x={x}
      y={y}
      width={width}
      height={height}
      rotation={rotation}
      opacity={opacity}
      image={imageObjRef.current || undefined}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
    />
  );
}

