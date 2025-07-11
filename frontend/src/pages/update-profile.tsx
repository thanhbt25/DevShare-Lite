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

import UpdateProfileForm from "@/components/update-profile/UpdateProfileForm";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { user, setUser } = useUser();

  const userId = user?._id || user?.id; 

  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
    avatar: "",
  });

  const [previewAvatar, setPreviewAvatar] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      const updatePayload: any = {
        username: form.username,
        email: form.email,
        avatar: form.avatar,
      };
      if (form.password.trim() !== "") {
        updatePayload.password = form.password;
      }

      const res = await API.patch(`/users/${userId}`, updatePayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Xử lý dữ liệu trả về để đảm bảo _id tồn tại
      const userRaw = res.data.user ?? res.data;
      const plainUser = userRaw._doc ?? userRaw;

      if (!plainUser._id && plainUser.id) {
        plainUser._id = plainUser.id;
      }

      setUser(plainUser);
      localStorage.setItem("user", JSON.stringify(plainUser));
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
          <UpdateProfileForm
            form={form}
            previewAvatar={previewAvatar}
            loading={loading}
            message={message}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
          />
        </main>
      </div>
      <Footer />
    </div>
  );
}
