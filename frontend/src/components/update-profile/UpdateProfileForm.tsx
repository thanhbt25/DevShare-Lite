"use client";

import React, { useRef } from "react";

type Props = {
  form: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    avatar: string;
  };
  previewAvatar: string;
  loading: boolean;
  message: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
};

const UpdateProfileForm: React.FC<Props> = ({
  form,
  previewAvatar,
  loading,
  message,
  handleChange,
  handleFileChange,
  handleSubmit,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
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
            placeholder="Enter avatar URL"
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
            placeholder="Enter your username"
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
            placeholder="Enter your email"
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
  );
};

export default UpdateProfileForm;
