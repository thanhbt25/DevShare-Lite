// src/pages/home.tsx
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PostCard from "../components/PostCard";
import { useState } from "react";
import '@/styles/globals.css';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"blog" | "qa">("blog");

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>DevShare Lite - Home</title>
      </Head>

      <Navbar />

      <main className="flex flex-1">
        {/* Sidebar trái */}
        <aside className="w-1/5 border-r p-4">
          <Sidebar />
        </aside>

        {/* Nội dung chính */}
        <section className="w-3/5 p-4">
          <div className="flex space-x-4 border-b pb-2 mb-4">
            <button
              onClick={() => setActiveTab("blog")}
              className={`font-medium ${activeTab === "blog" ? "border-b-2 border-black" : "text-gray-400"}`}
            >
              Blog
            </button>
            <button
              onClick={() => setActiveTab("qa")}
              className={`font-medium ${activeTab === "qa" ? "border-b-2 border-black" : "text-gray-400"}`}
            >
              Q&A
            </button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div>
              <button className="px-3 py-1 text-sm font-medium">Newest</button>
              <button className="px-3 py-1 text-sm font-medium text-gray-400">Popular</button>
              <button className="px-3 py-1 text-sm font-medium text-gray-400">Unanswered</button>
            </div>
            <button className="bg-gray-200 px-3 py-1 rounded">Filter</button>
          </div>

          {/* Danh sách bài viết */}
          {[1, 2, 3, 4, 5].map((item) => (
            <PostCard key={item} type={activeTab} />
          ))}

          {/* Pagination */}
          <div className="mt-6 flex justify-center gap-2">
            <span className="text-gray-400">← Previous</span>
            <button className="font-bold">1</button>
            <button>2</button>
            <button>3</button>
            <span className="text-gray-400">...</span>
            <button>68</button>
            <span className="text-gray-400">Next →</span>
          </div>
        </section>

        {/* Right sidebar (chỉ có ở trang Home) */}
        <aside className="w-1/5 border-l p-4">
          <h3 className="font-bold mb-2">The most contributors</h3>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2 mb-1">
              <img src="/user.png" className="w-6 h-6 rounded-full" alt="user" />
              <span className="text-sm">Người dùng {i}</span>
            </div>
          ))}

          <h3 className="font-bold mt-6 mb-2">Trend 🔼</h3>
          {["Tag", "Tag", "Tag", "Tag"].map((tag, index) => (
            <button
              key={index}
              className="bg-gray-800 text-white text-sm rounded px-2 py-1 mb-1 block"
            >
              {tag}
            </button>
          ))}
        </aside>
      </main>

      <Footer />
    </div>
  );
}
