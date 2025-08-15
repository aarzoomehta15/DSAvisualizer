export async function binarySearch(
    array,
    target,
    setCurrentComparing,
    setIsSearching,
    setFoundIndex,
    animationSpeedMs,
    setHighlightRange
){
    setIsSearching(true)
    setFoundIndex(null);
    setHighlightRange([]);
    setCurrentComparing([]);

    let left = 0
    let right = array.length - 1;

    while(left<=right){
        setHighlightRange([left, right]);
        await new Promise(resolve => setTimeout(resolve, animationSpeedMs)); 

        let mid = Math.floor((left + right) / 2);
        setCurrentComparing([mid]);
        await new Promise(resolve => setTimeout(resolve, animationSpeedMs));

        if(array[mid] === target){
            setFoundIndex(mid);
            setCurrentComparing([]);
            setHighlightRange([]);
            setIsSearching(false);
            console.log(`Element ${target} found at index ${mid}`);
            return;
        } else if(array[mid] < target){
            left = mid + 1;
        }
        else {
            right = mid - 1;
        }
    }
    setCurrentComparing([]);
    setHighlightRange([]);
    setFoundIndex(null);
    setIsSearching(false);
    console.log(`Element ${target} not found in the array`);
}