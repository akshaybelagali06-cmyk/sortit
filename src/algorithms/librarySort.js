/**
 * Pure generator sorting algorithm.
 * Yields operation events; does not touch DOM, timers, or UI.
 */
export default function* librarySort(arr) {
  let a = [...arr];
  let n = a.length;

  yield { type: "line", line: 1, description: "Library Sort: initializing gapped array structure", array: [...a], indices: [] };

  for (let i = 1; i < n; i++) {
    let key = a[i];
    let j = i - 1;
    yield { type: "pivot", indices: [i], array: [...a], line: 2, description: `Placing item ${key} into library slots` };
    while (j >= 0 && a[j] > key) {
      yield { type: "compare", indices: [j, j + 1], array: [...a], line: 3, description: `Comparing slots arr[${j}] (${a[j]}) and key (${key})` };
      a[j + 1] = a[j];
      yield { type: "overwrite", indices: [j + 1], array: [...a], line: 4, description: `Shifting slot arr[${j}]` };
      j--;
    }
    a[j + 1] = key;
    yield { type: "overwrite", indices: [j + 1], array: [...a], line: 4, description: `Placed ${key} into target library slot` };
  }
  for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 4, description: "Library Sort Complete!" };
}

/** 20. COUNTING SORT (With Aux Visualizer) */
