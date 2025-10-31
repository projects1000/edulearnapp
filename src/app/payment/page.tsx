"use client";
import dynamic from "next/dynamic";

const PaymentForm = dynamic(() => import("./PaymentForm"), { ssr: false });

export default function PaymentPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100">
      <PaymentForm />
    </div>
  );
}
