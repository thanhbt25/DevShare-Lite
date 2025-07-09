"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import axiosInstance from "@/utils/api";
import { useUser } from "@/contexts/UserContext";
import PostForm, { PostFormValues } from "@/components/create-post/PostForm";
import "@/styles/globals.css";

export default function EditPostPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isBlog, setIsBlog] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (typeof id === "string") {
      axiosInstance
        .get(`/posts/${id}`)
        .then((res) => {
          const post = res.data;
          if (user && post.authorId.id !== user._id) {
            console.log("author id is", post.authorId, "and user id is: ", user._id);
            setErrorMessage("Bạn không có quyền chỉnh sửa bài viết này.");
            return;
          }

          setTitle(post.title);
          setContent(post.content);
          setIsPublished(post.isPublished);
          setIsBlog(post.isBlog);
          setTags(post.tags || []);
        })
        .catch((err) => {
          console.error("Lỗi khi lấy post:", err);
          setErrorMessage("Không thể tải bài viết.");
        })
        .finally(() => setLoading(false));
    }
  }, [id, user]);

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " && tagInput.trim() !== "") {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handlePostSubmit = async (data: PostFormValues) => {
    try {
      if (!user) return;
      const payload: PostFormValues = {
        ...data,
        authorId: user._id,
        tags,
      };

      await axiosInstance.patch(`/posts/${id}`, payload);
      setSuccessMessage("Bài viết đã được cập nhật.");

      // Optional: redirect
      setTimeout(() => {
        router.push(payload.isPublished ? `/post/${id}` : `/draft/${id}`);
      }, 1500);
    } catch (error: any) {
      console.error("Update error:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Không thể cập nhật bài viết.";
      setErrorMessage(message);
    }
  };

  if (!user) {
    if (typeof window !== "undefined") {
      router.push("/login");
    }
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>DevShare Lite - Chỉnh sửa bài viết</title>
      </Head>

      <Navbar />

      <div className="bg-white py-4 px-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Chỉnh sửa bài viết
        </h1>

        {loading && <p>Đang tải bài viết...</p>}

        {errorMessage && (
          <div className="mt-4 text-red-600 font-medium bg-red-100 border border-red-300 rounded px-4 py-2">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mt-4 text-green-600 font-medium bg-green-100 border border-green-300 rounded px-4 py-2">
            {successMessage}
          </div>
        )}
      </div>

      {!loading && !errorMessage && (
        <main className="flex-1 flex flex-col md:flex-row justify-between px-6 py-8 gap-6">
          <div className="w-full md:w-2/3">
            <PostForm
              onSubmit={handlePostSubmit}
              title={title}
              setTitle={setTitle}
              content={content}
              setContent={setContent}
              isPublished={isPublished}
              setIsPublished={setIsPublished}
              tags={tags}
              tagInput={tagInput}
              setTagInput={setTagInput}
              handleTagInput={handleTagInput}
              removeTag={removeTag}
              isBlog={isBlog}
              setIsBlog={setIsBlog}
            />
          </div>

          <aside className="w-full md:w-1/3 text-sm text-gray-700">
            <h3 className="font-semibold mb-2">Tips</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Markdown được hỗ trợ.</li>
              <li>Dùng phím cách để tạo tag.</li>
              <li>Đảm bảo nội dung rõ ràng và có format tốt.</li>
            </ul>
          </aside>
        </main>
      )}

      <Footer />
    </div>
  );
}
