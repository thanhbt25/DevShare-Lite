import Sidebar from "@/components/common/Sidebar";

interface Props {
  children: React.ReactNode;
  rightSidebar?: React.ReactNode;
}

export default function ThreeColumnLayout({ children, rightSidebar }: Props) {
  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex flex-1">
        {/* Left Sidebar */}
        <aside className="w-1/5 border-r p-4 bg-white">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <section className="w-3/5 p-6">{children}</section>

        {/* Right Sidebar */}
        <aside className="w-1/5 border-l p-4 bg-white">{rightSidebar}</aside>
      </main>

    </div>
  );
}
