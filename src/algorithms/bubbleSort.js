/**
 * Pure generator sorting algorithm.
 * Yields operation events; does not touch DOM, timers, or UI.
 */
export default function* bubbleSort(arr) {
  let a = [...arr];
  let n = a.length;
  let swapped;
  for (let i = 0; i < n - 1; i++) {
    swapped = false;
    yield { type: "line", line: 1, description: `Starting pass ${i + 1}`, array: [...a], indices: [] };
    for (let j = 0; j < n - i - 1; j++) {
      yield {
        type: "compare",
        indices: [j, j + 1],
        array: [...a],
        line: 4,
        description: `Comparing arr[${j}] (${a[j]}) and arr[${j + 1}] (${a[j + 1]})`
      };
      if (a[j] > a[j + 1]) {
        let temp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = temp;
        swapped = true;
        yield {
          type: "swap",
          indices: [j, j + 1],
          array: [...a],
          line: 5,
          description: `Swapped arr[${j}] and arr[${j + 1}]`
        };
      }
    }
    yield { type: "markSorted", indices: [n - 1 - i], array: [...a], line: 7, description: `Element at index ${n - 1 - i} is in final sorted position` };
    if (!swapped) break;
  }
  for (let k = 0; k < n; k++) {
    yield { type: "markSorted", indices: [k], array: [...a], line: 7, description: "Bubble Sort Complete!" };
  }
}

/** 2. SELECTION SORT */
