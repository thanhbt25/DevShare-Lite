import React from 'react';
import { FiTrendingUp } from "react-icons/fi"; 

const RightSidebar = (
        <div>
      <h3 className="font-bold mb-2">Top Contributors</h3>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <img src="/user.png" className="w-6 h-6 rounded-full" alt="user" />
          <span className="text-sm">User {i}</span>
        </div>
      ))}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-2">
          <FiTrendingUp className="text-indigo-600" />
          <h3 className="font-bold">Trending Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Tag1", "Tag2", "Tag3", "Tag4"].map((tag, index) => (
            <button
              key={index}
              className="bg-indigo-100 text-indigo-700 text-sm rounded px-3 py-1 hover:bg-indigo-200 transition"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
);

export default RightSidebar;