import React from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import "@/styles/globals.css";

const PostDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <div className="flex flex-1 w-full">
        {/* Left Sidebar */}
        <div className="w-[180px] shrink-0">
          <Sidebar />
        </div>

        {/* Main Post Content */}
        <main className="flex-1 px-6 py-6">
          <div className="flex gap-6">
            {/* Left voting & actions */}
            <div className="w-12 flex flex-col items-center bg-violet-50 rounded-md py-4">
              <button className="text-2xl">⬆️</button>
              <button className="text-2xl">⬇️</button>
              <button className="text-2xl mt-4">🤍</button>
              <button className="text-xl mt-4">🕒</button>
            </div>

            {/* Post Details */}
            <div className="flex-1">
              {/* Title */}
              <div className="bg-violet-100 p-4 rounded-md mb-4">
                <h1 className="text-xl font-semibold">Tiêu đề câu hỏi ở đây</h1>
              </div>

              {/* Meta Info */}
              <div className="bg-violet-300 text-sm p-2 rounded-md flex justify-between items-center mb-4">
                <p>Ask today</p>
                <p>Modify today</p>
                <p>Viewed 4 times</p>
              </div>

              {/* Tags */}
              <p className="mb-4 text-sm">Tag của bài viết</p>

              {/* Main content */}
              <div className="bg-white border border-gray-200 rounded-md p-4 min-h-[200px] mb-4">
                <p>Nội dung câu hỏi ở đây</p>
              </div>

              {/* Related questions */}
              <div className="bg-white border border-gray-200 rounded-md p-4 mb-4">
                <p className="font-medium">Câu hỏi liên quan</p>
              </div>

              {/* Comment/Answer box */}
              <div className="bg-violet-100 rounded-md p-4">
                <label className="block text-sm font-medium mb-2">Your answer/ your comment</label>
                <textarea className="w-full border border-gray-300 rounded-md p-2 mb-4 min-h-[120px]" />
                <button className="bg-neutral-800 text-white px-4 py-2 rounded-md">Post</button>
              </div>
            </div>

            {/* Right Sidebar (optional) */}
            <div className="w-1/5 text-sm text-right mt-2">
              <p className="text-sm font-medium">Newest question</p>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PostDetailPage;
