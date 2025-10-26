import axios from 'axios';
import { CanvasElement } from '../types/canvas';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://design-editor-backend-production.up.railway.app/api';

export interface Design {
  _id: string;
  name: string;
  description?: string;
  width: number;
  height: number;
  canvasBackground: string;
  elements: CanvasElement[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
  details?: string;
  count?: number;
}

// Get all designs
export const getAllDesigns = async (): Promise<Design[]> => {
  try {
    const response = await axios.get<ApiResponse<Design[]>>(`${API_BASE_URL}/designs`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch designs');
  } catch (error) {
    console.error('Error fetching designs:', error);
    throw error;
  }
};

// Get single design by ID
export const getDesignById = async (id: string): Promise<Design> => {
  try {
    const response = await axios.get<ApiResponse<Design>>(`${API_BASE_URL}/designs/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch design');
  } catch (error) {
    console.error('Error fetching design:', error);
    throw error;
  }
};

// Create new design
export const createDesign = async (designData: {
  name: string;
  description?: string;
  width?: number;
  height?: number;
  canvasBackground?: string;
  elements?: CanvasElement[];
}): Promise<Design> => {
  try {
    const response = await axios.post<ApiResponse<Design>>(
      `${API_BASE_URL}/designs/create`,
      designData
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to create design');
  } catch (error) {
    console.error('Error creating design:', error);
    throw error;
  }
};

// Update design (name, elements, canvas properties, etc.)
export const updateDesign = async (
  id: string,
  updates: Partial<{
    name: string;
    description: string;
    width: number;
    height: number;
    canvasBackground: string;
    elements: CanvasElement[];
  }>
): Promise<Design> => {
  try {
    const response = await axios.put<ApiResponse<Design>>(
      `${API_BASE_URL}/designs/${id}`,
      updates
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update design');
  } catch (error) {
    console.error('Error updating design:', error);
    throw error;
  }
};

// Delete design
export const deleteDesign = async (id: string): Promise<void> => {
  try {
    const response = await axios.delete<ApiResponse<{ id: string; name: string }>>(
      `${API_BASE_URL}/designs/${id}`
    );
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete design');
    }
  } catch (error) {
    console.error('Error deleting design:', error);
    throw error;
  }
};

// Rename design (convenience function using updateDesign)
export const renameDesign = async (id: string, newName: string): Promise<Design> => {
  return updateDesign(id, { name: newName });
};

// Save design elements
export const saveDesignElements = async (id: string, elements: CanvasElement[]): Promise<Design> => {
  return updateDesign(id, { elements });
};

