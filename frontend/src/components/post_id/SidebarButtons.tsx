import React from "react";
import { FiThumbsUp, FiThumbsDown, FiHeart, FiClock } from "react-icons/fi";

interface Props {
  voted: "upvoted" | "downvoted" | null;
  favorited: boolean;
  upvoteCount: number;
  downvoteCount: number;
  saveCount: number;
  handleVote: (type: "upvote" | "downvote") => void;
  handleFavorite: () => void;
}

const SidebarButtons: React.FC<Props> = ({
  voted,
  favorited,
  upvoteCount,
  downvoteCount,
  saveCount,
  handleVote,
  handleFavorite,
}) => {
  return (
    <div className="w-14 flex flex-col items-center gap-5 py-4 bg-gray-50 border rounded-md shadow-sm shrink-0">
      <button
        title="Upvote"
        onClick={() => handleVote("upvote")}
        className={`p-2 rounded-full transition ${
          voted === "upvoted"
            ? "bg-green-100 text-green-600"
            : "text-gray-600 hover:text-green-600 hover:bg-green-50"
        }`}
      >
        <FiThumbsUp size={20} />
        <div className="text-xs mt-1">{upvoteCount}</div>
      </button>

      <button
        title="Downvote"
        onClick={() => handleVote("downvote")}
        className={`p-2 rounded-full transition ${
          voted === "downvoted"
            ? "bg-red-100 text-red-600"
            : "text-gray-600 hover:text-red-600 hover:bg-red-50"
        }`}
      >
        <FiThumbsDown size={20} />
        <div className="text-xs mt-1">{downvoteCount}</div>
      </button>

      <button
        title="Save"
        onClick={handleFavorite}
        className={`p-2 rounded-full transition ${
          favorited
            ? "bg-red-100 text-red-600"
            : "text-pink-500 hover:text-pink-600 hover:bg-pink-50"
        }`}
      >
        <FiHeart size={20} className={favorited ? "fill-red-600" : ""} />
        <div className="text-xs mt-1">{saveCount}</div>
      </button>

      <button
        title="Watch later"
        className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
      >
        <FiClock size={20} />
      </button>
    </div>
  );
};

export default SidebarButtons;
