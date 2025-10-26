import { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { searchUsersAsync } from '../store/commentsSlice';
import { User } from '../types/comments';
import MentionDropdown from '../atoms/MentionDropdown';

interface CommentInputProps {
  onSubmit: (text: string, mentions: string[]) => void;
  currentUser: User;
}

export default function CommentInput({
  onSubmit,
  currentUser,
}: CommentInputProps) {
  const dispatch = useAppDispatch();
  const searchedUsers = useAppSelector((state) => state.comments.users);

  const [text, setText] = useState('');
  const [mentionIds, setMentionIds] = useState<string[]>([]);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);

    // Check if @ was typed
    const lastAtIndex = newText.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const textAfterAt = newText.substring(lastAtIndex + 1);
      // Show dropdown if @ is followed by text without space
      if (textAfterAt && !textAfterAt.includes(' ')) {
        setMentionSearch(textAfterAt);

        // Clear previous debounce timer
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        // Search users via API with 500ms debounce
        if (textAfterAt.length > 0) {
          debounceTimerRef.current = setTimeout(() => {
            dispatch(searchUsersAsync(textAfterAt));
          }, 500);
        }
        setShowMentionDropdown(true);
      } else {
        setShowMentionDropdown(false);
      }
    } else {
      setShowMentionDropdown(false);
    }
  };

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Handle mention selection
  const handleMentionSelect = (user: User) => {
    const lastAtIndex = text.lastIndexOf('@');
    const beforeAt = text.substring(0, lastAtIndex);

    // Replace the @ and search text with @username
    const newText = `${beforeAt}@${user.name} `;
    setText(newText);
    setShowMentionDropdown(false);
    setMentionSearch('');

    // Add user ID to mentions if not already there
    if (!mentionIds.includes(user._id)) {
      setMentionIds([...mentionIds, user._id]);
    }

    // Focus back on textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newText.length, newText.length);
      }
    }, 0);
  };

  const handleSubmit = () => {
    if (text.trim() === '') return;

    onSubmit(text.trim(), mentionIds);
    setText('');
    setMentionIds([]);
    setShowMentionDropdown(false);
  };

  return (
    <div className="border-b border-gray-200 p-2">
      <div className="mb-1 flex items-center gap-2">
        {currentUser.avatar && (
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="h-6 w-6 rounded-full"
          />
        )}
        <span className="text-xs font-medium text-gray-700">
          You
        </span>
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          placeholder="Add a comment... (type @ to mention)"
          className="w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none resize-none"
          rows={2}
        />

        <MentionDropdown
          users={searchedUsers}
          onSelect={handleMentionSelect}
          isOpen={showMentionDropdown}
          searchQuery={mentionSearch}
        />
      </div>

      <div className="mt-1 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={text.trim() === ''}
          className="rounded bg-blue-500 px-3 py-1 text-xs font-medium text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Comment
        </button>
      </div>
    </div>
  );
}

