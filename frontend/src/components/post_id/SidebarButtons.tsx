import React from "react";
import { FiThumbsUp, FiThumbsDown, FiHeart } from "react-icons/fi";

interface Props {
  voted: "upvoted" | "downvoted" | null;
  favorited: boolean;
  handleVote: (type: "upvote" | "downvote") => void;
  handleFavorite: () => void;
}

const SidebarButtons: React.FC<Props> = ({
  voted,
  favorited,
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
      </button>
    </div>
  );
};

export default SidebarButtons;
