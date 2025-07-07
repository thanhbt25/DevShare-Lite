// components/ThreeColumnLayout.tsx
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

interface Props {
  children: React.ReactNode;
  rightSidebar?: React.ReactNode;
}

export default function ThreeColumnLayout({ children, rightSidebar }: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex flex-1">
        {/* Left Sidebar */}
        <aside className="w-1/5 border-r p-4 bg-white">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <section className="w-3/5 p-6">
          {children}
        </section>

        {/* Right Sidebar */}
        <aside className="w-1/5 border-l p-4 bg-white">
          {rightSidebar}
        </aside>
      </main>

      <Footer />
    </div>
  );
}
