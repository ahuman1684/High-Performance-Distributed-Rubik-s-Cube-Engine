import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, Center } from '@react-three/drei';
import * as THREE from 'three';
import { 
  RefreshCw, RotateCcw, Cpu, Info, Grid, History, ArrowLeft, 
  Activity, Layers, Brain, Zap, ChevronRight, Shuffle, Timer, 
  ChevronsRight, Sun, Moon, X
} from 'lucide-react';

// --- THEME CONFIGURATION ---
const THEMES = {
  cyber: {
    bg: "bg-gradient-to-br from-gray-900 via-black to-gray-950",
    text: "text-white",
    panel: "bg-black/80 border-white/10",
    accent: "text-cyan-400",
    highlight: "bg-cyan-500 text-white shadow-lg shadow-cyan-500/50 border-cyan-400 scale-105",
    buttonPrimary: "bg-gradient-to-r from-cyan-500 to-purple-600",
    buttonSecondary: "bg-amber-500",
    glow: "ambient-glow" 
  },
  classic: {
    bg: "bg-slate-100",
    text: "text-slate-800",
    panel: "bg-white/80 border-slate-200 shadow-xl backdrop-blur-xl",
    accent: "text-blue-600",
    highlight: "bg-blue-600 text-white shadow-lg shadow-blue-600/50 border-blue-500 scale-105",
    buttonPrimary: "bg-blue-600 hover:bg-blue-700",
    buttonSecondary: "bg-orange-500 hover:bg-orange-600",
    glow: "hidden" 
  }
};

// --- CONSTANTS & UTILS ---
const COLORS = {
  0: '#FFFFFF', // UP
  1: '#009E60', // LEFT
  2: '#C41E3A', // FRONT
  3: '#0051BA', // RIGHT
  4: '#FF5800', // BACK
  5: '#FFD500', // DOWN
  X: '#1a1a1a'  // Internal
};

const SOLVED_STATE = Array.from({ length: 54 }, (_, i) => Math.floor(i / 9));
const clone = (arr) => [...arr];

const inverseMove = (m) => (m.includes("'") ? m.replace("'", "") : m + "'");

// --- CORE LOGIC ---
const rotateFace = (cube, faceIdx) => {
  const offset = faceIdx * 9; 
  const temp = clone(cube);

  cube[offset + 0] = temp[offset + 6]; 
  cube[offset + 2] = temp[offset + 0]; 
  cube[offset + 8] = temp[offset + 2]; 
  cube[offset + 6] = temp[offset + 8];

  cube[offset + 1] = temp[offset + 3]; 
  cube[offset + 5] = temp[offset + 1]; 
  cube[offset + 7] = temp[offset + 5]; 
  cube[offset + 3] = temp[offset + 7];
};

