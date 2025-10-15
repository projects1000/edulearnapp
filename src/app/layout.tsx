import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  themeColor: "#fbbf24",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        {/* Fixed header */}
        <header className="fixed top-0 left-0 w-full z-20 bg-gradient-to-r from-yellow-300 via-pink-200 to-blue-200 shadow-lg flex items-center justify-center h-14 rounded-b-2xl">
          <span className="text-xl font-extrabold text-pink-700 tracking-wide">EduLearnApp</span>
        </header>
        {/* Main content with space for header and nav */}
        <main className="flex-1 pt-16 pb-16 w-full max-w-xl mx-auto">
          {children}
        </main>
        {/* Fixed bottom nav */}
        <nav className="fixed bottom-0 left-0 w-full z-20 bg-gradient-to-r from-yellow-300 via-pink-200 to-blue-200 shadow-lg flex justify-around items-center h-14 rounded-t-2xl">
          <a href="/" className="flex flex-col items-center text-pink-700 font-bold text-xs hover:text-blue-700 transition-colors">
            <span className="text-lg">🏠</span>
            Home
          </a>
          <a href="/ukg" className="flex flex-col items-center text-pink-700 font-bold text-xs hover:text-blue-700 transition-colors">
            <span className="text-lg">🔢</span>
            UKG
          </a>
          <a href="#" className="flex flex-col items-center text-pink-700 font-bold text-xs hover:text-blue-700 transition-colors">
            <span className="text-lg">🎨</span>
            More
          </a>
        </nav>
      </body>
    </html>
  );
}
