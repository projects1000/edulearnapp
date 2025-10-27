"use client";
import { SessionProvider, useSession } from "next-auth/react";
import Link from "next/link";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const isAuthPage = pathname.startsWith("/auth/signin") || pathname.startsWith("/auth/mobile-signin");
  if (status === "loading") return null;
  if (!session && !isAuthPage) {
    if (typeof window !== "undefined") window.location.href = "/auth/signin";
    return null;
  }
  return <>{children}</>;
}

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {/* Fixed header: only mobile */}
      <header className="fixed top-0 left-0 w-full z-20 bg-gradient-to-r from-yellow-300 via-pink-200 to-blue-200 shadow-lg flex items-center justify-center h-14 rounded-b-2xl sm:hidden">
        <span className="text-xl font-extrabold text-pink-700 tracking-wide">EduLearnApp</span>
      </header>
      {/* Main content with space for header and nav */}
      <main className="flex-1 pt-16 pb-16 w-full sm:pt-0 sm:pb-0">
        <AuthGuard>{children}</AuthGuard>
      </main>
      {/* Fixed bottom nav: only mobile */}
      <nav className="fixed bottom-0 left-0 w-full z-20 bg-gradient-to-r from-yellow-300 via-pink-200 to-blue-200 shadow-lg flex justify-around items-center h-14 rounded-t-2xl sm:hidden">
        <Link href="/" className="flex flex-col items-center text-pink-700 font-bold text-xs hover:text-blue-700 transition-colors">
          <span className="text-lg">🏠</span>
          Home
        </Link>
        <Link href="/ukg" className="flex flex-col items-center text-pink-700 font-bold text-xs hover:text-blue-700 transition-colors">
          <span className="text-lg">🔢</span>
          UKG
        </Link>
        <Link href="#" className="flex flex-col items-center text-pink-700 font-bold text-xs hover:text-blue-700 transition-colors">
          <span className="text-lg">🎨</span>
          More
        </Link>
      </nav>
    </SessionProvider>
  );
}
