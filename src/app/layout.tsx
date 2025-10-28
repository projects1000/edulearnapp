import type { Metadata } from "next";
import NextAuthSessionProvider from "./NextAuthSessionProvider";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduLearnApp",
  description: "Play school learning app for Nursery, LKG, UKG",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get user name from localStorage (client only)
  let userName = null;
  if (typeof window !== "undefined") {
    try { userName = localStorage.getItem("edulearn_user_name"); } catch {}
  }
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon-192.png" />
        <meta name="theme-color" content="#fbbf24" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-yellow-50 min-h-screen flex flex-col`}>
        {/* Fixed header: only mobile */}
        {/* Floating login icon for desktop only */}
  <div className="fixed top-4 right-6 z-30">
          <Link href="/login" className="flex items-center gap-2 bg-white bg-opacity-80 rounded-full shadow-lg px-3 py-2 hover:bg-yellow-100 transition">
            <img src="/icon-login.svg" alt="Login" className="w-6 h-6" />
            <span className="font-bold text-sm text-pink-700">Login</span>
            {userName && (
              <span className="ml-2 font-bold text-sm text-gray-700">{userName}</span>
            )}
          </Link>
        </div>
        {/* Main content with space for header and nav */}
        <NextAuthSessionProvider>
          <main className="flex-1 pt-16 pb-16 w-full sm:pt-0 sm:pb-0">
            {children}
          </main>
        </NextAuthSessionProvider>
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
      </body>
    </html>
  );
}
