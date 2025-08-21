// src/algorithms/mergeSort.js
import { MERGE_BOX_COLOR, MERGE_HIGHLIGHT_COLOR, MERGE_SORTED_COLOR } from "../utils/constants";

export function getMergeSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return array;
  const auxArray = array.slice();
  mergeSortHelper(array, 0, array.length - 1, auxArray, animations);
  return animations;
}

function mergeSortHelper(mainArray, startIdx, endIdx, auxArray, animations) {
  if (startIdx === endIdx) return;
  const midIdx = Math.floor((startIdx + endIdx) / 2);
  mergeSortHelper(auxArray, startIdx, midIdx, mainArray, animations);
  mergeSortHelper(auxArray, midIdx + 1, endIdx, mainArray, animations);
  doMerge(mainArray, startIdx, midIdx, endIdx, auxArray, animations);
}

function doMerge(mainArray, startIdx, midIdx, endIdx, auxArray, animations) {
  let i = startIdx;
  let j = midIdx + 1;
  let k = startIdx;

  while (i <= midIdx && j <= endIdx) {
    // highlight compare
    animations.push(["compare", i, j]);

    if (auxArray[i] <= auxArray[j]) {
      animations.push(["overwrite", k, auxArray[i]]);
      mainArray[k++] = auxArray[i++];
    } else {
      animations.push(["overwrite", k, auxArray[j]]);
      mainArray[k++] = auxArray[j++];
    }
  }

  while (i <= midIdx) {
    animations.push(["overwrite", k, auxArray[i]]);
    mainArray[k++] = auxArray[i++];
  }

  while (j <= endIdx) {
    animations.push(["overwrite", k, auxArray[j]]);
    mainArray[k++] = auxArray[j++];
  }

  // mark range as merged
  animations.push(["merged", startIdx, endIdx]);
}
