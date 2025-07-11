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

  useEffect(() => {
    if (typeof id === "string") {
      axiosInstance
        .get(`/posts/${id}`)
        .then((res) => {
          setPost(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  const handleEdit = () => {
    router.push(`/edit/${post._id}`);
  };

  const handleDelete = async () => {
    if (!user || !post) return alert("You need to login to delete.");
    const authorId =
      typeof post.authorId === "string" ? post.authorId : post.authorId._id;
    if (user._id !== authorId)
      return alert("You don't have permission to delete this post.");
    const confirmed = confirm("Are you sure to delete this post?");
    if (!confirmed) return;

    try {
      await axiosInstance.delete(`/posts/${post._id}`);
      alert("Post deleted.");
      router.push("/your-question");
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Cannot delete the post.");
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
        <title>DevShare Lite - Managing your post</title>
      </Head>

      <ThreeColumnLayout rightSidebar={<RightSidebar />}>
        <div className="p-4">
          {loading ? (
            <p>Downloading your posts...</p>
          ) : !post ? (
            <p>Cannot find your post.</p>
          ) : (
            <div className="space-y-4">
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

              {user?._id === post?.authorId?.id && (
                <div className="flex gap-4 mt-6">
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
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
