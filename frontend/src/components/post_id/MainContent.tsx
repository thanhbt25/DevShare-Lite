import React from "react";
import SidebarButtons from "./SidebarButtons";
import PostContent from "./PostContent";
import CommentEditor from "./CommentEditor";
import CommentList from "./CommentList";

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
  comments: CommentType[];
  onCommentVote: (commentId: string) => void;
  onReplySubmit: (parentId: string, content: string) => void;
};

type CommentType = {
  _id: string;
  content: string;
  authorName: string;
  createdAt: string;
  upvoteCount: number;
  parentId?: string | null;
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
  comments,
  onCommentVote,
  onReplySubmit,
}) => {
  return (
    <div className="flex gap-6 items-start">
      <SidebarButtons
        voted={voted}
        favorited={favorited}
        handleVote={handleVote}
        handleFavorite={handleFavorite}
      />

      <div className="flex-1">
        <PostContent post={post} loading={loading} />

        <CommentEditor
          comment={comment}
          setComment={setComment}
          handleCommentSubmit={handleCommentSubmit}
        />

        <CommentList
          comments={comments}
          onCommentVote={onCommentVote}
          onReplySubmit={onReplySubmit}
        />
      </div>
    </div>
  );
};

export default PostMainContent;
