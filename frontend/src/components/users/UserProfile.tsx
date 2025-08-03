"use client";

import { FaMedal, FaTrophy, FaAward } from "react-icons/fa";

type Badge = {
  type: "gold" | "silver" | "bronze";
  name: string;
  date: string;
};

type Post = {
  _id: string;
  title: string;
  score: number;
  createdAt: string;
};

type UserProfileProps = {
  avatarUrl: string;
  name: string;
  memberFor: string;
  lastSeen: string;
  stats: {
    reputation: number;
    reached: number;
    answers: number;
    questions: number;
  };
  badges: {
    gold: Badge[];
    silver: Badge[];
    bronze: Badge[];
  };
  tags: { name: string; count: number; percentage: number }[];
  posts: Post[]; // thêm vào
};

export default function UserProfile({ user }: { user: UserProfileProps }) {
  return (
    <div className="p-6 w-full">
      {/* Avatar + Info */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={user.avatarUrl}
          alt="avatar"
          className="w-24 h-24 rounded bg-gray-200"
        />
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-sm text-gray-600">
            Member for {user.memberFor} • Last seen {user.lastSeen}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Reputation" value={user.stats.reputation} />
        <StatCard label="Reached" value={user.stats.reached.toLocaleString()} />
        <StatCard label="Answers" value={user.stats.answers} />
        <StatCard label="Questions" value={user.stats.questions} />
      </div>

      {/* Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <BadgeCard title="Gold" color="yellow-500" badges={user.badges.gold} />
        <BadgeCard title="Silver" color="gray-400" badges={user.badges.silver} />
        <BadgeCard title="Bronze" color="amber-600" badges={user.badges.bronze} />
      </div>

      {/* Top Tags */}
      {user.tags.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">Top tags</h2>
          <div className="space-y-2">
            {user.tags.map((tag) => (
              <div
                key={tag.name}
                className="flex justify-between p-3 bg-gray-100 rounded"
              >
                <span className="font-mono">{tag.name}</span>
                <span>
                  {tag.count} posts ({tag.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Posts */}
      {user.posts.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Top posts</h2>
          <ul className="space-y-2">
            {user.posts.map((post) => (
              <li
                key={post._id}
                className="flex justify-between items-center p-3 bg-gray-100 rounded"
              >
                <div className="flex gap-2 items-center">
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
                    {post.score}
                  </span>
                  <a
                    href={`/post/${post._id}`}
                    className="hover:underline font-medium"
                  >
                    {post.title}
                  </a>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="p-4 bg-white shadow rounded">
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function BadgeCard({
  title,
  color,
  badges,
}: {
  title: "Gold" | "Silver" | "Bronze";
  color: string;
  badges: Badge[];
}) {
  const iconMap = {
    Gold: <FaTrophy className="inline mr-1 text-yellow-500" />,
    Silver: <FaAward className="inline mr-1 text-gray-400" />,
    Bronze: <FaMedal className="inline mr-1 text-amber-600" />,
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <div className={`text-${color} text-lg font-semibold mb-2`}>
        {iconMap[title]} {badges.length} {title.toLowerCase()} badge
        {badges.length !== 1 && "s"}
      </div>
      {badges.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No {title.toLowerCase()} badges yet.
        </p>
      ) : (
        <ul className="text-sm">
          {badges.map((badge, index) => (
            <li key={index} className="flex justify-between mb-1">
              <span>{badge.name}</span>
              <span className="text-gray-500">{badge.date}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
