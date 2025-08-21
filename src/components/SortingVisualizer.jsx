import React , { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  NUM_BARS,
  ANIMATION_SPEED_MS,
  DEFAULT_COLOR,
  COMPARING_COLOR,
  SWAP_COLOR,
  SORTED_COLOR,
  MIN_HIGHLIGHT_COLOR,

  MERGE_NUM_BARS,
  MERGE_BOX_COLOR,
  MERGE_HIGHLIGHT_COLOR, 
  MERGE_SORTED_COLOR,      
  MERGE_FINAL_COLOR,       
} from '../utils/constants.js';

import { bubbleSort as runBubbleSort } from '../algorithms/bubbleSort.js';
import { selectionSort as runSelectionSort } from '../algorithms/selectionSort.js';
import { insertionSort as runInsertionSort } from '../algorithms/insertionSort.js';

import { getMergeSortFrames } from '../algorithms/mergeSortTree.js';


function Box({ children, style, glow }) {
  return (
    <div
      className={`flex gap-1 p-2 rounded-2xl shadow transition-transform duration-200 ${
        glow ? 'ring-2 ring-pink-400' : ''
      }`}
      style={style}
    >
      {children}
    </div>
  );
}

function ValuesPills({ arr, flashIndex, highlightVal }) {
  return (
    <div className="flex gap-1">
      {arr.map((n, i) => {
        let bg = 'white';
        if (i < flashIndex) bg = MERGE_SORTED_COLOR;
        if (highlightVal !== undefined && n === highlightVal) {
          bg = 'skyblue';   // <-- child highlight
        }
        return (
          <div
            key={i}
            className="w-8 h-8 flex items-center justify-center rounded-md border text-sm font-semibold transition-colors duration-200 text-black"
            style={{ backgroundColor: bg, borderColor: 'rgba(0,0,0,0.08)' }}
          >
            {n}
          </div>
        );
      })}
    </div>
  );
}

