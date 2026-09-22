/**
 * Pure generator sorting algorithm.
 * Yields operation events; does not touch DOM, timers, or UI.
 */
export default function* selectionSort(arr) {
  let a = [...arr];
  let n = a.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    yield { type: "pivot", indices: [i], array: [...a], line: 2, description: `Setting initial minimum at index ${i} (${a[i]})` };
    for (let j = i + 1; j < n; j++) {
      yield { type: "compare", indices: [j, minIdx], array: [...a], line: 4, description: `Comparing arr[${j}] (${a[j]}) with current min arr[${minIdx}] (${a[minIdx]})` };
      if (a[j] < a[minIdx]) {
        minIdx = j;
        yield { type: "pivot", indices: [minIdx], array: [...a], line: 4, description: `New minimum found at index ${minIdx} (${a[minIdx]})` };
      }
    }
    if (minIdx !== i) {
      let temp = a[i];
      a[i] = a[minIdx];
      a[minIdx] = temp;
      yield { type: "swap", indices: [i, minIdx], array: [...a], line: 6, description: `Swapping arr[${i}] and min element at arr[${minIdx}]` };
    }
    yield { type: "markSorted", indices: [i], array: [...a], line: 1, description: `Element at index ${i} sorted` };
  }
}

/** 3. INSERTION SORT */