const applyMove = (cube, move) => {
  const newCube = [...cube];
  switch (move) {
    case 'U': {
      rotateFace(newCube, 0);
      const tU = clone(newCube);
      for (let i = 0; i < 3; i++) {
        newCube[9 + i]  = tU[18 + i];
        newCube[36 + i] = tU[9 + i];
        newCube[27 + i] = tU[36 + i];
        newCube[18 + i] = tU[27 + i];
      }
      break;
    }
    case "U'": 
      return applyMove(applyMove(applyMove(newCube, 'U'), 'U'), 'U');

    case 'L': {
      rotateFace(newCube, 1); 
      const tL = clone(newCube); 
      newCube[18] = tL[0]; 
      newCube[21] = tL[3]; 
      newCube[24] = tL[6]; 
      newCube[45] = tL[18]; 
      newCube[48] = tL[21]; 
      newCube[51] = tL[24]; 
      newCube[44] = tL[45]; 
      newCube[41] = tL[48]; 
      newCube[38] = tL[51]; 
      newCube[0] = tL[44]; 
      newCube[3] = tL[41]; 
      newCube[6] = tL[38]; 
      break;
    }
    case "L'": 
      return applyMove(applyMove(applyMove(newCube, 'L'), 'L'), 'L');

    case 'F': {
      rotateFace(newCube, 2); 
      const tF = clone(newCube); 
      newCube[27] = tF[6]; 
      newCube[30] = tF[7]; 
      newCube[33] = tF[8]; 
      newCube[47] = tF[27]; 
      newCube[46] = tF[30]; 
      newCube[45] = tF[33]; 
      newCube[17] = tF[47]; 
      newCube[14] = tF[46]; 
      newCube[11] = tF[45]; 
      newCube[6] = tF[17]; 
      newCube[7] = tF[14]; 
      newCube[8] = tF[11]; 
      break;
    }
    case "F'": 
      return applyMove(applyMove(applyMove(newCube, 'F'), 'F'), 'F');

    case 'R': {
      rotateFace(newCube, 3); 
      const tR = clone(newCube); 
      newCube[36] = tR[8]; 
      newCube[39] = tR[5]; 
      newCube[42] = tR[2]; 
      newCube[53] = tR[36]; 
      newCube[50] = tR[39]; 
      newCube[47] = tR[42]; 
      newCube[26] = tR[53]; 
      newCube[23] = tR[50]; 
      newCube[20] = tR[47]; 
      newCube[8] = tR[26]; 
      newCube[5] = tR[23]; 
      newCube[2] = tR[20]; 
      break;
    }
    case "R'": 
      return applyMove(applyMove(applyMove(newCube, 'R'), 'R'), 'R');

    case 'B': {
      rotateFace(newCube, 4); 
      const tB = clone(newCube); 
      newCube[9] = tB[2]; 
      newCube[12] = tB[1]; 
      newCube[15] = tB[0]; 
      newCube[51] = tB[9]; 
      newCube[52] = tB[12]; 
      newCube[53] = tB[15]; 
      newCube[35] = tB[51]; 
      newCube[32] = tB[52]; 
      newCube[29] = tB[53]; 
      newCube[2] = tB[35]; 
      newCube[1] = tB[32]; 
      newCube[0] = tB[29]; 
      break;
    }
    case "B'": 
      return applyMove(applyMove(applyMove(newCube, 'B'), 'B'), 'B');

    case 'D': {
      rotateFace(newCube, 5); 
      const tD = clone(newCube); 
      newCube[33] = tD[24]; 
      newCube[34] = tD[25]; 
      newCube[35] = tD[26]; 
      newCube[42] = tD[33]; 
      newCube[43] = tD[34]; 
      newCube[44] = tD[35]; 
      newCube[15] = tD[42]; 
      newCube[16] = tD[43]; 
      newCube[17] = tD[44]; 
      newCube[24] = tD[15]; 
      newCube[25] = tD[16]; 
      newCube[26] = tD[17]; 
      break;
    }
    case "D'": 
      return applyMove(applyMove(applyMove(newCube, 'D'), 'D'), 'D');
  }
  return newCube;
};

// --- 3D COMPONENTS ---
const Cubelet = ({ position, colors }) => {
  const geometry = new THREE.BoxGeometry(0.95, 0.95, 0.95);
  const edges = new THREE.EdgesGeometry(geometry);
  return (
    <group position={position}>
      <mesh geometry={geometry}>
        {colors.map((c, i) => (
          <meshStandardMaterial
            key={i}
            attach={`material-${i}`}
            color={c || COLORS['X']}
            roughness={0.1}
            metalness={0.0}
          />
        ))}
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#000000" linewidth={2} transparent opacity={0.5} />
      </lineSegments>
    </group>
  );
};

const RubiksModel = ({ cubeState, isAnimating }) => {
  const groupRef = useRef();
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        isAnimating ? 0.05 : 0,
        0.1
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        isAnimating ? 0.05 : 0,
        0.1
      );
    }
  });

  const cubelets = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const materials = Array(6).fill(COLORS['X']);

        if (y === 1) {
          materials[2] = COLORS[cubeState[(z + 1) * 3 + (x + 1)]];
        }
        if (y === -1) {
          materials[3] = COLORS[cubeState[45 + (2 - (z + 1)) * 3 + (x + 1)]];
        }
        if (x === -1) {
          materials[1] = COLORS[cubeState[9 + (1 - y) * 3 + (z + 1)]];
        }
        if (x === 1) {
          materials[0] = COLORS[cubeState[27 + (1 - y) * 3 + (2 - (z + 1))]];
        }
        if (z === 1) {
          materials[4] = COLORS[cubeState[18 + (1 - y) * 3 + (x + 1)]];
        }
        if (z === -1) {
          materials[5] = COLORS[cubeState[36 + (1 - y) * 3 + (2 - (x + 1))]];
        }

        cubelets.push(
          <Cubelet key={`${x}-${y}-${z}`} position={[x, y, z]} colors={materials} />
        );
      }
    }
  }
  return <group ref={groupRef}>{cubelets}</group>;
};

