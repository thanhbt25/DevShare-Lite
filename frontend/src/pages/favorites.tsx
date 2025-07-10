"use client";

import Head from "next/head";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/api";
import ThreeColumnLayout from "@/components/common/ThreeColumnsLayout";
import RightSidebar from "@/components/index/RightSidebar";
import PostCard from "@/components/review/ReviewPostcard";
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
        console.error("Lỗi khi lấy bài viết đã lưu:", error);
      }
      setLoading(false);
    };

    fetchFavorites();
  }, [user?._id]);

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>DevShare Lite - Bài viết đã lưu</title>
      </Head>

      <ThreeColumnLayout rightSidebar={RightSidebar}>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Bài viết đã lưu của bạn</h1>

          {loading ? (
            <p>Đang tải...</p>
          ) : !user ? (
            <p className="text-red-500">Bạn cần đăng nhập để xem bài viết đã lưu.</p>
          ) : favoritePosts.length === 0 ? (
            <p>Bạn chưa lưu bài viết nào.</p>
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
