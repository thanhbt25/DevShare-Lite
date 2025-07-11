import Head from "next/head";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/api";
import ThreeColumnLayout from "@/components/common/ThreeColumnsLayout";
import RightSidebar from "@/components/index/RightSidebar";
import PostCard from "@/components/review/ReviewPostcard";
import { useUser } from "@/contexts/UserContext";

export default function ReviewPostedPage() {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?._id) return;

    const fetchPosted = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/posts/user/${user._id}`);
        setPosts(res.data);
      } catch (error) {
        console.error("Error fetching posted articles:", error);
      }
      setLoading(false);
    };

    fetchPosted();
  }, [user?._id]);

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>DevShare Lite - Your Published Posts</title>
      </Head>

      <ThreeColumnLayout>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Your Published Posts</h1>

          {loading ? (
            <p>Loading...</p>
          ) : !user ? (
            <p className="text-red-500">You need to log in to view your posts.</p>
          ) : posts.length === 0 ? (
            <p>You haven't published any posts yet.</p>
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
