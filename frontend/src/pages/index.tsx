import Head from "next/head";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PostCard from "../components/PostCard";
import { useState } from "react";
import { FiTrendingUp, FiFilter } from "react-icons/fi";
import '@/styles/globals.css';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"blog" | "qa">("blog");
  const [sort, setSort] = useState<"newest" | "popular" | "unanswered">("newest");
  const [showFilter, setShowFilter] = useState(false);

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
              <button
                className={`px-3 py-1 text-sm font-medium rounded ${sort === "newest" ? "bg-indigo-600 text-white" : "text-gray-400 hover:bg-indigo-100"}`}
                onClick={() => setSort("newest")}
              >
                Newest
              </button>
              <button
                className={`px-3 py-1 text-sm font-medium rounded ${sort === "popular" ? "bg-indigo-600 text-white" : "text-gray-400 hover:bg-indigo-100"}`}
                onClick={() => setSort("popular")}
              >
                Popular
              </button>
              <button
                className={`px-3 py-1 text-sm font-medium rounded ${sort === "unanswered" ? "bg-indigo-600 text-white" : "text-gray-400 hover:bg-indigo-100"}`}
                onClick={() => setSort("unanswered")}
              >
                Unanswered
              </button>
            </div>
            <button
              className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded hover:bg-indigo-100"
              onClick={() => setShowFilter((v) => !v)}
            >
              <FiFilter /> Filter
            </button>
          </div>

          {/* Filter Modal */}
          {showFilter && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg p-6 min-w-[300px] shadow-lg relative">
                <button
                  className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-xl"
                  onClick={() => setShowFilter(false)}
                >
                  ×
                </button>
                <h3 className="text-lg font-bold mb-4 text-indigo-700">Filter Options</h3>
                {/* Add your filter options here */}
                <div className="mb-3">
                  <label className="block mb-1 text-sm font-medium">Tag</label>
                  <input className="w-full border rounded px-2 py-1" placeholder="Enter tag..." />
                </div>
                <div className="mb-3">
                  <label className="block mb-1 text-sm font-medium">User</label>
                  <input className="w-full border rounded px-2 py-1" placeholder="Enter username..." />
                </div>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded mt-2">
                  Apply Filter
                </button>
              </div>
            </div>
          )}

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
          <h3 className="font-bold mb-2">Top Contributors</h3>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2 mb-1">
              <img src="/user.png" className="w-6 h-6 rounded-full" alt="user" />
              <span className="text-sm">User {i}</span>
            </div>
          ))}

          <div className="mt-8">
            <div className="flex items-center gap-2 mb-2">
              <FiTrendingUp className="text-indigo-600" />
              <h3 className="font-bold">Trending Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Tag1", "Tag2", "Tag3", "Tag4"].map((tag, index) => (
                <button
                  key={index}
                  className="bg-indigo-100 text-indigo-700 text-sm rounded px-3 py-1 hover:bg-indigo-200 transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  );
}
