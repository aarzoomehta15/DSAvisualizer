import React from 'react'
import { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  // NUM_BARS will be overridden for search, but keep for consistency
  ANIMATION_SPEED_MS,
  DEFAULT_COLOR,
  COMPARING_COLOR,
  FOUND_COLOR,
  MID_COLOR
} from '../utils/constants.js'

import { linearSearch as runLinearSearch } from '../algorithms/linearSearch.js';
import { binarySearch as runBinarySearch } from '../algorithms/binarySearch.js';

const SearchingVisualizer = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const [barValues, setBarValues] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [currentComparing, setCurrentComparing] = useState([]);
    const [foundIndex, setFoundIndex] = useState(null);
    const [targetValue, setTargetValue] = useState('');
    const [highlightRange, setHighlightRange] = useState([]);
    const [animationSpeedMs, setAnimationSpeedMs] = useState(ANIMATION_SPEED_MS);

    const SEARCH_NUM_BARS = 20;

    const generateRandomArray = useCallback(()=> {
        if (isSearching) return;
        const newBarValues = [];
        for (let k = 0; k < SEARCH_NUM_BARS; k++) {
          newBarValues.push(Math.floor(Math.random() ** 2 * 90) + 10);
        }
        setBarValues(newBarValues);
        setCurrentComparing([]);
        setFoundIndex(null);
        setTargetValue('');
        setHighlightRange([]);
    }, [SEARCH_NUM_BARS, setBarValues, setCurrentComparing, setFoundIndex, setTargetValue, setHighlightRange]);

    const pickRandomTarget = useCallback(() => {
        if(barValues.length === 0) return;
        const randomIndex = Math.floor(Math.random() * barValues.length);
        setTargetValue(barValues[randomIndex].toString());  
        setFoundIndex(null);
        setHighlightRange([]);
        setCurrentComparing([]);
    },  [barValues, isSearching, setTargetValue, setFoundIndex, setCurrentComparing, setHighlightRange]);

    const drawBars = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const effectiveCanvasWidth = canvas.width;
        const barWidthWithoutSpacing = effectiveCanvasWidth / SEARCH_NUM_BARS;
        const barSpacing = barWidthWithoutSpacing * 0.1;
        const actualBarWidth = barWidthWithoutSpacing - barSpacing;

        barValues.forEach((value, index) => {
            let color = DEFAULT_COLOR; 

            if(index == foundIndex) {
              color = FOUND_COLOR;
            }
            else if(currentComparing.includes(index)) {
              color = MID_COLOR;
            }
            if(highlightRange.length === 2 && index >= highlightRange[0] && index <= highlightRange[1]) {
                color = COMPARING_COLOR;
            }
            const x = index * (actualBarWidth + barSpacing);
            const barHeight = value;
            const y = canvas.height - barHeight;

            ctx.fillStyle = color;
            ctx.fillRect(x, y, actualBarWidth, barHeight);

            ctx.fillStyle = '#FFFFF'
            ctx.font = '14px Arial'
            ctx.textAlign = 'center';
            ctx.fillText(value.toString(), x + actualBarWidth / 2, y - 10); 
        });
    }, [barValues, canvasRef, currentComparing, foundIndex, highlightRange, DEFAULT_COLOR, COMPARING_COLOR, FOUND_COLOR, SEARCH_NUM_BARS])

    const linearSearch = useCallback(async () => {
        if (isSearching || targetValue === '') return
        const targetNum = Number(targetValue)
        if (isNaN(targetNum)) {
            alert('Please enter a valid number');
            return;
        }

        await runLinearSearch(
            barValues,
            targetNum,
            setCurrentComparing,
            setIsSearching,
            setFoundIndex,
            animationSpeedMs
        );
    }, [barValues, targetValue, isSearching, setCurrentComparing, setFoundIndex, setIsSearching, animationSpeedMs]); 


    const binarySearch = useCallback(async () => {
      if (isSearching || targetValue === '') return
      const targetNum = Number(targetValue)
      if (isNaN(targetNum)) {
        alert('Please enter a valid number');
        return;
      }
    const sortedArray = [...barValues].sort((a, b) => a - b);
    setBarValues(sortedArray); // update bars visually to sorted order
    await runBinarySearch(
      sortedArray,
      targetNum,
      setCurrentComparing,
      setIsSearching,
      setFoundIndex,
      animationSpeedMs,
      setHighlightRange
    );
    }, [barValues, targetValue, isSearching, setCurrentComparing, setFoundIndex, setIsSearching, animationSpeedMs, setHighlightRange]);


    const drawBarsFnRef = useRef(drawBars);
    useEffect(() => {
        drawBarsFnRef.current = drawBars;
    }, [drawBars]);

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
    }, [barValues, currentComparing, foundIndex, highlightRange, drawBars])

  return (
    <div>
        <button onClick= {() => navigate('/')} className="absolute top-4 left-4 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
            &larr; Back
        </button>
      <h1 className="text-4xl font-extrabold mb-8 text-custom-primary text-center">Searching Visualizer</h1>

      <canvas
        ref={canvasRef}
        id="visualizerCanvas"
        className="border-4 border-custom-secondary rounded-lg shadow-lg w-full max-w-5xl"
        style={{display:'block'}}
      ></canvas>

        <div className="controls mt-6 flex flex-wrap gap-4 justify-center">
        <button
          onClick={generateRandomArray}
          disabled={isSearching}
          className={`font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 ${
            isSearching ? 'bg-gray-500 cursor-not-allowed' : 'bg-custom-primary hover:bg-custom-secondary text-visual-bg-dark'
          }`}
        >
          Generate New Array
        </button>

        <button
          onClick={pickRandomTarget}
          disabled={isSearching || barValues.length === 0}
          className={`font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 ${
            isSearching || barValues.length === 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 text-visual-bg-dark'
          }`}
        >
          Pick Random Target
        </button>

        <div className="flex items-center gap-2 px-4 py-2 bg-visual-canvas-bg rounded-lg shadow-md">
          <label htmlFor="targetInput" className="text-text-light text-sm font-medium">Target:</label>
          <input
            type="number"
            id="targetInput"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            placeholder="Enter target"
            className="w-28 p-1 rounded-md bg-gray-700 text-text-light border border-custom-primary focus:outline-none focus:ring-2 focus:ring-custom-primary"
            disabled={isSearching}
          />

          <button
            onClick={linearSearch}
            disabled={isSearching || barValues.length === 0 || targetValue === ''}
            className={`font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 ${
              isSearching || barValues.length === 0 || targetValue === '' ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-400 hover:bg-blue-500 text-white'
            }`}
          >
            Linear Search
          </button>

          <button
            onClick={binarySearch}
            disabled={isSearching || barValues.length === 0 || targetValue === ''}
            className={`font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 ${
              isSearching || barValues.length === 0 || targetValue === '' ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600 text-white'
            }`}
          >
            Binary Search
          </button>
        </div>

        <div className="flex flex-col items-center gap-2 px-4 py-2 bg-visual-canvas-bg rounded-lg shadow-md">
          <label htmlFor="speedSlider" className="text-text-light text-sm font-medium">Animation Speed(ms): {animationSpeedMs}</label>
          <input
            type="range"
            id="speedSlider"
            min="1"
            max="800"
            value={animationSpeedMs}
            onChange={(e) => setAnimationSpeedMs(Number(e.target.value))}
            className="w-48 h-2 rounded-lg appearance-none cursor-pointer accent-custom-primary"
            disabled={isSearching}
            title={`Animation Speed: ${animationSpeedMs} ms`}
          />
          <span className="text-text-light text-xs">{animationSpeedMs} ms</span>
        </div>
    </div>
    </div>
  )
}

export default SearchingVisualizer
