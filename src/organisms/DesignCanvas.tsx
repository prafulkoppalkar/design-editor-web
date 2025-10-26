import { useRef, useEffect } from 'react';
import { Stage, Layer, Transformer } from 'react-konva';
import Konva from 'konva';
import { useAppSelector, useAppDispatch } from '../store';
import { updateElement, selectElement, deselectElement, deleteElement } from '../store/canvasSlice';
import { renderShape } from '../utils/shapeFactory';
import { useCanvasContext } from '../context/CanvasContext';

export default function DesignCanvas() {
  const dispatch = useAppDispatch();
  const elements = useAppSelector((state) => state.canvas.elements);
  const selectedElementId = useAppSelector((state) => state.canvas.selectedElementId);
  const canvasWidth = useAppSelector((state) => state.canvas.canvasWidth);
  const canvasHeight = useAppSelector((state) => state.canvas.canvasHeight);
  const zoom = useAppSelector((state) => state.canvas.zoom);
  const canvasBackground = useAppSelector((state) => state.canvas.canvasBackground);

  const { stageRef } = useCanvasContext();
  const transformerRef = useRef<Konva.Transformer>(null);
  const layerRef = useRef<Konva.Layer>(null);

  // Attach transformer to selected shape (except lines and arrows)
  useEffect(() => {
    if (transformerRef.current && layerRef.current && selectedElementId) {
      const selectedNode = layerRef.current.findOne(`#${selectedElementId}`);
      const selectedElement = elements.find(el => el.id === selectedElementId);

      if (selectedNode && selectedElement) {
        const transformer = transformerRef.current;

        // Lines and arrows use draggable endpoints instead of transformer
        if (selectedElement.type === 'line' || selectedElement.type === 'arrow') {
          transformer.nodes([]);
          return;
        }

        // Configure transformer based on element type
        if (selectedElement.type === 'text') {
          // Text only resizes horizontally (width)
          transformer.enabledAnchors(['middle-left', 'middle-right']);
          transformer.keepRatio(false);
        } else {
          // All other shapes (including images) get 8 anchors for full resize control
          transformer.enabledAnchors([
            'top-left', 'top-right', 'bottom-left', 'bottom-right',
            'top-center', 'middle-right', 'middle-left', 'bottom-center'
          ]);
          transformer.keepRatio(false);
        }

        // Attach the node AFTER configuration
        transformer.nodes([selectedNode]);
        transformer.getLayer()?.batchDraw();
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
    }
  }, [selectedElementId, elements]);

  // Handle keyboard events (Delete and Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keyboard shortcuts if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      // Delete selected element
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId) {
        e.preventDefault();
        dispatch(deleteElement(selectedElementId));
      }
      // Deselect on Escape
      if (e.key === 'Escape') {
        dispatch(deselectElement());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, dispatch]);

  const handleStageClick = (e: any) => {
    // Deselect when clicking on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      dispatch(deselectElement());
    }
  };

  const handleDragEnd = (id: string, x: number, y: number) => {
    dispatch(updateElement({ id, changes: { x, y } }));
  };

  const handleTransformEnd = (id: string, attrs: any) => {
    dispatch(updateElement({ id, changes: attrs }));
  };

  const handleSelect = (id: string) => {
    dispatch(selectElement(id));
  };

  const handleTextEdit = (id: string, newText: string) => {
    dispatch(updateElement({ id, changes: { text: newText } }));
  };

  return (
    <div className="flex h-full items-center justify-center overflow-hidden bg-gray-100 p-8">
      <div
        className="rounded-lg border-2 border-gray-300 shadow-xl"
        style={{
          width: canvasWidth * zoom,
          height: canvasHeight * zoom,
          background: canvasBackground,
        }}
      >
        <Stage
          ref={stageRef}
          width={canvasWidth}
          height={canvasHeight}
          scaleX={zoom}
          scaleY={zoom}
          onClick={handleStageClick}
          onTap={handleStageClick}
        >
          <Layer ref={layerRef}>
            {elements.map((element) =>
              renderShape({
                element,
                isSelected: element.id === selectedElementId,
                onSelect: () => handleSelect(element.id),
                onDragEnd: (x, y) => handleDragEnd(element.id, x, y),
                onTransformEnd: (attrs) => handleTransformEnd(element.id, attrs),
                onTextEdit: (text) => handleTextEdit(element.id, text),
              })
            )}

            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                // Limit resize to minimum size
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}

