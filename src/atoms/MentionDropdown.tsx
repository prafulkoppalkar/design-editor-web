import { User } from '../types/comments';

interface MentionDropdownProps {
  users: User[];
  onSelect: (user: User) => void;
  isOpen: boolean;
  searchQuery: string;
}

export default function MentionDropdown({
  users,
  onSelect,
  isOpen,
}: MentionDropdownProps) {
  if (!isOpen || users.length === 0) return null;

  return (
    <div className="absolute top-full left-0 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg z-50">
      <div className="max-h-48 overflow-y-auto">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => onSelect(user)}
            className="flex w-full items-center gap-2 border-b border-gray-100 px-3 py-2 text-left hover:bg-blue-50"
          >
            {user.avatar && (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-6 w-6 rounded-full"
              />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

