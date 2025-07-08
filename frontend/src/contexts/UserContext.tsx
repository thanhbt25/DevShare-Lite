"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "@/utils/api";

interface User {
  id: string;
  _id: string;
  username: string;
  email?: string;
  avatar?: string;
  // password?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);

        // Nếu là object từ mongoose → lấy phần _doc ra
        const plainUser = parsed._doc ? parsed._doc : parsed;

        // Nếu đã có _id → dùng luôn
        if (plainUser._id) {
          setUser(plainUser);
        } else if (plainUser.username) {
          // Nếu thiếu _id nhưng có username → fetch lại từ server
          axiosInstance
            .get(`/users/username/${plainUser.username}`)
            .then((res) => {
              const userData = res.data;
              localStorage.setItem("user", JSON.stringify(userData));
              setUser(userData);
            })
            .catch((err) => {
              console.error("❌ Failed to fetch user data:", err);
              setUser(null);
            });
        } else {
          setUser(null); // Không có username hoặc id thì reject
        }
      } catch (err) {
        console.error("❌ Failed to parse stored user:", err);
        setUser(null);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
