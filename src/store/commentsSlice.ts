import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CommentsState } from '../types/comments';
import * as commentsApi from '../services/commentsApi';
import * as usersApi from '../services/usersApi';

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (designId: string) => {
    const response = await commentsApi.getComments(designId);
    return response.data;
  }
);

export const addCommentAsync = createAsyncThunk(
  'comments/addComment',
  async (payload: {
    designId: string;
    authorId: string;
    text: string;
    mentions: string[];
  }) => {
    const response = await commentsApi.createComment(
      payload.designId,
      payload.authorId,
      payload.text,
      payload.mentions
    );
    return response.data;
  }
);

export const deleteCommentAsync = createAsyncThunk(
  'comments/deleteComment',
  async (commentId: string) => {
    await commentsApi.deleteComment(commentId);
    return commentId;
  }
);

export const searchUsersAsync = createAsyncThunk(
  'comments/searchUsers',
  async (query: string) => {
    const response = await usersApi.searchUsers(query);
    return response.data;
  }
);

const initialState: CommentsState = {
  comments: [],
  users: [],
  loading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch comments';
      });

    builder
      .addCase(addCommentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCommentAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.unshift(action.payload);
      })
      .addCase(addCommentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create comment';
      });

    builder
      .addCase(deleteCommentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCommentAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload
        );
      })
      .addCase(deleteCommentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete comment';
      });

    builder
      .addCase(searchUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(searchUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search users';
      });
  },
});

export const { setError } = commentsSlice.actions;

export default commentsSlice.reducer;

