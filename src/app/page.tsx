
"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// Removed unused BeforeAfterNumberTask

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice?: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export default function Home() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    try { return localStorage.getItem('edulearn_installed') === '1'; } catch { return false; }
  });

  // Listen for beforeinstallprompt
  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
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
      const choice = deferredPrompt.userChoice ? await deferredPrompt.userChoice : null;
      if (choice && choice.outcome === 'accepted') {
        try { localStorage.setItem('edulearn_installed', '1'); } catch {}
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } catch {
      // ignore
    }
  }

  // show a short helper message when prompt not available
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const helpTimerRef = useRef<number | null>(null);

  function handleInstallIconClick() {
    if (isInstalled) return; // already installed
    if (deferredPrompt) {
      handleInstallClick();
      return;
    }
    // show fallback helper (e.g. "Use browser menu → Add to Home screen")
    setShowInstallHelp(true);
    if (helpTimerRef.current) { clearTimeout(helpTimerRef.current); helpTimerRef.current = null; }
    helpTimerRef.current = window.setTimeout(() => { setShowInstallHelp(false); helpTimerRef.current = null; }, 3500) as unknown as number;
  }

  useEffect(() => {
    return () => {
      if (helpTimerRef.current) { clearTimeout(helpTimerRef.current); helpTimerRef.current = null; }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-yellow-100 flex flex-col items-center justify-center p-4 sm:p-8">
      <header className="w-full max-w-2xl text-center mb-8 relative">
  <h1 className="text-4xl sm:text-5xl font-extrabold text-pink-600 mb-2 drop-shadow-lg">EduLearn Play Factory</h1>
        <p className="text-lg sm:text-xl text-blue-700 font-semibold">Fun Learning for Nursery, LKG, UKG</p>
        {/* Persistent install icon - top-right */}
        <div className="absolute top-0 right-0 mt-2 mr-2">
          <button onClick={handleInstallIconClick} title={isInstalled ? 'Installed' : 'Install app'} className={`p-2 rounded-full shadow-lg transition-colors ${isInstalled ? 'bg-gray-200 text-gray-600' : 'bg-green-500 text-white hover:bg-green-600'}`}>
            <span className="text-2xl">⬇️</span>
          </button>
        </div>
        {showInstallHelp && (
          <div className="absolute top-12 right-0 mr-2 bg-white rounded-lg shadow p-2 text-sm text-gray-700">
            <div className="font-semibold">Install tip</div>
            <div>Open your browser menu and select &quot;Add to Home screen&quot; (or &quot;Install app&quot;).</div>
          </div>
        )}
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
