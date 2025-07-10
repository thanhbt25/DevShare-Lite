"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/utils/api";

interface Post {
  id?: string;        // nếu có transform
  _id?: string;       // nếu chưa có transform
  title: string;
}

const RightSidebar = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const res = await axiosInstance.get<Post[]>("/posts/latest-posts");
        setPosts(
          res.data.map((p) => ({
            id: p.id || p._id, // fallback nếu backend chưa có toJSON transform
            title: p.title,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch latest posts:", err);
      }
    };

    fetchLatestPosts();
  }, []);

  return (
    <div className="bg-white border rounded-md p-4 shadow-sm">
      <h3 className="text-sm font-semibold mb-2">Latest Posts</h3>
      <ul className="text-gray-700 text-sm space-y-1 list-disc list-inside">
        {posts.map((p) => (
          <li key={p.id}>
            <Link href={`/post/${p.id}`} className="hover:underline text-indigo-600">
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RightSidebar;
