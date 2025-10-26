import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchComments, addCommentAsync, deleteCommentAsync } from '../store/commentsSlice';
import CommentInput from './CommentInput';
import CommentItem from '../atoms/CommentItem';
import { User } from '../types/comments';

export default function CommentsPanel() {
  const dispatch = useAppDispatch();
  const { id: designId } = useParams<{ id: string }>();
  const comments = useAppSelector((state) => state.comments.comments);
  const loading = useAppSelector((state) => state.comments.loading);
  const error = useAppSelector((state) => state.comments.error);

  // Hardcoded current user due to time contraints
  // TODO: Replace with actual user data from auth once implemented
  const currentUser: User = {
    _id: '68fdba1abaef7b45c22f6408',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  };

  // Fetch comments when component mounts or designId changes
  useEffect(() => {
    if (designId) {
      dispatch(fetchComments(designId));
    }
  }, [designId, dispatch]);

  const handleAddComment = async (text: string, mentions: string[]) => {
    if (!designId) return;

    dispatch(
      addCommentAsync({
        designId,
        authorId: currentUser._id,
        text,
        mentions,
      })
    );
  };

  const handleDeleteComment = (commentId: string) => {
    dispatch(deleteCommentAsync(commentId));
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">

      <CommentInput
        onSubmit={handleAddComment}
        currentUser={currentUser}
      />

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex h-full items-center justify-center px-4">
            <p className="text-center text-xs text-gray-500">Loading comments...</p>
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center px-4">
            <p className="text-center text-xs text-red-500">{error}</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="flex h-full items-center justify-center px-4">
            <p className="text-center text-xs text-gray-500">
              No comments yet. Be the first to comment!
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                onDelete={handleDeleteComment}
                currentUser={currentUser}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

