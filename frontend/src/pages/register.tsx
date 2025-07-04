import { useState } from "react";
import Link from "next/link";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
          Register
        </h2>
        <form>
          <div className="mb-4">
            <label
              className="block text-indigo-700 mb-1"
              htmlFor="username"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>
          <div className="mb-4">
            <label className="block text-indigo-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>
          <div className="mb-4 relative">
            <label
              className="block text-indigo-700 mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
              placeholder="Enter your password"
              autoComplete="new-password"
            />
          </div>
          <div className="mb-6 relative">
            <label
              className="block text-indigo-700 mb-1"
              htmlFor="confirm"
            >
              Confirm Password
            </label>
            <input
              id="confirm"
              type={showConfirm ? "text" : "password"}
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
          <Link
            href="/login"
            className="text-indigo-600 hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}