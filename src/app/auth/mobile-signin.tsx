"use client";
"use client";
import { useState } from "react";
// Extend window type for recaptchaVerifier
declare global {
  interface Window {
    recaptchaVerifier?: any;
  }
}
import firebaseApp from "@/lib/firebase";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default function MobileSignIn() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<any>(null);
  const recaptchaId = "recaptcha-container";



  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const auth = getAuth(firebaseApp);
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          recaptchaId,
          {
            size: "invisible",
            callback: () => {},
          },
          auth
        );
        await window.recaptchaVerifier.render();
      }
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmation(confirmationResult);
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    }
    setLoading(false);
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!confirmation) throw new Error("No confirmation object");
      const result = await confirmation.confirm(otp);
      const idToken = await result.user.getIdToken();
      // Send idToken to backend to create/find user and set session
      const res = await fetch("/api/verify-firebase-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = await res.json();
      if (data.success) {
        // Session set on backend, redirect to home/dashboard
        window.location.href = "/";
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 32, border: "1px solid #eee", borderRadius: 16 }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Sign In with Mobile</h2>
  <div id={recaptchaId} />
      {step === "phone" && (
        <form onSubmit={sendOtp}>
          <input
            type="tel"
            placeholder="Enter mobile number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            style={{ width: "100%", padding: 8, fontSize: 16, marginBottom: 12 }}
          />
          <button type="submit" style={{ width: "100%", padding: 10, fontSize: 18, background: "#0af", color: "#fff", border: "none", borderRadius: 8 }} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      )}
      {step === "otp" && (
        <form onSubmit={verifyOtp}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            required
            style={{ width: "100%", padding: 8, fontSize: 16, marginBottom: 12 }}
          />
          <button type="submit" style={{ width: "100%", padding: 10, fontSize: 18, background: "#0af", color: "#fff", border: "none", borderRadius: 8 }} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      )}
      {error && <div style={{ color: "red", marginTop: 16 }}>{error}</div>}
    </div>
  );
}
