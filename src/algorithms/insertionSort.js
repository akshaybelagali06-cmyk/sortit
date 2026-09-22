/**
 * Pure generator sorting algorithm.
 * Yields operation events; does not touch DOM, timers, or UI.
 */
export default function* insertionSort(arr) {
  let a = [...arr];
  let n = a.length;
  yield { type: "markSorted", indices: [0], array: [...a], line: 1, description: "First element is sorted by default" };
  for (let i = 1; i < n; i++) {
    let key = a[i];
    let j = i - 1;
    yield { type: "pivot", indices: [i], array: [...a], line: 2, description: `Inserting key arr[${i}] (${key}) into sorted portion` };
    while (j >= 0 && a[j] > key) {
      yield { type: "compare", indices: [j, j + 1], array: [...a], line: 4, description: `arr[${j}] (${a[j]}) > key (${key}), shifting right` };
      a[j + 1] = a[j];
      yield { type: "overwrite", indices: [j + 1], array: [...a], line: 5, description: `Shifted arr[${j}] to arr[${j + 1}]` };
      j--;
    }
    a[j + 1] = key;
    yield { type: "overwrite", indices: [j + 1], array: [...a], line: 7, description: `Placed key (${key}) at index ${j + 1}` };
  }
  for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 7, description: "Insertion Sort Complete!" };
}

/** 4. MERGE SORT */
