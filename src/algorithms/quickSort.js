/**
 * Pure generator sorting algorithm.
 * Yields operation events; does not touch DOM, timers, or UI.
 */
export default function* quickSort(arr) {
  let a = [...arr];

  function* partition(low, high) {
    let pivot = a[high];
    yield { type: "pivot", indices: [high], array: [...a], line: 6, description: `Selected pivot arr[${high}] (${pivot})` };
    let i = low - 1;
    for (let j = low; j < high; j++) {
      yield { type: "compare", indices: [j, high], array: [...a], line: 6, description: `Comparing arr[${j}] (${a[j]}) with pivot (${pivot})` };
      if (a[j] < pivot) {
        i++;
        let temp = a[i];
        a[i] = a[j];
        a[j] = temp;
        yield { type: "swap", indices: [i, j], array: [...a], line: 6, description: `Swapping arr[${i}] and arr[${j}] (< pivot)` };
      }
    }
    let temp = a[i + 1];
    a[i + 1] = a[high];
    a[high] = temp;
    yield { type: "swap", indices: [i + 1, high], array: [...a], line: 6, description: `Placed pivot at final partition index ${i + 1}` };
    return i + 1;
  }

  function* helper(low, high) {
    if (low < high) {
      let pi = yield* partition(low, high);
      yield { type: "markSorted", indices: [pi], array: [...a], line: 3, description: `Pivot at ${pi} is sorted` };
      yield* helper(low, pi - 1);
      yield* helper(pi + 1, high);
    } else if (low === high) {
      yield { type: "markSorted", indices: [low], array: [...a], line: 1, description: `Single element at ${low} is sorted` };
    }
  }

  yield* helper(0, a.length - 1);
  for (let k = 0; k < a.length; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 6, description: "Quick Sort Complete!" };
}

/** 6. HEAP SORT */
