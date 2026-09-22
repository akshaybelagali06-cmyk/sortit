/**
 * Pure generator sorting algorithm.
 * Yields operation events; does not touch DOM, timers, or UI.
 */
export default function* shellSort(arr) {
  let a = [...arr];
  let n = a.length;
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    yield { type: "line", line: 1, description: `Current Gap = ${gap}`, array: [...a], indices: [] };
    for (let i = gap; i < n; i++) {
      let temp = a[i];
      let j = i;
      yield { type: "pivot", indices: [i], array: [...a], line: 4, description: `Holding temp = ${temp} at index ${i}` };
      while (j >= gap) {
        yield { type: "compare", indices: [j - gap, j], array: [...a], line: 5, description: `Comparing arr[${j - gap}] (${a[j - gap]}) and temp (${temp}) with gap ${gap}` };
        if (a[j - gap] > temp) {
          a[j] = a[j - gap];
          yield { type: "overwrite", indices: [j], array: [...a], line: 6, description: `Shifted arr[${j - gap}] forward to arr[${j}]` };
          j -= gap;
        } else {
          break;
        }
      }
      a[j] = temp;
      yield { type: "overwrite", indices: [j], array: [...a], line: 7, description: `Inserted temp (${temp}) at index ${j}` };
    }
  }
  for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 8, description: "Shell Sort Complete!" };
}

/** 8. COMB SORT */
