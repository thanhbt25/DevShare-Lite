import React from "react";
import { FiThumbsUp } from "react-icons/fi";

interface CommentType {
  _id: string;
  content: string;
  authorName: string;
  createdAt: string;
  upvoteCount: number;
}

interface Props {
  comments: CommentType[];
  onCommentVote: (commentId: string) => void;
}

const CommentList: React.FC<Props> = ({ comments, onCommentVote }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Comments</h3>
      {comments.length === 0 ? (
        <p className="text-gray-500">Chưa có bình luận nào.</p>
      ) : (
        comments.map((cmt) => (
          <div key={cmt._id} className="bg-gray-50 p-4 border rounded-md">
            <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
              <span>{cmt.authorName || "Anonymous"}</span>
              <span>{new Date(cmt.createdAt).toLocaleString()}</span>
            </div>
            <div className="text-gray-800 text-sm whitespace-pre-line mb-2">
              {cmt.content}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <button
                onClick={() => onCommentVote(cmt._id)}
                className="flex items-center gap-1 hover:text-green-600"
              >
                <FiThumbsUp size={16} />
                {cmt.upvoteCount}
              </button>
              <button className="text-xs text-indigo-600 hover:underline">
                Trả lời
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentList;
