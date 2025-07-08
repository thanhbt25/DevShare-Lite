import React from "react";
import { FiThumbsUp, FiThumbsDown, FiHeart, FiClock } from "react-icons/fi";

type Props = {
  post: any;
  loading: boolean;
  favorited: boolean;
  voted: "upvoted" | "downvoted" | null;
  comment: string;
  setComment: (value: string) => void;
  handleVote: (type: "upvote" | "downvote") => void;
  handleFavorite: () => void;
  handleCommentSubmit: () => void;
};

const PostMainContent: React.FC<Props> = ({
  post,
  loading,
  favorited,
  voted,
  comment,
  setComment,
  handleVote,
  handleFavorite,
  handleCommentSubmit,
}) => {
  return (
    <div className="flex gap-6 items-start">
      {/* Sidebar buttons */}
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
          <FiHeart
            size={20}
            className={`${
              favorited ? "fill-red-600 text-red-600" : ""
            } transition-all`}
          />
        </button>

        <button
          title="Watch later"
          className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <FiClock size={20} />
        </button>
      </div>

      {/* Post content */}
      <div className="flex-1">
        <div className="bg-white p-4 rounded-md mb-4 border shadow-sm">
          <h1 className="text-2xl font-bold">
            {loading ? "Đang tải..." : post?.title || "Không tìm thấy bài viết"}
          </h1>
        </div>

        <div className="bg-indigo-50 text-sm p-2 rounded-md flex justify-between mb-4 border text-gray-700">
          <span>
            Asked:{" "}
            {post?.createdAt
              ? new Date(post.createdAt).toLocaleDateString()
              : "?"}
          </span>
          <span>
            Modified:{" "}
            {post?.updatedAt
              ? new Date(post.updatedAt).toLocaleDateString()
              : "?"}
          </span>
          <span>Viewed: {post?.views || 0} times</span>
        </div>

        <div className="mb-4 space-x-2">
          {post?.tags?.map((tag: string) => (
            <span
              key={tag}
              className="bg-indigo-100 text-indigo-700 px-3 py-1 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="bg-white border rounded-md p-4 min-h-[200px] mb-4 shadow-sm">
          <p>{post?.content || "Nội dung đang được cập nhật."}</p>
        </div>

        {/* Comment box */}
        <div className="bg-white border rounded-md p-4 shadow-sm">
          <label className="block text-sm font-medium mb-2">
            Your answer / comment
          </label>
          <textarea
            className="w-full border rounded-md p-2 mb-4 min-h-[120px] focus:outline-none focus:ring focus:border-indigo-300"
            placeholder="Nhập câu trả lời hoặc bình luận của bạn..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            onClick={handleCommentSubmit}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostMainContent;
