/**
 * Pure generator sorting algorithm.
 * Yields operation events; does not touch DOM, timers, or UI.
 */
export default function* bogoSort(arr) {
  let a = [...arr];
  let n = a.length;

  function isSorted() {
    for (let i = 0; i < n - 1; i++) {
      if (a[i] > a[i + 1]) return false;
    }
    return true;
  }

  let attempts = 0;
  const MAX_ATTEMPTS = 200;

  while (!isSorted() && attempts < MAX_ATTEMPTS) {
    attempts++;
    yield { type: "line", line: 2, description: `Bogo attempt ${attempts}: Shuffling array randomly...`, array: [...a], indices: [] };
    for (let i = n - 1; i > 0; i--) {
      let r = Math.floor(Math.random() * (i + 1));
      let temp = a[i];
      a[i] = a[r];
      a[r] = temp;
    }
    yield { type: "swap", indices: [0, n - 1], array: [...a], line: 2, description: `Random shuffle executed` };
  }

  if (isSorted()) {
    for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 3, description: "Bogo Sort miraculously succeeded!" };
  } else {
    yield { type: "line", line: 3, description: `Reached max Bogo attempts (${MAX_ATTEMPTS}). Fallback to standard sort for safety!`, array: [...a], indices: [] };
    a.sort((x, y) => x - y);
    for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 3, description: "Sorted array via fallback" };
  }
}

/** 15. STOOGE SORT */
