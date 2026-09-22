/**
 * Pure generator sorting algorithm.
 * Yields operation events; does not touch DOM, timers, or UI.
 */
export default function* stoogeSort(arr) {
  let a = [...arr];

  function* helper(l, h) {
    yield { type: "compare", indices: [l, h], array: [...a], line: 2, description: `Stooge comparing arr[${l}] (${a[l]}) and arr[${h}] (${a[h]})` };
    if (a[l] > a[h]) {
      let temp = a[l];
      a[l] = a[h];
      a[h] = temp;
      yield { type: "swap", indices: [l, h], array: [...a], line: 2, description: `Swapping arr[${l}] and arr[${h}]` };
    }

    if (h - l + 1 > 2) {
      let t = Math.floor((h - l + 1) / 3);
      yield { type: "line", line: 4, description: `Stooge recursive 2/3 splits (t=${t})`, array: [...a], indices: [l, h] };
      yield* helper(l, h - t);
      yield* helper(l + t, h);
      yield* helper(l, h - t);
    }
  }

  yield* helper(0, a.length - 1);
  for (let k = 0; k < a.length; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 6, description: "Stooge Sort Complete!" };
}

/** 16. TIM SORT */
