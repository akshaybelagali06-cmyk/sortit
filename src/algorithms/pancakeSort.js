/**
 * Pure generator sorting algorithm.
 * Yields operation events; does not touch DOM, timers, or UI.
 */
export default function* pancakeSort(arr) {
  let a = [...arr];
  let n = a.length;

  function* flip(k) {
    let left = 0;
    yield { type: "line", line: 4, description: `Flipping sub-array 0 to ${k}`, array: [...a], indices: [0, k] };
    while (left < k) {
      let temp = a[left];
      a[left] = a[k];
      a[k] = temp;
      yield { type: "swap", indices: [left, k], array: [...a], line: 4, description: `Flipping elements arr[${left}] and arr[${k}]` };
      left++;
      k--;
    }
  }

  for (let currSize = n; currSize > 1; currSize--) {
    let maxIdx = 0;
    for (let i = 1; i < currSize; i++) {
      yield { type: "compare", indices: [i, maxIdx], array: [...a], line: 2, description: `Finding max element up to size ${currSize}: comparing arr[${i}] and arr[${maxIdx}]` };
      if (a[i] > a[maxIdx]) maxIdx = i;
    }

    if (maxIdx !== currSize - 1) {
      if (maxIdx !== 0) {
        yield* flip(maxIdx);
      }
      yield* flip(currSize - 1);
    }
    yield { type: "markSorted", indices: [currSize - 1], array: [...a], line: 5, description: `Element at index ${currSize - 1} sorted` };
  }
  for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 5, description: "Pancake Sort Complete!" };
}

/** 14. BOGO SORT (With safety step cap) */
