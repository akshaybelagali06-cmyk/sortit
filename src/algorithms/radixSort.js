/**
 * Pure generator sorting algorithm.
 * Yields operation events; does not touch DOM, timers, or UI.
 */
export default function* radixSort(arr) {
  let a = [...arr];
  let maxVal = Math.max(...a);

  for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
    let buckets = Array.from({ length: 10 }, () => []);
    yield {
      type: "line",
      line: 4,
      description: `Radix Pass for ${exp}s digit place`,
      array: [...a],
      indices: [],
      auxData: { label: "10 Digit Buckets (0-9)", items: buckets.map((b, i) => ({ value: `[${i}]: ${b.join(",")}` })) }
    };

    for (let i = 0; i < a.length; i++) {
      let digit = Math.floor(a[i] / exp) % 10;
      buckets[digit].push(a[i]);
      yield {
        type: "compare",
        indices: [i],
        array: [...a],
        line: 4,
        description: `Placing arr[${i}] (${a[i]}) into Bucket ${digit}`,
        auxData: { label: "10 Digit Buckets (0-9)", items: buckets.map((b, bIdx) => ({ value: `[${bIdx}]: ${b.join(",")}`, state: bIdx === digit ? "active" : "" })) }
      };
    }

    let idx = 0;
    for (let b = 0; b < 10; b++) {
      while (buckets[b].length > 0) {
        let val = buckets[b].shift();
        a[idx] = val;
        yield {
          type: "overwrite",
          indices: [idx],
          array: [...a],
          line: 5,
          description: `Collecting ${val} from Bucket ${b} to arr[${idx}]`,
          auxData: { label: "10 Digit Buckets (0-9)", items: buckets.map((bk, bIdx) => ({ value: `[${bIdx}]: ${bk.join(",")}`, state: bIdx === b ? "active" : "" })) }
        };
        idx++;
      }
    }
  }

  for (let k = 0; k < a.length; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 5, description: "Radix Sort Complete!" };
}

/** 22. BUCKET SORT (With Aux Visualizer) */
