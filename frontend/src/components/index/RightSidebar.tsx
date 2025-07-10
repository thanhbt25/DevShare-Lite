"use client";

import React, { useEffect, useState } from "react";
import { FiTrendingUp } from "react-icons/fi";
import axiosInstance from "@/utils/api";

interface RawContributor {
  authorId: string;
  postCount: number;
}

interface User {
  id: string;
  username: string;
  avatar: string;
}

interface EnrichedContributor {
  id: string;
  username: string;
  avatar: string;
  postCount: number;
}

export default function RightSidebar() {
  const [topUsers, setTopUsers] = useState<EnrichedContributor[]>([]);
  const [trendingTags, setTrendingTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        // Lấy danh sách top contributors
        const contributorRes = await axiosInstance.get<RawContributor[]>(
          "/posts/top-contributors-id"
        );
        const contributors = contributorRes.data;
        const ids = contributors.map((c) => c.authorId.toString());

        // Lấy thông tin user
        const userRes = await axiosInstance.post<User[]>("/users/bulk", { ids });
        const userMap = new Map(userRes.data.map((u) => [u.id, u]));

        // Ghép dữ liệu
        const enriched: EnrichedContributor[] = contributors.map((c) => {
          const user = userMap.get(c.authorId.toString());
          return {
            id: c.authorId,
            username: user?.username || "Anonymous",
            avatar: user?.avatar || "/images/default-user.png",
            postCount: c.postCount,
          };
        });

        setTopUsers(enriched);
        console.log(enriched);

        // Lấy trending tags
        const tagRes = await axiosInstance.get<string[]>("/posts/trending");
        setTrendingTags(tagRes.data);
      } catch (err) {
        console.error("Failed to fetch sidebar data:", err);
      }
    };

    fetchSidebarData();
  }, []);

  return (
    <div>
      <h3 className="font-bold mb-2">Top Contributors</h3>
      {topUsers.map((user) => (
        <div key={user.id} className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <img
              src={user.avatar || "/user.png"}
              className="w-6 h-6 rounded-full"
              alt="user"
            />
            <span className="text-sm">{user.username}</span>
          </div>
          <span className="text-xs text-gray-500">{user.postCount} posts</span>
        </div>
      ))}

      <div className="mt-8">
        <div className="flex items-center gap-2 mb-2">
          <FiTrendingUp className="text-indigo-600" />
          <h3 className="font-bold">Trending Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingTags.map((tag, index) => (
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
}
