"use client";

import { useState, useEffect } from "react";

export default function LoginRegisterPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", mobile: "", password: "" });
  const [status, setStatus] = useState<string | null>(null);

  // Always clear form fields on mount and when switching between login/register
  useEffect(() => {
    setForm({ name: "", mobile: "", password: "" });
  }, [isRegister]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setForm({ name: "", mobile: "", password: "" }); // Clear fields before submit
    try {
      const resp = await fetch(isRegister ? "/api/register" : "/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await resp.json();
      if (!resp.ok) {
        if (isRegister && resp.status === 409) {
          setStatus("error");
          setForm({ name: "", mobile: "", password: "" });
          throw new Error("You are already registered");
        }
        setStatus("error");
        setForm({ name: "", mobile: "", password: "" });
        throw new Error(data?.error || "Failed");
      }
      setStatus("success");
      if (data?.user?.name) {
        try { localStorage.setItem("edulearn_user_name", data.user.name); } catch {}
      }
      setForm({ name: "", mobile: "", password: "" });
      if (!isRegister) window.location.href = "/";
    } catch (err: any) {
      setStatus("error");
      if (err?.message) setStatus(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 32, border: "1px solid #eee", borderRadius: 16 }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>{isRegister ? "Register" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div style={{ marginBottom: 12 }}>
            <input name="name" type="text" placeholder="Name" value={form.name} onChange={handleChange} required style={{ width: "100%", padding: 8, fontSize: 16 }} />
          </div>
        )}
        <div style={{ marginBottom: 12 }}>
          <input name="mobile" type="tel" placeholder="Mobile Number" value={form.mobile} onChange={handleChange} required style={{ width: "100%", padding: 8, fontSize: 16 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required style={{ width: "100%", padding: 8, fontSize: 16 }} />
        </div>
        <button type="submit" style={{ width: "100%", padding: 10, fontSize: 18, background: "#0af", color: "#fff", border: "none", borderRadius: 8 }}>
          {isRegister ? "Register" : "Login"}
        </button>
      </form>
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <button onClick={() => setIsRegister(!isRegister)} style={{ background: "none", border: "none", color: "#0af", fontWeight: 600, cursor: "pointer" }}>
          {isRegister ? "Already have an account? Login" : "New user? Register"}
        </button>
      </div>
      {status === "loading" && <p>Processing…</p>}
      {status === "success" && <p>{isRegister ? "Registered!" : "Login successful!"}</p>}
      {status && status !== "loading" && status !== "success" && (
        <p style={{ color: "red" }}>{status}</p>
      )}
    </div>
  );
}
