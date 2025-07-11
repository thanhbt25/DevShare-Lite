import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/api";
import Head from "next/head";
import ThreeColumnLayout from "@/components/common/ThreeColumnsLayout";
import RightSidebar from "@/components/index/RightSidebar";
import PostCard from "@/components/index/PostCard";

export default function SearchResultPage() {
  const router = useRouter();
  const { q } = router.query;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (typeof q !== "string" || q.trim() === "") return;

      try {
        const res = await axiosInstance.get(`/posts/search?q=${q}`);
        setPosts(res.data);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [q]);

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Searching results - DevShare Lite</title>
      </Head>

      <ThreeColumnLayout rightSidebar={<RightSidebar />}>
        <div className="p-4">
          <h1 className="text-xl font-bold mb-4">Searching results for: <span className="text-indigo-600">{q}</span></h1>

          {loading ? (
            <p>Downloading results...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-500">No suiable post.</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post: any) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </ThreeColumnLayout>
    </div>
  );
}
