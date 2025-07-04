import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import API from "../utils/api";
import "@/styles/globals.css";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.password || !form.confirm) {
      alert("Please fill in all fields.");
      return;
    }

    if (form.password !== form.confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await API.post("/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      alert("Registered successfully!");
      router.push("/login");
    } catch (error: any) {
      console.error(error);
      const message =
        error?.response?.data?.message || "Registration failed!";
      alert(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
          Register
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label className="block text-indigo-700 mb-1" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-indigo-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label className="block text-indigo-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
              placeholder="Enter your password"
              autoComplete="new-password"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6 relative">
            <label className="block text-indigo-700 mb-1" htmlFor="confirm">
              Confirm Password
            </label>
            <input
              id="confirm"
              type={showConfirm ? "text" : "password"}
              value={form.confirm}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
              placeholder="Re-enter your password"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded transition"
          >
            Register
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
