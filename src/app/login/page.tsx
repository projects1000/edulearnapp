
"use client";
import { useState, useEffect } from "react";

export default function LoginRegisterPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", mobile: "", password: "" });
  const [status, setStatus] = useState<string | null>(null);
  const [sessionInvalid, setSessionInvalid] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const resp = await fetch(isRegister ? "/api/register" : "/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setStatus("error");
        setForm({ name: "", mobile: "", password: "" });
        throw new Error(data?.error || "Failed");
      }
      setStatus("success");
      if (data?.user?.name) {
        try {
          localStorage.setItem("edulearn_user_name", data.user.name);
          if (data.user.sessionToken) localStorage.setItem("edulearn_user_sessionToken", data.user.sessionToken);
          if (data.user.mobile) localStorage.setItem("edulearn_user_mobile", data.user.mobile);
        } catch {}
      }
      setForm({ name: "", mobile: "", password: "" });
      if (!isRegister) window.location.href = "/";
    } catch (err: any) {
      setStatus("error");
      if (err?.message) setStatus(err.message);
    }
  };

  useEffect(() => {
    setForm({ name: "", mobile: "", password: "" });
  }, [isRegister]);

  useEffect(() => {
    async function checkSession() {
      const mobile = localStorage.getItem("edulearn_user_mobile");
      const sessionToken = localStorage.getItem("edulearn_user_sessionToken");
      // if there's no stored mobile/sessionToken we are already on login state
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
          // clear stored credentials so the app shows logged-out state
          try { localStorage.clear(); } catch {}
        }
      } catch {}
    }
    checkSession();
    const interval = setInterval(checkSession, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-6 border border-blue-200">
        <div className="flex justify-center items-center gap-4 mb-2">
          <a href="/" className="text-blue-600 font-semibold underline text-lg hover:text-pink-600 transition">🏠 Home</a>
          <button onClick={() => setIsRegister(!isRegister)} className="bg-gradient-to-r from-pink-400 to-yellow-300 text-white font-bold px-4 py-2 rounded-full shadow hover:from-pink-500 hover:to-yellow-400 transition">
            {isRegister ? "Already have an account? Login" : "New user? Register"}
          </button>
        </div>
        <h2 className="text-3xl font-extrabold text-blue-700 text-center mb-4 drop-shadow">{isRegister ? "Register" : "Login"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isRegister && (
            <input name="name" type="text" placeholder="Name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-lg" />
          )}
          <input name="mobile" type="tel" placeholder="Mobile Number" value={form.mobile} onChange={handleChange} required className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg" />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg" />
          <button type="submit" className="w-full py-3 text-lg font-bold bg-gradient-to-r from-blue-500 to-pink-400 text-white rounded-xl shadow hover:from-blue-600 hover:to-pink-500 transition">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>
        {status === "loading" && <p className="text-center text-pink-600 font-semibold">Processing…</p>}
        {status === "success" && <p className="text-center text-green-600 font-semibold">{isRegister ? "Registered!" : "Login successful!"}</p>}
        {status && status !== "loading" && status !== "success" && (
          <p className="text-center text-red-500 font-semibold">{status}</p>
        )}
        {sessionInvalid && (
          <div className="fixed inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-50">
            <div className="bg-red-100 border border-red-400 rounded-xl px-8 py-6 shadow-lg flex flex-col items-center">
              <span className="text-4xl mb-2" role="img" aria-label="locked">🔒</span>
              <span className="text-red-700 font-bold text-lg mb-2">You have logged in on another device.</span>
              <button
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => {
                  try { localStorage.clear(); } catch {}
                  window.location.href = "/login";
                }}
              >Go to Login</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


