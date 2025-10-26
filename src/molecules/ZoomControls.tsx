import { ZoomIn, ZoomOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { zoomIn, zoomOut } from '../store/canvasSlice';

export default function ZoomControls() {
  const dispatch = useAppDispatch();
  const zoom = useAppSelector((state) => state.canvas.zoom);

  const zoomPercentage = Math.round(zoom * 100);

  const handleZoomIn = () => {
    dispatch(zoomIn());
  };

  const handleZoomOut = () => {
    dispatch(zoomOut());
  };

  return (
    <div className="fixed bottom-[3px] left-1/2 z-10 flex -translate-x-[30%] items-center gap-1 rounded-lg bg-white px-3 py-1.5 shadow-lg">
      <button
        onClick={handleZoomOut}
        disabled={zoom <= 0.1}
        className="rounded p-1 text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        title="Zoom Out"
      >
        <ZoomOut className="h-4 w-4" />
      </button>

      <span className="min-w-[50px] text-center text-xs font-medium text-gray-700">
        {zoomPercentage}%
      </span>
      <button
        onClick={handleZoomIn}
        disabled={zoom >= 4}
        className="rounded p-1 text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        title="Zoom In"
      >
        <ZoomIn className="h-4 w-4" />
      </button>
    </div>
  );
}

