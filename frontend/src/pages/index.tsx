import Head from "next/head";
import Footer from "@/components/common/Footer";
import PostCard from "@/components/post/PostCard";
import ThreeColumnLayout from "@/components/common/ThreeColumnsLayout";
import { useEffect, useState } from "react";
import { FiTrendingUp, FiFilter } from "react-icons/fi";
import axiosInstance from "@/utils/api";
import "@/styles/globals.css";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"blog" | "qa">("blog");
  const [sort, setSort] = useState<"newest" | "popular" | "unanswered">("newest");
  const [showFilter, setShowFilter] = useState(false);

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/posts", {
          params: {
            page: currentPage,
            type: activeTab,
          },
        });
        setPosts(res.data.posts);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      }
      setLoading(false);
    };
    fetchPosts();
  }, [currentPage, activeTab]);

  const RightSidebar = (
    <div>
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
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>DevShare Lite - Home</title>
      </Head>

      <ThreeColumnLayout rightSidebar={RightSidebar}>
        {/* Tabs */}
        <div className="flex space-x-4 border-b pb-2 mb-4">
          <button
            onClick={() => { setActiveTab("blog"); setCurrentPage(1); }}
            className={`font-medium ${
              activeTab === "blog" ? "border-b-2 border-black" : "text-gray-400"
            }`}
          >
            Blog
          </button>
          <button
            onClick={() => { setActiveTab("qa"); setCurrentPage(1); }}
            className={`font-medium ${
              activeTab === "qa" ? "border-b-2 border-black" : "text-gray-400"
            }`}
          >
            Q&A
          </button>
        </div>

        {/* Sort options */}
        <div className="flex justify-between items-center mb-4">
          <div>
            {["newest", "popular", "unanswered"].map((s) => (
              <button
                key={s}
                className={`px-3 py-1 text-sm font-medium rounded ${
                  sort === s
                    ? "bg-indigo-600 text-white"
                    : "text-gray-400 hover:bg-indigo-100"
                }`}
                onClick={() => setSort(s as any)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <button
            className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded hover:bg-indigo-100"
            onClick={() => setShowFilter((v) => !v)}
          >
            <FiFilter /> Filter
          </button>
        </div>

        {/* Filter popup */}
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

        {/* Post cards */}
        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          posts.map((post: any) => <PostCard key={post._id} post={post} />)
        )}

        {/* Pagination */}
        <div className="mt-6 flex justify-center gap-2">
          <button
            className={`text-gray-500 ${currentPage === 1 ? "opacity-50 cursor-default" : ""}`}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-2 py-1 rounded ${
                currentPage === num ? "font-bold bg-indigo-200" : ""
              }`}
            >
              {num}
            </button>
          ))}
          <button
            className={`text-gray-500 ${currentPage === totalPages ? "opacity-50 cursor-default" : ""}`}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      </ThreeColumnLayout>
    </div>
  );
}
