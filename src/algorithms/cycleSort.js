/**
 * Pure generator sorting algorithm.
 * Yields operation events; does not touch DOM, timers, or UI.
 */
export default function* cycleSort(arr) {
  let a = [...arr];
  let n = a.length;

  for (let cycleStart = 0; cycleStart <= n - 2; cycleStart++) {
    let item = a[cycleStart];
    let pos = cycleStart;

    yield { type: "pivot", indices: [cycleStart], array: [...a], line: 2, description: `Cycle start at ${cycleStart}, item = ${item}` };

    for (let i = cycleStart + 1; i < n; i++) {
      yield { type: "compare", indices: [i, cycleStart], array: [...a], line: 3, description: `Counting elements smaller than item (${item})` };
      if (a[i] < item) pos++;
    }

    if (pos === cycleStart) continue;

    while (item === a[pos]) pos++;

    if (pos !== cycleStart) {
      let temp = a[pos];
      a[pos] = item;
      item = temp;
      yield { type: "swap", indices: [pos, cycleStart], array: [...a], line: 5, description: `Placed item into position ${pos}` };
    }

    while (pos !== cycleStart) {
      pos = cycleStart;
      for (let i = cycleStart + 1; i < n; i++) {
        yield { type: "compare", indices: [i, cycleStart], array: [...a], line: 6, description: `Re-evaluating target position for item (${item})` };
        if (a[i] < item) pos++;
      }
      while (item === a[pos]) pos++;
      if (item !== a[pos]) {
        let temp = a[pos];
        a[pos] = item;
        item = temp;
        yield { type: "swap", indices: [pos, cycleStart], array: [...a], line: 6, description: `Rotating cycle item into position ${pos}` };
      }
    }
  }
  for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 6, description: "Cycle Sort Complete!" };
}

/** 12. BITONIC SORT */
