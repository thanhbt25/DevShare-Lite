"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/api";
import Link from "next/link";

type Tag = {
  name: string;
  count: number;
};

type UserCardProps = {
  _id: string;
  username: string;
  avatar: string;
  created_at: string;
  topTags?: Tag[];
};

export default function AllUsersPage({ users }: { users: UserCardProps[] }) {
  const [userData, setUserData] = useState<UserCardProps[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/users");
        console.log("Fetched users:", res.data);
        const users = res.data;

        const usersWithTags = await Promise.all(
          users.map(async (user: UserCardProps) => {
            try {
              const tagRes = await axiosInstance.get(
                `/posts/top-tags/${user._id}`
              );
              const tags = tagRes.data;
              console.log('tags is: ', tags);
              return { ...user, topTags: Array.isArray(tags) ? tags : [] };
            } catch (err) {
              console.error(`Failed to fetch tags for user ${user._id}`, err);
              return { ...user, topTags: [] };
            }
          })
        );

        setUserData(usersWithTags);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6 w-full min-h-screen bg-white">
      <h1 className="text-3xl font-bold mb-8 text-indigo-600 border-b pb-2">
        All users
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {userData.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
}

function UserCard({ user }: { user: UserCardProps }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition duration-200">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={user.avatar}
          alt={user.username}
          className="w-14 h-14 rounded-full border object-cover"
        />
        <div>
          <Link
            href={`/users/${user._id}/page`}
            className="text-lg font-semibold text-indigo-600 hover:underline"
          >
            {user.username}
          </Link>
          <p className="text-sm text-gray-500">
            Joined at{" "}
            {new Date(user.created_at).toLocaleDateString("us-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {user.topTags && user.topTags.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-1 font-medium">
            Popular tags:
          </p>
          <div className="flex flex-wrap gap-2">
            {user.topTags.slice(0, 3).map((tag) => (
              <span
                key={tag.name}
                className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full"
              >
                {tag.name} ({tag.count})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
