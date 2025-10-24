
import React, { useState, useRef } from "react";
// Removed unused dnd-kit imports

function getRandomBalloons(maxNum: number) {
  // Always 5 balloons, numbers 0 to maxNum, allow repetitions
  if (maxNum <= 0) return Array(5).fill(0);
  // Always include the remaining value (maxNum) if > 0, never show magic number
  const nums: number[] = [];
  // Rule 1: magic number must not show in balloons
  // If remaining is 1, always include 1 and 0
  if (maxNum === 1) {
    nums.push(1, 0);
    while (nums.length < 5) nums.push(0);
  } else {
    // Always include the remaining value (maxNum) if > 0 and not forbidden
    if (maxNum > 1) nums.push(maxNum - 1);
    // Fill the rest with random numbers between 0 and maxNum-1, avoiding duplicates for small ranges
    while (nums.length < 5) {
    const val = Math.floor(Math.random() * maxNum);
    // Avoid duplicates for small ranges, but allow 0 multiple times
    if (maxNum <= 6 && nums.includes(val) && val !== 0) continue;
    nums.push(val);
    }
  }
  // Shuffle balloons
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  return nums;
}

function getRandomBoxValue() {
  // Random integer between 6 and 10
  return Math.floor(Math.random() * 5) + 6;
}

function MagicBoxOf10() {
  const [boxValue, setBoxValue] = useState(getRandomBoxValue());
  const [balloons, setBalloons] = useState(getRandomBalloons(boxValue));
  const [selected, setSelected] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<string>("");
  const [sparkle, setSparkle] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const resetTimerRef = useRef<number | null>(null);

  // Automatically check for correct sum whenever selected changes
  React.useEffect(() => {
    if (selected.length === 0 || result) return;
    const sum = selected.reduce((a, b) => a + b, 0);
    if (sum === boxValue) {
      setResult('🎉 Congratulations!');
      setSparkle(true);
      setFeedback('');
      if (resetTimerRef.current) { clearTimeout(resetTimerRef.current); resetTimerRef.current = null; }
      resetTimerRef.current = window.setTimeout(() => { resetGame(); }, 3000) as unknown as number;
    }
  }, [selected, boxValue, result]);

  function resetGame() {
    const newBoxValue = getRandomBoxValue();
    setSelected([]);

    setBoxValue(newBoxValue);
    setBalloons(getRandomBalloons(newBoxValue));
    setFeedback("");
    setResult(null);
    setSparkle(false);
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
      // ...existing code...
        setFeedback("");
        setResult(null);
        setSparkle(false);
        if (resetTimerRef.current) {
          clearTimeout(resetTimerRef.current);
          resetTimerRef.current = null;
        }
      }

      function burstBalloon(idx: number) {
        if (result) return;
        const value = balloons[idx];
        const newSelected = [...selected, value];
        setSelected(newSelected);
        setFeedback("");
        const currentSum = newSelected.reduce((a, b) => a + b, 0);
        const remaining = boxValue - currentSum;
        if (remaining > 0) {
          setBalloons(getRandomBalloons(remaining));
        }
      }

      function removeSelected(idx: number) {
        const newSelected = [...selected];
        newSelected.splice(idx, 1);
        setSelected(newSelected);
        setFeedback("");
        const currentSum = newSelected.reduce((a, b) => a + b, 0);
        const remaining = boxValue - currentSum;
        setBalloons(getRandomBalloons(remaining >= 0 ? remaining : 0));
      }

      const currentSum = selected.reduce((a, b) => a + b, 0);
      const remaining = boxValue - currentSum;

      return (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h2 className="text-2xl font-bold mb-2">🪄 Magic Number Addition</h2>
          <div style={{ fontSize: 40, fontWeight: 700, color: "#0af", marginBottom: 8 }}>{boxValue}</div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "0 auto", width: "100%" }}>
            <div>
              <div
                style={{
                  width: 260,
                  minHeight: 70,
                  background: "#ffe",
                  borderRadius: 32,
                  boxShadow: sparkle ? "0 0 40px #0ff" : "0 0 10px #aaa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  position: "relative",
                  padding: "12px 0",
                  margin: "0 auto",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 32,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <div style={{ fontSize: 32, fontWeight: 600, color: "#333", minHeight: 40 }}>
                    {selected.length ? selected.join(" + ") : <span style={{ color: "#bbb" }}>Select numbers…</span>}
                  </div>
                  {sparkle && (
                    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                      <span style={{ fontSize: 64, color: "gold" }}>✨</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={resetGame}
              style={{
                height: 36,
                minWidth: 56,
                background: "#FFD600",
                color: "#333",
                fontWeight: 600,
                fontSize: 15,
                border: "none",
                borderRadius: 10,
                boxShadow: "0 2px 8px #eee",
                cursor: "pointer",
                marginTop: 16,
              }}
            >
              Reset
            </button>
          </div>
          {result && (
            <div style={{ marginTop: 18, marginBottom: -8, fontSize: 28, color: "#093", fontWeight: 700 }}>
              🎉 Congratulations!
            </div>
          )}
          <div style={{ marginTop: 12, fontSize: 28, color: "#e33", fontWeight: 600 }}>{selected.length ? `= ${currentSum}` : ""}</div>
          {/* Removed selected numbers as removable bubbles below the box */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, marginBottom: 24, marginTop: 32 }}>
            {balloons.map((num, idx) => (
              <BalloonBubble key={idx} num={num} burst={false} onBurst={() => burstBalloon(idx)} />
            ))}
          </div>
          {/* Removed duplicate Reset button below balloons */}
          {feedback && !result && (
            <div style={{ marginTop: 24, fontSize: 24, color: feedback.startsWith("❌") ? "#e33" : "#093" }}>{feedback}</div>
          )}
          <div style={{ marginTop: 32 }}>
            <span style={{ fontSize: 16, color: "#888" }}>
              Burst balloons to select numbers. Click selected bubbles to remove. Find a combination that adds up to the magic number above!
            </span>
          </div>
        </div>
      );
    }

function BalloonBubble({ num, burst, onBurst }: { num: number; burst: boolean; onBurst: () => void }) {
  return (
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: burst ? "#ccc" : "#f9c",
        color: burst ? "#aaa" : "#333",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 32,
        boxShadow: burst ? "0 0 4px #aaa" : "0 0 8px #f9c",
        opacity: burst ? 0.5 : 1,
        cursor: burst ? "not-allowed" : "pointer",
        position: "relative",
        transition: "all 0.2s",
      }}
      onClick={() => !burst && onBurst()}
      aria-disabled={burst}
      title={burst ? "Already burst" : "Burst this balloon"}
    >
      {num}
      {!burst && (
        <span
          style={{
            position: "absolute",
            bottom: -8,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 18,
            color: "#f39",
          }}
        >
          🎈
        </span>
      )}
    </div>
  );
}

export default MagicBoxOf10;
