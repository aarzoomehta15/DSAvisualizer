export async function linearSearch(
    array, 
    target,
    setCurrentComparing,
    setIsSearching,
    setFoundIndex,
    animationSpeedMs
){
    setIsSearching(true);
    setFoundIndex(null);

    for(let i = 0; i < array.length; i++) {
        setCurrentComparing([i]);
        await new Promise(resolve => setTimeout(resolve, animationSpeedMs)); // Pause for animation
        if(array[i] === target) {
            setFoundIndex(i);
            setCurrentComparing([]);
            setIsSearching(false);
            console.log(`Element ${target} found at index ${i}`);
            return;
        }
    }
    setCurrentComparing([]);
    setIsSearching(false);
    setFoundIndex(null);
    console.log(`Element ${target} not found in the array`);
}
