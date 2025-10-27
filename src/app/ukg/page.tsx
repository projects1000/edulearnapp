"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import MagicBoxOf10 from "./MagicBoxOf10";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  useSortable,
  arrayMove,
  SortableContext,
  rectSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* ============================
   LockedOverlay (for locked content)
   ============================ */
function LockedOverlay() {
  const [showPopup, setShowPopup] = React.useState(false);
  const handleBlock = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowPopup(true);
  };
  React.useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 1800);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);
  return (
    <>
      <div
        className="absolute inset-0 bg-transparent cursor-not-allowed z-10"
        onClick={handleBlock}
        onMouseDown={handleBlock}
        onTouchStart={handleBlock}
        style={{ borderRadius: "0.75rem" }}
      />
      {showPopup && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <div className="bg-white bg-opacity-90 rounded-xl px-6 py-4 flex flex-col items-center shadow-lg">
            <span className="text-4xl mb-2" role="img" aria-label="locked">
              🔒
            </span>
            <span className="text-red-600 font-semibold text-lg">
              Login to unlock and play this game.
            </span>
          </div>
        </div>
      )}
    </>
  );
}

/* ============================
   Number spelling data 1..100
   ============================ */
const numberSpellings: { [key: number]: string } = {
  1: "ONE",
  2: "TWO",
  3: "THREE",
  4: "FOUR",
  5: "FIVE",
  6: "SIX",
  7: "SEVEN",
  8: "EIGHT",
  9: "NINE",
  10: "TEN",
  11: "ELEVEN",
  12: "TWELVE",
  13: "THIRTEEN",
  14: "FOURTEEN",
  15: "FIFTEEN",
  16: "SIXTEEN",
  17: "SEVENTEEN",
  18: "EIGHTEEN",
  19: "NINETEEN",
  20: "TWENTY",
  21: "TWENTY ONE",
  22: "TWENTY TWO",
  23: "TWENTY THREE",
  24: "TWENTY FOUR",
  25: "TWENTY FIVE",
  26: "TWENTY SIX",
  27: "TWENTY SEVEN",
  28: "TWENTY EIGHT",
  29: "TWENTY NINE",
  30: "THIRTY",
  31: "THIRTY ONE",
  32: "THIRTY TWO",
  33: "THIRTY THREE",
  34: "THIRTY FOUR",
  35: "THIRTY FIVE",
  36: "THIRTY SIX",
  37: "THIRTY SEVEN",
  38: "THIRTY EIGHT",
  39: "THIRTY NINE",
  40: "FORTY",
  41: "FORTY ONE",
  42: "FORTY TWO",
  43: "FORTY THREE",
  44: "FORTY FOUR",
  45: "FORTY FIVE",
  46: "FORTY SIX",
  47: "FORTY SEVEN",
  48: "FORTY EIGHT",
  49: "FORTY NINE",
  50: "FIFTY",
  51: "FIFTY ONE",
  52: "FIFTY TWO",
  53: "FIFTY THREE",
  54: "FIFTY FOUR",
  55: "FIFTY FIVE",
  56: "FIFTY SIX",
  57: "FIFTY SEVEN",
  58: "FIFTY EIGHT",
  59: "FIFTY NINE",
  60: "SIXTY",
  61: "SIXTY ONE",
  62: "SIXTY TWO",
  63: "SIXTY THREE",
  64: "SIXTY FOUR",
  65: "SIXTY FIVE",
  66: "SIXTY SIX",
  67: "SIXTY SEVEN",
  68: "SIXTY EIGHT",
  69: "SIXTY NINE",
  70: "SEVENTY",
  71: "SEVENTY ONE",
  72: "SEVENTY TWO",
  73: "SEVENTY THREE",
  74: "SEVENTY FOUR",
  75: "SEVENTY FIVE",
  76: "SEVENTY SIX",
  77: "SEVENTY SEVEN",
  78: "SEVENTY EIGHT",
  79: "SEVENTY NINE",
  80: "EIGHTY",
  81: "EIGHTY ONE",
  82: "EIGHTY TWO",
  83: "EIGHTY THREE",
  84: "EIGHTY FOUR",
  85: "EIGHTY FIVE",
  86: "EIGHTY SIX",
  87: "EIGHTY SEVEN",
  88: "EIGHTY EIGHT",
  89: "EIGHTY NINE",
  90: "NINETY",
  91: "NINETY ONE",
  92: "NINETY TWO",
  93: "NINETY THREE",
  94: "NINETY FOUR",
  95: "NINETY FIVE",
  96: "NINETY SIX",
  97: "NINETY SEVEN",
  98: "NINETY EIGHT",
  99: "NINETY NINE",
  100: "ONE HUNDRED"
};

/* ============================
   EnglishNumberSpellingTask
   - Pagination 5 per page, animate spelling on click
   ============================ */
