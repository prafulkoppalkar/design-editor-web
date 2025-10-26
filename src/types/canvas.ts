export type ElementType =
  | 'rectangle'
  | 'circle'
  | 'triangle'
  | 'star'
  | 'pentagon'
  | 'hexagon'
  | 'line'
  | 'arrow'
  | 'text'
  | 'image';

export interface CanvasElement {
  id: string;
  type: ElementType;
  name?: string;
  x: number;
  y: number;
  rotation: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;

  width?: number;
  height?: number;
  radius?: number;
  radiusX?: number;
  radiusY?: number;
  sides?: number;
  points?: number[];
  innerRadius?: number;
  outerRadius?: number;
  scaleX?: number;
  scaleY?: number;

  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: string;
  fontWeight?: number;

  imageUrl?: string;
  photographer?: string;

  strokeDasharray?: string;
  imageFilter?: string;
  imageFilterIntensity?: number;
}

export interface CanvasState {
  elements: CanvasElement[];
  selectedElementId: string | null;
  activeTool: string | null;
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
  canvasBackground: string;
}

export interface CanvasSnapshot {
  elements: CanvasElement[];
  canvasBackground: string;
  canvasWidth: number;
  canvasHeight: number;
}

export interface HistoryState {
  past: CanvasSnapshot[];
  present: CanvasSnapshot;
  future: CanvasSnapshot[];
}

