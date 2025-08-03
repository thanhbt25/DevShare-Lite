"use client";

import { useEffect, useState, useRef } from "react";
import { getSocket, connectSocket } from "@/utils/notificationService";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import Cookies from "js-cookie";

type Notification = {
  _id: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationDropdown() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [show, setShow] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load real-time socket
  useEffect(() => {
    if (user) {
      const token = Cookies.get("access_token");
      const socket = connectSocket(token!); 

      socket.on("notification", (data: Notification) => {
        setNotifications((prev) => [data, ...prev]);
      });

      return () => {
        socket.off("notification");
        socket.disconnect();
      };
    }
  }, [user]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setShow(!show)}>
        <IoMdNotificationsOutline size={28} className="hover:text-indigo-200" />
      </button>

      {show && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white text-black rounded shadow z-20">
          <div className="p-4 font-semibold border-b">Notifications</div>
          {notifications.length === 0 ? (
            <div className="p-4 text-sm text-gray-600">No new notifications</div>
          ) : (
            notifications.map((n) => (
              <div key={n._id} className="p-3 border-b hover:bg-indigo-50 text-sm">
                <p>{n.content}</p>
                <p className="text-gray-400 text-xs">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
            ))
          )}
          <div className="p-2 text-center text-indigo-500 hover:underline">
            <Link href="/notification">View all</Link>
          </div>
        </div>
      )}
    </div>
  );
}
