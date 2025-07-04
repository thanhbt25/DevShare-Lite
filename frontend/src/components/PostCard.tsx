interface Props {
  type: "blog" | "qa";
}

export default function PostCard({ type }: Props) {
  return (
    <div className="border rounded p-4 mb-4 min-h-[150px] bg-white shadow hover:shadow-lg transition-shadow">
      <div className="flex">
        {/* Left column */}
        <div className="flex flex-col items-center justify-center w-28 mr-4 text-sm text-gray-600 gap-2">
          <div className="flex items-center gap-1">
            <span className="font-semibold">{0}</span>
            <span>votes</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">{0}</span>
            <span>answers</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">{10}</span>
            <span>views</span>
          </div>
        </div>
        {/* Right column */}
        <div className="flex-1 min-w-0 flex flex-col h-[130px] justify-between">
          <div>
            <h3 className="text-lg font-bold text-blue-800 underline cursor-pointer break-words">
              Subject
            </h3>
            <p className="text-sm text-gray-700 mt-1 break-words">
              nội dung, nếu dài quá thì cuối sẽ có …
            </p>
          </div>
          <div className="flex justify-between items-end mt-2">
            <div className="flex gap-2 flex-wrap">
              <span className="bg-gray-800 text-white text-xs rounded px-2 py-1">Tag</span>
              <span className="bg-gray-800 text-white text-xs rounded px-2 py-1">Tag</span>
              <span className="bg-gray-800 text-white text-xs rounded px-2 py-1">Tag</span>
            </div>
            <div className="text-xs text-gray-500 text-right">
              By user123 • 1 hour ago
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
