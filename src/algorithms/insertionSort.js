export async function insertionSort(
  array,
  setBarValues,
  setCurrentComparing,
  setCurrentSwapping,
  setSortedIndices,
  setIsSorting,
  setCurrentMinIndex,
  animationSpeedMs){
    setIsSorting(true);
    setSortedIndices([]); 
    setCurrentComparing([]);
    setCurrentSwapping([]);
    setCurrentMinIndex(null);
    let arr = [...array];
    const n = arr.length;

    setSortedIndices([0])
    for (let i = 1; i < n; i++) {
        let current = arr[i];
        let j = i - 1;
        setCurrentComparing([i]);
        await new Promise(resolve => setTimeout(resolve, animationSpeedMs));

        while (j >= 0 && arr[j] > current) {
            setCurrentComparing([j, j+1]);
            setCurrentSwapping([j, j+1]);
            await new Promise(resolve => setTimeout(resolve, animationSpeedMs));

            arr[j + 1] = arr[j];
            setBarValues([...arr]);
            await new Promise(resolve => setTimeout(resolve, animationSpeedMs));
            j--;
            setCurrentSwapping([])
        }
        arr[j + 1] = current;
        setBarValues([...arr]);

        setSortedIndices(prev => {
            const newSorted = new Set(prev)
            newSorted.add(i)
            for(let k = 0; k <= i; k++) {
                newSorted.add(k);
            }
            return Array.from(newSorted).sort((a, b) => a - b);
        }); 
        await new Promise(resolve => setTimeout(resolve, animationSpeedMs));
    }
    setSortedIndices(Array.from({ length: n }, (_, i) => i))
    setCurrentComparing([]);
    setCurrentSwapping([]);
    setCurrentMinIndex(null);
    setIsSorting(false);
    console.log("Insertion Sorting completed");
}