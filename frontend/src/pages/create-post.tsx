import React, { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PostForm, { PostFormValues } from "@/components/PostForm";
import "@/styles/globals.css";
import axiosInstance from "@/utils/api";

const CreatePostPage = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [redirectLink, setRedirectLink] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const authorId = "66bfbd5f7f0b123456789abc"; // sau này thay bằng ID thật từ auth

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

  const resetForm = () => {
    setTitle("");
    setContent("");
    setIsPublished(false);
    setTags([]);
    setTagInput("");
  };

  const handlePostSubmit = async (data: PostFormValues) => {
    try {
      const payload: PostFormValues = {
        ...data,
        authorId,
        tags,
      };

      const response = await axiosInstance.post("/posts", payload);
      const createdPost = response.data;

      if (payload.isPublished) {
        setSuccessMessage("Post published successfully!");
        setRedirectLink(`/posts/${createdPost._id}`);
      } else {
        setSuccessMessage("Draft saved successfully!");
        setRedirectLink(`/drafts/${createdPost._id}`);
      }

      resetForm();
    } catch (error: any) {
      console.error("Error creating post:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while creating the post.";
      setErrorMessage(message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="bg-white py-4 px-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Create a New Post
        </h1>

        {/* Success message */}
        {successMessage && (
          <div className="mt-4 text-green-600 font-medium bg-green-100 border border-green-300 rounded px-4 py-2">
            {successMessage}{" "}
            {redirectLink && (
              <span
                onClick={() => router.push(redirectLink)}
                className="text-blue-600 underline cursor-pointer hover:text-blue-800 ml-1"
              >
                View here
              </span>
            )}
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="mt-4 text-red-600 font-medium bg-red-100 border border-red-300 rounded px-4 py-2">
            {errorMessage}
          </div>
        )}
      </div>

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
          />
        </div>

        <aside className="w-full md:w-1/3 text-sm text-gray-700">
          <h3 className="font-semibold mb-2">Tips</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Write your body content using markdown format. Use **, #, etc. for
              headings and formatting.
            </li>
            <li>Make sure your formatting is clean and easy to read.</li>
            <li>Use the spacebar to add tags. Tags are displayed as boxes.</li>
          </ol>
        </aside>
      </main>

      <Footer />
    </div>
  );
};

export default CreatePostPage;
