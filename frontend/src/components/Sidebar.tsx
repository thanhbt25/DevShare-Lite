import Link from "next/link";
import { FiHome, FiHelpCircle, FiTag, FiBookmark, FiUser } from "react-icons/fi";

export default function Sidebar() {
  return (
    <nav className="flex flex-col gap-2 pl-10 pt-6 pb-6 bg-gray rounded-lg min-w-[180px] sticky top-6">
      <Link href="/home" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-indigo-100 font-medium text-indigo-700">
        <FiHome /> Home
      </Link>
      <Link href="#" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-indigo-100 font-medium text-indigo-700">
        <FiHelpCircle /> Your Questions
      </Link>
      <Link href="#" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-indigo-100 font-medium text-indigo-700">
        <FiTag /> Tags
      </Link>
      <Link href="#" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-indigo-100 font-medium text-indigo-700">
        <FiBookmark /> Save
      </Link>
      <Link href="#" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-indigo-100 font-medium text-indigo-700">
        <FiUser /> User
      </Link>
    </nav>
  );
}
