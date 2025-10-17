
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

  // We'll auto-prompt on first visit when beforeinstallprompt fires (Android). For iOS, show a small helper UI.
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const firstPromptFlag = 'pwa_first_visit_shown';
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  function isiOS() {
    try {
      return /iphone|ipad|ipod/i.test(navigator.userAgent) && !('standalone' in navigator && (navigator as any).standalone);
    } catch {
      return false;
    }
  }

  useEffect(() => {
    let helpTimer: number | null = null;
    const onBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      try { e.preventDefault(); } catch {}
      deferredPromptRef.current = e;
      const firstShown = localStorage.getItem(firstPromptFlag) === '1';
      const installed = localStorage.getItem('edulearn_installed') === '1';
      if (!firstShown && !installed) {
        // small delay so it doesn't interrupt initial rendering
        setTimeout(async () => {
          try {
            await e.prompt();
            const choice = e.userChoice ? await e.userChoice : null;
            if (choice && choice.outcome === 'accepted') {
              try { localStorage.setItem('edulearn_installed', '1'); } catch {}
              setIsInstalled(true);
            }
          } catch {
            // ignore prompt errors
          } finally {
            try { localStorage.setItem(firstPromptFlag, '1'); } catch {}
          }
        }, 600);
      }
    };

    const onAppInstalled = () => {
      try { localStorage.setItem('edulearn_installed', '1'); } catch {}
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', onAppInstalled as EventListener);

    // iOS fallback: show helper once for first-time visitors
    try {
      const firstShown = localStorage.getItem(firstPromptFlag) === '1';
      const installed = localStorage.getItem('edulearn_installed') === '1';
      if (isiOS() && !firstShown && !installed) {
        setShowInstallHelp(true);
        try { localStorage.setItem(firstPromptFlag, '1'); } catch {}
        helpTimer = window.setTimeout(() => setShowInstallHelp(false), 3500) as unknown as number;
      }
    } catch {}

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', onAppInstalled as EventListener);
      if (helpTimer) { clearTimeout(helpTimer); helpTimer = null; }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-yellow-100 flex flex-col items-center justify-center p-4 sm:p-8">
      {showInstallHelp && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-lg shadow-lg p-3 text-center max-w-xs">
          <div className="font-semibold">Install on iPhone</div>
          <div className="text-sm mt-1">Tap the Share button, then "Add to Home Screen".</div>
          <button className="mt-2 text-xs text-blue-600" onClick={() => setShowInstallHelp(false)}>Got it</button>
        </div>
      )}
      <header className="w-full max-w-2xl text-center mb-8 relative">
  <h1 className="text-4xl sm:text-5xl font-extrabold text-pink-600 mb-2 drop-shadow-lg">EduLearn Play Factory</h1>
        <p className="text-lg sm:text-xl text-blue-700 font-semibold">Fun Learning for Nursery, LKG, UKG</p>
        {/* iOS helper will show below when appropriate */}
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
        {/* The app will prompt automatically on first visit for supporting Android browsers. */}
      </main>
      {/* UKG Tasks Section removed, now on separate page */}
      <footer className="mt-12 text-center text-sm text-gray-500">
  &copy; {new Date().getFullYear()} EduLearn Play Factory. All rights reserved.
      </footer>
    </div>
  );
}
