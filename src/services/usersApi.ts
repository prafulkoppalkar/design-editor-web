import { apiClient } from './api';
import { SearchUsersResponse } from '../types/comments';

export const searchUsers = async (
  query: string,
  limit: number = 10
): Promise<SearchUsersResponse> => {
  try {
    const response = await apiClient.get<SearchUsersResponse>('/users/search', {
      params: {
        q: query,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to search users:', error);
    throw error;
  }
};