// --- MAIN APP ---
const App = () => {
  const [cube, setCube] = useState(SOLVED_STATE);
  const [history, setHistory] = useState([]); 
  const [isSolving, setIsSolving] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [solution, setSolution] = useState("");
  const [metrics, setMetrics] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showHistory, setShowHistory] = useState(false); 
  const [themeMode, setThemeMode] = useState('cyber');
  const [error, setError] = useState("");
  const [moveTrigger, setMoveTrigger] = useState(0); 
  const [activeMove, setActiveMove] = useState(null);
  const [playIndex, setPlayIndex] = useState(null);

  const [scrambleMoves, setScrambleMoves] = useState([]); // remember initial scramble
  const [usedFallback, setUsedFallback] = useState(false); // mark if fallback used
  const [showShortcuts, setShowShortcuts] = useState(false); // NEW

  const theme = THEMES[themeMode];
  const isLight = themeMode === 'classic';

  const handleMove = (moveType, record = true) => {
    setCube(prev => applyMove(prev, moveType));
    setMoveTrigger(prev => prev + 1); 
    setTimeout(() => setMoveTrigger(0), 200);
    if (record) setHistory(prev => [...prev, moveType]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastMove = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    const inv = inverseMove(lastMove);
    handleMove(inv, false);
  };

  const handleReset = () => {
    setCube(SOLVED_STATE);
    setHistory([]);
    setSolution("");
    setMetrics(null);
    setError("");
    setActiveMove(null);
    setPlayIndex(null);
    setScrambleMoves([]);
    setUsedFallback(false);
  };

  const performRandomMove = () => {
    const moves = ['U', 'D', 'L', 'R', 'F', 'B', "U'", "D'", "L'", "R'", "F'", "B'"];
    handleMove(moves[Math.floor(Math.random() * moves.length)]);
    setSolution(""); 
    setMetrics(null);
    setUsedFallback(false);
  };

  // SCRAMBLE: depth 12 from SOLVED, and remember sequence
  const scramble = () => {
    const moves = ['U', 'D', 'L', 'R', 'F', 'B'];
    let currentCube = [...SOLVED_STATE];
    const seq = [];

    for (let i = 0; i < 12; i++) {
      const m = moves[Math.floor(Math.random() * moves.length)];
      currentCube = applyMove(currentCube, m);
      seq.push(m);
    }

    setCube(currentCube);
    setScrambleMoves(seq);
    setHistory([]); 
    setSolution("Scrambled (Depth 12)");
    setMetrics(null);
    setError("");
    setPlayIndex(null);
    setUsedFallback(false);
  };

  // HELPER: solver call with 100s timeout + TIMEOUT string handling
  const runSolverOnState = async (state) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 100000); // 100 seconds

    try {
      const response = await fetch('http://localhost:5000/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      const text = data.solution || data.error || "";
      if (text.includes("TIMEOUT")) {
        return { ok: false, timeout: true };
      }

      if (data.solution && !data.solution.startsWith("Error")) {
        return {
          ok: true,
          timeout: false,
          solution: data.solution,
          metrics: {
            time: data.time || "0.1",
            depth: data.depth || data.solution.split(' ').length,
            nodes: data.nodes || "88M (Lookup)"
          }
        };
      } else {
        return {
          ok: false,
          timeout: false,
          error: data.solution || data.error || "Unknown Error"
        };
      }
    } catch (e) {
      clearTimeout(timeoutId);
      if (e.name === 'AbortError') {
        return { ok: false, timeout: true };
      }
      return {
        ok: false,
        timeout: false,
        error: "Backend Offline. Ensure Python server is running."
      };
    }
  };

  // SMART SOLVER with fallback/backtracking
  const solve = async () => {
    if (isSolving) return;

    // Already solved guard
    const isSolved = cube.every((v, i) => v === SOLVED_STATE[i]);
    if (isSolved) {
      setSolution("Already solved");
      setMetrics(null);
      setError("");
      setUsedFallback(false);
      return;
    }

    setIsSolving(true);
    setSolution("Connecting to Neural Core...");
    setMetrics(null);
    setError("");
    setUsedFallback(false);
    
    // 1️⃣ Attempt 1: solve current cube directly
    let result = await runSolverOnState(cube);

    if (!result.timeout) {
      // no timeout → normal handling
      if (result.ok) {
        setSolution(result.solution);
        setMetrics(result.metrics);
        setError("");
      } else {
        // if backend offline or error, try simple fallback: reverse history
        if (history.length > 0) {
          const reverseMoves = [...history]
            .reverse()
            .map(inverseMove);
          const combined = reverseMoves.join(' ');
          setSolution(combined + " (Fallback)");
          setMetrics({
            time: "0.01",
            depth: reverseMoves.length,
            nodes: "0 (Reversal)"
          });
          setUsedFallback(true);
        } else {
          setError(result.error || "Unknown Error");
        }
      }
      setIsSolving(false);
      return;
    }

    // 2️⃣ Timeout case → backtracking strategy
    setSolution("Core Overload. Initiating Smart Backtrack...");

    const haveAnyMoves = scrambleMoves.length > 0 || history.length > 0;
    if (!haveAnyMoves) {
      setError("Solver timeout on initial state (no move history to backtrack).");
      setIsSolving(false);
      return;
    }

    let undoMoves = [];
    let baseState;

    if (scrambleMoves.length) {
      // Case A: we started from a known scramble at depth 12.
      // Backtrack only user/random/control moves (history).
      undoMoves = [...history].reverse().map(inverseMove);

      // recompute scrambled state from SOLVED + scrambleMoves
      baseState = scrambleMoves.reduce(
        (state, mv) => applyMove(state, mv),
        [...SOLVED_STATE]
      );
    } else {
      // Case B: no scramble, just moves from solved.
      // allow depth up to 12; backtrack the excess tail
      const maxDepth = 12;
      const userMoves = [...history];
      const excess = Math.max(0, userMoves.length - maxDepth);

      const keep = userMoves.slice(0, userMoves.length - excess);
      const toUndo = userMoves.slice(userMoves.length - excess);

      undoMoves = [...toUndo].reverse().map(inverseMove);

      // shallow base state: SOLVED + kept moves
      baseState = keep.reduce(
        (state, mv) => applyMove(state, mv),
        [...SOLVED_STATE]
      );
    }

    // 3️⃣ Attempt 2: solve from baseState (depth ≤ 12)
    const second = await runSolverOnState(baseState);

    if (second.ok) {
      const solverMoves = second.solution.trim().split(' ').filter(Boolean);
      const combined = [...undoMoves, ...solverMoves];
      const combinedStr = combined.join(' ');

      setSolution(combinedStr + " (Fallback)");
      setMetrics({
        ...second.metrics,
        depth: combined.length
      });
      setError("");
      setUsedFallback(true);
    } else if (second.timeout) {
      // Even after backtracking we timed out: last resort = just reverse everything
      if (history.length > 0) {
        const reverseMoves = [...history]
          .reverse()
          .map(inverseMove);
        const combined = reverseMoves.join(' ');
        setSolution(combined + " (Fallback)");
        setMetrics({
          time: "0.01",
          depth: reverseMoves.length,
          nodes: "0 (Reversal)"
        });
        setUsedFallback(true);
      } else {
        setError("Solver timeout even after backtracking to depth ≤ 12.");
      }
    } else {
      // some other error
      if (history.length > 0) {
        const reverseMoves = [...history]
          .reverse()
          .map(inverseMove);
        const combined = reverseMoves.join(' ');
        setSolution(combined + " (Fallback)");
        setMetrics({
          time: "0.01",
          depth: reverseMoves.length,
          nodes: "0 (Reversal)"
        });
        setUsedFallback(true);
      } else {
        setError(second.error || "Unknown Error");
      }
    }

    setIsSolving(false);
  };

  const playSolution = async () => {
    if (!solution || solution.includes("Scrambled") || isPlaying) return;
    setIsPlaying(true);
    setPlayIndex(0);

    const clean = solution.replace(" (Fallback)", "").trim();
    const moves = clean.split(' ').filter(Boolean);
    
    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      if (!move) continue;

      const buttonKey = move.replace('2', ''); 
      setActiveMove(buttonKey);
      setPlayIndex(i + 1);
      
      if (move.includes('2')) {
        handleMove(buttonKey, false);
        await new Promise(r => setTimeout(r, 200));
        handleMove(buttonKey, false);
      } else {
        handleMove(move, false);
      }
      
      await new Promise(r => setTimeout(r, 500)); 
      setActiveMove(null);
      await new Promise(r => setTimeout(r, 50)); 
    }
    setPlayIndex(null);
    setIsPlaying(false);
  };

  // --- Keyboard Shortcuts ---
  useEffect(() => {
    const onKeyDown = (e) => {
      if (isSolving || isPlaying) return;

      const key = e.key.toUpperCase();

      // Undo
      if ((e.ctrlKey && key === 'Z') || e.key === 'Backspace') {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Solve
      if (key === 'S') {
        e.preventDefault();
        solve();
        return;
      }

      // Scramble
      if (key === 'X') {
        e.preventDefault();
        scramble();
        return;
      }

      // Replay solution
      if (e.code === 'Space') {
        e.preventDefault();
        if (solution && !solution.includes('Scrambled') && !isSolving) {
          playSolution();
        }
        return;
      }

      // Face moves
      const faces = ['U', 'D', 'L', 'R', 'F', 'B'];
      if (faces.includes(key)) {
        e.preventDefault();
        const move = e.shiftKey ? `${key}'` : key;
        handleMove(move);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSolving, isPlaying, solution, history, cube]);

  const solutionDisplay = usedFallback ? solution : solution;

  return (
    <div className={`w-full h-screen overflow-hidden flex relative font-sans transition-colors duration-500 ${theme.bg} ${theme.text}`}>
      <div className={theme.glow}></div>

      {/* HEADER */}
      <div className="absolute top-6 left-6 right-6 z-30 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-4 pointer-events-auto">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tighter drop-shadow-lg">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 via-yellow-400 via-green-500 via-blue-500 to-white">
                Rubik's Cube Solver
              </span>
            </h1>

            <div className="flex items-center gap-3 mt-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                Uses Korf-style IDA* + Backtracking
              </span>
            </div>
          </div>
          <button 
            onClick={() => setShowInfo(true)} 
            className={`self-start flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md transition-all text-xs font-semibold hover:scale-105 border ${theme.panel}`}
          >
            <Info size={16} /> System Details
          </button>
        </div>

        {/* STATUS BAR (Top Right) */}
        <div className="pointer-events-auto flex items-center gap-4">
          <div className={`px-6 py-2 rounded-full text-sm font-mono border backdrop-blur-md flex items-center gap-4 shadow-lg ${theme.panel}`}>
            {error ? (
              <span className="text-red-400">{error}</span>
            ) : isSolving ? (
              <span className="animate-pulse text-cyan-300">Searching DB...</span>
            ) : (
              <span className={`font-bold ${solutionDisplay.includes("Scrambled") ? "text-amber-400" : "text-green-400"}`}>
                {solutionDisplay || "Ready"}
                {isPlaying && playIndex !== null && solutionDisplay && !solutionDisplay.includes("Scrambled") && (
                  <span className="ml-3 text-xs opacity-70">
                    (Step {playIndex} / {solutionDisplay.replace(" (Fallback)", "").trim().split(' ').filter(Boolean).length})
                  </span>
                )}
              </span>
            )}
            
            {solutionDisplay && !solutionDisplay.includes("Scrambled") && !isSolving && (
              <button 
                onClick={playSolution} 
                disabled={isPlaying} 
                className="ml-2 p-2 hover:bg-white/20 rounded-full transition-colors bg-green-500/20 text-green-400 hover:text-white border border-green-500/30" 
                title="Replay Animation"
              >
                {isPlaying ? <RefreshCw size={14} className="animate-spin"/> : <ChevronsRight size={14} />}
              </button>
            )}
          </div>

          <button 
            onClick={() => setThemeMode(themeMode === 'cyber' ? 'classic' : 'cyber')}
            className={`p-3 rounded-full transition-all hover:scale-110 shadow-lg ${theme.panel}`}
          >
            {themeMode === 'cyber' ? (
              <Sun size={20} className="text-amber-400"/>
            ) : (
              <Moon size={20} className="text-slate-600"/>
            )}
          </button>
        </div>
      </div>

      {/* CENTER STAGE */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none lg:-translate-x-32">
        <div className="w-full max-w-[800px] h-[420px] sm:h-[520px] lg:h-[600px] pointer-events-auto relative px-4">
          <Canvas shadows dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[3.5, 3.5, 5]} fov={45} />
            <ambientLight intensity={themeMode === 'cyber' ? 0.4 : 0.8} />
            <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={1.5} castShadow />
            {themeMode === 'cyber' && (
              <>
                <pointLight position={[-10, -5, -10]} intensity={1} color="#a855f7" />
                <pointLight position={[10, -5, -10]} intensity={1} color="#06b6d4" />
              </>
            )}
            <Float 
              speed={isSolving ? 10 : 2} 
              rotationIntensity={isSolving ? 2 : 0.5} 
              floatIntensity={1}
            >
              <Center>
                <RubiksModel cubeState={cube} isAnimating={moveTrigger > 0 || isPlaying} />
              </Center>
            </Float>
            <OrbitControls 
              enablePan={false} 
              enableZoom={false} 
              autoRotate={isSolving} 
              autoRotateSpeed={20}
            />
          </Canvas>
        </div>

        <div className="flex flex-col items-center gap-4 mt-2 pointer-events-auto w-full max-w-lg px-4">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <button 
              onClick={scramble} 
              disabled={isSolving || isPlaying} 
              className={`group relative px-6 py-3 rounded-xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-lg ${theme.buttonSecondary} text-white`}
            >
              <div className="relative flex items-center gap-2 text-xs">
                <Shuffle size={16} className="group-hover:rotate-180 transition-transform duration-700"/> SCRAMBLE
              </div>
            </button>

            <button 
              onClick={handleReset} 
              disabled={isSolving || isPlaying} 
              className={`p-3 rounded-xl font-bold border transition-all hover:scale-105 active:scale-95 disabled:opacity-50 ${theme.panel}`} 
              title="Reset Cube"
            >
              <RotateCcw size={20} />
            </button>

            <button 
              onClick={solve} 
              disabled={isSolving || isPlaying} 
              className={`group relative px-8 py-3 rounded-xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-lg ${theme.buttonPrimary} text-white`}
            >
              <div className="relative flex items-center gap-2 text-xs">
                {isSolving ? (
                  <RotateCcw className="animate-spin" size={16}/>
                ) : (
                  <Zap size={16} fill="currentColor"/>
                )} 
                {isSolving ? 'COMPUTING...' : 'SOLVE CUBE'}
              </div>
            </button>
          </div>

          {/* METRICS DASHBOARD */}
          {metrics && (
            <div className={`w-full px-6 py-3 rounded-xl backdrop-blur-md animate-fade-in-up flex justify-around border shadow-lg ${theme.panel}`}>
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-widest opacity-60 flex items-center justify-center gap-1">
                  <Timer size={10}/> Time
                </div>
                <div className="text-lg font-bold font-mono text-cyan-400">{metrics.time}ms</div>
              </div>
              <div className="text-center border-l border-white/10 pl-8">
                <div className="text-[10px] uppercase tracking-widest opacity-60 flex items-center justify-center gap-1">
                  <Layers size={10}/> Depth
                </div>
                <div className="text-lg font-bold font-mono text-purple-400">{metrics.depth}</div>
              </div>
              <div className="text-center border-l border-white/10 pl-8">
                <div className="text-[10px] uppercase tracking-widest opacity-60 flex items-center justify-center gap-1">
                  <Cpu size={10}/> Nodes
                </div>
                <div className="text-lg font-bold font-mono text-green-400">{metrics.nodes}</div>
              </div>
            </div>
          )}

            {/* SIGNATURE FOOTER */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <p
                className={`
                text-[11px] tracking-wide
                ${isLight ? 'text-slate-500' : 'text-gray-400'}
                `}
            >
                Created with <span className="text-red-500">❤️</span> by Kartik
            </p>
            </div>

        </div>
      </div>

      {/* RIGHT SIDE - CONTROLS & HISTORY */}
      <div className="absolute z-20 flex flex-col gap-4 right-4 top-24 sm:right-8 sm:top-28 lg:right-12">
        <div className={`p-5 rounded-2xl border shadow-2xl w-64 max-w-xs backdrop-blur-md ${theme.panel}`}>
          <h3
            className={`
              text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 pb-2 opacity-70 border-b
              ${isLight ? 'border-slate-200 text-slate-700' : 'border-white/10'}
            `}
          >
            <Grid size={14}/> Cube Controls
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {['U', 'L', 'F', 'R', 'B', 'D'].map((face) => (
              <div key={face} className="flex flex-col gap-2">
                <button 
                  onClick={() => handleMove(face)} 
                  disabled={isSolving || isPlaying} 
                  className={`p-3 rounded-lg text-sm font-bold transition-all disabled:opacity-50 border 
                    ${activeMove === face 
                      ? theme.highlight
                      : isLight
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                        : 'bg-white/5 hover:bg-white/10 border-white/5 text-cyan-100'}`}
                >
                  {face}
                </button>
                <button 
                  onClick={() => handleMove(face + "'")} 
                  disabled={isSolving || isPlaying} 
                  className={`p-3 rounded-lg text-sm font-bold transition-all disabled:opacity-50 border
                    ${activeMove === face + "'" 
                      ? theme.highlight 
                      : isLight
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                        : 'bg-white/5 hover:bg-white/10 border-white/5 opacity-60 hover:opacity-100'}`}
                >
                  {face}'
                </button>
              </div>
            ))}
          </div>
          {/* RANDOM MOVE BUTTON */}
          <button 
            onClick={performRandomMove} 
            disabled={isSolving || isPlaying} 
            className={`w-full mt-4 flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-bold transition-all opacity-80 hover:opacity-100 border
              ${isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-cyan-100'}`}
          >
            <Shuffle size={14}/> Random Move
          </button>
        </div>

        <div className={`transition-all duration-500 overflow-hidden flex flex-col rounded-2xl border backdrop-blur-md ${theme.panel} ${showHistory ? 'h-96 opacity-100' : 'h-0 opacity-0 border-0'}`}>
          <div className="p-4 flex flex-col h-full">
            <div
              className={`
                flex justify-between items-center mb-3 pb-2 border-b
                ${isLight ? 'border-slate-200' : 'border-white/10'}
              `}
            >
              <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 opacity-70">
                <History size={14} /> History
              </h3>
              <button 
                onClick={handleUndo} 
                disabled={history.length === 0 || isSolving || isPlaying} 
                className="p-1 hover:bg-white/10 rounded disabled:opacity-30 transition-colors"
              >
                <ArrowLeft size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto font-mono text-xs space-y-1 custom-scrollbar pr-1">
              {history.length === 0 ? (
                <div className="italic text-center mt-8 opacity-50">No moves recorded.</div>
              ) : (
                history.map((m, i) => (
                  <div 
                    key={i}
                    className={`
                      flex justify-between px-3 py-2 rounded border transition-colors
                      ${isLight
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                        : 'bg-white/5 hover:bg-white/10 border-white/5'}
                    `}
                  >
                    <span className="opacity-50">#{i + 1}</span>
                    <span className={`font-bold ${theme.accent}`}>{m}</span>
                  </div>
                ))
              )}
              <div ref={(el) => el?.scrollIntoView({ behavior: "smooth" })} />
            </div>
          </div>
        </div>
      </div>

      {/* HISTORY TOGGLE (BOTTOM RIGHT) */}
      <div className="absolute bottom-6 right-6 z-30">
        <button 
          onClick={() => setShowHistory(!showHistory)} 
          className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md transition-all text-xs font-semibold hover:scale-105 border ${theme.panel}`}
        >
          {showHistory ? <ChevronRight size={16}/> : <History size={16}/>}
          {showHistory ? 'Hide History' : 'Show History'} 
        </button>
      </div>

      {/* INFO SIDEBAR */}
      <div className={`absolute left-6 top-6 bottom-6 z-40 transition-all duration-500 overflow-hidden rounded-2xl flex flex-col border backdrop-blur-xl shadow-2xl ${theme.panel} ${showInfo ? 'w-96 opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-10 pointer-events-none border-0'}`}>
        <div
          className={`
            p-6 flex justify-between items-center border-b
            ${isLight ? 'border-slate-200' : 'border-white/10'}
          `}
        >
            <h2
                className={
                isLight
                    ? "text-xl font-bold text-slate-800"
                    : "text-xl font-bold text-white bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"
                }
            >
                System Details
            </h2>

          <button 
            onClick={() => setShowInfo(false)} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-8 flex flex-col gap-8 h-full overflow-y-auto custom-scrollbar">
          {/* 1. Search Space & Core Algorithm */}
          <section>
            <h3 className="flex items-center gap-2 font-bold text-lg mb-2 text-red-400">
              <Activity size={18}/> Search Space & Core Algorithm
            </h3>
            <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
              A 3×3 Rubik&apos;s Cube has 
              <span className={`font-mono ${isLight ? 'text-slate-800' : 'text-white'}`}> 43 Quintillion (43,252,003,274,489,856,000) </span>
              reachable states. Brute-force search explodes before depth 8, so the solver uses a 
              <strong> Korf-style Iterative Deepening A* (IDA*)</strong> core guided by a precomputed 
              pattern database. Instead of exploring the full state tree, it expands only states whose 
              estimated cost can still beat the current depth limit.
            </p>
          </section>

          {/* 2. State Encoding & Pattern Database */}
          <section>
            <h3 className="flex items-center gap-2 font-bold text-lg mb-2 text-red-400">
              <Brain size={18}/> State Encoding & Pattern Database
            </h3>
            <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
              Each cube position is stored as a flat <span className={`font-mono ${isLight ? 'text-slate-800' : 'text-white'}`}>  54-element</span> 
              array, which keeps the whole state cache-friendly. Corner configurations are mapped to a compact 
              index using <strong>combinatorial number systems (Lehmer codes)</strong>, allowing direct 
              lookup into an <span className={`font-mono ${isLight ? 'text-slate-800' : 'text-white'}`}>88M-entry</span> pattern database. 
              That database stores the exact distance (in face turns) for those patterns, giving a strong 
              admissible heuristic for the IDA* search.
            </p>
          </section>

          {/* 3. Smart Timeout & Backtracking Strategy */}
          <section>
            <h3 className="flex items-center gap-2 font-bold text-lg mb-2 text-red-400">
              <Cpu size={18}/> Smart Timeout & Backtracking
            </h3>
            <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
              The frontend sends the current cube state to a Python backend, which forwards it to the C++17 core. 
              Each request is wrapped in a <strong>100-second timeout</strong>. If the core finishes in time, 
              the exact optimal solution sequence is returned along with metrics like time, depth and node count. 
              If a <span className={`font-mono ${isLight ? 'text-slate-800' : 'text-white'}`}>TIMEOUT</span> occurs, the UI triggers a 
              <strong> smart backtracking</strong> path: it uses the recorded move history and, when available, 
              the original <span className={`font-mono ${isLight ? 'text-slate-800' : 'text-white'}`}>Scrambled (Depth 12)</span> sequence to roll the cube 
              back to a safer depth (≤ 12), then asks the solver to restart from that shallower position.
            </p>
            <p className={`text-sm leading-relaxed mt-2 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
              When even that fails or the backend is offline, the app falls back to a guaranteed 
              <strong> logical undo</strong>: it simply returns the inverse of every move in history. 
              The UI clearly labels this as a <span className={`font-mono ${isLight ? 'text-slate-800' : 'text-white'}`}>Fallback</span> 
              sequence so you can see when the solution came from the search core versus pure reversal.
            </p>
          </section>

          {/* 4. Frontend / Backend Architecture */}
          <section>
            <h3 className="flex items-center gap-2 font-bold text-lg mb-2 text-red-400">
              <Layers size={18}/> Frontend / Backend Architecture
            </h3>
            <div className={`text-sm leading-relaxed space-y-2 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
              <p>The system is split into clean layers:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  <strong>Frontend:</strong> React + React Three Fiber + drei render the cube in WebGL, 
                  with keyboard shortcuts, animated replay, themes and full move history tracking.
                </li>
                <li>
                  <strong>Backend:</strong> Python (Flask / FastAPI style) exposes a single 
                  <span className="font-mono"> /solve</span> endpoint, handles JSON I/O and enforces 
                  the timeout via an <span className="font-mono">AbortController</span>-style pattern.
                </li>
                <li>
                  <strong>Solver Core:</strong> A C++17 engine with a flat 1D cube representation, tuned 
                  for <strong>L1 cache locality</strong> and tight loops over the 88M-entry pattern database 
                  to explore millions of states per second.
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>

      {/* KEYBOARD SHORTCUTS MODULE - BOTTOM LEFT */}
      <div className="absolute bottom-6 left-6 z-30 flex flex-col-reverse items-start gap-3">
        {/* Toggle Button */}
        <button
          onClick={() => setShowShortcuts((prev) => !prev)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md transition-all text-xs font-semibold hover:scale-105 border ${theme.panel}`}
        >
          <Activity size={16} />
          {showShortcuts ? 'Hide Shortcuts' : 'Shortcuts'}
        </button>

        {/* Slide / Fade Panel */}
        <div
          className={`
            origin-bottom-left
            transition-all duration-300
            ${showShortcuts 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
            }
          `}
        >
          <div className={`px-4 py-3 rounded-xl text-xs backdrop-blur-md border shadow-lg ${theme.panel}`}>
            <h3 className="font-bold uppercase tracking-widest mb-2 opacity-70">
              Keyboard Shortcuts
            </h3>

            <div className="space-y-1 font-mono">
              <div className="flex justify-between gap-6">
                <span className="opacity-70">U / D / L / R / F / B</span>
                <span className={theme.accent}>Face Turns</span>
              </div>

              <div className="flex justify-between gap-6">
                <span className="opacity-70">Shift + Face</span>
                <span className={theme.accent}>Inverse Turn</span>
              </div>

              <div className="flex justify-between gap-6">
                <span className="opacity-70">Ctrl + Z / Backspace</span>
                <span className={theme.accent}>Undo Move</span>
              </div>

              <div className="flex justify-between gap-6">
                <span className="opacity-70">S</span>
                <span className={theme.accent}>Solve Cube</span>
              </div>

              <div className="flex justify-between gap-6">
                <span className="opacity-70">X</span>
                <span className={theme.accent}>Scramble</span>
              </div>

              <div className="flex justify-between gap-6">
                <span className="opacity-70">Space</span>
                <span className={theme.accent}>Replay Solution</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default App;
