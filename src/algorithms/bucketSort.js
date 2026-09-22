/**
 * Pure generator sorting algorithm.
 * Yields operation events; does not touch DOM, timers, or UI.
 */
export default function* bucketSort(arr) {
  let a = [...arr];
  let n = a.length;
  let min = Math.min(...a);
  let max = Math.max(...a);
  let numBuckets = Math.max(3, Math.floor(Math.sqrt(n)));
  let buckets = Array.from({ length: numBuckets }, () => []);

  yield { type: "line", line: 1, description: `Distributing into ${numBuckets} buckets`, array: [...a], indices: [], auxData: { label: "Buckets", items: buckets.map((b, i) => ({ value: `B${i}: ${b.join(",")}` })) } };

  for (let i = 0; i < n; i++) {
    let bIdx = Math.floor(((a[i] - min) / (max - min + 1)) * numBuckets);
    if (bIdx >= numBuckets) bIdx = numBuckets - 1;
    buckets[bIdx].push(a[i]);
    yield {
      type: "compare",
      indices: [i],
      array: [...a],
      line: 2,
      description: `Putting arr[${i}] (${a[i]}) in Bucket ${bIdx}`,
      auxData: { label: "Buckets", items: buckets.map((b, idx) => ({ value: `B${idx}: ${b.join(",")}`, state: idx === bIdx ? "active" : "" })) }
    };
  }

  let outIdx = 0;
  for (let b = 0; b < numBuckets; b++) {
    buckets[b].sort((x, y) => x - y);
    for (let val of buckets[b]) {
      a[outIdx] = val;
      yield {
        type: "overwrite",
        indices: [outIdx],
        array: [...a],
        line: 4,
        description: `Flattening sorted Bucket ${b}: writing ${val} to arr[${outIdx}]`,
        auxData: { label: "Buckets", items: buckets.map((bk, idx) => ({ value: `B${idx}: ${bk.join(",")}`, state: idx === b ? "active" : "" })) }
      };
      outIdx++;
    }
  }

  for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 4, description: "Bucket Sort Complete!" };
}

/** 23. PIGEONHOLE SORT (With Aux Visualizer) */
