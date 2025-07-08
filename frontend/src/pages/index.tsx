import Head from "next/head";
import Footer from "@/components/common/Footer";
import PostCard from "@/components/index/PostCard";
import ThreeColumnLayout from "@/components/common/ThreeColumnsLayout";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/api";
import "@/styles/globals.css";

import RightSidebar from "@/components/index/RightSidebar";
import HomeMainContent from "@/components/index/HomeMainContent";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"blog" | "qa">("blog");
  const [sort, setSort] = useState<"newest" | "popular" | "unanswered">(
    "newest"
  );
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

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>DevShare Lite - Home</title>
      </Head>

      <ThreeColumnLayout rightSidebar={RightSidebar}>
        <HomeMainContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sort={sort}
          setSort={setSort}
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          posts={posts}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </ThreeColumnLayout>
    </div>
  );
}
