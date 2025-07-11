"use client";

import Head from "next/head";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/api";
import ThreeColumnLayout from "@/components/common/ThreeColumnsLayout";
import RightSidebar from "@/components/index/RightSidebar";
import PostCard from "@/components/index/PostCard";
import { useUser } from "@/contexts/UserContext";

export default function FavoritesPage() {
  const { user } = useUser();
  const [favoritePosts, setFavoritePosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?._id) return;

    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/users/${user._id}/favorite`);
        const data = res.data;

        // Đảm bảo là mảng
        const favoritesArray = Array.isArray(data) ? data : [];
        setFavoritePosts(favoritesArray);
      } catch (error) {
        console.error("Error fetching your favorite posts:", error);
      }
      setLoading(false);
    };

    fetchFavorites();
  }, [user?._id]);

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>DevShare Lite - Your favorite posts</title>
      </Head>

      <ThreeColumnLayout rightSidebar={< RightSidebar />}>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Your favorite posts</h1>

          {loading ? (
            <p>Downloading...</p>
          ) : !user ? (
            <p className="text-red-500">You need to login to see your favorite posts.</p>
          ) : favoritePosts.length === 0 ? (
            <p>You haven't saved any posts yet.</p>
          ) : (
            <div className="space-y-4">
              {favoritePosts.map((post: any) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </ThreeColumnLayout>
    </div>
  );
}
