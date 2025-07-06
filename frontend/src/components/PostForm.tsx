// src/components/PostForm.tsx
import React from "react";
import MDEditor from "@uiw/react-md-editor";

export type PostFormValues = {
  title: string;
  content: string;
  isPublished: boolean;
  authorId: string;
  tags?: string[];
};

interface PostFormProps {
  title: string;
  setTitle: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  isPublished: boolean;
  setIsPublished: (value: boolean) => void;
  tags: string[];
  tagInput: string;
  setTagInput: (value: string) => void;
  handleTagInput: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  removeTag: (tag: string) => void;
  onSubmit: (data: PostFormValues) => void;
}

const PostForm: React.FC<PostFormProps> = ({
  title,
  setTitle,
  content,
  setContent,
  isPublished,
  setIsPublished,
  tags,
  tagInput,
  setTagInput,
  handleTagInput,
  removeTag,
  onSubmit,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: PostFormValues = {
      title,
      content,
      isPublished,
      authorId: "", // authorId sẽ được gắn ở CreatePostPage
      tags,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-violet-50 rounded-md p-6 space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Understanding React Hooks"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      {/* Content */}
      <div data-color-mode="light">
        <label htmlFor="content" className="block text-sm font-medium mb-1">
          Content
        </label>
        <MDEditor
          value={content}
          onChange={(val) => setContent(val || "")}
          preview="edit"
          className="rounded-md"
          style={{ height: "300px" }}
        />
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-1">
          Tags (press space to add)
        </label>
        <input
          type="text"
          id="tags"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagInput}
          placeholder="e.g. reactjs tailwind node"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />

        {/* Display added tags */}
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="bg-black text-white px-2 py-1 rounded-md flex items-center gap-1"
            >
              <span>#{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-xs ml-1 text-gray-300 hover:text-red-400"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
          onClick={() => setIsPublished(true)}
        >
          Create Post
        </button>
        <button
          type="submit"
          onClick={() => setIsPublished(false)}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-400"
        >
          Save as Draft
        </button>
      </div>
    </form>
  );
};

export default PostForm;
