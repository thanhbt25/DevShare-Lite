"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import axiosInstance from "@/utils/api";
import { useUser } from "@/contexts/UserContext";
import ThreeColumnLayout from "@/components/common/ThreeColumnsLayout";
import RightSidebar from "@/components/index/RightSidebar";
import "@/styles/globals.css";

export default function DraftDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof id === "string") {
      axiosInstance
        .get(`/posts/${id}`)
        .then((res) => {
          setPost(res.data);
        })
        .catch((err) => {
          console.error("Error fetching drafts:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleDelete = async () => {
    if (!user || !post) return alert("You need to login to delete.");
    const confirmed = confirm("Are you sure to delete this post?");
    if (!confirmed) return;

    try {
      await axiosInstance.delete(`/posts/${post._id}`);
      alert("Draft deleted.");
      router.push("/draft/review-draft");
    } catch (err) {
      console.error("Error in deleting post:", err);
      alert("Cannot detele the post.");
    }
  };

  const handleEdit = () => {
    router.push(`/edit/${post._id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Head>
        <title>DevShare Lite - Review you drafts</title>
      </Head>

      <ThreeColumnLayout rightSidebar={<RightSidebar />}>
        <div className="p-4">
          {loading ? (
            <p>Downloading you drafts...</p>
          ) : !post ? (
            <p>Cannot find your drafts.</p>
          ) : (
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">{post.title}</h1>

              {post.tags?.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-gray-200 text-sm px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: post.html || post.content }}
              />

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleEdit}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Edit 
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </ThreeColumnLayout>
    </div>
  );
}
