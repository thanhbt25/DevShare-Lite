import React, { useState } from "react";
import { FiThumbsUp } from "react-icons/fi";
import CommentEditor from "./CommentEditor";
import MarkdownPreview from "@uiw/react-markdown-preview";

interface CommentType {
  _id: string;
  content: string;
  authorName: string;
  createdAt: string;
  upvoteCount: number;
  parentId?: string | null;
}

interface Props {
  comments: CommentType[];
  onCommentVote: (commentId: string) => void;
  onReplySubmit: (parentId: string, content: string) => void;
}

const CommentList: React.FC<Props> = ({
  comments,
  onCommentVote,
  onReplySubmit,
}) => {
  const [activeReply, setActiveReply] = useState<string | null>(null);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  const groupComments = (comments: CommentType[]) => {
    const topLevel = comments.filter((c) => !c.parentId);
    const repliesMap: Record<string, CommentType[]> = {};
    comments.forEach((c) => {
      if (c.parentId) {
        if (!repliesMap[c.parentId]) repliesMap[c.parentId] = [];
        repliesMap[c.parentId].push(c);
      }
    });
    return { topLevel, repliesMap };
  };

  const { topLevel, repliesMap } = groupComments(comments);

  const handleReplyChange = (id: string, value: string) => {
    setReplyInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleReplySend = (id: string) => {
    const content = replyInputs[id]?.trim();
    if (!content) return;

    onReplySubmit(id, content);
    setReplyInputs((prev) => ({ ...prev, [id]: "" }));
    setActiveReply(null);
  };

  const renderComment = (cmt: CommentType, depth = 0) => {
    const replies = repliesMap[cmt._id] || [];

    return (
      <div key={cmt._id} style={{ marginLeft: depth * 20 }} className="mb-3">
        <div className="bg-gray-50 p-4 border rounded-md">
          <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
            <span>{cmt.authorName || "Anonymous"}</span>
            <span>{new Date(cmt.createdAt).toLocaleString()}</span>
          </div>
          <div className="text-gray-800 text-sm mb-2">
            <MarkdownPreview
              source={cmt.content}
              wrapperElement={{ "data-color-mode": "light" }}
            />
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <button
              onClick={() => onCommentVote(cmt._id)}
              className="flex items-center gap-1 hover:text-green-600"
            >
              <FiThumbsUp size={16} />
              {cmt.upvoteCount}
            </button>
            <button
              onClick={() =>
                setActiveReply((prev) => (prev === cmt._id ? null : cmt._id))
              }
              className="text-xs text-indigo-600 hover:underline"
            >
              {activeReply === cmt._id ? "Hủy" : "Trả lời"}
            </button>
          </div>

          {activeReply === cmt._id && (
            <div className="mt-3">
              <CommentEditor
                comment={replyInputs[cmt._id] || ""}
                setComment={(val) => handleReplyChange(cmt._id, val)}
                handleCommentSubmit={() => handleReplySend(cmt._id)}
              />
            </div>
          )}
        </div>

        {replies.map((reply) => renderComment(reply, depth + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Comments</h3>
      {topLevel.length === 0 ? (
        <p className="text-gray-500">Chưa có bình luận nào.</p>
      ) : (
        topLevel.map((cmt) => renderComment(cmt))
      )}
    </div>
  );
};

export default CommentList;
