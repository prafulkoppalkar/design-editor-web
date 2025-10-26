export interface User {
  id?: string;
  _id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface Comment {
  _id: string;
  designId: string;
  author: User;
  text: string;
  mentions: User[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCommentRequest {
  designId: string;
  authorId: string;
  text: string;
  mentions: string[];
}

export interface CreateCommentResponse {
  success: boolean;
  data: Comment;
  message?: string;
}

export interface GetCommentsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  totalPages: number;
  data: Comment[];
}

export interface SearchUsersResponse {
  success: boolean;
  count: number;
  data: User[];
}

export interface CommentsState {
  comments: Comment[];
  users: User[];
  loading: boolean;
  error: string | null;
}

