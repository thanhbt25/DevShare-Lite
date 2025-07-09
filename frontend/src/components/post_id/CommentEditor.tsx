import React from "react";
import MarkdownEditor from "@/components/common/MarkdownEditor";

interface Props {
  comment: string;
  setComment: (value: string) => void;
  handleCommentSubmit: () => void;
}

const CommentEditor: React.FC<Props> = ({ comment, setComment, handleCommentSubmit }) => {
  return (
    <div className="bg-white border rounded-md p-4 shadow-sm mb-6">
      <label className="block text-sm font-medium mb-2">
        Your answer / comment
      </label>
      <MarkdownEditor
        content={comment}
        setContent={setComment}
        placeholder="Nhập bình luận hoặc câu trả lời bằng markdown..."
        height={200}
      />
      <button
        onClick={handleCommentSubmit}
        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
      >
        Post
      </button>
    </div>
  );
};

export default CommentEditor;
