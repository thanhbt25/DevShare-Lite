"use client";
import Link from "next/link";
import { useState } from "react";
import API from "../utils/api"; // Adjust the import path as necessary
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import "@/styles/globals.css"; 

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", form);
      console.log(res.data);
      // Lưu trạng thái người dùng ở localStorage hoặc context
      localStorage.setItem("user", JSON.stringify(res.data.user));
      Cookies.set("access_token", res.data.access_token, { expires: 7 }); // Lưu token vào cookie
      router.push("/"); // Chuyển về trang chính sau login
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-indigo-700 mb-1" htmlFor="username">
              Username/Email
            </label>
            <input
              id="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-6">
            <label className="block text-indigo-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded transition"
          >
            Login
          </button>
        </form>
        <div className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="text-indigo-600 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
