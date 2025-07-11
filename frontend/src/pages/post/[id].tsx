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
  const { user, setUser } = useUser();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const [voted, setVoted] = useState<"upvoted" | "downvoted" | null>(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]); // Lưu danh sách comment riêng
  const [replyMap, setReplyMap] = useState<{ [key: string]: string }>({});

  type CommentType = {
    _id: string;
    content: string;
    authorName: string;
    createdAt: string;
    upvoteCount: number;
    parentId?: string | null;
  };

  // Debug context user
  useEffect(() => {
    console.log("👤 Current user from context:", user);
    console.log("user id: ", user?._id);
  }, [user]);

  const onReplySubmit = async (parentId: string, content: string) => {
    if (!user || !post) return alert("You need to login to reply!");
    if (!content) return;
    console.log('content is: ', content, 'parent id: ',  parentId);

    try {
      await axiosInstance.post(`/comments`, {
        content,
        authorId: user._id,
        postId: post._id,
        parentId, 
      });

      setReplyMap((prev) => ({ ...prev, [parentId]: "" }));

      const res = await axiosInstance.get(`/comments/post/${post._id}`);
      const enriched = await enrichComments(res.data, user._id);
      setComments(enriched);
    } catch (err) {
      console.error("Reply comment error:", err);
    }
  };

  const enrichComments = async (
    comments: any[],
    currentUserId?: string
  ): Promise<any[]> => {
    const authorIds = comments.map((c) => c.authorId);
    const uniqueIds = [
      ...new Set(
        authorIds.map((id: any) => {
          if (typeof id === "string") return id;
          if (typeof id === "object" && id !== null) {
            return id._id?.toString?.() || id.id?.toString?.() || "";
          }
          return "";
        })
      ),
    ].filter(Boolean);

    const usersRes = await axiosInstance.post("/users/bulk", {
      ids: uniqueIds,
    });
    const userMap: Record<string, string> = {};
    usersRes.data.forEach((user: any) => {
      userMap[user.id] = user.username;
    });

    return comments.map((c: any) => {
      const likedBy = c.likedBy || [];
      const hasVoted = currentUserId ? likedBy.includes(currentUserId) : false;
      return {
        ...c,
        authorName: userMap[c.authorId] || "anonymous",
        upvoteCount: likedBy.length,
        hasVoted,
      };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (typeof id !== "string") return;
      try {
        const [postRes, commentRes] = await Promise.all([
          axiosInstance.get(`/posts/${id}`),
          axiosInstance.get(`/comments/post/${id}`),
        ]);

        const postData = postRes.data;
        const commentData = commentRes.data;

        // Author enrichment
        const authorIds = [
          postData.authorId,
          ...commentData.map((c: any) => c.authorId),
        ];
        const uniqueIds = [
          ...new Set(
            authorIds.map((id: any) => {
              if (typeof id === "string") return id;
              if (typeof id === "object" && id !== null)
                return id._id?.toString?.() || id.id?.toString?.() || "";
              return "";
            })
          ),
        ].filter(Boolean);

        const usersRes = await axiosInstance.post("/users/bulk", {
          ids: uniqueIds,
        });

        const userMap: Record<string, string> = {};
        usersRes.data.forEach((user: any) => {
          userMap[user.id] = user.username;
        });

        // Cập nhật trạng thái vote/save
        if (user) {
          setFavorited(postData.favoritedBy?.includes(user._id));
          if (postData.votedUpUsers?.includes(user._id)) {
            setVoted("upvoted");
          } else if (postData.votedDownUsers?.includes(user._id)) {
            setVoted("downvoted");
          } else {
            setVoted(null);
          }
        }

        // Set lại post đầy đủ (gồm votes, favorites,...)
        setPost({
          ...postData,
          authorName: userMap[postData.authorId] || "anonymous",
        });

        const enrichedComments = commentData.map((c: any) => ({
          ...c,
          authorName: userMap[c.authorId] || "anonymous",
          upvoteCount: c.likedBy?.length || 0,
        }));

        setComments(enrichedComments);
      } catch (err) {
        console.error("Error fetching post or comments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const onCommentVote = async (commentId: string) => {
    try {
      if (!user) return alert("You need to login to vote!");

      const comment = comments.find((c) => c._id === commentId);
      const hasVoted = comment?.likedBy?.includes(user._id); // hoặc comment.hasVoted nếu đã enrich

      if (hasVoted) {
        await axiosInstance.patch(`/comments/${commentId}/unvote/${user._id}`);
      } else {
        await axiosInstance.post(`/comments/${commentId}/upvote/${user._id}`);
      }

      const res = await axiosInstance.get(`/comments/post/${post._id}`);
      const enriched = await enrichComments(res.data, user._id);
      setComments(enriched);
    } catch (err) {
      console.error("Vote comment error:", err);
    }
  };

  const handleFavorite = async () => {
    if (!post || !user) return alert("You need to login to save the post.");

    try {
      if (favorited) {
        await axiosInstance.post(`/posts/${post._id}/unfavorite/${user._id}`);
        await axiosInstance.post(`/users/${user._id}/unfavorite/${post._id}`);
        setFavorited(false);
      } else {
        await axiosInstance.post(`/posts/${post._id}/favorite/${user._id}`);
        await axiosInstance.post(`/users/${user._id}/favorite/${post._id}`);
        setFavorited(true);
      }

      const userRes = await axiosInstance.get(`/users/${user._id}`);
      setUser(userRes.data);

      const res = await axiosInstance.get(`/posts/${post._id}`);
      setPost(res.data);
    } catch (err) {
      console.error("Favorite toggle error:", err);
    }
  };

  const handleVote = async (type: "upvote" | "downvote") => {
    if (!post || !user) return alert("You need to login to vote!");

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
    if (!user || !post) return alert("You need to login to comment!");
    if (!comment.trim()) return;

    try {
      await axiosInstance.post(`/comments`, {
        content: comment,
        authorId: user._id,
        postId: post._id,
      });
      setComment("");

      const res = await axiosInstance.get(`/comments/post/${post._id}`);
      const enriched = await enrichComments(res.data);
      setComments(enriched);
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
          comments={comments}
          onCommentVote={onCommentVote}
          onReplySubmit={onReplySubmit}
        />
      </ThreeColumnLayout>
    </div>
  );
}
