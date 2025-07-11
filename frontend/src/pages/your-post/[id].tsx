"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import axiosInstance from "@/utils/api";
import { useUser } from "@/contexts/UserContext";
import ThreeColumnLayout from "@/components/common/ThreeColumnsLayout";
import RightSidebar from "@/components/post_id/RightSideBar";
import "@/styles/globals.css";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { FiThumbsUp, FiThumbsDown, FiHeart } from "react-icons/fi";
import CommentList from "@/components/post_id/CommentList";
import CommentEditor from "@/components/post_id/CommentEditor";

export default function ManagePostDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userListModal, setUserListModal] = useState<{
    type: string;
    users: any[];
  } | null>(null);

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    if (typeof id !== "string") return;

    const fetchData = async () => {
      try {
        const [postRes, commentRes] = await Promise.all([
          axiosInstance.get(`/posts/${id}`),
          axiosInstance.get(`/comments/post/${id}`),
        ]);
        setPost(postRes.data);

        const enriched = await enrichComments(commentRes.data, user?._id);
        setComments(enriched);
      } catch (err) {
        console.error("Error loading post or comments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const enrichComments = async (
    comments: any[],
    currentUserId?: string
  ): Promise<any[]> => {
    const authorIds = comments.map((c) => c.authorId);
    const uniqueIds = [...new Set(authorIds.map((id) => (typeof id === "object" ? id._id : id)))];

    const usersRes = await axiosInstance.post("/users/bulk", { ids: uniqueIds });
    const userMap: Record<string, string> = {};
    usersRes.data.forEach((u: any) => (userMap[u.id] = u.username));

    return comments.map((c) => {
      const likedBy = c.likedBy || [];
      return {
        ...c,
        authorName: userMap[c.authorId] || "anonymous",
        upvoteCount: likedBy.length,
        hasVoted: currentUserId ? likedBy.includes(currentUserId) : false,
      };
    });
  };

  const handleCommentSubmit = async () => {
    if (!user || !post) return alert("You need to login to comment.");
    if (!comment.trim()) return;

    try {
      await axiosInstance.post(`/comments`, {
        content: comment,
        authorId: user._id,
        postId: post._id,
      });
      setComment("");

      const res = await axiosInstance.get(`/comments/post/${post._id}`);
      const enriched = await enrichComments(res.data, user._id);
      setComments(enriched);
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };

  const onCommentVote = async (commentId: string) => {
    if (!user) return alert("Login required");
    try {
      const comment = comments.find((c) => c._id === commentId);
      const hasVoted = comment?.hasVoted;

      if (hasVoted) {
        await axiosInstance.patch(`/comments/${commentId}/unvote/${user._id}`);
      } else {
        await axiosInstance.post(`/comments/${commentId}/upvote/${user._id}`);
      }

      const res = await axiosInstance.get(`/comments/post/${post._id}`);
      const enriched = await enrichComments(res.data, user._id);
      setComments(enriched);
    } catch (err) {
      console.error("Error voting comment:", err);
    }
  };

  const onReplySubmit = async (parentId: string, content: string) => {
    if (!user || !post) return alert("Login required.");
    if (!content.trim()) return;

    try {
      await axiosInstance.post(`/comments`, {
        content,
        authorId: user._id,
        postId: post._id,
        parentId,
      });

      const res = await axiosInstance.get(`/comments/post/${post._id}`);
      const enriched = await enrichComments(res.data, user._id);
      setComments(enriched);
    } catch (err) {
      console.error("Reply error:", err);
    }
  };

  const handleEdit = () => router.push(`/edit/${post._id}`);
  const handleDelete = async () => {
    if (!user || !post) return;
    const authorId = typeof post.authorId === "string" ? post.authorId : post.authorId._id;
    if (user._id !== authorId) return alert("No permission");

    if (!confirm("Delete this post?")) return;

    try {
      await axiosInstance.delete(`/posts/${post._id}`);
      alert("Post deleted.");
      router.push("/your-question");
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  const handleShowUserList = async (
    type: "upvotes" | "downvotes" | "favorites"
  ) => {
    if (!post) return;

    let userIds: string[] = [];
    if (type === "upvotes") userIds = post.votedUpUsers;
    else if (type === "downvotes") userIds = post.votedDownUsers;
    else if (type === "favorites") userIds = post.favoritedBy;

    try {
      const res = await axiosInstance.post("/users/bulk", { ids: userIds });
      setUserListModal({ type, users: res.data });
    } catch (err) {
      console.error("Error fetching user list:", err);
    }
  };

  const closeModal = () => setUserListModal(null);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <Head>
        <title>DevShare Lite - Manage Your Post</title>
      </Head>

      <ThreeColumnLayout rightSidebar={<RightSidebar />}>
        <div className="p-4 max-w-3xl w-full mx-auto">
          {loading ? (
            <p>Loading...</p>
          ) : !post ? (
            <p>Post not found.</p>
          ) : (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">{post.title}</h1>

              {post.tags?.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-gray-200 text-sm px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <MarkdownPreview
                source={post?.content || "No content"}
                wrapperElement={{ "data-color-mode": "light" }}
              />

              <div className="flex gap-6 text-sm text-gray-600 mt-2">
                <span
                  onClick={() => handleShowUserList("upvotes")}
                  className="cursor-pointer hover:text-green-600 flex items-center gap-1"
                >
                  <FiThumbsUp size={16} />
                  {post.votedUpUsers?.length || 0} upvotes
                </span>
                <span
                  onClick={() => handleShowUserList("downvotes")}
                  className="cursor-pointer hover:text-red-600 flex items-center gap-1"
                >
                  <FiThumbsDown size={16} />
                  {post.votedDownUsers?.length || 0} downvotes
                </span>
                <span
                  onClick={() => handleShowUserList("favorites")}
                  className="cursor-pointer hover:text-pink-600 flex items-center gap-1"
                >
                  <FiHeart size={16} />
                  {post.favoritedBy?.length || 0} favorites
                </span>
              </div>

              {user?._id === post?.authorId?._id && (
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={handleEdit}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}

              {/* Comment Editor */}
              <CommentEditor
                comment={comment}
                setComment={setComment}
                handleCommentSubmit={handleCommentSubmit}
              />

              {/* Comment List */}
              <CommentList
                comments={comments}
                onCommentVote={onCommentVote}
                onReplySubmit={onReplySubmit}
              />
            </div>
          )}
        </div>
      </ThreeColumnLayout>

      {userListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 max-w-md w-full shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {userListModal.type === "upvotes"
                ? "Users who upvoted"
                : userListModal.type === "downvotes"
                ? "Users who downvoted"
                : "Users who saved your post"}
            </h2>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {userListModal.users.map((user) => (
                <li key={user._id} className="border-b pb-1">
                  👤 {user.username}
                </li>
              ))}
            </ul>
            <button
              onClick={closeModal}
              className="mt-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
