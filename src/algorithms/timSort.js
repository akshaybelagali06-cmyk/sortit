/**
 * Pure generator sorting algorithm.
 * Yields operation events; does not touch DOM, timers, or UI.
 */
export default function* timSort(arr) {
  let a = [...arr];
  let n = a.length;
  let RUN = 4;

  for (let i = 0; i < n; i += RUN) {
    let right = Math.min(i + RUN - 1, n - 1);
    yield { type: "line", line: 2, description: `Insertion sort on run [${i}..${right}]`, array: [...a], indices: [i, right] };
    for (let j = i + 1; j <= right; j++) {
      let key = a[j];
      let k = j - 1;
      while (k >= i && a[k] > key) {
        yield { type: "compare", indices: [k, k + 1], array: [...a], line: 2, description: `TimSort run insertion comparison` };
        a[k + 1] = a[k];
        yield { type: "overwrite", indices: [k + 1], array: [...a], line: 2, description: `TimSort run shift` };
        k--;
      }
      a[k + 1] = key;
    }
  }

  for (let size = RUN; size < n; size = 2 * size) {
    for (let left = 0; left < n; left += 2 * size) {
      let mid = left + size - 1;
      let right = Math.min(left + 2 * size - 1, n - 1);
      if (mid < right) {
        yield { type: "line", line: 5, description: `Merging TimSort runs [${left}..${mid}] and [${mid + 1}..${right}]`, array: [...a], indices: [left, right] };
        let tempArr = [];
        let p1 = left, p2 = mid + 1;
        while (p1 <= mid && p2 <= right) {
          yield { type: "compare", indices: [p1, p2], array: [...a], line: 5, description: `Comparing run elements` };
          if (a[p1] <= a[p2]) tempArr.push(a[p1++]);
          else tempArr.push(a[p2++]);
        }
        while (p1 <= mid) tempArr.push(a[p1++]);
        while (p2 <= right) tempArr.push(a[p2++]);
        for (let idx = 0; idx < tempArr.length; idx++) {
          a[left + idx] = tempArr[idx];
          yield { type: "overwrite", indices: [left + idx], array: [...a], line: 5, description: `Merging back to main array` };
        }
      }
    }
  }

  for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 6, description: "Tim Sort Complete!" };
}

/** 17. ODD-EVEN SORT (BRICK) */
