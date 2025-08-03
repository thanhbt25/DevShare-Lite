"use client";

import { useEffect, useState, useRef } from "react";
import { connectSocket } from "@/utils/notificationService";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import Cookies from "js-cookie";
import axiosInstance from "@/utils/api";
import { useRouter } from "next/navigation";

type Notification = {
  _id: string;
  senderId: string[];
  receiverId: string;
  type: "like" | "comment";
  postId?: string;
  content: string;
  isRead: boolean;
  createdAt: string;
};

type User = {
  _id: string;
  username: string;
};

export default function NotificationDropdown() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const [show, setShow] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const formatSenderList = (senderIds: string[]) => {
    const names = senderIds.map((id) => userMap[id] || "Unknown");
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} và ${names[1]}`;
    return `${names[0]}, ${names[1]} và ${names.length - 2} người khác`;
  };

  const formatContent = (n: Notification) => {
    const senderText = formatSenderList(n.senderId);
    const action = n.type === "like" ? "đã thích" : "đã bình luận";
    return `${senderText} ${action} bài viết của bạn.`;
  };

  // Load real-time socket
  useEffect(() => {
    if (user) {
      const token = Cookies.get("access_token");
      const socket = connectSocket(token!);

      socket.on("notification", async (data: Notification) => {
        setNotifications((prev) => [data, ...prev]);

        const unknownIds = data.senderId.filter((id) => !userMap[id]);
        if (unknownIds.length > 0) {
          try {
            const res = await axiosInstance.post("/users/bulk", {
              ids: unknownIds,
            });
            const newMap: Record<string, string> = {};
            res.data.forEach((u: User) => {
              newMap[u._id] = u.username;
            });
            setUserMap((prev) => ({ ...prev, ...newMap }));
          } catch (error) {
            console.error("Lỗi khi load userMap mới:", error);
          }
        }
      });

      return () => {
        socket.off("notification");
        socket.disconnect();
      };
    }
  }, [user, userMap]);

  // Load tất cả notifications ban đầu
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const res = await axiosInstance.get(`/notifications/${user._id}`);
        setNotifications(res.data);

        // Lấy danh sách tất cả senderId duy nhất
        const allSenderIds = Array.from(
          new Set(res.data.flatMap((n: Notification) => n.senderId))
        );

        // Gọi song song từng request GET /users/:id
        const userResponses = await Promise.all(
          allSenderIds.map((id) =>
            axiosInstance.get(`/users/${id}`).then((res) => res.data)
          )
        );

        // Tạo map _id -> username
        const map: Record<string, string> = {};
        userResponses.forEach((u: User) => {
          map[u._id] = u.username;
        });

        setUserMap(map);
      } catch (error) {
        console.error("Lỗi khi load notifications:", error);
      }
    };

    fetchNotifications();
  }, [user]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await axiosInstance.patch(`/notifications/${notification._id}/read`);
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, isRead: true } : n
          )
        );
      } catch (error) {
        console.error("Lỗi khi đánh dấu đã đọc:", error);
      }
    }
    if (notification.postId) {
      console.log()
      router.push(`/post/${notification.postId}`);
    }
    setShow(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setShow(!show)}>
        <IoMdNotificationsOutline size={28} className="hover:text-indigo-200" />
      </button>

      {show && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white text-black rounded shadow z-20">
          <div className="p-4 font-semibold border-b">Thông báo</div>
          {notifications.length === 0 ? (
            <div className="p-4 text-sm text-gray-600">
              Không có thông báo mới
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => handleNotificationClick(n)}
                className={`p-3 border-b text-sm cursor-pointer hover:bg-indigo-50 ${
                  n.isRead ? "bg-white" : "bg-indigo-100"
                }`}
              >
                <p>{formatContent(n)}</p>
                <p className="text-gray-400 text-xs">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
          <div className="p-2 text-center text-indigo-500 hover:underline">
            <Link href="/notification">Xem tất cả</Link>
          </div>
        </div>
      )}
    </div>
  );
}
