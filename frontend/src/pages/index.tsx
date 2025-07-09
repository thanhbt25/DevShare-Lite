import Head from "next/head";
import ThreeColumnLayout from "@/components/common/ThreeColumnsLayout";
import RightSidebar from "@/components/index/RightSidebar";
import HomeMainContent from "@/components/index/HomeMainContent";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/api";
import "@/styles/globals.css";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"blog" | "qa">("blog");
  const [sort, setSort] = useState<"newest" | "popular" | "unanswered">("newest");
  const [showFilter, setShowFilter] = useState(false);

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);

  // Gọi API mỗi khi activeTab hoặc currentPage thay đổi
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const isBlog = activeTab === "blog";
        const res = await axiosInstance.get(
          `/posts/paginated?page=${currentPage}&limit=${postsPerPage}&isBlog=${isBlog}`
        );
        setPosts(res.data.posts);
        setTotalPosts(res.data.total);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [activeTab, currentPage]);

  const totalPages = Math.max(1, Math.ceil(totalPosts / postsPerPage));

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>DevShare Lite - Home</title>
      </Head>

      <ThreeColumnLayout rightSidebar={RightSidebar}>
        <HomeMainContent
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setCurrentPage(1); // reset về trang 1 khi đổi tab
          }}
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
