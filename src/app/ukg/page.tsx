"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useMediaQuery } from 'react-responsive';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  useSortable,
  rectSortingStrategy,
  arrayMove,
  SortableContext
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
export type SortableNumberProps = {
  id: number;
  mode: 'asc' | 'desc';
  isFirst: boolean;
  isLast: boolean;
  mobileStyle?: React.CSSProperties;
  completed?: boolean;
};

export function SortableNumber({ id, mode, isFirst, isLast, mobileStyle, completed = false }: SortableNumberProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver
  } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    minWidth: 60,
    zIndex: isDragging ? 10 : 1,
    ...(typeof mobileStyle === 'object' ? mobileStyle : {}),
  };
  return (
    <div ref={setNodeRef} style={style} className="flex flex-col items-center">
      {isFirst && (
        <span className="text-xs text-green-700 font-bold mb-1 whitespace-nowrap">
          {mode === 'asc' ? 'Smaller' : 'Larger'}
        </span>

      )}
      <button
        className={`font-extrabold text-2xl rounded-full shadow-lg px-8 py-6 border-4 cursor-grab transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          completed ? 'bg-green-600 text-white border-green-400' : 'bg-red-600 text-white border-red-400'
        }`}
        style={{ width: '100%', fontSize: '2rem', touchAction: 'none', WebkitUserSelect: 'none' }}
        aria-label={`Drag number ${id}`}
        {...attributes}
        {...listeners}
      >
        {id}
      </button>
      {isLast && (
        <span className="text-xs text-blue-700 font-bold mt-1 whitespace-nowrap">
          {mode === 'asc' ? 'Larger' : 'Smaller'}
        </span>
      )}
    </div>
  );
}

