import React, { useRef, useState, useEffect } from "react";
import MDEditor, {
  ICommand,
  commands as mdCommands,
} from "@uiw/react-md-editor";

type Props = {
  content: string;
  setContent: (value: string) => void;
  height?: number;
  placeholder?: string;
};

const MarkdownEditor: React.FC<Props> = ({
  content,
  setContent,
  height = 300,
  placeholder = "Write your markdown content here...",
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const editorWrapperRef = useRef<HTMLDivElement | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);

  // Lấy <textarea> thật để chèn markdown ảnh
  useEffect(() => {
    if (editorWrapperRef.current) {
      const textarea = editorWrapperRef.current.querySelector("textarea");
      if (textarea) {
        textareaRef.current = textarea;
      }
    }
  }, [content]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const imageUrl = data.secure_url;
      const imageMarkdown = `![image](${imageUrl})`;

      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue =
          content.substring(0, start) + imageMarkdown + content.substring(end);
        setContent(newValue);

        setTimeout(() => {
          textarea.focus();
          textarea.selectionStart = textarea.selectionEnd =
            start + imageMarkdown.length;
        }, 0);
      } else {
        setContent(content + "\n" + imageMarkdown);
      }

      setShowImageUpload(false); // ẩn form upload sau khi xong
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed.");
    }
  };

  // Tạo command icon ảnh (🖼)
  const uploadImageCommand: ICommand = {
    name: "upload-image",
    keyCommand: "upload-image",
    buttonProps: { "aria-label": "Upload image" },
    icon: (
      <span role="img" aria-label="upload">
        🖼
      </span>
    ),
    execute: () => {
      setShowImageUpload((prev) => !prev); // toggle hiện form upload
    },
  };

  return (
    <div data-color-mode="light" ref={editorWrapperRef} className="space-y-2">
      <MDEditor
        value={content}
        onChange={(val) => setContent(val || "")}
        preview="edit"
        height={height}
        className="rounded-md"
        commands={[
          mdCommands.bold,
          mdCommands.italic,
          mdCommands.strikethrough,
          mdCommands.title,
          mdCommands.divider,
          mdCommands.unorderedListCommand,
          mdCommands.orderedListCommand,
          mdCommands.quote,
          mdCommands.code,
          mdCommands.divider,
          uploadImageCommand, // custom icon upload ảnh
        ]}
        textareaProps={{
          placeholder,
        }}
      />

      {showImageUpload && (
        <div className="mt-2">
          <label className="inline-block bg-gray-100 px-3 py-1 rounded cursor-pointer hover:bg-gray-200 text-sm border border-gray-300">
            📁 Select image to upload
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;
