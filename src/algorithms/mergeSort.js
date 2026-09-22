/**
 * Pure generator sorting algorithm.
 * Yields operation events; does not touch DOM, timers, or UI.
 */
export default function* mergeSort(arr) {
  let a = [...arr];

  function* helper(l, r) {
    if (l >= r) return;
    let mid = Math.floor((l + r) / 2);
    yield { type: "line", line: 3, description: `Dividing array from ${l} to ${r} at mid=${mid}`, array: [...a], indices: [mid] };
    yield* helper(l, mid);
    yield* helper(mid + 1, r);
    yield* merge(l, mid, r);
  }

  function* merge(l, mid, r) {
    let left = a.slice(l, mid + 1);
    let right = a.slice(mid + 1, r + 1);
    let i = 0, j = 0, k = l;

    yield { type: "line", line: 6, description: `Merging subarrays [${l}..${mid}] and [${mid + 1}..${r}]`, array: [...a], indices: [l, r] };

    while (i < left.length && j < right.length) {
      yield { type: "compare", indices: [l + i, mid + 1 + j], array: [...a], line: 6, description: `Comparing left element ${left[i]} and right element ${right[j]}` };
      if (left[i] <= right[j]) {
        a[k] = left[i];
        yield { type: "overwrite", indices: [k], array: [...a], line: 6, description: `Placed ${left[i]} at arr[${k}]` };
        i++;
      } else {
        a[k] = right[j];
        yield { type: "overwrite", indices: [k], array: [...a], line: 6, description: `Placed ${right[j]} at arr[${k}]` };
        j++;
      }
      k++;
    }
    while (i < left.length) {
      a[k] = left[i];
      yield { type: "overwrite", indices: [k], array: [...a], line: 6, description: `Copying remaining left element ${left[i]} to arr[${k}]` };
      i++;
      k++;
    }
    while (j < right.length) {
      a[k] = right[j];
      yield { type: "overwrite", indices: [k], array: [...a], line: 6, description: `Copying remaining right element ${right[j]} to arr[${k}]` };
      j++;
      k++;
    }
  }

  yield* helper(0, a.length - 1);
  for (let k = 0; k < a.length; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 6, description: "Merge Sort Complete!" };
}

/** 5. QUICK SORT */
