import React from "react";
import PostCard from "@/components/index/PostCard";
import { FiFilter } from "react-icons/fi";

type Props = {
  activeTab: "blog" | "qa";
  setActiveTab: (tab: "blog" | "qa") => void;
  sort: "newest" | "popular" | "unanswered" | "voted";
  setSort: (sort: "newest" | "popular" | "unanswered" | "voted") => void;
  posts: any[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
};

const HomeMainContent: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  sort,
  setSort,
  posts,
  loading,
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  const computedTotalPages = Math.max(1, totalPages);

  const getPagesToShow = (current: number, total: number) => {
    const delta = 2;
    const range: (number | "...")[] = [];

    const left = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);

    range.push(1);

    if (left > 2) {
      range.push("...");
    }

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < total - 1) {
      range.push("...");
    }

    if (total > 1) {
      range.push(total);
    }

    return range;
  };

  const sortOptions: { label: string; value: Props["sort"] }[] = [
    { label: "Newest", value: "newest" },
    { label: "Popular", value: "popular" },
    { label: "Unanswered", value: "unanswered" },
    { label: "Voted", value: "voted" },
  ];

  return (
    <>
      {/* Tabs */}
      <div className="flex space-x-4 border-b pb-2 mb-4">
        {["blog", "qa"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab as "blog" | "qa");
              setCurrentPage(1);
            }}
            className={`font-medium ${
              activeTab === tab ? "border-b-2 border-black" : "text-gray-400"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Sort options */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 flex-wrap">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              className={`px-3 py-1 text-sm font-medium rounded transition ${
                sort === option.value
                  ? "bg-indigo-600 text-white"
                  : "text-gray-500 hover:bg-indigo-100"
              }`}
              onClick={() => {
                setSort(option.value);
                setCurrentPage(1); // reset page khi đổi sort
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Post cards */}
      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post: any) => <PostCard key={post._id} post={post} />)
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2 flex-wrap">
        <button
          className={`text-gray-500 ${
            currentPage === 1 ? "opacity-50 cursor-default" : ""
          }`}
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          ← Previous
        </button>

        {getPagesToShow(currentPage, computedTotalPages).map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 py-1 text-gray-400 select-none"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => setCurrentPage(page as number)}
              className={`px-2 py-1 rounded ${
                currentPage === page ? "font-bold bg-indigo-200" : ""
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          className={`text-gray-500 ${
            currentPage === computedTotalPages
              ? "opacity-50 cursor-default"
              : ""
          }`}
          onClick={() =>
            setCurrentPage(Math.min(currentPage + 1, computedTotalPages))
          }
          disabled={currentPage === computedTotalPages}
        >
          Next →
        </button>
      </div>
    </>
  );
};

export default HomeMainContent;
