import Link from "next/link";
import { FiPlusSquare, FiBell, FiSearch } from "react-icons/fi";
import { useState, useEffect} from "react";
import Cookies from "js-cookie";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("access_token");
    setIsLoggedIn(!!token);
  }, []);

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
        <div className="relative w-full max-w-xl">
          <input
            type="text"
            placeholder="Search DevShare Lite"
            className="w-full pl-4 pr-10 py-2 rounded-full text-black"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 text-black hover:text-indigo-600">
            <FiSearch size={22} />
          </button>
        </div>
      </div>
      {/* Action */}
      <div className="flex gap-10 items-center ml-4">
        {isLoggedIn ? (
          <>
            <Link href="/create-post" aria-label="Add Post">
              <FiPlusSquare size={28} className="hover:text-indigo-200" />
            </Link>
            <Link href="#" aria-label="Notifications">
              <FiBell size={28} className="hover:text-indigo-200" />
            </Link>
            <img
              src="/user.png"
              alt="user avatar"
              className="w-8 h-8 rounded-full"
            />
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