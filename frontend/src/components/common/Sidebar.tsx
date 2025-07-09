import Link from "next/link";
import { FiHome, FiHelpCircle, FiTag, FiHeart, FiUser } from "react-icons/fi";
import { RiDraftLine } from "react-icons/ri";

export default function Sidebar() {
  return (
    <nav className="flex flex-col gap-2 pl-10 pt-6 pb-6 bg-gray rounded-lg min-w-[180px] sticky top-6">
      <Link
        href="/"
        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-indigo-100 font-medium text-indigo-700"
      >
        <FiHome /> Home
      </Link>
      <Link
        href="#"
        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-indigo-100 font-medium text-indigo-700"
      >
        <FiHelpCircle /> Your Questions
      </Link>
      <Link
        href="/draft/review-draft"
        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-indigo-100 font-medium text-indigo-700"
      >
        <RiDraftLine /> Draft
      </Link>
      <Link
        href="#"
        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-indigo-100 font-medium text-indigo-700"
      >
        <FiTag /> Tags
      </Link>
      <Link
        href="#"
        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-indigo-100 font-medium text-indigo-700"
      >
        <FiHeart /> Favorites
      </Link>
      <Link
        href="#"
        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-indigo-100 font-medium text-indigo-700"
      >
        <FiUser /> User
      </Link>
    </nav>
  );
}
