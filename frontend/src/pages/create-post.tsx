import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PostForm, { PostFormValues } from "@/components/PostForm";
import "@/styles/globals.css";

const CreatePostPage = () => {
  const handlePostSubmit = (data: PostFormValues) => {
    // Handle post submission logic here
    console.log("Post submitted:", data);
    // Example: send to API
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="bg-white py-4 px-6">
        <h1 className="text-2xl font-semibold text-gray-800">Create a New Post</h1>
      </div>
      <main className="flex-1 flex flex-col md:flex-row justify-between px-6 py-8 gap-6">
        {/* Post form */}
        <div className="w-full md:w-2/3">
          <PostForm onSubmit={handlePostSubmit} />
        </div>

        {/* Tips section */}
        <aside className="w-full md:w-1/3 text-sm text-gray-700">
          <h3 className="font-semibold mb-2">Tips</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Write your body content using markdown format. Use **, #, etc. for headings and formatting.
            </li>
            <li>
              Make sure your formatting is clean and easy to read.
            </li>
            <li>
              Separate tags by commas. Tags should not contain spaces.
            </li>
          </ol>
        </aside>
      </main>

      <Footer />
    </div>
  );
};

export default CreatePostPage;
