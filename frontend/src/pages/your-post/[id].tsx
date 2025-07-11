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
    if (!user || !post) return alert("Bạn cần đăng nhập.");
    const authorId =
      typeof post.authorId === "string" ? post.authorId : post.authorId._id;
    if (user._id !== authorId)
      return alert("Bạn không có quyền xoá bài viết này.");
    const confirmed = confirm("Bạn có chắc chắn muốn xoá bài viết này?");
    if (!confirmed) return;

    try {
      await axiosInstance.delete(`/posts/${post._id}`);
      alert("Đã xoá bài viết.");
      router.push("/your-question");
    } catch (err) {
      console.error("Lỗi khi xoá bài viết:", err);
      alert("Không thể xoá bài viết.");
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
      console.error("Lỗi khi lấy danh sách user:", err);
    }
  };

  const closeModal = () => setUserListModal(null);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <Head>
        <title>DevShare Lite - Quản lý bài viết</title>
      </Head>

      <ThreeColumnLayout rightSidebar={<RightSidebar />}>
        <div className="p-4">
          {loading ? (
            <p>Đang tải bài viết...</p>
          ) : !post ? (
            <p>Không tìm thấy bài viết.</p>
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
                source={post?.content || "Không có nội dung"}
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
                ? "Người đã upvote"
                : userListModal.type === "downvotes"
                ? "Người đã downvote"
                : "Người đã favorite"}
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