// Ascending/Descending Task
function AscendingDescendingTask() {
  const [mode, setMode] = useState<'asc' | 'desc'>('asc');
  const [numbers, setNumbers] = useState<number[]>(() => {
    const arr = Array.from({ length: 5 }, () => Math.floor(Math.random() * 90) + 10);
    return arr.sort(() => Math.random() - 0.5);
  });
  const [result, setResult] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  // Responsive sensor selection
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1024 });
  const sensors = useSensors(
    useSensor(isTabletOrMobile ? TouchSensor : PointerSensor, {
      activationConstraint: isTabletOrMobile
        ? { delay: 0, tolerance: 0 }
        : { distance: 0 },
    })
  );

  // Prevent page scrolling while dragging on touch devices
  let touchMoveHandler: ((e: TouchEvent) => void) | null = null;
  function disablePageScroll() {
    try {
      document.documentElement.style.touchAction = 'none';
      document.body.style.overflow = 'hidden';
      touchMoveHandler = (e: TouchEvent) => e.preventDefault();
      document.addEventListener('touchmove', touchMoveHandler, { passive: false });
    } catch {
      // ignore when document not available
    }
  }
  function enablePageScroll() {
    try {
      document.documentElement.style.touchAction = '';
      document.body.style.overflow = '';
      if (touchMoveHandler) {
        document.removeEventListener('touchmove', touchMoveHandler as EventListener);
        touchMoveHandler = null;
      }
    } catch {
      // ignore when document not available
    }
  }

  function handleDragStart() {
    // disable page scroll when a drag begins (especially for touch/tablet)
    disablePageScroll();
  }

  function handleDragEnd(event: import("@dnd-kit/core").DragEndEvent) {
    // re-enable page scroll when dragging ends
    enablePageScroll();
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = numbers.findIndex(n => n === Number(active.id));
      const newIndex = numbers.findIndex(n => n === Number(over.id));
      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(numbers, oldIndex, newIndex);
        setNumbers(reordered);
        setTimeout(() => {
          const correct = [...reordered].sort((a, b) => mode === 'asc' ? a - b : b - a);
          if (reordered.every((n, i) => n === correct[i])) {
            setResult('🎉 Good job!');
            setCompleted(true);
            setTimeout(() => setResult(null), 2000);
          } else {
            setResult(null);
            setCompleted(false);
          }
        }, 200);
      }
    }
  }
  function handleDragCancel() {
    // re-enable page scroll when drag is cancelled
    enablePageScroll();
  }
  function nextTask() {
    setNumbers(Array.from({ length: 5 }, () => Math.floor(Math.random() * 90) + 10).sort(() => Math.random() - 0.5));
    setResult(null);
    setMode(Math.random() > 0.5 ? 'asc' : 'desc');
    setCompleted(false);
  }
  return (
    <div className="w-full flex flex-col items-center bg-gradient-to-br from-pink-100 via-yellow-100 to-blue-100 rounded-xl p-4 shadow-md">
      <div className="mb-2 flex flex-col items-center gap-1">
        <span className="text-lg text-gray-700 font-bold">UKG Subjects</span>
        {/* Removed Ascending/Descending text as per user request */}
  <span className="text-xl text-blue-700">Arrange in {mode === 'asc' ? <span className="font-extrabold">Ascending</span> : <span className="font-extrabold">Descending</span>} Order</span>
  {/* Arrow: up/down on mobile, right/left on desktop */}
  <span className="text-2xl hidden lg:inline">{mode === 'asc' ? '➡️' : '⬅️'}</span>
  <span className="text-2xl lg:hidden">{mode === 'asc' ? '⬆️' : '⬇️'}</span>
      </div>
      <div className="w-full mb-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
          <SortableContext items={numbers} strategy={rectSortingStrategy}>
            <div className="flex flex-col lg:flex-row gap-4 justify-center items-center w-full lg:flex-nowrap">
              {numbers.map((num, idx) => (
                // wrap each sortable item so desktop uses a fixed width (single row) while mobile stays full-width
                <div key={num} className={isTabletOrMobile ? 'w-full flex justify-center' : 'px-2'} style={isTabletOrMobile ? undefined : { width: 120 }}>
                  <SortableNumber
                    id={num}
                    mode={mode}
                    isFirst={idx === 0}
                    isLast={idx === numbers.length - 1}
                    mobileStyle={isTabletOrMobile ? { width: '90%', minHeight: 60 } : undefined}
                    completed={completed}
                  />
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
      <button
        onClick={nextTask}
        className="bg-blue-400 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-lg shadow transition-colors mb-2"
      >
        Next
      </button>
      {result && result.startsWith('🎉') && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-90 rounded-2xl shadow-2xl p-8 flex flex-col items-center animate-bounce">
            <span className="text-6xl">🎉</span>
            <span className="text-3xl font-extrabold text-green-600 mb-2">Congratulations!</span>
            <span className="text-xl text-yellow-700">You arranged the numbers correctly!</span>
          </div>
        </div>
      )}
      {result && !result.startsWith('🎉') && (
        <div className="text-xl font-semibold mt-2 text-red-600">{result}</div>
      )}
      <div className="mt-2 text-sm text-gray-500">Tip: Drag numbers to arrange from small to big (ascending) or big to small (descending).</div>
    </div>
  );
}
// (duplicate imports removed - core imports are declared at the top of the file)

// Number spelling data
const numberSpellings: { [key: number]: string } = {
  1: "ONE", 2: "TWO", 3: "THREE", 4: "FOUR", 5: "FIVE", 6: "SIX", 7: "SEVEN", 8: "EIGHT", 9: "NINE", 10: "TEN",
  11: "ELEVEN", 12: "TWELVE", 13: "THIRTEEN", 14: "FOURTEEN", 15: "FIFTEEN", 16: "SIXTEEN", 17: "SEVENTEEN", 18: "EIGHTEEN", 19: "NINETEEN", 20: "TWENTY",
  21: "TWENTY ONE", 22: "TWENTY TWO", 23: "TWENTY THREE", 24: "TWENTY FOUR", 25: "TWENTY FIVE", 26: "TWENTY SIX", 27: "TWENTY SEVEN", 28: "TWENTY EIGHT", 29: "TWENTY NINE", 30: "THIRTY",
  31: "THIRTY ONE", 32: "THIRTY TWO", 33: "THIRTY THREE", 34: "THIRTY FOUR", 35: "THIRTY FIVE", 36: "THIRTY SIX", 37: "THIRTY SEVEN", 38: "THIRTY EIGHT", 39: "THIRTY NINE", 40: "FORTY",
  41: "FORTY ONE", 42: "FORTY TWO", 43: "FORTY THREE", 44: "FORTY FOUR", 45: "FORTY FIVE", 46: "FORTY SIX", 47: "FORTY SEVEN", 48: "FORTY EIGHT", 49: "FORTY NINE", 50: "FIFTY",
  51: "FIFTY ONE", 52: "FIFTY TWO", 53: "FIFTY THREE", 54: "FIFTY FOUR", 55: "FIFTY FIVE", 56: "FIFTY SIX", 57: "FIFTY SEVEN", 58: "FIFTY EIGHT", 59: "FIFTY NINE", 60: "SIXTY",
  61: "SIXTY ONE", 62: "SIXTY TWO", 63: "SIXTY THREE", 64: "SIXTY FOUR", 65: "SIXTY FIVE", 66: "SIXTY SIX", 67: "SIXTY SEVEN", 68: "SIXTY EIGHT", 69: "SIXTY NINE", 70: "SEVENTY",
  71: "SEVENTY ONE", 72: "SEVENTY TWO", 73: "SEVENTY THREE", 74: "SEVENTY FOUR", 75: "SEVENTY FIVE", 76: "SEVENTY SIX", 77: "SEVENTY SEVEN", 78: "SEVENTY EIGHT", 79: "SEVENTY NINE", 80: "EIGHTY",
  81: "EIGHTY ONE", 82: "EIGHTY TWO", 83: "EIGHTY THREE", 84: "EIGHTY FOUR", 85: "EIGHTY FIVE", 86: "EIGHTY SIX", 87: "EIGHTY SEVEN", 88: "EIGHTY EIGHT", 89: "EIGHTY NINE", 90: "NINETY",
  91: "NINETY ONE", 92: "NINETY TWO", 93: "NINETY THREE", 94: "NINETY FOUR", 95: "NINETY FIVE", 96: "NINETY SIX", 97: "NINETY SEVEN", 98: "NINETY EIGHT", 99: "NINETY NINE", 100: "ONE HUNDRED"
  // Add more as needed
};

function EnglishNumberSpellingTask() {
  const [page, setPage] = useState(1);
  const [selectedNumbers, setSelectedNumbers] = useState<Array<{ num: number, spellingIndex: number }>>([]);

  const numbers = Array.from({ length: 5 }, (_, i) => (page - 1) * 5 + i + 1);

  useEffect(() => {
    // For each selected number, animate its spelling
    selectedNumbers.forEach(({ num, spellingIndex }) => {
      const spelling = numberSpellings[num];
      if (spellingIndex < spelling.length) {
        const timer = setTimeout(() => {
          setSelectedNumbers(current => current.map(item =>
            item.num === num && item.spellingIndex === spellingIndex
              ? { ...item, spellingIndex: item.spellingIndex + 1 }
              : item
          ));
          // Play tick sound
          const audio = new Audio("https://www.soundjay.com/buttons/sounds/button-16.mp3");
          audio.play().catch(() => {});
        }, 400);
        return () => clearTimeout(timer);
      }
    });
  }, [selectedNumbers]);

  function handleNumberClick(num: number) {
    // If already selected, do nothing
    if (selectedNumbers.some(item => item.num === num)) return;
    setSelectedNumbers(current => [...current, { num, spellingIndex: 0 }]);
  }

  function handleNextPage() {
  setPage(page + 1);
  setSelectedNumbers([]);
  }
  function handlePrevPage() {
    if (page > 1) {
      setPage(page - 1);
      setSelectedNumbers([]);
    }
  }

  return (
    <div className="w-full flex flex-col items-center bg-white rounded-xl p-4 shadow-md">
      <h2 className="text-xl font-bold text-blue-700 mb-2">Learn 1 to 100</h2>
      <div className="flex w-full gap-8">
        {/* Number list with spelling beside */}
        <div className="flex flex-col gap-2 items-end">
          {numbers.map(num => {
            const selected = selectedNumbers.find(item => item.num === num);
            const spelling = numberSpellings[num];
            return (
              <div key={num} className="flex items-center gap-4 w-full">
                <button
                  className={`bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold px-4 py-2 rounded-xl shadow text-lg border-2 ${selected ? "border-blue-500" : "border-transparent"}`}
                  onClick={() => handleNumberClick(num)}
                  disabled={!numberSpellings[num]}
                  style={{ minWidth: 60 }}
                >
                  {num}
                </button>
                {/* Spelling animation beside number, in same row */}
                {selected && (
                  <div className="flex gap-2 text-3xl font-extrabold text-pink-600 items-center">
                    {spelling.split("").slice(0, selected.spellingIndex).map((char, idx) => (
                      <span key={idx} className="animate-pulse drop-shadow-lg">{char}</span>
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
          className="bg-yellow-300 hover:bg-yellow-400 text-white font-bold px-4 py-2 rounded-lg shadow"
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          Prev
        </button>
        <button
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-4 py-2 rounded-lg shadow"
          onClick={handleNextPage}
          disabled={numbers[numbers.length - 1] >= 100}
        >
          Next
        </button>
      </div>
      <div className="mt-2 text-sm text-gray-500">Click a number to see its spelling animated!</div>
    </div>
  );
}
// ...existing code...
function getChoices(correct: number) {
  const wrongChoices = [
    correct + (Math.random() > 0.5 ? 2 : -2),
    correct + (Math.random() > 0.5 ? 3 : -3),
  ];
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
        Select the <span className={mode === "before" ? "font-extrabold text-pink-500" : "font-extrabold text-blue-500"}>{mode.toUpperCase()}</span> number!
      </div>
      <div className="flex items-center justify-center gap-8 w-full">
        {/* Before choices */}
        <div className="flex flex-col gap-2 items-end">
          {mode === "before" && choices.map((choice, idx) => (
            <button
              key={idx}
              className={`bg-pink-200 hover:bg-pink-300 text-pink-800 font-bold px-4 py-2 rounded-xl shadow transition-colors text-lg border-2 ${selected === choice ? (choice === correct ? 'border-green-500' : 'border-red-500') : 'border-transparent'}`}
              onClick={() => checkAnswer(choice)}
              disabled={selected === correct}
            >
              {choice}
            </button>
          ))}
        </div>
        {/* Number box */}
        <div className="bg-yellow-200 text-yellow-800 font-extrabold text-4xl rounded-2xl shadow-lg px-8 py-6 border-4 border-yellow-400">
          {number}
        </div>
        {/* After choices */}
        <div className="flex flex-col gap-2 items-start">
          {mode === "after" && choices.map((choice, idx) => (
            <button
              key={idx}
              className={`bg-blue-200 hover:bg-blue-300 text-blue-800 font-bold px-4 py-2 rounded-xl shadow transition-colors text-lg border-2 ${selected === choice ? (choice === correct ? 'border-green-500' : 'border-red-500') : 'border-transparent'}`}
              onClick={() => checkAnswer(choice)}
              disabled={selected === correct}
            >
              {choice}
            </button>
          ))}
        </div>
      </div>
      {result && (
        <div className={`text-xl font-semibold mt-4 ${result.startsWith('🎉') ? 'text-green-600' : 'text-red-600'}`}>{result}</div>
      )}
      <button
        onClick={nextTask}
        className="mt-4 bg-yellow-400 text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-yellow-500 transition-colors"
      >
        Next
      </button>
      <div className="mt-2 text-sm text-gray-500">Tip: Before number is one less, after number is one more!</div>
    </div>
  );
}

// Find My Number Task
function ArrowDraggable({ running = true }: { running?: boolean }) {
  // Auto-oscillating arrow: moves left and right continuously to indicate dragging direction.
  const [x, setX] = React.useState(0);

  useEffect(() => {
    if (!running) {
      // stop and reset position
      setX(0);
      return;
    }
    let toggle = false;
    const id = setInterval(() => {
      toggle = !toggle;
      // move left by 26px, then back to 0
      setX(toggle ? -26 : 0);
    }, 600);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div className="inline-block select-none" style={{ touchAction: 'none' }}>
      <div className="text-4xl font-extrabold text-green-600 transition-transform duration-300"
        style={{ transform: `translateX(${x}px)` }}
      >
        &#8592;
      </div>
    </div>
  );
}

function FindMyNumberTask() {
  const total = 5;
  const [leftNumbers, setLeftNumbers] = useState<number[]>(() => {
    const arr = Array.from({ length: total }, () => Math.floor(Math.random() * 90) + 10);
    return arr;
  });
  const [rightItems, setRightItems] = useState<Array<{ id: string; word: string }>>(() => shuffleArray(leftNumbers.map((n, i) => ({ id: `r-${i}`, word: numberSpellings[n] || n.toString() }))));
  const [matched, setMatched] = useState<Record<number, boolean>>({});
  const [result, setResult] = useState<string | null>(null);

  // helper
  function shuffleArray<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

  const isTabletOrMobile = useMediaQuery({ maxWidth: 1024 });
  const sensors = useSensors(useSensor(isTabletOrMobile ? TouchSensor : PointerSensor, { activationConstraint: { distance: 0 } }));

  // page scroll prevention while dragging
  let touchMoveHandler: ((e: TouchEvent) => void) | null = null;
  function disablePageScroll() {
    try {
      document.documentElement.style.touchAction = 'none';
      document.body.style.overflow = 'hidden';
      touchMoveHandler = (e: TouchEvent) => e.preventDefault();
      document.addEventListener('touchmove', touchMoveHandler, { passive: false });
    } catch {}
  }
  function enablePageScroll() {
    try {
      document.documentElement.style.touchAction = '';
      document.body.style.overflow = '';
      if (touchMoveHandler) {
        document.removeEventListener('touchmove', touchMoveHandler as EventListener);
        touchMoveHandler = null;
      }
    } catch {}
  }

  useEffect(() => {
    // whenever leftNumbers changes, rebuild rightItems (with stable ids) and shuffle
    setRightItems(shuffleArray(leftNumbers.map((n, i) => ({ id: `r-${i}`, word: numberSpellings[n] || n.toString() }))));
  }, [leftNumbers]);

  function reset() {
    const arr = Array.from({ length: total }, () => Math.floor(Math.random() * 90) + 10);
    setLeftNumbers(arr);
    setRightItems(shuffleArray(arr.map((n, i) => ({ id: `r-${i}`, word: numberSpellings[n] || n.toString() }))));
    setMatched({});
    setResult(null);
  }

  function handleDragStart() { disablePageScroll(); }
  function handleDragEnd() { enablePageScroll(); }

  function handleDrop(activeId: string, overId: string | null) {
    if (!overId) return;
    // activeId is like 'r-2'
    const item = rightItems.find(it => it.id === activeId);
    if (!item) return;
    const word = item.word;
    const targetNumber = Number(overId);
    const correctWord = numberSpellings[targetNumber] || targetNumber.toString();
    if (word === correctWord) {
      setMatched(prev => ({ ...prev, [targetNumber]: true }));
      setRightItems(prev => prev.filter(it => it.id !== activeId));
      setTimeout(() => {
        setMatched(current => {
          const allMatched = leftNumbers.every((_, idx) => Boolean(current[leftNumbers[idx]]));
          if (allMatched) { setResult('🎉 Good job!'); setTimeout(() => setResult(null), 2000); }
          return current;
        });
      }, 50);
    }
  }

  // draggable word using dnd-kit
  function DraggableWordDnd({ id, word }: { id: string; word: string }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      opacity: isDragging ? 0.6 : 1,
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
      <div ref={setNodeRef} className={`h-16 flex items-center justify-center p-3 rounded-lg border-2 ${matched[num] ? 'bg-green-600 text-white border-green-500' : 'bg-red-600 text-white border-red-400'} ${isOver ? 'ring-4 ring-sky-300' : ''}`}>
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

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={(e) => { handleDragEnd(); const activeId = String(e.active.id); const overId = e.over?.id ? String(e.over.id) : null; handleDrop(activeId, overId); }} onDragCancel={handleDragEnd}>
        <div className="flex w-full gap-6">
          <div className="flex flex-col gap-3 w-1/2">
            {leftNumbers.map(num => (<NumberTile key={num} num={num} />))}
          </div>
            <div className="flex flex-col gap-3 w-1/2">
            {rightItems.map(item => (<DraggableWordDnd key={item.id} id={item.id} word={item.word} />))}
          </div>
        </div>
      </DndContext>

      <div className="flex gap-4 mt-4">
        <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-4 py-2 rounded-lg" onClick={reset}>Reset</button>
      </div>

      {result && result.startsWith('🎉') && (
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

function DraggableWord({ word, onDropOnNumber, onDragStartNative, onDragEndNative }: { word: string; onDropOnNumber: (w: string, n: number) => void; onDragStartNative?: () => void; onDragEndNative?: () => void }) {
  // for simplicity, we'll implement native drag events
  function handleDragStart(e: React.DragEvent) {
    try { onDragStartNative && onDragStartNative(); } catch {}
    e.dataTransfer.setData('text/plain', word);
  }
  function handleDragEnd(e: React.DragEvent) {
    try { onDragEndNative && onDragEndNative(); } catch {}
  }
  return (
    <div draggable className="h-16 w-full flex items-center justify-center p-2 rounded-lg bg-red-600 text-white border-2 border-red-400 cursor-grab" onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="text-lg font-bold text-center w-full">{word}</div>
    </div>
  );
}

function UKGPage() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const subjects = [
    { key: "math", label: "Math" },
    { key: "english", label: "English" },
    { key: "gk", label: "GK" },
    { key: "puzzle", label: "Puzzle" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 flex flex-col items-center justify-center p-4 sm:p-8">
      <header className="w-full max-w-2xl text-center mb-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-yellow-700 mb-2 drop-shadow-lg">UKG Subjects</h1>
      </header>
      <main className="w-full max-w-2xl flex flex-col gap-6">
        {/* Subject cards */}
        {!selectedSubject && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {subjects.map(subject => (
                <button
                  key={subject.key}
                  className="bg-white hover:bg-yellow-200 text-yellow-700 font-bold py-6 rounded-xl shadow-lg text-lg border-2 border-yellow-300 transition-colors"
                  onClick={() => setSelectedSubject(subject.key)}
                >
                  {subject.label}
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

        {/* Math tasks */}
        {selectedSubject === "math" && (
          <div className="flex flex-col gap-4 items-center">
            {/* Only show task heading when a task is active */}
            {activeTask === "beforeAfter" && (
              <h2 className="text-2xl font-extrabold text-pink-700 mb-2">Before/After Number</h2>
            )}
            {/** Ascending/Descending header removed per request; task UI still shows inside the task area */}
            {/* Show task buttons only if no task is active */}
            {!activeTask && (
              <>
                <button
                  className={`w-full bg-pink-200 hover:bg-pink-300 text-pink-800 font-bold py-3 rounded-xl shadow transition-colors text-lg`}
                  onClick={() => setActiveTask("beforeAfter")}
                >
                  Before/After Number
                </button>
                <button
                  className={`w-full bg-yellow-200 hover:bg-yellow-300 text-yellow-800 font-bold py-3 rounded-xl shadow transition-colors text-lg`}
                  onClick={() => setActiveTask("ascdesc")}
                >
                  Ascending/Descending
                </button>
                <button
                  className={`w-full bg-red-200 hover:bg-red-300 text-red-800 font-bold py-3 rounded-xl shadow transition-colors text-lg`}
                  onClick={() => setActiveTask("findNumber")}
                >
                  Find My Number
                </button>
              </>
            )}
            <div className="w-full mt-2 lg:mt-0">
              {activeTask === "beforeAfter" && <BeforeAfterNumberTask />}
              {activeTask === "ascdesc" && <AscendingDescendingTask />}
              {activeTask === "findNumber" && <FindMyNumberTask />}
            </div>
            <button
              className="mt-2 flex items-center gap-2 justify-center px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-600 text-lg shadow transition-colors font-semibold"
              title="Back"
              onClick={() => { setSelectedSubject(null); setActiveTask(null); }}
            >
              <span className="text-2xl">&#8592;</span>
              <span>BACK</span>
            </button>
          </div>
        )}

        {/* English tasks */}
        {selectedSubject === "english" && (
          <div className="flex flex-col gap-4 items-center">
            <h2 className="text-2xl font-bold text-pink-700 mb-2">English Tasks</h2>
            <button
              className={`w-full bg-blue-200 hover:bg-blue-300 text-blue-800 font-bold py-3 rounded-xl shadow transition-colors text-lg`}
              onClick={() => setActiveTask("numberSpelling")}
            >
              Learn 1 to 100
            </button>
            <div className="w-full mt-6">
              {activeTask === "numberSpelling" && <EnglishNumberSpellingTask />}
            </div>
            <button
              className="mt-4 flex items-center gap-2 justify-center px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-600 text-lg shadow transition-colors font-semibold"
              title="Back"
              onClick={() => { setSelectedSubject(null); setActiveTask(null); }}
            >
              <span className="text-2xl">&#8592;</span>
              <span>BACK</span>
            </button>
          </div>
        )}

        {/* Other subjects placeholder */}
        {selectedSubject && selectedSubject !== "math" && (
          <div className="flex flex-col gap-4 items-center">
            <h2 className="text-2xl font-bold text-pink-700 mb-2">{subjects.find(s => s.key === selectedSubject)?.label} Tasks</h2>
            <div className="w-full mt-6 text-gray-500 text-center">Coming soon!</div>
            <button
              className="mt-4 flex items-center justify-center w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-600 text-2xl shadow transition-colors"
              title="Back to Subjects"
              onClick={() => { setSelectedSubject(null); setActiveTask(null); }}
            >
              &#8592;
            </button>
          </div>
        )}
      </main>
      <footer className="mt-12 text-center text-sm text-gray-500">
  &copy; {new Date().getFullYear()} EduLearn Play Factory. All rights reserved.
      </footer>
    </div>
  );
}
export default UKGPage;