function TreeNode({ node, frame, level = 0, childHighlightVal }) {
  if (!node) return null;

  const isActive = frame?.activeId === node.id;
  const isRoot = node && !level;
  const isTreeDone =
    isRoot &&
    frame?.type === "merged" &&
    frame?.type === "merged" &&
    frame?.activeId === node.id;

  // parent highlight (only for active node)
  const highlightVal =
    frame?.type === "mergeStep" && isActive ? frame.meta?.picked : undefined;

  // child highlight (if explicitly passed from parent)
  const effectiveHighlight = highlightVal ?? childHighlightVal;

  return (
    <div className="flex flex-col items-center">
      <Box
        glow={isActive}
        style={{
          backgroundColor: isTreeDone
            ? MERGE_FINAL_COLOR
            : isActive
            ? MERGE_HIGHLIGHT_COLOR
            : MERGE_BOX_COLOR,
          transition: "background-color 0.5s ease-in-out"
        }}
      >
        <ValuesPills
          arr={node.arr}
          flashIndex={isActive && frame.type === "mergeStep" ? 1 : 0}
          highlightVal={effectiveHighlight}
        />
      </Box>

      {(node.left || node.right) && (
        <div className="flex items-start justify-center gap-10 mt-4">
          <div
            className={`transition-transform duration-300 ${
              isActive &&
              frame.type === "mergeStep" &&
              frame.meta?.from === "L"
                ? "-translate-y-2"
                : ""
            }`}
          >
            <TreeNode
              node={node.left}
              frame={frame}
              level={level + 1}
              childHighlightVal={
                isActive && frame.type === "mergeStep" && frame.meta?.from === "L"
                  ? frame.meta?.picked
                  : undefined
              }
            />
          </div>

          <div
            className={`transition-transform duration-300 ${
              isActive &&
              frame.type === "mergeStep" &&
              frame.meta?.from === "R"
                ? "-translate-y-2"
                : ""
            }`}
          >
            <TreeNode
              node={node.right}
              frame={frame}
              level={level + 1}
              childHighlightVal={
                isActive && frame.type === "mergeStep" && frame.meta?.from === "R"
                  ? frame.meta?.picked
                  : undefined
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SortingVisualizer() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [barValues, setBarValues] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [currentComparing, setCurrentComparing] = useState([]);
  const [currentSwapping, setCurrentSwapping] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [currentMinIndex, setCurrentMinIndex] = useState(null);
  const [animationSpeedMs, setAnimationSpeedMs] = useState(ANIMATION_SPEED_MS);

  const [mergeArray, setMergeArray] = useState([]);
  const [frames, setFrames] = useState([]);
  const [frameIdx, setFrameIdx] = useState(0);
  const [mergeSpeed, setMergeSpeed] = useState(500);
  const [playing, setPlaying] = useState(false);

  const generateRandomArray = useCallback(() => {
    if (isSorting) return;
    const newBarValues = [];
    for (let k = 0; k < NUM_BARS; k++) {
      newBarValues.push(Math.floor(Math.random() ** 2 * 390) + 10);
    }
    setBarValues(newBarValues);
    setCurrentComparing([]);
    setCurrentSwapping([]);
    setSortedIndices([]);
    setCurrentMinIndex(null);
  }, [isSorting]);

  const drawBars = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const effectiveCanvasWidth = canvas.width;
    const barWidthWithoutSpacing = effectiveCanvasWidth / NUM_BARS;
    const barSpacing = barWidthWithoutSpacing * 0.1;
    const actualBarWidth = barWidthWithoutSpacing - barSpacing;

    barValues.forEach((value, index) => {
      const x = index * (actualBarWidth + barSpacing);
      const barHeight = value;
      const y = canvas.height - barHeight;

      let color = DEFAULT_COLOR;
      if (currentComparing.includes(index)) color = COMPARING_COLOR;
      else if (currentSwapping.includes(index)) color = SWAP_COLOR;
      else if (sortedIndices.includes(index)) color = SORTED_COLOR;
      else if (currentMinIndex === index) color = MIN_HIGHLIGHT_COLOR;

      ctx.fillStyle = color;
      ctx.fillRect(x, y, actualBarWidth, barHeight);
    });
  }, [barValues, currentComparing, currentSwapping, sortedIndices, currentMinIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth * 0.8;
      canvas.height = window.innerHeight * 0.6;
      generateRandomArray();
    }
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth * 0.8;
        canvasRef.current.height = window.innerHeight * 0.6;
        drawBars();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    drawBars();
  }, [barValues, currentComparing, currentSwapping, sortedIndices, currentMinIndex, drawBars]);

  const generateMergeArray = useCallback((n = MERGE_NUM_BARS) =>
    Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 10), []);

  const resetMergeTree = useCallback(() => {
    const arr = generateMergeArray();
    setMergeArray(arr);
    const f = getMergeSortFrames(arr);
    setFrames(f);
    setFrameIdx(0);
    setPlaying(false);
  }, [generateMergeArray]);

  useEffect(() => {
    resetMergeTree();
  }, [resetMergeTree]);

  useEffect(() => {
    if (!playing) return;
    if (!frames.length) return;
    if (frameIdx >= frames.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setFrameIdx(i => Math.min(i + 1, frames.length - 1)), mergeSpeed);
    return () => clearTimeout(t);
  }, [playing, frameIdx, frames, mergeSpeed]);

  const start = () => { if (frames.length) setPlaying(true); };
  const pause = () => setPlaying(false);
  const step = () => setFrameIdx(i => Math.min(i + 1, frames.length - 1));

  const bubbleSort = useCallback(async () => {
    await runBubbleSort(
      barValues, setBarValues, setCurrentComparing, setCurrentSwapping,
      setSortedIndices, setIsSorting, setCurrentMinIndex, animationSpeedMs
    );
  }, [barValues, animationSpeedMs]);

  const selectionSort = useCallback(async () => {
    await runSelectionSort(
      barValues, setBarValues, setCurrentComparing, setCurrentSwapping,
      setSortedIndices, setIsSorting, setCurrentMinIndex, animationSpeedMs
    );
  }, [barValues, animationSpeedMs]);

  const insertionSort = useCallback(async () => {
    await runInsertionSort(
      barValues, setBarValues, setCurrentComparing, setCurrentSwapping,
      setSortedIndices, setIsSorting, setCurrentMinIndex, animationSpeedMs
    );
  }, [barValues, animationSpeedMs]);

  const frame = frames[frameIdx];

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
      >
        &larr; Back
      </button>

      <h1 className="text-4xl font-extrabold mb-8 text-custom-primary text-center">
        Sorting Visualization
      </h1>

      <canvas
        ref={canvasRef}
        id="visualizerCanvas"
        className="border-4 border-custom-secondary rounded-lg shadow-lg w-full max-w-5xl"
        style={{ display:'block' }}
      />

      <div className="controls mt-6 flex flex-wrap gap-4 justify-center">
        <button onClick={generateRandomArray} className='bg-custom-primary hover:bg-custom-secondary text-visual-bg-dark font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105'>
          Generate New Array
        </button>
        <button onClick={bubbleSort} disabled={isSorting || barValues.length === 0} className='bg-custom-accent hover:bg-custom-secondary text-visual-bg-dark font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105'>
          Start Bubble Sort
        </button>
        <button onClick={selectionSort} disabled={isSorting || barValues.length === 0} className='bg-custom-accent hover:bg-custom-secondary text-visual-bg-dark font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105'>
          Start Selection Sort
        </button>
        <button onClick={insertionSort} disabled={isSorting || barValues.length === 0} className='bg-custom-accent hover:bg-custom-secondary text-visual-bg-dark font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105'>
          Start Insertion Sort
        </button>

        <div className='flex flex-col items-center gap-2 px-4 py-2 bg-visual-canvas-bg rounded-lg shadow-md'>
          <label htmlFor="speedSlider" className='text-text-light text-sm font-medium'>
            Animation Speed(ms): {animationSpeedMs}
          </label>
          <input
            type="range" id="speedSlider" min="1" max="1000" value={animationSpeedMs}
            onChange={(e) => setAnimationSpeedMs(Number(e.target.value))}
            className='w-48 h-2 rounded-lg appearance-none cursor-pointer accent-custom-primary'
            disabled={isSorting}
          />
          <span className='text-text-light text-xs'>{animationSpeedMs} ms</span>
        </div>
      </div>

      {/* Merge sort */}
      <div className="mt-12 p-4 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-center text-xl font-bold mb-4">Merge Sort (Tree View)</h2>

        {/* top row */}
        <div className="flex justify-center gap-2 mb-4">
          {mergeArray.map((v, i) => (
            <div
              key={i}
              className="w-9 h-9 flex items-center justify-center rounded-md shadow text-sm font-semibold"
              style={{ backgroundColor: MERGE_BOX_COLOR }}
            >
              {v}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-4">
          <button onClick={resetMergeTree} className="px-4 py-2 rounded-xl bg-blue-400 text-black font-semibold shadow">
            Generate New Array
          </button>
          <button onClick={start} className="px-4 py-2 rounded-xl bg-pink-300 text-black font-semibold shadow">
            Start
          </button>
          <button onClick={pause} className="px-4 py-2 rounded-xl bg-gray-200 text-black font-semibold shadow">
            Pause
          </button>
          <button onClick={step} className="px-4 py-2 rounded-xl bg-green-200 text-black font-semibold shadow">
            Step
          </button>

          <div className="px-3 py-2 rounded-xl bg-gray-800 text-white shadow flex items-center gap-3">
            <span>Speed: {mergeSpeed} ms</span>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={mergeSpeed}
              onChange={(e) => setMergeSpeed(Number(e.target.value))}
            />
          </div>
        </div>

        {/* tree */}
        {frames.length > 0 && (
          <div className="flex justify-center overflow-x-auto">
            <TreeNode node={frame.tree} frame={frame} />
          </div>
        )}
      </div>
    </div>
  );
}

export default SortingVisualizer;
