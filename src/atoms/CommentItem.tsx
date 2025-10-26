import { Comment, User } from '../types/comments';

interface CommentItemProps {
  comment: Comment;
  onDelete?: (commentId: string) => void;
  currentUser?: User;
}

export default function CommentItem({ comment, onDelete, currentUser }: CommentItemProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(comment._id);
    }
  };

  // Parse text to render mentions inline with subtle tag style
  const renderTextWithMentions = () => {
    let text = comment.text;
    const mentionMap = new Map(comment.mentions.map((m) => [m.name, m]));

    // Create regex pattern from actual mention names to match exactly
    if (comment.mentions.length === 0) {
      return text;
    }

    const mentionNames = comment.mentions.map((m) => m.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const mentionRegex = new RegExp(`(@(?:${mentionNames}))`, 'g');

    const parts = text.split(mentionRegex);

    return parts.map((part, idx) => {
      if (part && part.startsWith('@')) {
        const mentionName = part.substring(1);
        const mention = mentionMap.get(mentionName);
        if (mention) {
          return (
            <span
              key={idx}
              className="inline-block rounded-md bg-blue-100 px-2 py-0.5 text-xs text-blue-600 mx-0.5"
              title={mention.email}
            >
              {part}
            </span>
          );
        }
      }
      return part;
    });
  };

  const isCurrentUser = currentUser && comment.author._id === currentUser._id;
  const authorDisplayName = isCurrentUser ? 'You' : comment.author.name;

  return (
    <div className="border-b border-gray-200 px-3 py-2 hover:bg-gray-50">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {comment.author.avatar && (
            <img
              src={comment.author.avatar}
              alt={comment.author.name}
              className="h-5 w-5 rounded-full"
            />
          )}
          <span className="text-xs font-semibold text-gray-900">
            {authorDisplayName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {formatTime(comment.createdAt)}
          </span>
          {onDelete && (
            <button
              onClick={handleDelete}
              className="text-xs text-gray-400 hover:text-red-500"
              title="Delete comment"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-700 leading-snug">
        {renderTextWithMentions()}
      </p>
    </div>
  );
}

