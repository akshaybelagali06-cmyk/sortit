/**
 * Pure generator sorting algorithm.
 * Yields operation events; does not touch DOM, timers, or UI.
 */
export default function* bitonicSort(arr) {
  let a = [...arr];
  let origLen = a.length;
  if (origLen === 0) return;

  // 1. Pad the array to the nearest power of 2 using Infinity
  let n = 1;
  while (n < origLen) {
    n *= 2;
  }
  while (a.length < n) {
    a.push(Infinity);
  }

  function* bitonicMerge(low, count, dir) {
    if (count > 1) {
      let k = Math.floor(count / 2);
      for (let i = low; i < low + k; i++) {
        // Exclude yield comparison visuals for padded virtual elements outside original bounds
        if (i < origLen || i + k < origLen) {
          yield {
            type: "compare",
            indices: [i, i + k],
            array: a.slice(0, origLen),
            line: 5,
            description: `Bitonic compare arr[${i}] (${a[i]}) and arr[${i + k}] (${a[i + k]}) dir=${dir ? "ASC" : "DESC"}`
          };
        }

        if ((dir && a[i] > a[i + k]) || (!dir && a[i] < a[i + k])) {
          let temp = a[i];
          a[i] = a[i + k];
          a[i + k] = temp;

          if (i < origLen || i + k < origLen) {
            yield {
              type: "swap",
              indices: [i, i + k],
              array: a.slice(0, origLen),
              line: 5,
              description: `Swapping bitonic elements`
            };
          }
        }
      }
      yield* bitonicMerge(low, k, dir);
      yield* bitonicMerge(low + k, k, dir);
    }
  }

  function* bitonicSortRec(low, count, dir) {
    if (count > 1) {
      let k = Math.floor(count / 2);
      yield* bitonicSortRec(low, k, true);
      yield* bitonicSortRec(low + k, k, false);
      yield* bitonicMerge(low, count, dir);
    }
  }

  yield* bitonicSortRec(0, n, true);

  // 2. Remove padded elements
  a = a.slice(0, origLen);

  for (let k = 0; k < origLen; k++) {
    yield {
      type: "markSorted",
      indices: [k],
      array: [...a],
      line: 5,
      description: "Bitonic Sort Complete!"
    };
  }
}

/** 13. PANCAKE SORT */
