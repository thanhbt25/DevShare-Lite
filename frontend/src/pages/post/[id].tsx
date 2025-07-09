"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import axiosInstance from "@/utils/api";
import ThreeColumnLayout from "@/components/common/ThreeColumnsLayout";
import { useUser } from "@/contexts/UserContext";
import "@/styles/globals.css";
import RightSidebar from "@/components/post_id/RightSideBar";
import PostMainContent from "@/components/post_id/MainContent";

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const [voted, setVoted] = useState<"upvoted" | "downvoted" | null>(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]); // Lưu danh sách comment riêng

  // Debug context user
  useEffect(() => {
    console.log("👤 Current user from context:", user);
  }, [user]);

  // Fetch bài viết
  useEffect(() => {
    if (typeof id === "string") {
      axiosInstance.post(`/posts/${id}/view`);

      axiosInstance
        .get(`/posts/${id}`)
        .then((res) => {
          const data = res.data;
          setPost(data);

          if (user) {
            setFavorited(data.favoritedBy?.includes(user._id));
            if (data.votedUpUsers?.includes(user._id)) setVoted("upvoted");
            else if (data.votedDownUsers?.includes(user._id))
              setVoted("downvoted");
            else setVoted(null);
          }

          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id, user]);

  useEffect(() => {
    if (typeof id === "string") {
      axiosInstance
        .get(`/comments/post/${id}`)
        .then((res) => {
          console.log("Comments:", res.data); 
          setComments(res.data);
        })
        .catch((err) => console.error("Comment fetch error:", err));
    }
  }, [id]);

  const handleFavorite = async () => {
    if (!post || !user) return alert("Bạn cần đăng nhập để lưu bài viết");
    try {
      if (favorited) {
        await axiosInstance.post(`/posts/${post._id}/unfavorite/${user._id}`);
        setFavorited(false);
      } else {
        await axiosInstance.post(`/posts/${post._id}/favorite/${user._id}`);
        setFavorited(true);
      }

      const res = await axiosInstance.get(`/posts/${post._id}`);
      setPost(res.data);
    } catch (err) {
      console.error("Favorite toggle error:", err);
    }
  };

  const handleVote = async (type: "upvote" | "downvote") => {
    if (!post || !user) return alert("Bạn cần đăng nhập để vote");

    try {
      if (
        (type === "upvote" && voted === "upvoted") ||
        (type === "downvote" && voted === "downvoted")
      ) {
        await axiosInstance.patch(`/posts/${post._id}/unvote/${user._id}`);
        setVoted(null);
      } else {
        await axiosInstance.post(`/posts/${post._id}/${type}/${user._id}`);
        setVoted(type === "upvote" ? "upvoted" : "downvoted");
      }

      const res = await axiosInstance.get(`/posts/${post._id}`);
      setPost(res.data);
    } catch (err) {
      console.error("Voting error:", err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!user || !post) return alert("Bạn cần đăng nhập để bình luận");
    if (!comment.trim()) return;

    try {
      await axiosInstance.post(`/comments`, {
        content: comment,
        authorId: user._id,
        postId: post._id,
      });
      setComment("");

      const res = await axiosInstance.get(`/comments/post/${post._id}`);
      setComments(res.data);
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <Head>
        <title>DevShare Lite - Post Detail</title>
      </Head>

      <ThreeColumnLayout rightSidebar={<RightSidebar />}>
        <PostMainContent
          post={post}
          loading={loading}
          favorited={favorited}
          voted={voted}
          comment={comment}
          setComment={setComment}
          handleVote={handleVote}
          handleFavorite={handleFavorite}
          handleCommentSubmit={handleCommentSubmit}
          upvoteCount={post?.votes?.up || 0}
          downvoteCount={post?.votes?.down || 0}
          saveCount={post?.favorites?.length || 0}
          comments={comments}
        />
      </ThreeColumnLayout>
    </div>
  );
}
