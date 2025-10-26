import { ElementType } from '../types/canvas';

export interface ShapePreset {
  id: string;
  name: string;
  type: ElementType;
  icon: string; // SVG path or emoji for preview
  defaultProps: {
    width?: number;
    height?: number;
    radius?: number;
    sides?: number;
    fill: string;
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
    innerRadius?: number;
    outerRadius?: number;
  };
}

// Move this to DB instead of storing here and fetch from metadata API 
export const linePresets: ShapePreset[] = [
  {
    id: 'solid-line',
    name: 'Solid Line',
    type: 'line',
    icon: '━',
    defaultProps: {
      width: 200,
      height: 0,
      stroke: '#000000',
      strokeWidth: 5,
      fill: '#000000',
    },
  },
  {
    id: 'arrow',
    name: 'Arrow',
    type: 'arrow',
    icon: '→',
    defaultProps: {
      width: 200,
      height: 0,
      stroke: '#000000',
      strokeWidth: 5,
      fill: '#000000',
    },
  },
];

export const textPresets: ShapePreset[] = [
  {
    id: 'text',
    name: 'Text',
    type: 'text',
    icon: 'T',
    defaultProps: {
      width: 200,
      fill: '#000000',
      stroke: '#000000',
      strokeWidth: 0,
    },
  },
];

export const shapePresets: ShapePreset[] = [
  {
    id: 'rectangle',
    name: 'Rectangle',
    type: 'rectangle',
    icon: '▬',
    defaultProps: {
      width: 200,
      height: 150,
      fill: '#9ca3af',
      stroke: '#6b7280',
      strokeWidth: 0,
    },
  },
  {
    id: 'circle',
    name: 'Circle',
    type: 'circle',
    icon: '●',
    defaultProps: {
      radius: 75,
      fill: '#9ca3af',
      stroke: '#6b7280',
      strokeWidth: 0,
    },
  },
  {
    id: 'star',
    name: 'Star',
    type: 'star',
    icon: '★',
    defaultProps: {
      innerRadius: 40,
      outerRadius: 80,
      fill: '#9ca3af',
      stroke: '#6b7280',
      strokeWidth: 0,
    },
  },
  {
    id: 'triangle',
    name: 'Triangle',
    type: 'triangle',
    icon: '▲',
    defaultProps: {
      radius: 75,
      sides: 3,
      fill: '#9ca3af',
      stroke: '#6b7280',
      strokeWidth: 0,
    },
  },
  {
    id: 'pentagon',
    name: 'Pentagon',
    type: 'pentagon',
    icon: '⬟',
    defaultProps: {
      radius: 75,
      sides: 5,
      fill: '#9ca3af',
      stroke: '#6b7280',
      strokeWidth: 0,
    },
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    type: 'hexagon',
    icon: '⬢',
    defaultProps: {
      radius: 75,
      sides: 6,
      fill: '#9ca3af',
      stroke: '#6b7280',
      strokeWidth: 0,
    },
  },
];

