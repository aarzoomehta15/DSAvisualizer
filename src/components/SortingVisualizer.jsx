import React , { useRef, useState, useEffect, useCallback }from 'react'

import { useNavigate } from 'react-router-dom';
import {
  NUM_BARS,
  ANIMATION_SPEED_MS,
  DEFAULT_COLOR,
  COMPARING_COLOR,
  SWAP_COLOR,
  SORTED_COLOR,
  MIN_HIGHLIGHT_COLOR,
  FOUND_COLOR
} from '../utils/constants.js'

import { bubbleSort as runBubbleSort } from '../algorithms/bubbleSort.js'
import { selectionSort as runSelectionSort } from '../algorithms/selectionSort.js'
import { insertionSort as runInsertionSort } from '../algorithms/insertionSort.js'

function SortingVisualizer() {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const [barValues, setBarValues] = useState([]);
    
    const [isSorting, setIsSorting] = useState(false);
    const [currentComparing, setCurrentComparing] = useState([]);
    const [currentSwapping, setCurrentSwapping] = useState([]);
    const [sortedIndices, setSortedIndices] = useState([]);
    const [currentMinIndex, setCurrentMinIndex] = useState(null);

    const [animationSpeedMs, setAnimationSpeedMs] = useState(ANIMATION_SPEED_MS)

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
      }, [NUM_BARS, setBarValues, setCurrentComparing, setCurrentSwapping, setSortedIndices, setCurrentMinIndex]);

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
        if (currentComparing.includes(index)) {
            color = COMPARING_COLOR;
        } else if (currentSwapping.includes(index)) {
            color = SWAP_COLOR;
        } else if (sortedIndices.includes(index)) {
            color = SORTED_COLOR;
        } else if (currentMinIndex === index) {
            color = MIN_HIGHLIGHT_COLOR;
        }
            ctx.fillStyle = color;
            ctx.fillRect(x, y, actualBarWidth, barHeight);
        });
        }, [barValues, canvasRef, currentComparing, currentSwapping, sortedIndices, currentMinIndex, DEFAULT_COLOR, COMPARING_COLOR, SWAP_COLOR, SORTED_COLOR, NUM_BARS, MIN_HIGHLIGHT_COLOR])

    
    const bubbleSort = useCallback(async () => {
            await runBubbleSort(
                barValues,
                setBarValues,
                setCurrentComparing,
                setCurrentSwapping,
                setSortedIndices,
                setIsSorting,
                setCurrentMinIndex,
                animationSpeedMs
            )
          },  [barValues,setBarValues,setCurrentComparing,setCurrentSwapping,setSortedIndices,setIsSorting,setCurrentMinIndex,animationSpeedMs])

    const selectionSort = useCallback(async () => {
            await runSelectionSort(
                barValues,
                setBarValues,
                setCurrentComparing,
                setCurrentSwapping,
                setSortedIndices,
                setIsSorting,
                setCurrentMinIndex,
                animationSpeedMs
            ), [barValues, setBarValues, setCurrentComparing, setCurrentSwapping, setSortedIndices, setIsSorting, setCurrentMinIndex, animationSpeedMs]
          }, [barValues, setBarValues, setCurrentComparing, setCurrentSwapping, setSortedIndices, setIsSorting, setCurrentMinIndex, animationSpeedMs]);

    const insertionSort = useCallback(async () => {
            await runInsertionSort(
              barValues,
              setBarValues,
              setCurrentComparing,
              setCurrentSwapping,
              setSortedIndices,
              setIsSorting,
              setCurrentMinIndex,
              animationSpeedMs
            )
          }, [barValues, setBarValues, setCurrentComparing, setCurrentSwapping, setSortedIndices, setIsSorting, setCurrentMinIndex, animationSpeedMs ])

    const drawBarsFnRef = useRef(drawBars);
      useEffect(() => {
      drawBarsFnRef.current = drawBars;
    }, [drawBars]);

    useEffect(() => {
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = window.innerWidth * 0.8;
        canvas.height = window.innerHeight * 0.6;
        generateRandomArray();
      }
      const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth * 0.8;
        canvasRef.current.height = window.innerHeight * 0.6;
        drawBarsFnRef.current(); 
        }
      };
      window.addEventListener('resize', handleResize);
       return () => {
      window.removeEventListener('resize', handleResize);
    };
    }, [generateRandomArray, drawBarsFnRef]);

    useEffect(() => {
      drawBars();
      }, [barValues, currentComparing, currentSwapping, sortedIndices, currentMinIndex, drawBars]);

    return (
      <div >
        <button onClick = {() => navigate('/')} className="absolute top-4 left-4 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
          &larr; Back
        </button>
        <h1 className="text-4xl font-extrabold mb-8 text-custom-primary text-center">Sorting Visualization</h1>
        <canvas ref={canvasRef} id="visualizerCanvas" className="border-4 border-custom-secondary rounded-lg shadow-lg w-full max-w-5xl" style={{display:'block'}}></canvas>
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
            <label htmlFor="speedSlider" className='text-text-light text-sm font-medium'>Animation Speed(ms): {animationSpeedMs}</label>
            <input type="range" id="speedSlider" min="1" max="1000" value={animationSpeedMs}
              onChange={(e) => setAnimationSpeedMs(Number(e.target.value))}
              className='w-48 h-2 rounded-lg appearance-none cursor-pointer accent-custom-primary'
              disabled={isSorting}
              title={`Animation Speed: ${animationSpeedMs} ms`}
            />
            <span className='text-text-light text-xs'>{animationSpeedMs} ms</span>
          </div>
        </div>
      </div>
    );
}

export default SortingVisualizer