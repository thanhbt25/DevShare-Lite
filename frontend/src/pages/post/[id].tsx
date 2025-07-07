import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import axiosInstance from "@/utils/api";
import ThreeColumnLayout from "@/components/common/ThreeColumnsLayout";
import "@/styles/globals.css";

import { FiThumbsUp, FiThumbsDown, FiHeart, FiClock } from "react-icons/fi";

const USER_ID = "686b351c3ca306d97ed2f21f"; // Replace with actual logged-in user ID

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const [voted, setVoted] = useState<"upvoted" | "downvoted" | null>(null);

  useEffect(() => {
    if (typeof id === "string") {
      axiosInstance.post(`/posts/${id}/view`);

      axiosInstance
        .get(`/posts/${id}`)
        .then((res) => {
          const data = res.data;
          setPost(data);

          setFavorited(data.favoritedBy.includes(USER_ID));

          if (data.votedUpUsers?.includes(USER_ID)) setVoted("upvoted");
          else if (data.votedDownUsers?.includes(USER_ID))
            setVoted("downvoted");
          else setVoted(null);

          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  const handleFavorite = async () => {
    if (!post) return;
    try {
      if (favorited) {
        await axiosInstance.post(`/posts/${post._id}/unfavorite/${USER_ID}`);
        setFavorited(false);
      } else {
        await axiosInstance.post(`/posts/${post._id}/favorite/${USER_ID}`);
        setFavorited(true);
      }
    } catch (err) {
      console.error("Favorite toggle error:", err);
    }
  };

  const handleVote = async (type: "upvote" | "downvote") => {
    if (!post) return;
    try {
      // Nếu đã vote kiểu đó rồi → thì bỏ vote
      if (
        (type === "upvote" && voted === "upvoted") ||
        (type === "downvote" && voted === "downvoted")
      ) {
        await axiosInstance.patch(`/posts/${post._id}/unvote/${USER_ID}`);
        setVoted(null);
      } else {
        await axiosInstance.post(`/posts/${post._id}/${type}/${USER_ID}`);
        setVoted(type === "upvote" ? "upvoted" : "downvoted");
      }
      // Sau mỗi hành động, lấy lại dữ liệu mới
      const res = await axiosInstance.get(`/posts/${post._id}`);
      setPost(res.data);
    } catch (err) {
      console.error("Voting error:", err);
    }
  };

  const RightSidebar = (
    <div className="bg-white border rounded-md p-4 shadow-sm">
      <h3 className="text-sm font-semibold mb-2">Newest Questions</h3>
      <ul className="text-gray-700 text-sm space-y-1 list-disc list-inside">
        <li>Câu hỏi mới 1</li>
        <li>Câu hỏi mới 2</li>
        <li>Câu hỏi mới 3</li>
      </ul>
    </div>
  );

  const MainContent = (
    <div className="flex gap-6 items-start">
      <div className="w-14 flex flex-col items-center gap-5 py-4 bg-gray-50 border rounded-md shadow-sm shrink-0">
        {/* Upvote */}
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

        {/* Downvote */}
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

        {/* Favorite */}
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

        {/* Watch later */}
        <button
          title="Watch later"
          className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <FiClock size={20} />
        </button>
      </div>

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

        <div className="bg-white border rounded-md p-4 mb-4 shadow-sm">
          <p className="font-semibold mb-2">Câu hỏi liên quan</p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Câu hỏi liên quan 1</li>
            <li>Câu hỏi liên quan 2</li>
          </ul>
        </div>

        <div className="bg-white border rounded-md p-4 shadow-sm">
          <label className="block text-sm font-medium mb-2">
            Your answer / comment
          </label>
          <textarea
            className="w-full border rounded-md p-2 mb-4 min-h-[120px] focus:outline-none focus:ring focus:border-indigo-300"
            placeholder="Nhập câu trả lời hoặc bình luận của bạn..."
          />
          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
            Post
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <Head>
        <title>DevShare Lite - Post Detail</title>
      </Head>

      <ThreeColumnLayout rightSidebar={RightSidebar}>
        {MainContent}
      </ThreeColumnLayout>
    </div>
  );
}
