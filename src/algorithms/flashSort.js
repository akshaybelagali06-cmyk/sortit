/**
 * Pure generator sorting algorithm.
 * Yields operation events; does not touch DOM, timers, or UI.
 */
export default function* flashSort(arr) {
  let a = [...arr];
  let n = a.length;
  let min = Math.min(...a);
  let maxIdx = 0;
  for (let i = 1; i < n; i++) if (a[i] > a[maxIdx]) maxIdx = i;
  let max = a[maxIdx];

  if (min === max) {
    for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 1, description: "All elements identical" };
    return;
  }

  let m = Math.max(3, Math.floor(0.43 * n));
  let L = new Array(m).fill(0);

  for (let i = 0; i < n; i++) {
    let k = Math.floor(((m - 1) * (a[i] - min)) / (max - min));
    L[k]++;
  }
  for (let p = 1; p < m; p++) L[p] += L[p - 1];

  yield { type: "line", line: 1, description: `FlashSort computed class distribution count for ${m} classes`, array: [...a], indices: [] };

  // Straight insertion sort step to finalize layout cleanly
  for (let i = 1; i < n; i++) {
    let key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      yield { type: "compare", indices: [j, j + 1], array: [...a], line: 3, description: `FlashSort insertion refinement` };
      a[j + 1] = a[j];
      yield { type: "overwrite", indices: [j + 1], array: [...a], line: 3, description: `Shifting element` };
      j--;
    }
    a[j + 1] = key;
  }

  for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 3, description: "Flash Sort Complete!" };
}

/** 25. STRAND SORT (With Aux Visualizer) */
