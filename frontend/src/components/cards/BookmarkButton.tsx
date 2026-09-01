import React from 'react';
import { useAuth } from '../../context/AuthContext';

interface BookmarkButtonProps {
  listingId: string;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({ listingId }) => {
  const { user, isSaved, toggleSaveListing } = useAuth();
  const saved = isSaved(listingId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      alert('Please log in to save listings');
      return;
    }
    toggleSaveListing(listingId);
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full border transition ${
        saved
          ? 'bg-red-500 text-white border-red-500'
          : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-300'
      }`}
      aria-label={saved ? 'Unsave listing' : 'Save listing'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill={saved ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
};