export async function bubbleSort(
  array,
  setBarValues,
  setCurrentComparing,
  setCurrentSwapping,
  setSortedIndices,
  setIsSorting,
  setCurrentMinIndex,
  animationSpeedMs
) {
  setIsSorting(true); 
  setSortedIndices([]); // Clear previous sorted state
  setCurrentComparing([]);
  setCurrentSwapping([]);
  setCurrentMinIndex(null); // Ensure clean state

  let arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      setCurrentComparing([j, j + 1]); 
      setCurrentSwapping([]); // Clear any ongoing swap highlights
      await new Promise(resolve => setTimeout(resolve, animationSpeedMs)); // Pause

      if (arr[j] > arr[j + 1]) {
        setCurrentSwapping([j, j + 1]); // Highlight bars being swapped
        await new Promise(resolve => setTimeout(resolve, animationSpeedMs)); // Pause

        // Perform the swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        setBarValues([...arr]); // Update React state to trigger redraw
        await new Promise(resolve => setTimeout(resolve, animationSpeedMs)); // Pause after swap
      }
    }
    setSortedIndices(prev => [...prev, n - 1 - i]); // Mark the largest element as sorted
  }
  setSortedIndices(prev => [...prev, 0]); // Mark the first element (index 0) as sorted too

  // Clear all temporary highlights and reset sorting flag
  setCurrentComparing([]);
  setCurrentSwapping([]);
  setCurrentMinIndex(null);
  setIsSorting(false);
  console.log("Bubble Sorting completed");
}