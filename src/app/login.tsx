import Link from "next/link";
import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [providers, setProviders] = useState<any>({});

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 32, border: "1px solid #eee", borderRadius: 16 }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Login</h2>
      {providers?.credentials && (
        <form
          onSubmit={e => {
            e.preventDefault();
            const email = (e.target as any).email.value;
            const password = (e.target as any).password.value;
            signIn("credentials", { email, password, callbackUrl: "/" });
          }}
        >
          <div style={{ marginBottom: 12 }}>
            <input name="email" type="email" placeholder="Email" required style={{ width: "100%", padding: 8, fontSize: 16 }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <input name="password" type="password" placeholder="Password" required style={{ width: "100%", padding: 8, fontSize: 16 }} />
          </div>
          <button type="submit" style={{ width: "100%", padding: 10, fontSize: 18, background: "#0af", color: "#fff", border: "none", borderRadius: 8 }}>Login with Email</button>
        </form>
      )}
      <hr style={{ margin: "24px 0" }} />
      {providers?.google && (
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          style={{ width: "100%", padding: 10, fontSize: 18, background: "#ea4335", color: "#fff", border: "none", borderRadius: 8 }}
        >
          Login with Google
        </button>
      )}
      <hr style={{ margin: "24px 0" }} />
      {/* Mobile OTP login */}
      <Link href="/auth/mobile-signin" style={{ display: "block", textAlign: "center", marginTop: 16, color: "#0af", fontWeight: 600 }}>
        Login with Mobile & OTP
      </Link>
    </div>
  );
}
