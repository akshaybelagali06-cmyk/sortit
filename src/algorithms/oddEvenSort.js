/**
 * Pure generator sorting algorithm.
 * Yields operation events; does not touch DOM, timers, or UI.
 */
export default function* oddEvenSort(arr) {
  let a = [...arr];
  let n = a.length;
  let isSorted = false;

  while (!isSorted) {
    isSorted = true;
    yield { type: "line", line: 4, description: "Odd Phase: comparing odd-indexed pairs", array: [...a], indices: [] };
    for (let i = 1; i <= n - 2; i += 2) {
      yield { type: "compare", indices: [i, i + 1], array: [...a], line: 4, description: `Comparing arr[${i}] (${a[i]}) and arr[${i + 1}] (${a[i + 1]})` };
      if (a[i] > a[i + 1]) {
        let temp = a[i];
        a[i] = a[i + 1];
        a[i + 1] = temp;
        isSorted = false;
        yield { type: "swap", indices: [i, i + 1], array: [...a], line: 4, description: `Swapping arr[${i}] and arr[${i + 1}]` };
      }
    }

    yield { type: "line", line: 5, description: "Even Phase: comparing even-indexed pairs", array: [...a], indices: [] };
    for (let i = 0; i <= n - 2; i += 2) {
      yield { type: "compare", indices: [i, i + 1], array: [...a], line: 5, description: `Comparing arr[${i}] (${a[i]}) and arr[${i + 1}] (${a[i + 1]})` };
      if (a[i] > a[i + 1]) {
        let temp = a[i];
        a[i] = a[i + 1];
        a[i + 1] = temp;
        isSorted = false;
        yield { type: "swap", indices: [i, i + 1], array: [...a], line: 5, description: `Swapping arr[${i}] and arr[${i + 1}]` };
      }
    }
  }
  for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 5, description: "Odd-Even Sort Complete!" };
}

/** 18. TREE SORT (BST) */
