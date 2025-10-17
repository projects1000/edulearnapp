
"use client";
import { useState } from "react";
import Link from "next/link";

// Removed unused BeforeAfterNumberTask

export default function Home() {
  // Removed unused showUKGTasks, setShowUKGTasks, activeTask, setActiveTask

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-yellow-100 flex flex-col items-center justify-center p-4 sm:p-8">
      <header className="w-full max-w-2xl text-center mb-8">
  <h1 className="text-4xl sm:text-5xl font-extrabold text-pink-600 mb-2 drop-shadow-lg">EduLearn Play Factory</h1>
        <p className="text-lg sm:text-xl text-blue-700 font-semibold">Fun Learning for Nursery, LKG, UKG</p>
      </header>
      <main className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Nursery Card */}
        <div className="rounded-3xl shadow-lg flex flex-col items-center justify-center p-8 transition-transform hover:scale-105 cursor-pointer bg-pink-200">
          <span className="text-6xl mb-4">🧸</span>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Nursery</h2>
          <p className="text-base text-gray-600">Explore fun activities & games!</p>
        </div>
        {/* LKG Card */}
        <div className="rounded-3xl shadow-lg flex flex-col items-center justify-center p-8 transition-transform hover:scale-105 cursor-pointer bg-blue-200">
          <span className="text-6xl mb-4">🎨</span>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">LKG</h2>
          <p className="text-base text-gray-600">Explore fun activities & games!</p>
        </div>
        {/* UKG Card - Navigates to UKG Page */}
        <Link href="/ukg" className="rounded-3xl shadow-lg flex flex-col items-center justify-center p-8 transition-transform hover:scale-105 cursor-pointer bg-yellow-200 w-full">
          <span className="text-6xl mb-4">📚</span>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">UKG</h2>
          <p className="text-base text-gray-600 mb-4">Click to see UKG activities!</p>
        </Link>
      </main>
      {/* UKG Tasks Section removed, now on separate page */}
      <footer className="mt-12 text-center text-sm text-gray-500">
  &copy; {new Date().getFullYear()} EduLearn Play Factory. All rights reserved.
      </footer>
    </div>
  );
}
