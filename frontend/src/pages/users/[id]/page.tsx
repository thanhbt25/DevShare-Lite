"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/utils/api";
import Sidebar from "@/components/common/Sidebar";
import UserProfile from "@/components/users/UserProfile";

type Badge = {
  type: "gold" | "silver" | "bronze";
  name: string;
  date: string;
};

type RawUser = {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  favorites: string[];
  created_at: string;
};

export default function UserProfilePage() {
  const { id } = useParams() ?? {};
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/users/${id}`);
        const data: RawUser = res.data;

        const badgeList = evaluateBadges(data);

        // Gọi thêm bài viết
        const postRes = await axiosInstance.get(`/posts/user/${id}`);
        console.log("postRes is:  ", postRes);
        const posts = (postRes.data || []).map((p: any) => ({
          _id: p._id,
          title: p.title,
          score: p.likes?.length || 0,
          createdAt: p.createdAt,
        }));

        const profile = {
          avatarUrl: data.avatar || "/default-avatar.png",
          name: data.username,
          memberFor: calculateMemberFor(data.created_at),
          lastSeen: "recently",
          stats: {
            reputation: 0,
            reached: 0,
            answers: 0,
            questions: posts.length,
          },
          badges: badgeList,
          tags: [],
          posts,
        };

        setUser(profile);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <div className="p-6 text-red-500">User not found.</div>;

  return (
    <>
      <div className="flex">
        <Sidebar />
        <UserProfile user={user} />
      </div>
    </>
  );
}

// logic đánh giá danh hiệu
function evaluateBadges(user: RawUser) {
  const badges = {
    gold: [] as Badge[],
    silver: [] as Badge[],
    bronze: [] as Badge[],
  };

  const now = new Date().toISOString().split("T")[0];

  // 🥈 Thành viên lâu năm (>= 12 tháng)
  const months = calculateMonthsSince(user.created_at);
  if (months >= 12) {
    badges.silver.push({
      type: "silver",
      name: "Thành viên lâu năm",
      date: now,
    });
  }

  // 🥉 Fan Cứng (favorite >= 10 post)
  if ((user.favorites?.length || 0) >= 10) {
    badges.bronze.push({
      type: "bronze",
      name: "Fan Cứng",
      date: now,
    });
  }

  // 🥉 Cá nhân hoá tài khoản (avatar khác mặc định)
  if (
    user.avatar &&
    !user.avatar.includes("ui-avatars.com/api") // avatar mặc định
  ) {
    badges.bronze.push({
      type: "bronze",
      name: "Cá nhân hoá tài khoản",
      date: now,
    });
  }

  // 🥇 Xác thực email (email hợp lệ)
  if (user.email && /^[\w.+-]+@\w+\.\w+$/.test(user.email)) {
    badges.gold.push({
      type: "gold",
      name: "Đã xác thực email",
      date: now,
    });
  }

  return badges;
}

function calculateMonthsSince(dateString: string | Date): number {
  const date = new Date(dateString);
  const now = new Date();
  return (
    (now.getFullYear() - date.getFullYear()) * 12 +
    now.getMonth() -
    date.getMonth()
  );
}

function calculateMemberFor(dateString: string): string {
  const months = calculateMonthsSince(dateString);
  if (months >= 12) return `${Math.floor(months / 12)} years`;
  if (months === 0) return "less than 1 month";
  return `${months} months`;
}
