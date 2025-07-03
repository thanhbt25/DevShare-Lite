import Link from "next/link";

export default function Sidebar() {
  return (
    <nav className="flex flex-col gap-2">
      <Link href="/home">Home</Link>
      <Link href="#">Your Questions</Link>
      <Link href="#">Tags</Link>
      <Link href="#">Save</Link>
      <Link href="#">User</Link>
    </nav>
  );
}
