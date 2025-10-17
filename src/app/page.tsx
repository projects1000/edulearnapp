
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// Removed unused BeforeAfterNumberTask

export default function Home() {
  const [deferredPrompt, setDeferredPrompt] = useState<any | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    try { return localStorage.getItem('edulearn_installed') === '1'; } catch { return false; }
  });

  // Listen for beforeinstallprompt
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler as EventListener);
    // appinstalled event
    const installedHandler = () => {
      try { localStorage.setItem('edulearn_installed', '1'); } catch {}
      setIsInstalled(true);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', installedHandler as EventListener);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler as EventListener);
      window.removeEventListener('appinstalled', installedHandler as EventListener);
    };
  }, []);

  async function handleInstallClick() {
    if (!deferredPrompt) return;
    try {
      // show the install prompt
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice && choice.outcome === 'accepted') {
        try { localStorage.setItem('edulearn_installed', '1'); } catch {}
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } catch (err) {
      // ignore
    }
  }

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
        {/* Install PWA button - only show when not installed and prompt available */}
        {!isInstalled && deferredPrompt && (
          <div className="col-span-full flex justify-center mt-4">
            <button onClick={handleInstallClick} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-full shadow">
              <span className="text-2xl">⬇️</span>
              <span>Install App</span>
            </button>
          </div>
        )}
      </main>
      {/* UKG Tasks Section removed, now on separate page */}
      <footer className="mt-12 text-center text-sm text-gray-500">
  &copy; {new Date().getFullYear()} EduLearn Play Factory. All rights reserved.
      </footer>
    </div>
  );
}
