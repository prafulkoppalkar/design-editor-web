import { apiClient } from './api';

export interface DesignElement {
  id: string;
  type: string;
  content?: string;
  shapeType?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  fontSize?: number;
  color?: string;
  fill?: string;
}

export interface Design {
  _id: string;
  name: string;
  description?: string;
  width: number;
  height: number;
  elements: DesignElement[];
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface DesignsApiResponse {
  success: boolean;
  count: number;
  data: Design[];
}

export const designsApi = {
  // Get all designs
  getDesigns: async (): Promise<Design[]> => {
    const response = await apiClient.get<DesignsApiResponse>('/designs');
    return response.data.data; // Extract the data array from the response
  },

  // Get single design
  getDesign: async (id: string): Promise<Design> => {
    const response = await apiClient.get(`/designs/${id}`);
    return response.data;
  },

  // Create design
  createDesign: async (data: { name: string; canvas?: any }): Promise<Design> => {
    const response = await apiClient.post('/designs', data);
    return response.data;
  },

  // Update design
  updateDesign: async (id: string, data: Partial<Design>): Promise<Design> => {
    const response = await apiClient.put(`/designs/${id}`, data);
    return response.data;
  },

  // Delete design
  deleteDesign: async (id: string): Promise<void> => {
    await apiClient.delete(`/designs/${id}`);
  },
};

