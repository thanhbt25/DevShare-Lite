"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on first load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);

        // Nếu object có `_doc`, thì là Mongoose Document → lấy phần _doc
        const plainUser = parsed._doc ? parsed._doc : parsed;

        setUser(plainUser);
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

// Hook để dùng trong các component khác
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
