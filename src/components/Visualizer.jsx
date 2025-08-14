import React , { useRef, useState, useEffect, useCallback }from 'react'
import {
  NUM_BARS,
  ANIMATION_SPEED_MS,
  DEFAULT_COLOR,
  COMPARING_COLOR,
  SWAP_COLOR,
  SORTED_COLOR,
  MIN_HIGHLIGHT_COLOR,
  FOUND_COLOR
} from '../utils/constants'

import { bubbleSort as runBubbleSort } from '../algorithms/bubbleSort'
import { selectionSort as runSelectionSort } from '../algorithms/selectionSort'
import { insertionSort as runInsertionSort } from '../algorithms/insertionSort'
import { linearSearch as runLinearSearch } from '../algorithms/linearSearch'

const Visualizer = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [barValues, setBarValues] = useState([]);

    const [isSorting, setIsSorting] = useState(false);
    const [currentComparing, setCurrentComparing] = useState([]);
    const [currentSwapping, setCurrentSwapping] = useState([]);
    const [sortedIndices, setSortedIndices] = useState([]);
    const [currentMinIndex, setCurrentMinIndex] = useState(null); // For Selection Sort

    const [foundIndex, setFoundIndex] = useState(null); // For Linear Search
    const [targetValue, setTargetValue] = useState(''); // For Linear Search input

    const [animationSpeedMs, setAnimationSpeedMs] = useState(ANIMATION_SPEED_MS);


    const generateRandomArray = useCallback(() => {
        if(isSorting) return; 
        const newBarValues = [];
        for (let k = 0; k < NUM_BARS; k++) {
          newBarValues.push(Math.floor(Math.random()  **2 * 390) + 10);
        }
        setBarValues(newBarValues)
        setCurrentComparing([]);
        setCurrentSwapping([]);
        setSortedIndices([]);
        setCurrentMinIndex(null);
        setFoundIndex(null);
        setTargetValue('');
      }, [NUM_BARS, isSorting, setBarValues, setCurrentComparing, setCurrentSwapping, setSortedIndices, setCurrentMinIndex, setFoundIndex, setTargetValue]);
    
      const drawBars = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        // Responsive sizing
        // const parent = containerRef.current;
        // if (parent) {
        //   const style = getComputedStyle(parent);
        //   const width = parent.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        //   const height = 400; // You can make this dynamic if you want
        //   canvas.width = width;
        //   canvas.height = height;
        // }
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
          }
          else if (currentMinIndex === index) {
            color = MIN_HIGHLIGHT_COLOR;
          }
          else if (foundIndex === index) {
            color = FOUND_COLOR
          }
          ctx.fillStyle = color;
          ctx.fillRect(x, y, actualBarWidth, barHeight);
        });
      }, [barValues, canvasRef, currentComparing, currentSwapping, sortedIndices, currentMinIndex, foundIndex, DEFAULT_COLOR, COMPARING_COLOR, SWAP_COLOR, SORTED_COLOR, NUM_BARS, MIN_HIGHLIGHT_COLOR, FOUND_COLOR]);

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
      })

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

      const linearSearch = useCallback(async () => {
        if (isSorting || targetValue === '') return;
        const targetNum = Number(targetValue);
        if (isNaN(targetNum)) {
          console.error("Invalid target value");
          return;
        }
        await runLinearSearch(
          barValues,
          targetNum,
          setCurrentComparing,
          setIsSorting,
          setSortedIndices,
          setCurrentSwapping,
          setCurrentMinIndex,
          setFoundIndex,
          animationSpeedMs
        )
      }, [barValues, targetValue, isSorting, setCurrentComparing, setIsSorting, setSortedIndices, setCurrentSwapping, setCurrentMinIndex, setFoundIndex, animationSpeedMs]);

    useEffect(() => {
        drawBars();
    }, [barValues, currentComparing, currentSwapping, sortedIndices, drawBars]);
    // Redraw on window resize
    useEffect(() => {
      const handleResize = () => drawBars();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [drawBars]);
    return (
      <div ref={containerRef} className='bg-visual-bg-dark text-text-light min-h-screen flex flex-col items-center justify-center p-4'>
        <h1 className="text-4xl font-extrabold mb-8 text-custom-primary">DSA Visualizer</h1>
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

          <div className="flex items-center gap-2 px-4 py-2 bg-visual-canvas-bg rounded-lg shadow-md">
            <label htmlFor='targetInput' className ="text-text-light text-sm font-medium">Target:</label>
            <input  
              type ="number"
              id="targetInput"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              placeholder='Enter target'
              className="w-28 p-1 rounded-md bg-gray-700 text-text-light border border-custom-primary focus:outline-none focus:ring-2 focus:ring-custom-primary"
              disabled={isSorting}
            ></input>

            <button
              onClick={linearSearch}
              disabled={isSorting || barValues.length === 0 || targetValue === ''}
              className={`bg-custom-accent hover:bg-custom-secondary text-visual-bg-dark font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 ${isSorting || barValues.length === 0 || targetValue === '' ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-400 hover:bg-blue-500 text-white'}`}
            >
              Linear Search
            </button>
          </div>

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

export default Visualizer
