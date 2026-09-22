/**
 * Pure generator sorting algorithm.
 * Yields operation events; does not touch DOM, timers, or UI.
 */
export default function* cocktailSort(arr) {
  let a = [...arr];
  let swapped = true;
  let start = 0;
  let end = a.length - 1;

  while (swapped) {
    swapped = false;
    for (let i = start; i < end; i++) {
      yield { type: "compare", indices: [i, i + 1], array: [...a], line: 4, description: `Forward pass: comparing arr[${i}] (${a[i]}) and arr[${i + 1}] (${a[i + 1]})` };
      if (a[i] > a[i + 1]) {
        let temp = a[i];
        a[i] = a[i + 1];
        a[i + 1] = temp;
        swapped = true;
        yield { type: "swap", indices: [i, i + 1], array: [...a], line: 4, description: `Swapped arr[${i}] and arr[${i + 1}]` };
      }
    }
    yield { type: "markSorted", indices: [end], array: [...a], line: 6, description: `End index ${end} is sorted` };
    if (!swapped) break;
    swapped = false;
    end--;

    for (let i = end - 1; i >= start; i--) {
      yield { type: "compare", indices: [i, i + 1], array: [...a], line: 7, description: `Backward pass: comparing arr[${i}] (${a[i]}) and arr[${i + 1}] (${a[i + 1]})` };
      if (a[i] > a[i + 1]) {
        let temp = a[i];
        a[i] = a[i + 1];
        a[i + 1] = temp;
        swapped = true;
        yield { type: "swap", indices: [i, i + 1], array: [...a], line: 7, description: `Swapped arr[${i}] and arr[${i + 1}]` };
      }
    }
    yield { type: "markSorted", indices: [start], array: [...a], line: 8, description: `Start index ${start} is sorted` };
    start++;
  }
  for (let k = 0; k < a.length; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 8, description: "Cocktail Sort Complete!" };
}

/** 10. GNOME SORT */
