/**
 * Pure generator sorting algorithm.
 * Yields operation events; does not touch DOM, timers, or UI.
 */
export default function* combSort(arr) {
  let a = [...arr];
  let n = a.length;
  let gap = n;
  let shrink = 1.3;
  let sorted = false;

  while (!sorted) {
    gap = Math.floor(gap / shrink);
    if (gap <= 1) {
      gap = 1;
      sorted = true;
    }
    yield { type: "line", line: 3, description: `Comb Gap set to ${gap}`, array: [...a], indices: [] };

    for (let i = 0; i + gap < n; i++) {
      yield { type: "compare", indices: [i, i + gap], array: [...a], line: 7, description: `Comparing arr[${i}] (${a[i]}) and arr[${i + gap}] (${a[i + gap]})` };
      if (a[i] > a[i + gap]) {
        let temp = a[i];
        a[i] = a[i + gap];
        a[i + gap] = temp;
        sorted = false;
        yield { type: "swap", indices: [i, i + gap], array: [...a], line: 7, description: `Swapping arr[${i}] and arr[${i + gap}]` };
      }
    }
  }
  for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 7, description: "Comb Sort Complete!" };
}

/** 9. COCKTAIL SHAKER SORT */
