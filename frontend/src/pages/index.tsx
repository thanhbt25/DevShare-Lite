import Head from "next/head";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/api";
import "@/styles/globals.css";

import ThreeColumnLayout from "@/components/common/ThreeColumnsLayout";
import RightSidebar from "@/components/index/RightSidebar";
import HomeMainContent from "@/components/index/HomeMainContent";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"blog" | "qa">("blog");
  const [sort, setSort] = useState<"newest" | "popular" | "unanswered" | "voted">("newest");
  const [showFilter, setShowFilter] = useState(false);

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.max(1, Math.ceil(totalPosts / postsPerPage));

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const isBlog = activeTab === "blog";
        const res = await axiosInstance.get(
          `/posts/paginated?page=${currentPage}&limit=${postsPerPage}&isBlog=${isBlog}&sort=${sort}`
        );
        setPosts(res.data.posts);
        setTotalPosts(res.data.total);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeTab, currentPage, sort]); 

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>DevShare Lite - Home</title>
      </Head>

      <ThreeColumnLayout rightSidebar={<RightSidebar />}>
        <HomeMainContent
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setCurrentPage(1); // reset về page 1 khi đổi tab
          }}
          sort={sort}
          setSort={(s) => {
            setSort(s);
            setCurrentPage(1); // reset về page 1 khi đổi sort
          }}
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
