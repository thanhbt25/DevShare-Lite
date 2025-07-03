import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-indigo-500 text-white px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold">💻 DevShare Lite</span>
        <input
          type="text"
          placeholder="Search DevShare Lite"
          className="ml-4 px-2 py-1 rounded text-black"
        />
      </div>
      <div className="flex gap-4 items-center">
        <Link href="#">➕</Link>
        <Link href="#">🔔</Link>
        <img
          src="/user.png"
          alt="user avatar"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </header>
  );
}