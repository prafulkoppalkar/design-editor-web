import { useEffect, useRef } from 'react';
import DesignCanvas from './DesignCanvas';
import ZoomControls from '../molecules/ZoomControls';
import { useAppDispatch, useAppSelector } from '../store';
import { setZoom } from '../store/canvasSlice';

export default function CanvasArea() {
  const dispatch = useAppDispatch();
  const canvasWidth = useAppSelector((state) => state.canvas.canvasWidth);
  const canvasHeight = useAppSelector((state) => state.canvas.canvasHeight);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-calculate zoom to fit canvas in viewport on mount and when canvas size changes
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Account for padding (64px total: 32px on each side)
    // Account for zoom controls height (50px) and spacing
    const availableWidth = containerWidth - 64;
    const availableHeight = containerHeight - 64 - 50;

    // Calculate zoom to fit
    const zoomToFitWidth = availableWidth / canvasWidth;
    const zoomToFitHeight = availableHeight / canvasHeight;
    const zoomToFit = Math.min(zoomToFitWidth, zoomToFitHeight);

    // Clamp to reasonable zoom levels and round to nearest 1%
    const clampedZoom = Math.max(0.1, Math.min(4, zoomToFit));
    const roundedZoom = Math.round(clampedZoom * 100) / 100;

    dispatch(setZoom(roundedZoom));
  }, [canvasWidth, canvasHeight, dispatch]);

  return (
    <div ref={containerRef} className="relative flex h-full w-full flex-col items-center justify-center bg-gray-100">
      <DesignCanvas />
      <ZoomControls />
    </div>
  );
}

