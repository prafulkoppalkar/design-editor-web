export interface BaseShapeProps {
  id: string;
  name: string;
  x: number;
  y: number;
  rotation: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  opacity?: number;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  onTransformEnd?: (attrs: {
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;
    radiusX?: number;
    radiusY?: number;
    rotation: number;
    scaleX?: number;
    scaleY?: number;
    fontSize?: number;
    innerRadius?: number;
    outerRadius?: number;
  }) => void;
}

export interface RectangleProps extends BaseShapeProps {
  width: number;
  height: number;
}

export interface CircleProps extends BaseShapeProps {
  radius: number;
  radiusX?: number;
  radiusY?: number;
}

export interface PolygonProps extends BaseShapeProps {
  radius: number;
  sides: number;
  scaleX?: number;
  scaleY?: number;
}

export interface StarProps extends BaseShapeProps {
  innerRadius: number;
  outerRadius: number;
  scaleX?: number;
  scaleY?: number;
}

export interface LineProps extends BaseShapeProps {
  width: number;
}

export interface ArrowProps extends BaseShapeProps {
  width: number;
}

export interface TextProps extends BaseShapeProps {
  text: string;
  fontSize: number;
  fontFamily?: string;
  fontStyle?: string;
  fontWeight?: number;
  width?: number;
  onTextEdit?: (text: string) => void;
}

