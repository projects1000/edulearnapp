import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 p-6">
      <header className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-pink-600 mb-4 drop-shadow-lg">EduLearn Play Factory</h1>
        <p className="text-xl text-blue-700 font-semibold mb-2">World's Most Engaging Learning App for Kids</p>
        <p className="text-lg text-gray-700">Fun, Safe, and Interactive Games for Nursery, LKG, UKG</p>
      </header>
      <main className="w-full max-w-2xl flex flex-col gap-8 items-center">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-blue-200">
          <h2 className="text-2xl font-bold text-yellow-700">Why EduLearn?</h2>
          <ul className="list-disc pl-6 text-lg text-gray-800">
            <li>Single-device secure login for child safety</li>
            <li>Professional, kid-friendly UI and vibrant colors</li>
            <li>Math, English, GK, and Puzzle games</li>
            <li>Progress tracking and locked tasks for motivation</li>
            <li>Premium features with secure Razorpay payments</li>
            <li>Compliant with global child privacy standards</li>
          </ul>
        </div>
        <div className="flex flex-col gap-4 items-center">
          <Link href="/payment" className="w-full py-3 text-lg font-bold bg-gradient-to-r from-blue-500 to-pink-400 text-white rounded-xl shadow hover:from-blue-600 hover:to-pink-500 transition text-center">Upgrade to Premium</Link>
          <Link href="/login" className="w-full py-3 text-lg font-bold bg-yellow-400 text-white rounded-xl shadow hover:bg-yellow-500 transition text-center">Try Free Demo</Link>
        </div>
      </main>
      <footer className="mt-12 text-center text-sm text-gray-500">
        ©2025 EduLearn Play Factory. All rights reserved.<br />Developed by Priyabrata Pattanaik
      </footer>
    </div>
  );
}