function EnglishNumberSpellingTask() {
  const [page, setPage] = useState(1);
  const [selectedNumbers, setSelectedNumbers] = useState<
    Array<{ num: number; spellingIndex: number }>
  >([]);

  const numbers = Array.from({ length: 5 }, (_, i) => (page - 1) * 5 + i + 1);

  useEffect(() => {
    // animate any selected items by incrementing their spellingIndex periodically
    selectedNumbers.forEach(({ num, spellingIndex }) => {
      const spelling = numberSpellings[num];
      if (!spelling) return;
      if (spellingIndex < spelling.length) {
        const timer = setTimeout(() => {
          setSelectedNumbers((current) =>
            current.map((item) =>
              item.num === num && item.spellingIndex === spellingIndex
                ? { ...item, spellingIndex: item.spellingIndex + 1 }
                : item
            )
          );
          const audio =
            typeof window !== "undefined"
              ? new Audio("https://www.soundjay.com/buttons/sounds/button-16.mp3")
              : null;
          audio?.play().catch(() => {});
        }, 350);
        return () => clearTimeout(timer);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNumbers]);

  function handleNumberClick(num: number) {
    if (selectedNumbers.some((item) => item.num === num)) return;
    setSelectedNumbers((current) => [...current, { num, spellingIndex: 0 }]);
  }

  function handleNextPage() {
    if ((page - 1) * 5 + 5 >= 100) return;
    setPage((p) => p + 1);
    setSelectedNumbers([]);
  }

  function handlePrevPage() {
    if (page === 1) return;
    setPage((p) => p - 1);
    setSelectedNumbers([]);
  }

  return (
    <div className="w-full flex flex-col items-center bg-white rounded-xl p-4 shadow-md">
      <h2 className="text-xl font-bold text-blue-700 mb-2">Learn 1 to 100</h2>
      <div className="flex w-full gap-8">
        <div className="flex flex-col gap-2 items-end w-full">
          {numbers.map((num) => {
            const selected = selectedNumbers.find((item) => item.num === num);
            const spelling = numberSpellings[num];
            return (
              <div key={num} className="flex items-center gap-4 w-full">
                <button
                  className={`bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold px-4 py-2 rounded-xl shadow text-lg border-2 ${
                    selected ? "border-blue-500" : "border-transparent"
                  }`}
                  onClick={() => handleNumberClick(num)}
                  disabled={!spelling}
                  style={{ minWidth: 60 }}
                >
                  {num}
                </button>
                {selected && (
                  <div className="flex gap-1 text-3xl font-extrabold text-pink-600 items-center">
                    {spelling
                      .split("")
                      .slice(0, selected.spellingIndex)
                      .map((char, idx) => (
                        <span key={idx} className="animate-pulse drop-shadow-lg">
                          {char}
                        </span>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          className="bg-yellow-300 hover:bg-yellow-400 text-white font-bold px-4 py-2 rounded-lg shadow disabled:opacity-50"
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          Prev
        </button>
        <div className="flex items-center text-sm text-gray-600 px-2">Page {page} / 20</div>
        <button
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-4 py-2 rounded-lg shadow disabled:opacity-50"
          onClick={handleNextPage}
          disabled={(page - 1) * 5 + 5 >= 100}
        >
          Next
        </button>
      </div>
      <div className="mt-2 text-sm text-gray-500">Click a number to see its spelling animated!</div>
    </div>
  );
}

/* ============================
   Utility: uniqueRandomIntegers
   ============================ */
function uniqueRandomIntegers(count: number, min: number, max: number) {
  const size = max - min + 1;
  if (count >= size) {
    const all: number[] = [];
    for (let i = min; i <= max; i++) all.push(i);
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    return all.slice(0, count);
  }
  const pool: number[] = [];
  for (let i = min; i <= max; i++) pool.push(i);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

/* ============================
   SubtractionTask
   ============================ */
function SubtractionTask() {
  const [a, setA] = useState(() => Math.floor(Math.random() * 5) + 2); // 2..6
  const [b, setB] = useState(() => Math.floor(Math.random() * (Math.min(4, a - 1))) + 1); // ensure b < a
  const correct = Math.max(0, a - b);
  const [choices, setChoices] = useState<number[]>(() => {
    const base = [correct, correct + 1, Math.max(0, correct - 1)].sort(() => Math.random() - 0.5);
    return base;
  });
  const [result, setResult] = useState<string | null>(null);
  const [matched, setMatched] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  const isTabletOrMobile = useMediaQuery({ maxWidth: 1024 });
  const sensors = useSensors(
    useSensor(isTabletOrMobile ? TouchSensor : PointerSensor, {
      activationConstraint: isTabletOrMobile ? { delay: 0, tolerance: 0 } : { distance: 0 }
    })
  );

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
    };
  }, []);

  function resetTask() {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
    const na = Math.floor(Math.random() * 5) + 2;
    const nb = Math.floor(Math.random() * (na - 1)) + 1;
    setA(na);
    setB(nb);
    const c = Math.max(0, na - nb);
    const cand = [c, c + (Math.random() > 0.5 ? 1 : -1), Math.max(0, c + (Math.random() > 0.5 ? 2 : -2))];
    setChoices(cand.sort(() => Math.random() - 0.5));
    setResult(null);
    setMatched(false);
  }

  function onDropChoice(choice: number) {
    if (matched) return;
    if (choice === correct) {
      setResult("🎉 Correct!");
      setMatched(true);
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
      resetTimerRef.current = (window.setTimeout(() => {
        resetTask();
        resetTimerRef.current = null;
      }, 2000) as unknown) as number;
    } else {
      setResult("❌ Try again!");
    }
  }

  function DraggableChoice({ id, value }: { id: string; value: number }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id,
      data: { value }
    });
    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      zIndex: isDragging ? 20 : 1,
      touchAction: "none",
      WebkitUserSelect: "none"
    };
    return (
      <button
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-white border-2 border-gray-200 rounded-full px-6 py-3 text-xl font-bold shadow cursor-grab"
      >
        {value}
      </button>
    );
  }

  function DropBox({ onDrop }: { onDrop: (val: number) => void }) {
    const { isOver, setNodeRef } = useDroppable({ id: "sub-drop" });
    return (
      <div
        ref={setNodeRef}
        className={`w-40 h-28 rounded-lg border-4 border-dashed flex items-center justify-center ${
          isOver ? "bg-green-100 border-green-400" : "bg-white border-gray-300"
        }`}
      >
        <div className="text-2xl font-extrabold">Drop answer here</div>
      </div>
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && String(over.id) === "sub-drop") {
      const dataVal = active.data?.current?.value;
      const fallback = parseInt(String(active.id).replace(/^choice-/, ""), 10);
      const finalVal = typeof dataVal === "number" && !isNaN(dataVal) ? dataVal : isNaN(fallback) ? NaN : fallback;
      if (!isNaN(finalVal)) onDropChoice(finalVal);
    }
  }

  // prevent scroll handling on touch drags
  let touchMoveHandlerSub: ((e: TouchEvent) => void) | null = null;
  function disablePageScrollSub() {
    try {
      document.documentElement.style.touchAction = "none";
      document.body.style.overflow = "hidden";
      touchMoveHandlerSub = (e: TouchEvent) => e.preventDefault();
      document.addEventListener("touchmove", touchMoveHandlerSub, { passive: false });
    } catch {}
  }
  function enablePageScrollSub() {
    try {
      document.documentElement.style.touchAction = "";
      document.body.style.overflow = "";
      if (touchMoveHandlerSub) {
        document.removeEventListener("touchmove", touchMoveHandlerSub as EventListener);
        touchMoveHandlerSub = null;
      }
    } catch {}
  }
  function handleDragStartSub() {
    disablePageScrollSub();
  }
  function handleDragCancelSub() {
    enablePageScrollSub();
  }

  return (
    <div className="w-full flex flex-col items-center bg-gradient-to-br from-indigo-50 via-yellow-50 to-pink-50 rounded-xl p-4 shadow-md">
      <h2 className="text-xl font-bold text-indigo-700 mb-2">Subtraction</h2>
      <DndContext
        sensors={useSensors(
          useSensor(isTabletOrMobile ? TouchSensor : PointerSensor, {
            activationConstraint: isTabletOrMobile ? { delay: 0, tolerance: 0 } : { distance: 0 }
          })
        )}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStartSub}
        onDragCancel={handleDragCancelSub}
      >
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2 items-center">
              <div className="flex gap-2 items-center">
                {Array.from({ length: a }).map((_, i) => (
                  <div key={`sa-${i}`} className="w-8 h-8 bg-purple-400 rounded-full shadow" />
                ))}
              </div>
              <div className="text-2xl font-extrabold">-</div>
              <div className="flex gap-2 items-center">
                {Array.from({ length: b }).map((_, i) => (
                  <div key={`sb-${i}`} className="w-8 h-8 bg-yellow-400 rounded-full shadow" />
                ))}
              </div>
              <div className="text-2xl font-extrabold">=</div>
              <div>
                <DropBox onDrop={onDropChoice} />
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-2">Drag the correct number into the box</div>
          </div>
          <div className="flex gap-4 flex-wrap justify-center">
            {choices.map((c, i) => (
              <div key={`choice-${i}`} className="p-1">
                <DraggableChoice id={`choice-${c}`} value={c} />
              </div>
            ))}
          </div>
        </div>
      </DndContext>

      {result && result.startsWith("🎉") && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-90 rounded-2xl shadow-2xl p-8 flex flex-col items-center animate-bounce">
            <span className="text-6xl">🎉</span>
            <span className="text-3xl font-extrabold text-green-600 mb-2">Congratulations!</span>
            <span className="text-xl text-yellow-700">You answered correctly!</span>
          </div>
        </div>
      )}
      {result && !result.startsWith("🎉") && (
        <div className="text-xl font-semibold mt-2 text-red-600">{result}</div>
      )}
      <div className="mt-4">
        <button onClick={resetTask} className="px-4 py-2 bg-indigo-400 hover:bg-indigo-500 text-white rounded">
          Next
        </button>
      </div>
    </div>
  );
}

/* ============================
   SortableNumber (used by AscendingDescendingTask)
   ============================ */
export function SortableNumber({
  id,
  value,
  mode,
  isFirst,
  isLast,
  mobileStyle,
  completed = false
}: {
  id: string;
  value: number;
  mode: "asc" | "desc";
  isFirst: boolean;
  isLast: boolean;
  mobileStyle?: React.CSSProperties;
  completed?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    minWidth: 60,
    zIndex: isDragging ? 10 : 1,
    ...(typeof mobileStyle === "object" ? mobileStyle : {})
  };
  return (
    <div ref={setNodeRef} style={style} className="flex flex-col items-center w-28">
      {isFirst && (
        <span className="text-xs text-green-700 font-bold mb-1 whitespace-nowrap">
          {mode === "asc" ? "Smaller" : "Larger"}
        </span>
      )}
      <button
        className={`font-extrabold text-2xl rounded-full shadow-lg px-6 py-4 border-4 cursor-grab transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          completed ? "bg-green-600 text-white border-green-400" : "bg-red-600 text-white border-red-400"
        }`}
        style={{ width: "100%", fontSize: "1.5rem", touchAction: "none", WebkitUserSelect: "none" }}
        aria-label={`Drag number ${value}`}
        {...attributes}
        {...listeners}
      >
        {value}
      </button>
      {isLast && (
        <span className="text-xs text-blue-700 font-bold mt-1 whitespace-nowrap">
          {mode === "asc" ? "Larger" : "Smaller"}
        </span>
      )}
    </div>
  );
}

/* ============================
   AscendingDescendingTask (corrected)
   ============================ */
function AscendingDescendingTask() {
  const [mode, setMode] = useState<"asc" | "desc">("asc");
  const [numbers, setNumbers] = useState<Array<{ id: string; value: number }>>(() => {
    const arr = uniqueRandomIntegers(5, 10, 99);
    return arr.sort(() => Math.random() - 0.5).map((v, i) => ({ id: `n-${Date.now()}-${i}-${Math.floor(Math.random() * 1000)}`, value: v }));
  });
  const [result, setResult] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  const isTabletOrMobile = useMediaQuery({ maxWidth: 1024 });
  const sensors = useSensors(
    useSensor(isTabletOrMobile ? TouchSensor : PointerSensor, {
      activationConstraint: isTabletOrMobile ? { delay: 0, tolerance: 0 } : { distance: 0 }
    })
  );

  // prevent page scroll while dragging on touch devices
  let touchMoveHandler: ((e: TouchEvent) => void) | null = null;
  function disablePageScroll() {
    try {
      document.documentElement.style.touchAction = "none";
      document.body.style.overflow = "hidden";
      touchMoveHandler = (e: TouchEvent) => e.preventDefault();
      document.addEventListener("touchmove", touchMoveHandler, { passive: false });
    } catch {}
  }
  function enablePageScroll() {
    try {
      document.documentElement.style.touchAction = "";
      document.body.style.overflow = "";
      if (touchMoveHandler) {
        document.removeEventListener("touchmove", touchMoveHandler as EventListener);
        touchMoveHandler = null;
      }
    } catch {}
  }

  function handleDragStart() {
    disablePageScroll();
  }

  function handleDragEnd(event: DragEndEvent) {
    enablePageScroll();
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const oldIndex = numbers.findIndex((n) => n.id === activeId);
    const newIndex = numbers.findIndex((n) => n.id === overId);

    if (oldIndex === -1 || newIndex === -1) return;
    if (oldIndex === newIndex) return;

    const reordered = arrayMove(numbers, oldIndex, newIndex);
    setNumbers(reordered);

    setTimeout(() => {
      const currentValues = reordered.map((r) => r.value);
      const expected = [...currentValues].sort((a, b) => (mode === "asc" ? a - b : b - a));
      const ok = currentValues.every((v, i) => v === expected[i]);

      if (ok) {
        setResult("🎉 Good job!");
        setCompleted(true);
        if (resetTimerRef.current) {
          clearTimeout(resetTimerRef.current);
          resetTimerRef.current = null;
        }
        resetTimerRef.current = (window.setTimeout(() => {
          nextTask();
          resetTimerRef.current = null;
        }, 1800) as unknown) as number;
      } else {
        setResult(null);
        setCompleted(false);
      }
    }, 120);
  }

  function handleDragCancel() {
    enablePageScroll();
  }

  function nextTask() {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
    const arr = uniqueRandomIntegers(5, 10, 99).sort(() => Math.random() - 0.5);
    setNumbers(arr.map((v, i) => ({ id: `n-${Date.now()}-${i}-${Math.floor(Math.random() * 1000)}`, value: v })));
    setResult(null);
    setMode(Math.random() > 0.5 ? "asc" : "desc");
    setCompleted(false);
  }

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center bg-gradient-to-br from-pink-100 via-yellow-100 to-blue-100 rounded-xl p-4 shadow-md">
      <div className="mb-2 flex flex-col items-center gap-1">
        <span className="text-lg text-gray-700 font-bold">Arrange in {mode === "asc" ? "Ascending" : "Descending"} Order</span>
        <div className="text-2xl">
          {mode === "asc" ? (isTabletOrMobile ? "⬆️" : "➡️") : (isTabletOrMobile ? "⬇️" : "⬅️")}
        </div>
      </div>

      <div className="w-full mb-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
          <SortableContext items={numbers.map((n) => n.id)} strategy={rectSortingStrategy}>
            <div className="flex flex-col lg:flex-row gap-4 justify-center items-center w-full lg:flex-nowrap">
              {numbers.map((item, idx) => (
                <div key={item.id} className={isTabletOrMobile ? "w-full flex justify-center" : "px-2"} style={isTabletOrMobile ? undefined : { width: 120 }}>
                  <SortableNumber
                    id={item.id}
                    value={item.value}
                    mode={mode}
                    isFirst={idx === 0}
                    isLast={idx === numbers.length - 1}
                    mobileStyle={isTabletOrMobile ? { width: "90%", minHeight: 60 } : undefined}
                    completed={completed}
                  />
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div className="flex gap-3">
        <button onClick={() => setMode((prev) => (prev === "asc" ? "desc" : "asc"))} className="bg-white border px-3 py-1 rounded">
          Toggle Mode
        </button>
        <button onClick={nextTask} className="bg-blue-400 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-lg shadow">
          Next
        </button>
      </div>

      {result && result.startsWith("🎉") && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white bg-opacity-90 rounded-2xl shadow-2xl p-8 flex flex-col items-center animate-bounce">
            <span className="text-6xl">🎉</span>
            <span className="text-3xl font-extrabold text-green-600 mb-2">Congratulations!</span>
            <span className="text-xl text-yellow-700">You arranged the numbers correctly!</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================
   BeforeAfterNumberTask
   ============================ */
function getChoices(correct: number) {
  const wrongChoices = [correct + (Math.random() > 0.5 ? 2 : -2), correct + (Math.random() > 0.5 ? 3 : -3)];
  return [correct, ...wrongChoices].sort(() => Math.random() - 0.5);
}

function BeforeAfterNumberTask() {
  const [number, setNumber] = useState(Math.floor(Math.random() * 89) + 10);
  const [mode, setMode] = useState<"before" | "after">(Math.random() > 0.5 ? "before" : "after");
  const [result, setResult] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [choices, setChoices] = useState<number[]>(() => {
    const correct = mode === "before" ? number - 1 : number + 1;
    return getChoices(correct);
  });

  const correct = mode === "before" ? number - 1 : number + 1;

  function checkAnswer(choice: number) {
    setSelected(choice);
    if (choice === correct) {
      setResult("🎉 Correct! Great job!");
    } else {
      setResult("❌ Try again!");
    }
  }

  function nextTask() {
    const newNumber = Math.floor(Math.random() * 89) + 10;
    const newMode = Math.random() > 0.5 ? "before" : "after";
    const newCorrect = newMode === "before" ? newNumber - 1 : newNumber + 1;
    setNumber(newNumber);
    setMode(newMode);
    setChoices(getChoices(newCorrect));
    setResult(null);
    setSelected(null);
  }

  return (
    <div className="w-full flex flex-col items-center bg-white rounded-xl p-4 shadow-md">
      <div className="mb-4 text-lg font-bold text-yellow-700">
        Select the{" "}
        <span className={mode === "before" ? "font-extrabold text-pink-500" : "font-extrabold text-blue-500"}>
          {mode.toUpperCase()}
        </span>{" "}
        number!
      </div>
      <div className="flex items-center justify-center gap-8 w-full">
        <div className="flex flex-col gap-2 items-end">
          {mode === "before" &&
            choices.map((choice, idx) => (
              <button
                key={idx}
                className={`bg-pink-200 hover:bg-pink-300 text-pink-800 font-bold px-4 py-2 rounded-xl shadow transition-colors text-lg border-2 ${
                  selected === choice ? (choice === correct ? "border-green-500" : "border-red-500") : "border-transparent"
                }`}
                onClick={() => checkAnswer(choice)}
                disabled={selected === correct}
              >
                {choice}
              </button>
            ))}
        </div>
        <div className="bg-yellow-200 text-yellow-800 font-extrabold text-4xl rounded-2xl shadow-lg px-8 py-6 border-4 border-yellow-400">
          {number}
        </div>
        <div className="flex flex-col gap-2 items-start">
          {mode === "after" &&
            choices.map((choice, idx) => (
              <button
                key={idx}
                className={`bg-blue-200 hover:bg-blue-300 text-blue-800 font-bold px-4 py-2 rounded-xl shadow transition-colors text-lg border-2 ${
                  selected === choice ? (choice === correct ? "border-green-500" : "border-red-500") : "border-transparent"
                }`}
                onClick={() => checkAnswer(choice)}
                disabled={selected === correct}
              >
                {choice}
              </button>
            ))}
        </div>
      </div>
      {result && <div className={`text-xl font-semibold mt-4 ${result.startsWith("🎉") ? "text-green-600" : "text-red-600"}`}>{result}</div>}
      <button onClick={nextTask} className="mt-4 bg-yellow-400 text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-yellow-500 transition-colors">
        Next
      </button>
      <div className="mt-2 text-sm text-gray-500">Tip: Before number is one less, after number is one more!</div>
    </div>
  );
}

/* ============================
   AdditionTask
   ============================ */
function AdditionTask() {
  const [a, setA] = useState(() => Math.floor(Math.random() * 4) + 1); // 1..4
  const [b, setB] = useState(() => Math.floor(Math.random() * 4) + 1); // 1..4
  const correct = a + b;
  const [choices, setChoices] = useState<number[]>(() => {
    const base = [correct, correct + 1, Math.max(0, correct - 1)].sort(() => Math.random() - 0.5);
    if (!base.includes(correct)) base[0] = correct;
    return base;
  });
  const [result, setResult] = useState<string | null>(null);
  const [matched, setMatched] = useState<boolean>(false);
  const resetTimerRef = useRef<number | null>(null);

  const isTabletOrMobile = useMediaQuery({ maxWidth: 1024 });
  const sensors = useSensors(
    useSensor(isTabletOrMobile ? TouchSensor : PointerSensor, {
      activationConstraint: isTabletOrMobile ? { delay: 0, tolerance: 0 } : { distance: 0 }
    })
  );

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
    };
  }, []);

  function resetTask() {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
    const na = Math.floor(Math.random() * 4) + 1;
    const nb = Math.floor(Math.random() * 4) + 1;
    setA(na);
    setB(nb);
    const c = na + nb;
    const cand = [c, c + (Math.random() > 0.5 ? 1 : -1), c + (Math.random() > 0.5 ? 2 : -2)];
    setChoices(cand.sort(() => Math.random() - 0.5));
    setResult(null);
    setMatched(false);
  }

  function onDropChoice(choice: number) {
    if (matched) return;
    if (choice === correct) {
      setResult("🎉 Correct!");
      setMatched(true);
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
      resetTimerRef.current = (window.setTimeout(() => {
        resetTask();
        resetTimerRef.current = null;
      }, 2000) as unknown) as number;
    } else {
      setResult("❌ Try again!");
    }
  }

  function DraggableChoice({ id, value }: { id: string; value: number }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id, data: { value } });
    const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), zIndex: isDragging ? 20 : 1, touchAction: "none" };
    return (
      <button ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-white border-2 border-gray-200 rounded-full px-6 py-3 text-xl font-bold shadow cursor-grab">
        {value}
      </button>
    );
  }

  function DropBox({ onDrop }: { onDrop: (val: number) => void }) {
    const { isOver, setNodeRef } = useDroppable({ id: "add-drop" });
    return (
      <div ref={setNodeRef} className={`w-40 h-28 rounded-lg border-4 border-dashed flex items-center justify-center ${isOver ? "bg-green-100 border-green-400" : "bg-white border-gray-300"}`}>
        <div className="text-2xl font-extrabold">Drop answer here</div>
      </div>
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && String(over.id) === "add-drop") {
      const dataVal = active.data?.current?.value;
      const fallback = parseInt(String(active.id).replace(/^choice-/, ""), 10);
      const finalVal = typeof dataVal === "number" && !isNaN(dataVal) ? dataVal : isNaN(fallback) ? NaN : fallback;
      if (!isNaN(finalVal)) onDropChoice(finalVal);
    }
  }

  // touch scroll prevention
  let touchMoveHandlerAdd: ((e: TouchEvent) => void) | null = null;
  function disablePageScrollAdd() {
    try {
      document.documentElement.style.touchAction = "none";
      document.body.style.overflow = "hidden";
      touchMoveHandlerAdd = (e: TouchEvent) => e.preventDefault();
      document.addEventListener("touchmove", touchMoveHandlerAdd, { passive: false });
    } catch {}
  }
  function enablePageScrollAdd() {
    try {
      document.documentElement.style.touchAction = "";
      document.body.style.overflow = "";
      if (touchMoveHandlerAdd) {
        document.removeEventListener("touchmove", touchMoveHandlerAdd as EventListener);
        touchMoveHandlerAdd = null;
      }
    } catch {}
  }
  function handleDragStartAdd() {
    disablePageScrollAdd();
  }
  function handleDragCancelAdd() {
    enablePageScrollAdd();
  }

  return (
    <div className="w-full flex flex-col items-center bg-gradient-to-br from-green-50 via-yellow-50 to-pink-50 rounded-xl p-4 shadow-md">
      <h2 className="text-xl font-bold text-green-700 mb-2">Addition</h2>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragStart={handleDragStartAdd} onDragCancel={handleDragCancelAdd}>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2 items-center">
              <div className="flex gap-2 items-center">
                {Array.from({ length: a }).map((_, i) => (
                  <div key={`a-${i}`} className="w-8 h-8 bg-red-400 rounded-full shadow" />
                ))}
              </div>
              <div className="text-2xl font-extrabold">+</div>
              <div className="flex gap-2 items-center">
                {Array.from({ length: b }).map((_, i) => (
                  <div key={`b-${i}`} className="w-8 h-8 bg-blue-400 rounded-full shadow" />
                ))}
              </div>
              <div className="text-2xl font-extrabold">=</div>
              <div>
                <DropBox onDrop={onDropChoice} />
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-2">Drag the correct number into the box</div>
          </div>
          <div className="flex gap-4 flex-wrap justify-center">
            {choices.map((c, i) => (
              <div key={`choice-${i}`} className="p-1">
                <DraggableChoice id={`choice-${c}`} value={c} />
              </div>
            ))}
          </div>
        </div>
      </DndContext>

      {result && result.startsWith("🎉") && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-90 rounded-2xl shadow-2xl p-8 flex flex-col items-center animate-bounce">
            <span className="text-6xl">🎉</span>
            <span className="text-3xl font-extrabold text-green-600 mb-2">Congratulations!</span>
            <span className="text-xl text-yellow-700">You answered correctly!</span>
          </div>
        </div>
      )}
      {result && !result.startsWith("🎉") && (
        <div className="text-xl font-semibold mt-2 text-red-600">{result}</div>
      )}
      <div className="mt-4">
        <button onClick={resetTask} className="px-4 py-2 bg-green-400 hover:bg-green-500 text-white rounded">
          Next
        </button>
      </div>
    </div>
  );
}

/* ============================
   FindMyNumberTask
   ============================ */
function ArrowDraggable({ running = true }: { running?: boolean }) {
  const [x, setX] = React.useState(0);
  useEffect(() => {
    if (!running) {
      setX(0);
      return;
    }
    let toggle = false;
    const id = setInterval(() => {
      toggle = !toggle;
      setX(toggle ? -26 : 0);
    }, 600);
    return () => clearInterval(id);
  }, [running]);
  return (
    <div className="inline-block select-none" style={{ touchAction: "none" }}>
      <div className="text-4xl font-extrabold text-green-600 transition-transform duration-300" style={{ transform: `translateX(${x}px)` }}>
        &#8592;
      </div>
    </div>
  );
}

function FindMyNumberTask() {
  function shuffleArray<T>(arr: T[]) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  const total = 5;
  const [leftNumbers, setLeftNumbers] = useState<number[]>(() => {
    const arr = Array.from({ length: total }, () => Math.floor(Math.random() * 90) + 10);
    return arr;
  });
  const [rightItems, setRightItems] = useState<Array<{ id: string; word: string }>>(() =>
    shuffleArray(leftNumbers.map((n, i) => ({ id: `r-${i}`, word: numberSpellings[n] || n.toString() })))
  );
  const [matched, setMatched] = useState<Record<number, boolean>>({});
  const [result, setResult] = useState<string | null>(null);
  const resetTimerRef = useRef<number | null>(null);

  const isTabletOrMobile = useMediaQuery({ maxWidth: 1024 });
  const sensors = useSensors(useSensor(isTabletOrMobile ? TouchSensor : PointerSensor, { activationConstraint: { distance: 0 } }));

  // page scroll prevention while dragging
  let touchMoveHandler: ((e: TouchEvent) => void) | null = null;
  function disablePageScroll() {
    try {
      document.documentElement.style.touchAction = "none";
      document.body.style.overflow = "hidden";
      touchMoveHandler = (e: TouchEvent) => e.preventDefault();
      document.addEventListener("touchmove", touchMoveHandler, { passive: false });
    } catch {}
  }
  function enablePageScroll() {
    try {
      document.documentElement.style.touchAction = "";
      document.body.style.overflow = "";
      if (touchMoveHandler) {
        document.removeEventListener("touchmove", touchMoveHandler as EventListener);
        touchMoveHandler = null;
      }
    } catch {}
  }

  useEffect(() => {
    setRightItems(shuffleArray(leftNumbers.map((n, i) => ({ id: `r-${i}`, word: numberSpellings[n] || n.toString() }))));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftNumbers]);

  function reset() {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
    const arr = Array.from({ length: total }, () => Math.floor(Math.random() * 90) + 10);
    setLeftNumbers(arr);
    setRightItems(shuffleArray(arr.map((n, i) => ({ id: `r-${i}`, word: numberSpellings[n] || n.toString() }))));
    setMatched({});
    setResult(null);
  }

  function handleDragStart() {
    disablePageScroll();
  }
  function handleDragEnd() {
    enablePageScroll();
  }

  function handleDrop(activeId: string, overId: string | null) {
    if (!overId) return;
    const item = rightItems.find((it) => it.id === activeId);
    if (!item) return;
    const word = item.word;
    const targetNumber = Number(overId);
    const correctWord = numberSpellings[targetNumber] || targetNumber.toString();
    if (word === correctWord) {
      setMatched((prev) => ({ ...prev, [targetNumber]: true }));
      setRightItems((prev) => prev.filter((it) => it.id !== activeId));
      setTimeout(() => {
        setMatched((current) => {
          const allMatched = leftNumbers.every((_, idx) => Boolean(current[leftNumbers[idx]]));
          if (allMatched) {
            setResult("🎉 Good job!");
          }
          return current;
        });
      }, 50);
    }
  }

  const resetRef = useRef(reset);
  useEffect(() => {
    resetRef.current = reset;
  }, [reset]);

  useEffect(() => {
    if (result && result.startsWith("🎉")) {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
      resetTimerRef.current = (window.setTimeout(() => {
        resetRef.current();
        resetTimerRef.current = null;
      }, 2000) as unknown) as number;
    }
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
    };
  }, [result]);

  function DraggableWordDnd({ id, word }: { id: string; word: string }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      opacity: isDragging ? 0.6 : 1
    };
    return (
      <div ref={setNodeRef} {...listeners} {...attributes} style={style} className="h-16 w-full flex items-center justify-center p-2 rounded-lg bg-red-600 text-white border-2 border-red-400 cursor-grab">
        <div className="text-lg font-bold text-center w-full">{word}</div>
      </div>
    );
  }

  function NumberTile({ num }: { num: number }) {
    const { setNodeRef, isOver } = useDroppable({ id: String(num) });
    return (
      <div
        ref={setNodeRef}
        className={`h-16 flex items-center justify-center p-3 rounded-lg border-2 ${
          matched[num] ? "bg-green-600 text-white border-green-500" : "bg-red-600 text-white border-red-400"
        } ${isOver ? "ring-4 ring-sky-300" : ""}`}
      >
        <div className="text-xl font-extrabold">{num}</div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center bg-white rounded-xl p-4 shadow-md">
      <h3 className="text-xl font-bold mb-4">Find My Number</h3>
      <div className="mb-2 text-sm font-semibold text-gray-700 flex items-center justify-between w-full">
        <span>DRAG LETTERS OVER NUMBER</span>
        <div className="ml-4">
          <ArrowDraggable running={!Boolean(result)} />
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={(e) => {
          handleDragEnd();
          const activeId = String(e.active.id);
          const overId = e.over?.id ? String(e.over.id) : null;
          handleDrop(activeId, overId);
        }}
        onDragCancel={handleDragEnd}
      >
        <div className="flex w-full gap-6">
          <div className="flex flex-col gap-3 w-1/2">
            {leftNumbers.map((num) => (
              <NumberTile key={num} num={num} />
            ))}
          </div>
          <div className="flex flex-col gap-3 w-1/2">
            {rightItems.map((item) => (
              <DraggableWordDnd key={item.id} id={item.id} word={item.word} />
            ))}
          </div>
        </div>
      </DndContext>

      <div className="flex gap-4 mt-4">
        <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-4 py-2 rounded-lg" onClick={reset}>
          Reset
        </button>
      </div>

      {result && result.startsWith("🎉") && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-90 rounded-2xl shadow-2xl p-8 flex flex-col items-center animate-bounce">
            <span className="text-6xl">🎉</span>
            <span className="text-3xl font-extrabold text-green-600 mb-2">Congratulations!</span>
            <span className="text-xl text-yellow-700">You matched all numbers correctly!</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================
   UKGPage (main)
   ============================ */
function UKGPage() {
  // Session validation for single device login
  const [sessionInvalid, setSessionInvalid] = useState(false);
  useEffect(() => {
    async function checkSession() {
      const mobile = localStorage.getItem("edulearn_user_mobile");
      const sessionToken = localStorage.getItem("edulearn_user_sessionToken");
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
          localStorage.clear();
        }
      } catch {}
    }
    checkSession();
    const interval = setInterval(checkSession, 30000); // check every 30s
    return () => clearInterval(interval);
  }, []);

  // check local unlock key
  const [isUnlocked, setIsUnlocked] = useState(() => {
    try {
      return !!localStorage.getItem("edulearn_user_name");
    } catch {
      return false;
    }
  });
  useEffect(() => {
    const updateUnlock = () => setIsUnlocked(!!localStorage.getItem("edulearn_user_name"));
    updateUnlock();
    window.addEventListener("storage", updateUnlock);
    return () => window.removeEventListener("storage", updateUnlock);
  }, []);

  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const subjects = [
    { key: "math", label: "Math" },
    { key: "english", label: "English" },
    { key: "gk", label: "GK" },
    { key: "puzzle", label: "Puzzle" }
  ];

  return (
    <div>

      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 flex flex-col items-center justify-center p-4 sm:p-8">
        {sessionInvalid && (
          <div className="fixed inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-50">
            <div className="bg-red-100 border border-red-400 rounded-xl px-8 py-6 shadow-lg flex flex-col items-center">
              <span className="text-4xl mb-2" role="img" aria-label="locked">🔒</span>
              <span className="text-red-700 font-bold text-lg mb-2">You have logged in on another device.</span>
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => window.location.href = "/login"}>Go to Login</button>
            </div>
          </div>
        )}
        <header className="w-full max-w-2xl text-center mb-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-yellow-700 mb-2 drop-shadow-lg">UKG Subjects</h1>
        </header>

        <main className="w-full max-w-2xl flex flex-col gap-6">
          {!selectedSubject && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {subjects.map((subject) => (
                  <button
                    key={subject.key}
                    className="bg-white hover:bg-yellow-200 text-yellow-700 font-bold py-6 rounded-xl shadow-lg text-lg border-2 border-yellow-300 transition-colors flex items-center justify-center"
                    onClick={() => setSelectedSubject(subject.key)}
                  >
                    <span>{subject.label}</span>
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-center">
                <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-600 text-lg shadow transition-colors font-semibold">
                  <span className="text-2xl">&#8592;</span>
                  <span>BACK</span>
                </Link>
              </div>
            </>
          )}

          {/* MATH */}
          {selectedSubject === "math" && (
            <div className="flex flex-col gap-4 items-center">
              {!activeTask && (
                <>
                  <button className="w-full bg-pink-200 hover:bg-pink-300 text-pink-800 font-bold py-3 rounded-xl shadow transition-colors text-lg" onClick={() => setActiveTask("beforeAfter")}>
                    Before/After Number
                  </button>
                  <button className="w-full bg-yellow-200 hover:bg-yellow-300 text-yellow-800 font-bold py-3 rounded-xl shadow transition-colors text-lg" onClick={() => setActiveTask("ascdesc")}>
                    Ascending/Descending
                  </button>
                  <button className="w-full bg-red-200 hover:bg-red-300 text-red-800 font-bold py-3 rounded-xl shadow transition-colors text-lg" onClick={() => setActiveTask("findNumber")}>
                    Find My Number
                  </button>
                  <button className="w-full bg-green-200 hover:bg-green-300 text-green-800 font-bold py-3 rounded-xl shadow transition-colors text-lg" onClick={() => setActiveTask("addition")}>
                    Addition (Drag answer)
                  </button>
                  <button className="w-full bg-indigo-200 hover:bg-indigo-300 text-indigo-800 font-bold py-3 rounded-xl shadow transition-colors text-lg" onClick={() => setActiveTask("subtraction")}>
                    Subtraction (Drag answer)
                  </button>
                  <button className="w-full bg-orange-200 hover:bg-orange-300 text-orange-800 font-bold py-3 rounded-xl shadow transition-colors text-lg" onClick={() => setActiveTask("magicBox10")}>
                    Magic Box of 10
                  </button>
                </>
              )}

              <div className="w-full mt-2 lg:mt-0 relative">
                {activeTask === "beforeAfter" && <BeforeAfterNumberTask />}
                {activeTask === "ascdesc" && <AscendingDescendingTask />}
                {activeTask === "findNumber" && <FindMyNumberTask />}
                {activeTask === "addition" && <AdditionTask />}
                {activeTask === "subtraction" && <SubtractionTask />}
                {activeTask === "magicBox10" && <MagicBoxOf10 />}
                {/* block interaction if locked */}
                {activeTask && !isUnlocked && <LockedOverlay />}
              </div>

              <button className="mt-2 flex items-center gap-2 justify-center px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-600 text-lg shadow transition-colors font-semibold" onClick={() => { setSelectedSubject(null); setActiveTask(null); }}>
                <span className="text-2xl">&#8592;</span>
                <span>BACK</span>
              </button>
            </div>
          )}

          {/* ENGLISH */}
          {selectedSubject === "english" && (
            <div className="flex flex-col gap-4 items-center">
              <h2 className="text-2xl font-bold text-pink-700 mb-2">English Tasks</h2>
              <button className="w-full bg-blue-200 hover:bg-blue-300 text-blue-800 font-bold py-3 rounded-xl shadow transition-colors text-lg" onClick={() => setActiveTask("numberSpelling")}>
                Learn 1 to 100
              </button>

              <div className="w-full mt-6 relative">
                {activeTask === "numberSpelling" && <EnglishNumberSpellingTask />}
                {activeTask === "numberSpelling" && !isUnlocked && <LockedOverlay />}
              </div>

              <button className="mt-4 flex items-center gap-2 justify-center px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-600 text-lg shadow transition-colors font-semibold" onClick={() => { setSelectedSubject(null); setActiveTask(null); }}>
                <span className="text-2xl">&#8592;</span>
                <span>BACK</span>
              </button>
            </div>
          )}

          {/* GK & PUZZLE - locked preview */}
          {selectedSubject && selectedSubject !== "math" && selectedSubject !== "english" && (
            <div className="flex flex-col gap-4 items-center">
              <h2 className="text-2xl font-bold text-pink-700 mb-2">{subjects.find((s) => s.key === selectedSubject)?.label} Tasks</h2>
              <button className="w-full bg-gray-200 text-gray-600 font-bold py-3 rounded-xl shadow transition-colors text-lg" onClick={() => setActiveTask("lockedTask")}>
                Locked Task
              </button>
              <div className="w-full mt-6 relative">
                {activeTask === "lockedTask" && !isUnlocked && <LockedOverlay />}
                {isUnlocked && activeTask === "lockedTask" && <div className="text-center text-gray-500 p-6 rounded-lg">Coming soon!</div>}
              </div>

              <button className="mt-4 flex items-center justify-center w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-600 text-2xl shadow transition-colors" onClick={() => { setSelectedSubject(null); setActiveTask(null); }}>
                &#8592;
              </button>
            </div>
          )}
        </main>

        <footer className="mt-12 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} EduLearn Play Factory. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default UKGPage;
