export async function linearSearch(
    array, 
    target,
    setCurrentComparing,
    setIsSorting,//isactive flag
    setSortedIndices,
    setCurrentSwapping,
    setCurrentMinIndex,
    setFoundIndex,
    animationSpeedMs
){
    setIsSorting(true);
    setCurrentSwapping([]);
    setSortedIndices([]);
    setFoundIndex(null);
    setCurrentMinIndex(null);

    for(let i = 0; i < array.length; i++) {
        setCurrentComparing([i]);
        await new Promise(resolve => setTimeout(resolve, animationSpeedMs)); // Pause for animation
        if(array[i] === target) {
            setFoundIndex(i);
            setCurrentComparing([]);
            setIsSorting(false);
            console.log(`Element ${target} found at index ${i}`);
            return;
        }
    }
    setCurrentComparing([]);
    setIsSorting(false);
    setFoundIndex(null);
    console.log(`Element ${target} not found in the array`);
}