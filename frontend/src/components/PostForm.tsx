// src/components/PostForm.tsx
import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import ReactMarkdown from "react-markdown";

export interface PostFormValues {
  title: string;
  body: string;
  tags: string;
  type: "blog" | "question";
}
interface PostFormProps {
  onSubmit: (data: PostFormValues) => void;
}

const PostForm: React.FC<PostFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<PostFormValues>({
    title: "",
    body: "",
    tags: "",
    type: "blog",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, type: e.target.value as "blog" | "question" }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-violet-50 rounded-md p-6 space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Topic
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange as any}
          placeholder="eg. this is a topic"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      {/* Body */}
      <div data-color-mode="light">
        <label htmlFor="body" className="block text-sm font-medium mb-1">
          Body
        </label>
        <MDEditor
          value={formData.body}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, body: value || "" }))
          }
          preview="edit"
          className="rounded-md"
          style={{ height: "300px" }}
        />
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-1">
          Tags
        </label>
        <input
          type="text"
          name="tags"
          id="tags"
          value={formData.tags}
          onChange={handleChange as any}
          placeholder="e.g. javascript webdev tailwindcss"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      {/* Post Type */}
      <div className="flex items-center gap-6 mt-2">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="type"
            value="blog"
            checked={formData.type === "blog"}
            onChange={handleTypeChange}
          />
          Share your blog
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="type"
            value="question"
            checked={formData.type === "question"}
            onChange={handleTypeChange}
          />
          Ask a question
        </label>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex gap-4">
        <button
          type="submit"
          className="bg-neutral-800 text-white px-4 py-2 rounded-md hover:bg-neutral-700"
        >
          Post
        </button>
        <button
          type="button"
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500"
          onClick={() => console.log("Saved as draft (not implemented yet)")}
        >
          Draft
        </button>
      </div>
    </form>
  );
};

export default PostForm;
