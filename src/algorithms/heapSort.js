/**
 * Pure generator sorting algorithm.
 * Yields operation events; does not touch DOM, timers, or UI.
 */
export default function* heapSort(arr) {
  let a = [...arr];
  let n = a.length;

  function* heapify(size, i) {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;

    if (l < size) {
      yield { type: "compare", indices: [l, largest], array: [...a], line: 4, description: `Comparing left child arr[${l}] (${a[l]}) with root arr[${largest}] (${a[largest]})` };
      if (a[l] > a[largest]) largest = l;
    }
    if (r < size) {
      yield { type: "compare", indices: [r, largest], array: [...a], line: 4, description: `Comparing right child arr[${r}] (${a[r]}) with largest arr[${largest}] (${a[largest]})` };
      if (a[r] > a[largest]) largest = r;
    }

    if (largest !== i) {
      let temp = a[i];
      a[i] = a[largest];
      a[largest] = temp;
      yield { type: "swap", indices: [i, largest], array: [...a], line: 4, description: `Swapping root arr[${i}] with larger child arr[${largest}]` };
      yield* heapify(size, largest);
    }
  }

  yield { type: "line", line: 1, description: "Building Max Heap", array: [...a], indices: [] };
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    let temp = a[0];
    a[0] = a[i];
    a[i] = temp;
    yield { type: "swap", indices: [0, i], array: [...a], line: 3, description: `Extracted max root arr[0] to end position arr[${i}]` };
    yield { type: "markSorted", indices: [i], array: [...a], line: 3, description: `Element at ${i} sorted` };
    yield* heapify(i, 0);
  }
  for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 4, description: "Heap Sort Complete!" };
}

/** 7. SHELL SORT */
