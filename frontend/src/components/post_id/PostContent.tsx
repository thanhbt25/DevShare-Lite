import React from "react";

interface Props {
  post: any;
  loading: boolean;
}

const PostContent: React.FC<Props> = ({ post, loading }) => {
  return (
    <>
      <div className="bg-white p-4 rounded-md mb-4 border shadow-sm">
        <h1 className="text-2xl font-bold">
          {loading ? "Đang tải..." : post?.title || "Không tìm thấy bài viết"}
        </h1>
      </div>

      <div className="bg-indigo-50 text-sm p-2 rounded-md flex justify-between mb-4 border text-gray-700">
        <span>
          Asked: {post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : "?"}
        </span>
        <span>
          Modified: {post?.updatedAt ? new Date(post.updatedAt).toLocaleDateString() : "?"}
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
        {post?.authorName && (
          <p className="text-sm text-right text-gray-500 mt-4 italic">
            By {post.authorId?.username}
          </p>
        )}
      </div>
    </>
  );
};

export default PostContent;
