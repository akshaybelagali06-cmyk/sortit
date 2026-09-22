/**
 * Pure generator sorting algorithm.
 * Yields operation events; does not touch DOM, timers, or UI.
 */
export default function* gnomeSort(arr) {
  let a = [...arr];
  let n = a.length;
  let pos = 0;

  while (pos < n) {
    if (pos === 0) {
      pos++;
      yield { type: "line", line: 3, description: "Gnome at index 0, stepping forward", array: [...a], indices: [pos] };
    }
    yield { type: "compare", indices: [pos, pos - 1], array: [...a], line: 3, description: `Gnome comparing arr[${pos}] (${a[pos]}) and arr[${pos - 1}] (${a[pos - 1]})` };
    if (a[pos] >= a[pos - 1]) {
      pos++;
      yield { type: "line", line: 4, description: `In order, gnome steps forward to ${pos}`, array: [...a], indices: [pos] };
    } else {
      let temp = a[pos];
      a[pos] = a[pos - 1];
      a[pos - 1] = temp;
      yield { type: "swap", indices: [pos, pos - 1], array: [...a], line: 6, description: `Out of order! Gnome swaps arr[${pos}] and arr[${pos - 1}] and steps back` };
      pos--;
    }
  }
  for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 6, description: "Gnome Sort Complete!" };
}

/** 11. CYCLE SORT */
