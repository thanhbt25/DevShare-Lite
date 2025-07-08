"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import API from "@/utils/api";
import { useUser } from "@/contexts/UserContext";
import Cookies from "js-cookie";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import Footer from "@/components/common/Footer";
import "@/styles/globals.css";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { user, setUser } = useUser();

  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: user?.password || "",
    confirmPassword: user?.password || "",
    avatar: "",
  });
  const [previewAvatar, setPreviewAvatar] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    console.log("👤 Current user from context:", user);
    console.log("Current id: ", user?._id);
    console.log("Current username: ", user?.username);
    console.log("Current email: ", user?.email);
    console.log("Current avatar: ", user?.avatar);
  }, [user]);

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username,
        email: user.email || "",
        password: "",
        confirmPassword: "",
        avatar: user.avatar || "",
      });
      setPreviewAvatar(user.avatar || "/images/default-user.png");
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const res = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const imageUrl = data.secure_url;

      setForm((prev) => ({ ...prev, avatar: imageUrl }));
      setPreviewAvatar(imageUrl);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (form.password && form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const token = Cookies.get("access_token");
      const res = await API.patch(`/users/${user?._id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setMessage("Profile updated successfully!");
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-indigo-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
            Please log in to update your profile
          </h2>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 bg-white">
        <div className="w-[250px]">
          <Sidebar />
        </div>

        <main className="flex-1 bg-indigo-50 py-10 px-6 flex justify-center items-start">
          <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
            {/* Title */}
            <h2 className="text-3xl font-bold text-center mb-10 text-indigo-700 tracking-wide">
              Update Your Profile
            </h2>

            {/* Avatar */}
            <div className="flex justify-center mb-8 relative group">
              <img
                src={previewAvatar}
                alt="avatar"
                className="w-28 h-28 rounded-full border shadow-md object-cover cursor-pointer"
                onClick={handleAvatarClick}
              />
              <div
                className="absolute inset-0 rounded-full bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                onClick={handleAvatarClick}
              >
                <span className="text-white text-2xl font-bold">+</span>
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Avatar URL
                </label>
                <input
                  type="text"
                  name="avatar"
                  value={form.avatar}
                  onChange={handleChange}
                  placeholder={user?.avatar || "Enter avatar URL"}
                  className="w-full border rounded px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder={user?.username || "Enter your username"}
                  className="w-full border rounded px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={user?.email || "Enter your email"}
                  className="w-full border rounded px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="w-full border rounded px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your new password"
                  className="w-full border rounded px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>

              {/* Message */}
              {message && (
                <p
                  className={`text-center font-medium text-sm ${
                    message.includes("successfully")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {message}
                </p>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition font-semibold"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
