export async function selectionSort(
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
        let minIdx = i;
        setCurrentMinIndex(minIdx); 
        // Highlight the current minimum index
        await new Promise(resolve => setTimeout(resolve, animationSpeedMs)); // Pause

        for(let j = i+1; j<n; j++){
            setCurrentComparing([minIdx, j]); 
            await new Promise(resolve => setTimeout(resolve, animationSpeedMs)); 
            if(arr[j] < arr[minIdx]){
                minIdx = j;
                setCurrentMinIndex(minIdx); 
                await new Promise(resolve => setTimeout(resolve, animationSpeedMs));
            }
        }

        if(minIdx !== i) {
            setCurrentSwapping([i, minIdx]);
            await new Promise(resolve => setTimeout(resolve, animationSpeedMs)); 

            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            setBarValues([...arr]); 
            await new Promise(resolve => setTimeout(resolve, animationSpeedMs));
        }
        setSortedIndices(prev => [...prev, i]); 
    }
    setSortedIndices(prev => [...prev, n - 1]); 
    setCurrentComparing([]);
    setCurrentSwapping([]);
    setCurrentMinIndex(null);
    setIsSorting(false);
    console.log("Selection Sorting completed");
}