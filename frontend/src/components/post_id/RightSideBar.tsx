import React from "react";

const RightSidebar = () => {
  return (
    <div className="bg-white border rounded-md p-4 shadow-sm">
      <h3 className="text-sm font-semibold mb-2">Newest Questions</h3>
      <ul className="text-gray-700 text-sm space-y-1 list-disc list-inside">
        <li>Câu hỏi mới 1</li>
        <li>Câu hỏi mới 2</li>
        <li>Câu hỏi mới 3</li>
      </ul>
    </div>
  );
};

export default RightSidebar;
