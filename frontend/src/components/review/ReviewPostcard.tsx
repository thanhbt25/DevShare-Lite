import Link from "next/link";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/api";

interface Props {
  post: any;
}

export default function PostCard({ post }: Props) {
  const [authorName, setAuthorName] = useState("anonymous");

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const res = await axiosInstance.get(`/users/${post.authorId}`);
        setAuthorName(res.data.username);
      } catch (err) {
        console.error("Failed to fetch author:", err);
      }
    };

    if (typeof post.authorId === "string") {
      fetchAuthor();
    } else if (post.authorId?.username) {
      setAuthorName(post.authorId.username); // in case populated
    }
  }, [post.authorId]);

  return (
    <div className="border rounded p-4 mb-4 bg-white shadow hover:shadow-lg transition-shadow">
      <div className="flex">
        <div className="flex flex-col items-center justify-center w-28 mr-4 text-sm text-gray-600 gap-2">
          <div>
            <strong>{post.upvotes - post.downvotes}</strong> votes
          </div>
          <div>
            <strong>{post.commentCount}</strong> answers
          </div>
          <div>
            <strong>{post.views}</strong> views
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <Link href={ `/your-post/${post._id}` }>
              <h3 className="text-lg font-bold text-blue-800 underline cursor-pointer break-words line-clamp-2">
                {post.title}
              </h3>
            </Link>

            <p className="text-sm text-gray-700 mt-1 break-words line-clamp-3">
              {post.content}
            </p>
          </div>

          <div className="flex justify-between items-end mt-2 flex-wrap gap-2">
            <div className="flex gap-2 flex-wrap">
              {post.tags?.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="bg-gray-800 text-white text-xs rounded px-2 py-1"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="text-xs text-gray-500 whitespace-nowrap">
              By <span className="font-medium">{authorName}</span> •{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
