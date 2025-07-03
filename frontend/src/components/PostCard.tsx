interface Props {
  type: "blog" | "qa";
}

export default function PostCard({ type }: Props) {
  return (
    <div className="border rounded p-4 mb-4">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>0 votes</span>
        <span>0 answers</span>
        <span>10 views</span>
      </div>

      <h3 className="text-lg font-bold text-blue-800 underline cursor-pointer">
        Subject
      </h3>
      <p className="text-sm text-gray-700">
        nội dung, nếu dài quá thì cuối sẽ có …
      </p>

      <div className="flex gap-2 mt-2">
        <span className="bg-gray-800 text-white text-xs rounded px-2 py-1">Tag</span>
        <span className="bg-gray-800 text-white text-xs rounded px-2 py-1">Tag</span>
        <span className="bg-gray-800 text-white text-xs rounded px-2 py-1">Tag</span>
      </div>

      <div className="text-right text-xs text-gray-500 mt-2">
        By user123 • 1 hour ago
      </div>
    </div>
  );
}
