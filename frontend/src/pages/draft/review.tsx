import Head from "next/head";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/api";
import ThreeColumnLayout from "@/components/common/ThreeColumnsLayout";
import RightSidebar from "@/components/index/RightSidebar";
import PostCard from "@/components/index/PostCard";
import { useUser } from "@/contexts/UserContext";

export default function ReviewDraftPage() {
  const { user } = useUser();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?._id) return;

    const fetchDrafts = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/drafts/user/${user._id}`);
        setDrafts(res.data);
      } catch (error) {
        console.error("Error fetching your drafts:", error);
      }
      setLoading(false);
    };

    fetchDrafts();
  }, [user?._id]);

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>DevShare Lite - Your drafts</title>
      </Head>

      <ThreeColumnLayout rightSidebar={<RightSidebar />}>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Your drafts</h1>

          {loading ? (
            <p>Downloading...</p>
          ) : !user ? (
            <p className="text-red-500">You need to login to see your drafts.</p>
          ) : drafts.length === 0 ? (
            <p>You haven't had any drafts yet.</p>
          ) : (
            <div className="space-y-4">
              {drafts.map((post: any) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </ThreeColumnLayout>
    </div>
  );
}
