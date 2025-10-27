
"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// Removed unused BeforeAfterNumberTask

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice?: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export default function Home() {
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    try { return localStorage.getItem('edulearn_installed') === '1'; } catch { return false; }
  });
  const [userName, setUserName] = useState<string | null>(null);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
    const [sessionInvalid, setSessionInvalid] = useState(false);
    useEffect(() => {
      async function checkSession() {
        const mobile = localStorage.getItem("edulearn_user_mobile");
        const sessionToken = localStorage.getItem("edulearn_user_sessionToken");
        if (!mobile || !sessionToken) return;
        try {
          const res = await fetch("/api/session-check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mobile, sessionToken })
          });
          const data = await res.json();
          if (!data.valid) {
            setSessionInvalid(true);
            localStorage.clear();
          }
        } catch {}
      }
      checkSession();
      const interval = setInterval(checkSession, 30000); // check every 30s
      return () => clearInterval(interval);
    }, []);
  const firstPromptFlag = 'pwa_first_visit_shown';
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  function isiOS() {
    try {
      const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
      const isStandalone = typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches;
      return /iphone|ipad|ipod/i.test(ua) && !isStandalone;
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

    try {
      const firstShown = localStorage.getItem(firstPromptFlag) === '1';
      const installed = localStorage.getItem('edulearn_installed') === '1';
      if (isiOS() && !firstShown && !installed) {
        setShowInstallHelp(true);
        try { localStorage.setItem(firstPromptFlag, '1'); } catch {}
        helpTimer = window.setTimeout(() => setShowInstallHelp(false), 3500) as unknown as number;
      }
    } catch {}

    try {
      const name = localStorage.getItem('edulearn_user_name');
      if (name) setUserName(name);
    } catch {}

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', onAppInstalled as EventListener);
      if (helpTimer) { clearTimeout(helpTimer); helpTimer = null; }
    };
  }, [isInstalled]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-yellow-100 flex flex-col items-center justify-center p-4 sm:p-8">
      {showInstallHelp && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-lg shadow-lg p-3 text-center max-w-xs">
          <div className="font-semibold">Install on iPhone</div>
          <div className="text-sm mt-1">Tap the Share button, then &quot;Add to Home Screen&quot;.</div>
          <button className="mt-2 text-xs text-blue-600" onClick={() => setShowInstallHelp(false)}>Got it</button>
        </div>
      )}
      <header className="w-full max-w-2xl text-center mb-8 relative">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-pink-600 mb-2 drop-shadow-lg">EduLearn Play Factory</h1>
        <p className="text-lg sm:text-xl text-blue-700 font-semibold">Fun Learning for Nursery, LKG, UKG</p>
        {/* Show welcome message if logged in, else show login button */}
        {userName ? (
          <div style={{ position: 'fixed', top: '18px', right: '32px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#fff', borderRadius: '9999px', boxShadow: '0 2px 8px #eee', zIndex: 100 }}>
            <span className="text-xl" role="img" aria-label="wave">👋</span>
            <span className="text-blue-700 font-bold">Welcome, {userName}</span>
            <button
              onClick={() => { localStorage.removeItem('edulearn_user_name'); window.location.reload(); }}
              style={{ marginLeft: 8, background: '#e33', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontWeight: 600, cursor: 'pointer' }}
            >Logout</button>
          </div>
        ) : (
          <Link href="/login" style={{ position: 'fixed', top: '18px', right: '32px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#fff', borderRadius: '9999px', boxShadow: '0 2px 8px #eee', zIndex: 100 }}>
            <span className="text-xl" role="img" aria-label="login">🔑</span>
            <span className="hidden sm:inline text-blue-700 font-bold">Login</span>
          </Link>
        )}
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
        ©2025 Edulearn Play factory. All right reserved
        <div className="mt-2 text-xs text-gray-600">Developed By<br/>Priyabrata Pattanaik<br/>+91-9702160068</div>
      </footer>
    </div>
  );
}
