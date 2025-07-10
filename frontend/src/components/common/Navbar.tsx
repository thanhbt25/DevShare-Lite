"use client";

import Link from "next/link";
import { FiPlusSquare, FiBell, FiSearch } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/router";

export default function Navbar() {
  const { user, setUser } = useUser(); // Sử dụng context
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    router.push(`/find?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  // Ẩn dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    Cookies.remove("access_token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="bg-indigo-500 text-white px-6 py-3 flex items-center">
      {/* Logo */}
      <Link href="/">
        <img
          src="/images/devshare-lite-logo-white.png"
          alt="DevShare Lite Logo"
          className="w-15 h-10 rectangle"
        />
      </Link>

      {/* Title */}
      <h1 className="text-2xl font-bold ml-4">DevShare Lite</h1>

      {/* Search center */}
      <div className="flex-1 flex justify-center">
        <form onSubmit={handleSearch} className="relative w-full max-w-xl">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search DevShare Lite"
            className="w-full pl-4 pr-10 py-2 rounded-full text-black"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-black hover:text-indigo-600"
          >
            <FiSearch size={22} />
          </button>
        </form>
      </div>

      {/* Actions */}
      <div className="flex gap-10 items-center ml-4">
        {user ? (
          <>
            <Link href="/create-post" aria-label="Add Post">
              <FiPlusSquare size={28} className="hover:text-indigo-200" />
            </Link>
            <Link href="#" aria-label="Notifications" title="Notifications - coming soon">
              <FiBell size={28} className="hover:text-indigo-200" />
            </Link>

            {/* Avatar dropdown */}
            <div className="relative" ref={menuRef}>
              <img
                src={user.avatar || "/images/default-user.png"}
                alt="user avatar"
                className="w-8 h-8 rounded-full cursor-pointer border border-white"
                onClick={() => setShowMenu((prev) => !prev)}
              />
              {showMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow z-10">
                  <div className="px-4 py-2 text-sm font-medium border-b">
                    {user.username}
                  </div>
                  <Link
                    href="/update-profile"
                    className="block px-4 py-2 hover:bg-indigo-100 text-sm"
                  >
                    Update Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-100 text-sm text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="px-4 py-1 rounded-full bg-white text-indigo-600 font-semibold hover:bg-indigo-100"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-1 rounded-full bg-white text-indigo-600 font-semibold hover:bg-indigo-100"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
