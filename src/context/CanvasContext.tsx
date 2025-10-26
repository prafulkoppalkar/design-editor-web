import React, { createContext, useContext, useRef } from 'react';
import Konva from 'konva';

interface CanvasContextType {
  stageRef: React.MutableRefObject<Konva.Stage | null>;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const stageRef = useRef<Konva.Stage | null>(null);

  return (
    <CanvasContext.Provider value={{ stageRef }}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvasContext = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvasContext must be used within CanvasProvider');
  }
  return context;
};

