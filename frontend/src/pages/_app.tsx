import { UserProvider } from "@/contexts/UserContext";
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import Footer from "@/components/common/Footer"; 
import Navbar from "@/components/common/Navbar"; 

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </UserProvider>
  );
}
