import React, { useState, useRef } from "react";
import { DndContext, useDraggable, useDroppable, closestCenter } from "@dnd-kit/core";

function getRandomBalloons() {
  // 10 balloons, numbers 1-9, allow repetitions
  const nums = [];
  for (let i = 0; i < 10; i++) {
    nums.push(Math.floor(Math.random() * 9) + 1);
  }
  return nums;
}

function getRandomBoxValue() {
  // Random integer between 10 and 15
  return Math.floor(Math.random() * 6) + 10;
}

function MagicBoxOf10() {
  const [boxValue, setBoxValue] = useState(getRandomBoxValue());
  const [balloons, setBalloons] = useState(getRandomBalloons());
  const [selected, setSelected] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<string>("");
  const [sparkle, setSparkle] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const resetTimerRef = useRef<number | null>(null);

  // Automatically check for correct sum whenever selected changes
  React.useEffect(() => {
    if (selected.length === 0 || result) return;
    const sum = selected.reduce((a,b)=>a+balloons[b],0);
    if (sum === boxValue) {
      setResult('🎉 Congratulations!');
      setSparkle(true);
      setFeedback('');
      if (resetTimerRef.current) { clearTimeout(resetTimerRef.current); resetTimerRef.current = null; }
      resetTimerRef.current = window.setTimeout(() => { resetGame(); }, 2000) as unknown as number;
    }
  }, [selected, boxValue, balloons, result]);

  function resetGame() {
    setSelected([]);
    setBoxValue(getRandomBoxValue());
    setBalloons(getRandomBalloons());
    setFeedback("");
    setResult(null);
    setSparkle(false);
    if (resetTimerRef.current) { clearTimeout(resetTimerRef.current); resetTimerRef.current = null; }
  }

  function burstBalloon(idx:number) {
    if (selected.includes(idx) || result) return;
    setSelected([...selected, idx]);
    setFeedback("");
  }

  function checkAnswer() {
    const sum = selected.reduce((a,b)=>a+balloons[b],0);
    if (sum !== boxValue) {
      setFeedback('❌ Try again!');
      setSparkle(false);
      setResult(null);
      setTimeout(()=>setFeedback(''), 1200);
    }
  }

  function removeSelected(idx:number) {
    setSelected(selected.filter(i => i !== idx));
    setFeedback("");
  }

  // Calculate current sum
  const currentSum = selected.reduce((a,b)=>a+balloons[b],0);

  return (
    <div style={{textAlign:"center", padding:"2rem"}}>
      <h2 className="text-2xl font-bold mb-2">🪄 Magic Number Addition</h2>
      <div style={{fontSize:40, fontWeight:700, color:'#0af', marginBottom:8}}>{boxValue}</div>
      <div style={{display:'flex', flexDirection:'column', alignItems:'center', margin:'0 auto', width:'100%'}}>
        <div>
          <div style={{width:260, minHeight:70, background:'#ffe', borderRadius:32, boxShadow:sparkle?"0 0 40px #0ff" : "0 0 10px #aaa", display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, position:'relative', padding:'12px 0', margin:'0 auto'}}>
            <div style={{width:'100%', height:'100%', borderRadius:32, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative'}}>
              <div style={{fontSize:32, fontWeight:600, color:'#333', minHeight:40}}>
                {selected.length ? selected.map(idx=>balloons[idx]).join(' + ') : <span style={{color:'#bbb'}}>Select numbers…</span>}
              </div>
              {sparkle && <div style={{position:"absolute", top:0, left:0, width:"100%", height:"100%", pointerEvents:"none"}}>
                <span style={{fontSize:64, color:"gold"}}>✨</span>
              </div>}
            </div>
          </div>
        </div>
        <button onClick={resetGame} style={{height:36, minWidth:56, background:'#FFD600', color:'#333', fontWeight:600, fontSize:15, border:'none', borderRadius:10, boxShadow:'0 2px 8px #eee', cursor:'pointer', marginTop:16}}>Reset</button>
      </div>
      {/* Show congratulation above sum */}
      {result && (
        <div style={{marginTop:18, marginBottom:-8, fontSize:28, color:'#093', fontWeight:700}}>
          🎉 Congratulations!
        </div>
      )}
      {/* Show current sum below box in red */}
      <div style={{marginTop:12, fontSize:28, color:'#e33', fontWeight:600}}>
        {selected.length ? `= ${currentSum}` : ''}
      </div>
      <div style={{display:"flex", flexWrap:"wrap", justifyContent:"center", gap:16, marginBottom:24, marginTop:32}}>
        {balloons.map((num, idx) => (
          <BalloonBubble key={idx} num={num} burst={selected.includes(idx)} onBurst={()=>burstBalloon(idx)} />
        ))}
      </div>
      {/* Reset button below the box */}
      <div style={{marginTop:18}}>
        <button onClick={resetGame} style={{padding:"0.5rem 1.5rem", fontSize:18}}>Reset</button>
      </div>
      {feedback && !result && (
        <div style={{marginTop:24, fontSize:24, color:feedback.startsWith('❌')?"#e33":"#093"}}>{feedback}</div>
      )}
      <div style={{marginTop:32}}>
        <span style={{fontSize:16, color:'#888'}}>Burst balloons to select numbers. Click selected bubbles to remove. Find a combination that adds up to the magic number above!</span>
      </div>
    </div>
  );
}

function BalloonBubble({num, burst, onBurst}:{num:number, burst:boolean, onBurst:()=>void}) {
  return (
    <div
      style={{
        width:56, height:56, borderRadius:"50%", background:burst?"#ccc":"#f9c", color:burst?"#aaa":"#333", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, boxShadow:burst?"0 0 4px #aaa":"0 0 8px #f9c", opacity:burst?0.5:1, cursor:burst?"not-allowed":"pointer", position:'relative', transition:'all 0.2s'
      }}
      onClick={()=>!burst && onBurst()}
      aria-disabled={burst}
      title={burst?"Already burst":"Burst this balloon"}
    >
      {num}
      {!burst && <span style={{position:'absolute', bottom:-8, left:'50%', transform:'translateX(-50%)', fontSize:18, color:'#f39'}}>🎈</span>}
    </div>
  );
}

function DraggableBubble({num, disabled}:{num:number, disabled:boolean}) {
  const {attributes, listeners, setNodeRef, isDragging} = useDraggable({id:`bubble-${num}`});
  return (
    <div ref={setNodeRef} {...listeners} {...attributes}
      style={{
        width:56, height:56, borderRadius:"50%", background:disabled?"#ccc":"#9cf", color:"#333", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, boxShadow:isDragging?"0 0 16px #09f":"0 0 4px #aaa", opacity:disabled?0.5:1, cursor:disabled?"not-allowed":"grab", marginBottom:8
      }}
      aria-disabled={disabled}
    >{num}</div>
  );
}

function MagicBoxDrop({selected, onRemove, boxValue, sparkle}:{selected:number[], onRemove:(n:number)=>void, boxValue:number, sparkle:boolean}) {
  const {isOver, setNodeRef} = useDroppable({id:'magic-box-drop'});
  return (
    <div ref={setNodeRef}
      style={{
        width:'100%', height:'100%', borderRadius:32, background:isOver?"#e0f7fa":"#ffe", display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative', boxShadow:sparkle?"0 0 40px #0ff" : "0 0 10px #aaa"
      }}>
      <span style={{color:"#09f", fontWeight:700, fontSize:48}}>{boxValue}</span>
      {sparkle && <div style={{position:"absolute", top:0, left:0, width:"100%", height:"100%", pointerEvents:"none"}}>
        <span style={{fontSize:64, color:"gold"}}>✨</span>
      </div>}
      <div style={{marginTop:12, display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center'}}>
        {selected.map(num => (
          <span key={num} style={{background:'#9cf', color:'#333', borderRadius:'50%', width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, boxShadow:'0 0 4px #aaa', cursor:'pointer'}} title="Remove" onClick={()=>onRemove(num)}>{num}</span>
        ))}
      </div>
      {isOver && <span style={{position:'absolute', bottom:8, left:'50%', transform:'translateX(-50%)', color:'#0af', fontWeight:600}}>Drop here!</span>}
    </div>
  );
}

export default MagicBoxOf10;
