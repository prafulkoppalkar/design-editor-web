import { apiClient } from './api';
import { GetCommentsResponse, CreateCommentResponse } from '../types/comments';

export const getComments = async (
  designId: string,
  page: number = 1,
  limit: number = 20
): Promise<GetCommentsResponse> => {
  try {
    const response = await apiClient.get<GetCommentsResponse>('/comments', {
      params: {
        designId,
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    throw error;
  }
};


export const createComment = async (
  designId: string,
  authorId: string,
  text: string,
  mentions: string[] = []
): Promise<CreateCommentResponse> => {
  try {
    const response = await apiClient.post<CreateCommentResponse>('/comments/create', {
      designId,
      authorId,
      text,
      mentions,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create comment:', error);
    throw error;
  }
};

export const deleteComment = async (commentId: string): Promise<any> => {
  try {
    const response = await apiClient.delete(`/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete comment:', error);
    throw error;
  }
};

