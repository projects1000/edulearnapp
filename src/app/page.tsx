
"use client";
import { useState } from "react";
import Link from "next/link";

function BeforeAfterNumberTask() {
  const [number, setNumber] = useState(5);
  const [answer, setAnswer] = useState("");
  const [mode, setMode] = useState<"before" | "after">("before");
  const [result, setResult] = useState<string | null>(null);

  const correct = mode === "before" ? number - 1 : number + 1;

  function checkAnswer() {
    if (parseInt(answer) === correct) {
      setResult("🎉 Correct! Great job!");
    } else {
      setResult("❌ Try again!");
    }
  }

  function nextTask() {
    setNumber(Math.floor(Math.random() * 89) + 10); // random 2-digit number
    setAnswer("");
    setResult(null);
    setMode(Math.random() > 0.5 ? "before" : "after");
  }

  return (
    <div className="w-full flex flex-col items-center bg-white rounded-xl p-4 shadow-md">
      <div className="mb-2 text-lg font-bold text-yellow-700">What is the {mode} number of <span className="text-2xl text-pink-500">{number}</span>?</div>
      <input
        type="number"
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        className="border-2 border-yellow-300 rounded-lg px-3 py-2 text-xl text-center mb-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
        placeholder="Enter your answer"
        min={0}
        max={100}
      />
      <div className="flex gap-2 mb-2">
        <button
          onClick={checkAnswer}
          className="bg-pink-400 text-white font-bold px-4 py-2 rounded-lg shadow hover:bg-pink-500 transition-colors"
        >
          Check
        </button>
        <button
          onClick={nextTask}
          className="bg-blue-400 text-white font-bold px-4 py-2 rounded-lg shadow hover:bg-blue-500 transition-colors"
        >
          Next
        </button>
      </div>
      {result && <div className="text-xl font-semibold mt-2">{result}</div>}
      <div className="mt-2 text-sm text-gray-500">Tip: Before number is one less, after number is one more!</div>
    </div>
  );
}

export default function Home() {
  const [showUKGTasks, setShowUKGTasks] = useState(false);
  const [activeTask, setActiveTask] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-yellow-100 flex flex-col items-center justify-center p-4 sm:p-8">
      <header className="w-full max-w-2xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-pink-600 mb-2 drop-shadow-lg">EduLearn Play School</h1>
        <p className="text-lg sm:text-xl text-blue-700 font-semibold">Fun Learning for Nursery, LKG, UKG</p>
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
      </main>
      {/* UKG Tasks Section removed, now on separate page */}
      <footer className="mt-12 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} EduLearn Play School. All rights reserved.
      </footer>
    </div>
  );
}
