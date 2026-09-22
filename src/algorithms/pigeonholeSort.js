/**
 * Pure generator sorting algorithm.
 * Yields operation events; does not touch DOM, timers, or UI.
 */
export default function* pigeonholeSort(arr) {
  let a = [...arr];
  let n = a.length;
  let min = Math.min(...a);
  let max = Math.max(...a);
  let range = max - min + 1;
  let holes = Array.from({ length: range }, () => []);

  yield { type: "line", line: 2, description: `Setting up ${range} pigeonholes (range [${min}..${max}])`, array: [...a], indices: [] };

  for (let i = 0; i < n; i++) {
    let hIdx = a[i] - min;
    holes[hIdx].push(a[i]);
    yield {
      type: "compare",
      indices: [i],
      array: [...a],
      line: 3,
      description: `Placed arr[${i}] (${a[i]}) into Pigeonhole ${hIdx}`,
      auxData: { label: "Pigeonholes", items: holes.map((h, idx) => ({ value: `[${idx + min}]: ${h.length}`, state: idx === hIdx ? "active" : "" })) }
    };
  }

  let idx = 0;
  for (let h = 0; h < range; h++) {
    while (holes[h].length > 0) {
      let val = holes[h].shift();
      a[idx] = val;
      yield {
        type: "overwrite",
        indices: [idx],
        array: [...a],
        line: 4,
        description: `Extracting from Pigeonhole ${h} -> writing ${val} at arr[${idx}]`,
        auxData: { label: "Pigeonholes", items: holes.map((hk, idx) => ({ value: `[${idx + min}]: ${hk.length}`, state: idx === h ? "active" : "" })) }
      };
      idx++;
    }
  }

  for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 4, description: "Pigeonhole Sort Complete!" };
}

/** 24. FLASH SORT */
