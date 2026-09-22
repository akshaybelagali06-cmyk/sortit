/**
 * Pure generator sorting algorithm.
 * Yields operation events; does not touch DOM, timers, or UI.
 */
export default function* countingSort(arr) {
  let a = [...arr];
  let n = a.length;
  let min = Math.min(...a);
  let max = Math.max(...a);
  let range = max - min + 1;
  let count = new Array(range).fill(0);

  yield { type: "line", line: 2, description: `Creating count frequency array of size ${range} (min=${min}, max=${max})`, array: [...a], indices: [], auxData: { label: "Frequency Bins", items: count.map((v, i) => ({ value: `${i + min}: ${v}` })) } };

  for (let i = 0; i < n; i++) {
    let idx = a[i] - min;
    count[idx]++;
    yield {
      type: "compare",
      indices: [i],
      array: [...a],
      line: 3,
      description: `Counted arr[${i}] (${a[i]}), frequency bin [${a[i] - min}] = ${count[idx]}`,
      auxData: { label: "Frequency Bins", items: count.map((v, cIdx) => ({ value: `${cIdx + min}: ${v}`, state: cIdx === idx ? "active" : "" })) }
    };
  }

  let outIdx = 0;
  for (let c = 0; c < range; c++) {
    while (count[c] > 0) {
      a[outIdx] = c + min;
      count[c]--;
      yield {
        type: "overwrite",
        indices: [outIdx],
        array: [...a],
        line: 4,
        description: `Reconstructing array: writing val ${c + min} to index ${outIdx}`,
        auxData: { label: "Frequency Bins", items: count.map((v, cIdx) => ({ value: `${cIdx + min}: ${v}`, state: cIdx === c ? "active" : "" })) }
      };
      outIdx++;
    }
  }

  for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 4, description: "Counting Sort Complete!" };
}

/** 21. RADIX SORT (LSD, With Aux Visualizer) */
