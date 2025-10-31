"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthStatus() {
  const { data: session, status } = useSession();
  if (status === "loading") return <span>Loading...</span>;
  if (!session)
    return (
      <button onClick={() => signIn()} style={{ background: "#0af", color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", fontWeight: 600 }}>
        Sign In
      </button>
    );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontWeight: 600, color: "#093" }}>{session.user?.name || session.user?.email}</span>
      <button onClick={() => signOut()} style={{ background: "#e33", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontWeight: 600 }}>
        Logout
      </button>
    </div>
  );
}
