"use client";
import { useState } from "react";

export default function PaymentForm() {
  const [amount, setAmount] = useState(199);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const order = await res.json();
      if (!order.id) throw new Error(order.error || "Order failed");
      // @ts-ignore
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "EduLearn Play Factory",
        description: "Premium Access",
        order_id: order.id,
        handler: async function (response: any) {
          alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
          // Mark user as premium
          try {
            const mobile = localStorage.getItem("edulearn_user_mobile");
            if (mobile) {
              await fetch("/api/upgrade-premium", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mobile })
              });
              localStorage.setItem("edulearn_user_premium", "1");
              window.location.href = "/";
            }
          } catch {}
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: { color: "#F37254" },
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg flex flex-col gap-6 border border-blue-200 mt-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Upgrade to Premium</h2>
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Amount (INR)</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
          min={1}
        />
      </div>
      <button
        className="w-full py-3 text-lg font-bold bg-gradient-to-r from-blue-500 to-pink-400 text-white rounded-xl shadow hover:from-blue-600 hover:to-pink-500 transition"
        onClick={handlePay}
        disabled={loading}
      >
        {loading ? "Processing…" : "Pay Now"}
      </button>
      {error && <p className="text-center text-red-500 font-semibold">{error}</p>}
    </div>
  );
}
