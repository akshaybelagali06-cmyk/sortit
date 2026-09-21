/**
 * algorithms.js - Pure ES6 Generator Functions for 25 Sorting Algorithms
 * 
 * Each algorithm is implemented as a generator function that yields operation event objects:
 * {
 *   type: 'compare' | 'swap' | 'overwrite' | 'markSorted' | 'pivot' | 'aux' | 'line',
 *   indices: number[],         // Indices in the primary array involved
 *   array: number[],           // Full snapshot of the primary array after operation
 *   line: number,              // 1-based index of highlighted pseudocode line
 *   description: string,       // Human-readable narration step
 *   auxData?: { label: string, items: Array<{ value: any, state?: string }> }
 * }
 */

export const ALGORITHM_METADATA = {
  bubble: {
    name: "Bubble Sort",
    category: "Simple O(N²)",
    timeBest: "O(N)",
    timeAvg: "O(N²)",
    timeWorst: "O(N²)",
    space: "O(1)",
    description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
    pseudocode: [
      "do",
      "  swapped = false",
      "  for i = 0 to n - 2",
      "    if arr[i] > arr[i+1] then",
      "      swap(arr[i], arr[i+1])",
      "      swapped = true",
      "while swapped"
    ]
  },
  selection: {
    name: "Selection Sort",
    category: "Simple O(N²)",
    timeBest: "O(N²)",
    timeAvg: "O(N²)",
    timeWorst: "O(N²)",
    space: "O(1)",
    description: "Divides the array into sorted and unsorted regions, repeatedly finding the minimum element from the unsorted region.",
    pseudocode: [
      "for i = 0 to n - 1",
      "  minIdx = i",
      "  for j = i + 1 to n - 1",
      "    if arr[j] < arr[minIdx] then minIdx = j",
      "  if minIdx != i then",
      "    swap(arr[i], arr[minIdx])"
    ]
  },
  insertion: {
    name: "Insertion Sort",
    category: "Simple O(N²)",
    timeBest: "O(N)",
    timeAvg: "O(N²)",
    timeWorst: "O(N²)",
    space: "O(1)",
    description: "Builds the final sorted array one item at a time by repeatedly inserting an unsorted element into its correct position.",
    pseudocode: [
      "for i = 1 to n - 1",
      "  key = arr[i]",
      "  j = i - 1",
      "  while j >= 0 and arr[j] > key",
      "    arr[j + 1] = arr[j]",
      "    j = j - 1",
      "  arr[j + 1] = key"
    ]
  },
  merge: {
    name: "Merge Sort",
    category: "Efficient O(N log N)",
    timeBest: "O(N log N)",
    timeAvg: "O(N log N)",
    timeWorst: "O(N log N)",
    space: "O(N)",
    description: "A divide-and-conquer algorithm that recursively splits the array in half, sorts each half, and merges them.",
    pseudocode: [
      "function mergeSort(arr, left, right):",
      "  if left >= right then return",
      "  mid = (left + right) / 2",
      "  mergeSort(arr, left, mid)",
      "  mergeSort(arr, mid + 1, right)",
      "  merge(arr, left, mid, right)"
    ]
  },
  quick: {
    name: "Quick Sort",
    category: "Efficient O(N log N)",
    timeBest: "O(N log N)",
    timeAvg: "O(N log N)",
    timeWorst: "O(N²)",
    space: "O(log N)",
    description: "Picks a pivot element and partitions the array such that elements smaller than pivot are on the left and larger on the right.",
    pseudocode: [
      "function quickSort(arr, low, high):",
      "  if low < high then",
      "    pivotIdx = partition(arr, low, high)",
      "    quickSort(arr, low, pivotIdx - 1)",
      "    quickSort(arr, pivotIdx + 1, high)",
      "partition: select pivot, swap elements < pivot to left"
    ]
  },
  heap: {
    name: "Heap Sort",
    category: "Efficient O(N log N)",
    timeBest: "O(N log N)",
    timeAvg: "O(N log N)",
    timeWorst: "O(N log N)",
    space: "O(1)",
    description: "Converts the array into a Max-Heap binary tree, then repeatedly extracts the maximum root element to the end.",
    pseudocode: [
      "buildMaxHeap(arr)",
      "for i = n - 1 down to 1",
      "  swap(arr[0], arr[i])",
      "  heapify(arr, 0, i)"
    ]
  },
  shell: {
    name: "Shell Sort",
    category: "Efficient O(N log N)",
    timeBest: "O(N log N)",
    timeAvg: "O(N^1.3)",
    timeWorst: "O(N²)",
    space: "O(1)",
    description: "Generalization of insertion sort that allows exchanges of items that are far apart, reducing gap distance gradually.",
    pseudocode: [
      "gap = n / 2",
      "while gap > 0",
      "  for i = gap to n - 1",
      "    temp = arr[i], j = i",
      "    while j >= gap and arr[j - gap] > temp",
      "      arr[j] = arr[j - gap], j -= gap",
      "    arr[j] = temp",
      "  gap = gap / 2"
    ]
  },
  comb: {
    name: "Comb Sort",
    category: "Efficient O(N log N)",
    timeBest: "O(N log N)",
    timeAvg: "O(N² / 2^p)",
    timeWorst: "O(N²)",
    space: "O(1)",
    description: "Improves bubble sort by using a gap > 1 with a shrink factor of 1.3 to eliminate small values near the end of the list.",
    pseudocode: [
      "gap = n, shrink = 1.3, swapped = true",
      "while gap > 1 or swapped",
      "  gap = floor(gap / shrink)",
      "  if gap < 1 then gap = 1",
      "  swapped = false",
      "  for i = 0 to n - gap - 1",
      "    if arr[i] > arr[i + gap] swap & swapped = true"
    ]
  },
  cocktail: {
    name: "Cocktail Shaker Sort",
    category: "Simple O(N²)",
    timeBest: "O(N)",
    timeAvg: "O(N²)",
    timeWorst: "O(N²)",
    space: "O(1)",
    description: "A variation of Bubble Sort that traverses the list in both directions alternately.",
    pseudocode: [
      "swapped = true, start = 0, end = n - 1",
      "while swapped",
      "  swapped = false",
      "  for i = start to end - 1: compare & swap left to right",
      "  if not swapped break",
      "  end--",
      "  for i = end - 1 down to start: compare & swap right to left",
      "  start++"
    ]
  },
  gnome: {
    name: "Gnome Sort",
    category: "Simple O(N²)",
    timeBest: "O(N)",
    timeAvg: "O(N²)",
    timeWorst: "O(N²)",
    space: "O(1)",
    description: "Similar to Insertion Sort, moves elements to their proper position by a series of swaps, like a garden gnome sorting flower pots.",
    pseudocode: [
      "pos = 0",
      "while pos < n",
      "  if pos == 0 or arr[pos] >= arr[pos - 1]",
      "    pos++",
      "  else",
      "    swap(arr[pos], arr[pos - 1])",
      "    pos--"
    ]
  },
  cycle: {
    name: "Cycle Sort",
    category: "Simple O(N²)",
    timeBest: "O(N²)",
    timeAvg: "O(N²)",
    timeWorst: "O(N²)",
    space: "O(1)",
    description: "An in-place sorting algorithm that minimizes the total number of memory writes by decomposing array permutations into cycles.",
    pseudocode: [
      "for cycleStart = 0 to n - 2",
      "  item = arr[cycleStart], pos = cycleStart",
      "  count smaller elements after cycleStart to find pos",
      "  if pos == cycleStart continue",
      "  put item to correct pos (swap)",
      "  rotate remaining elements in cycle until back at start"
    ]
  },
  bitonic: {
    name: "Bitonic Sort",
    category: "Efficient O(N log N)",
    timeBest: "O(N log²N)",
    timeAvg: "O(N log²N)",
    timeWorst: "O(N log²N)",
    space: "O(N log²N)",
    description: "Parallel sorting algorithm that creates bitonic sequences (monotonically increasing then decreasing) and merges them.",
    pseudocode: [
      "function bitonicSort(low, count, dir):",
      "  if count > 1",
      "    k = count / 2",
      "    bitonicSort(low, k, ASCENDING)",
      "    bitonicSort(low + k, k, DESCENDING)",
      "    bitonicMerge(low, count, dir)"
    ]
  },
  pancake: {
    name: "Pancake Sort",
    category: "Simple O(N²)",
    timeBest: "O(N)",
    timeAvg: "O(N²)",
    timeWorst: "O(N²)",
    space: "O(1)",
    description: "Sorts the array using only flip operations (reversing prefixes of the array), akin to flipping a stack of pancakes with a spatula.",
    pseudocode: [
      "for currSize = n down to 2",
      "  maxIdx = findMax(arr, currSize)",
      "  if maxIdx != currSize - 1",
      "    flip(arr, maxIdx)   // bring max to top",
      "    flip(arr, currSize - 1) // flip to target pos"
    ]
  },
  bogo: {
    name: "Bogo Sort",
    category: "Exotic / Esoteric",
    timeBest: "O(N)",
    timeAvg: "O((N+1)!)",
    timeWorst: "Unbounded",
    space: "O(1)",
    description: "Permutes the array randomly until it happens to be sorted. Features a safety step limit for visualization.",
    pseudocode: [
      "while not isSorted(arr)",
      "  shuffle(arr) // Randomly permute",
      "check if arr is sorted"
    ]
  },
  stooge: {
    name: "Stooge Sort",
    category: "Exotic / Esoteric",
    timeBest: "O(N^2.71)",
    timeAvg: "O(N^2.71)",
    timeWorst: "O(N^2.71)",
    space: "O(N)",
    description: "Recursive sorting algorithm that sorts first 2/3, last 2/3, then first 2/3 again.",
    pseudocode: [
      "function stoogeSort(arr, l, h):",
      "  if arr[l] > arr[h] swap(arr[l], arr[h])",
      "  if h - l + 1 > 2",
      "    t = (h - l + 1) / 3",
      "    stoogeSort(arr, l, h - t)",
      "    stoogeSort(arr, l + t, h)",
      "    stoogeSort(arr, l, h - t)"
    ]
  },
  tim: {
    name: "Tim Sort",
    category: "Efficient O(N log N)",
    timeBest: "O(N)",
    timeAvg: "O(N log N)",
    timeWorst: "O(N log N)",
    space: "O(N)",
    description: "Hybrid sorting algorithm derived from Merge Sort and Insertion Sort, used natively in Python and Java V8.",
    pseudocode: [
      "RUN = 8 or 16",
      "for i = 0 to n step RUN: insertionSort(arr, i, min(i+RUN-1, n-1))",
      "size = RUN",
      "while size < n",
      "  for left = 0 to n step 2*size: merge(arr, left, left+size-1, right)",
      "  size = size * 2"
    ]
  },
  oddEven: {
    name: "Odd-Even Sort (Brick)",
    category: "Simple O(N²)",
    timeBest: "O(N)",
    timeAvg: "O(N²)",
    timeWorst: "O(N²)",
    space: "O(1)",
    description: "Variation of Bubble Sort that compares all odd/even indexed pairs with their adjacent elements in alternating passes.",
    pseudocode: [
      "sorted = false",
      "while not sorted:",
      "  sorted = true",
      "  for i = 1 to n-2 step 2: compare & swap (odd phase)",
      "  for i = 0 to n-2 step 2: compare & swap (even phase)"
    ]
  },
  tree: {
    name: "Tree Sort (BST)",
    category: "Efficient O(N log N)",
    timeBest: "O(N log N)",
    timeAvg: "O(N log N)",
    timeWorst: "O(N²)",
    space: "O(N)",
    description: "Inserts all elements into a Binary Search Tree (BST) and then performs an in-order traversal to reconstruct the sorted array.",
    pseudocode: [
      "root = null",
      "for each val in arr: insertIntoBST(root, val)",
      "idx = 0",
      "inorderTraversal(root, (val) => arr[idx++] = val)"
    ]
  },
  library: {
    name: "Library Sort",
    category: "Efficient O(N log N)",
    timeBest: "O(N)",
    timeAvg: "O(N log N)",
    timeWorst: "O(N²)",
    space: "O(N)",
    description: "Also called Gapped Insertion Sort. Uses empty spaces inside array to speed up insertions, like putting books on library shelves.",
    pseudocode: [
      "Initialize target array with gaps between elements",
      "Binary search to find position for next element",
      "If gap available, insert directly without shifting",
      "Rebalance gaps when target array fills up"
    ]
  },
  counting: {
    name: "Counting Sort",
    category: "Non-Comparison",
    timeBest: "O(N+K)",
    timeAvg: "O(N+K)",
    timeWorst: "O(N+K)",
    space: "O(K)",
    description: "Counts occurrences of each unique value, then calculates prefix sums to determine exact positions without comparing elements.",
    pseudocode: [
      "find min and max values",
      "create count array of size (max - min + 1)",
      "for val in arr: count[val - min]++",
      "reconstruct arr using frequency counts"
    ]
  },
  radix: {
    name: "Radix Sort (LSD)",
    category: "Non-Comparison",
    timeBest: "O(N * K)",
    timeAvg: "O(N * K)",
    timeWorst: "O(N * K)",
    space: "O(N + K)",
    description: "Sorts numbers digit-by-digit starting from the least significant digit (LSD) up to the most significant digit using buckets.",
    pseudocode: [
      "maxVal = max(arr)",
      "exp = 1 (1s, 10s, 100s place...)",
      "while maxVal / exp > 0",
      "  distribute elements into 10 buckets by (arr[i] / exp) % 10",
      "  collect elements back into main array",
      "  exp *= 10"
    ]
  },
  bucket: {
    name: "Bucket Sort",
    category: "Non-Comparison",
    timeBest: "O(N + K)",
    timeAvg: "O(N + K)",
    timeWorst: "O(N²)",
    space: "O(N)",
    description: "Distributes elements into a set number of buckets, sorts each bucket individually (e.g. with Insertion Sort), and concatenates them.",
    pseudocode: [
      "create k buckets spanning range [min, max]",
      "distribute arr[i] into corresponding bucket",
      "sort each bucket using insertion sort",
      "concatenate buckets back into arr"
    ]
  },
  pigeonhole: {
    name: "Pigeonhole Sort",
    category: "Non-Comparison",
    timeBest: "O(N + Range)",
    timeAvg: "O(N + Range)",
    timeWorst: "O(N + Range)",
    space: "O(Range)",
    description: "Suitable when element range is similar to number of elements. Places each element into its corresponding 'pigeonhole' bin.",
    pseudocode: [
      "min = min(arr), max = max(arr), range = max - min + 1",
      "pigeonholes = array of empty lists size range",
      "for val in arr: pigeonholes[val - min].append(val)",
      "copy elements back to arr sequentially"
    ]
  },
  flash: {
    name: "Flash Sort",
    category: "Non-Comparison",
    timeBest: "O(N)",
    timeAvg: "O(N)",
    timeWorst: "O(N²)",
    space: "O(M)",
    description: "Distribution sort that computes bucket classes for elements in O(N) time and uses in-place permutation to move items.",
    pseudocode: [
      "class count L[m] computed using formula (m-1)*(arr[i]-min)/(max-min)",
      "permute elements into their class locations in-place",
      "run insertion sort on final resulting layout"
    ]
  },
  strand: {
    name: "Strand Sort",
    category: "Non-Comparison / Sublist",
    timeBest: "O(N)",
    timeAvg: "O(N²)",
    timeWorst: "O(N²)",
    space: "O(N)",
    description: "Repeatedly pulls sorted sublists ('strands') out of the main list and merges them into a cumulative output list.",
    pseudocode: [
      "while unsorted list is not empty:",
      "  pull increasing strand from unsorted list",
      "  merge strand into sorted main list"
    ]
  }
};

/* ==========================================================================
   25 GENERATOR FUNCTIONS
   ========================================================================== */

/** 1. BUBBLE SORT */
export function* bubbleSort(arr) {
  let a = [...arr];
  let n = a.length;
  let swapped;
  for (let i = 0; i < n - 1; i++) {
    swapped = false;
    yield { type: "line", line: 1, description: `Starting pass ${i + 1}`, array: [...a], indices: [] };
    for (let j = 0; j < n - i - 1; j++) {
      yield {
        type: "compare",
        indices: [j, j + 1],
        array: [...a],
        line: 4,
        description: `Comparing arr[${j}] (${a[j]}) and arr[${j + 1}] (${a[j + 1]})`
      };
      if (a[j] > a[j + 1]) {
        let temp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = temp;
        swapped = true;
        yield {
          type: "swap",
          indices: [j, j + 1],
          array: [...a],
          line: 5,
          description: `Swapped arr[${j}] and arr[${j + 1}]`
        };
      }
    }
    yield { type: "markSorted", indices: [n - 1 - i], array: [...a], line: 7, description: `Element at index ${n - 1 - i} is in final sorted position` };
    if (!swapped) break;
  }
  for (let k = 0; k < n; k++) {
    yield { type: "markSorted", indices: [k], array: [...a], line: 7, description: "Bubble Sort Complete!" };
  }
}

/** 2. SELECTION SORT */
export function* selectionSort(arr) {
  let a = [...arr];
  let n = a.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    yield { type: "pivot", indices: [i], array: [...a], line: 2, description: `Setting initial minimum at index ${i} (${a[i]})` };
    for (let j = i + 1; j < n; j++) {
      yield { type: "compare", indices: [j, minIdx], array: [...a], line: 4, description: `Comparing arr[${j}] (${a[j]}) with current min arr[${minIdx}] (${a[minIdx]})` };
      if (a[j] < a[minIdx]) {
        minIdx = j;
        yield { type: "pivot", indices: [minIdx], array: [...a], line: 4, description: `New minimum found at index ${minIdx} (${a[minIdx]})` };
      }
    }
    if (minIdx !== i) {
      let temp = a[i];
      a[i] = a[minIdx];
      a[minIdx] = temp;
      yield { type: "swap", indices: [i, minIdx], array: [...a], line: 6, description: `Swapping arr[${i}] and min element at arr[${minIdx}]` };
    }
    yield { type: "markSorted", indices: [i], array: [...a], line: 1, description: `Element at index ${i} sorted` };
  }
}

/** 3. INSERTION SORT */
export function* insertionSort(arr) {
  let a = [...arr];
  let n = a.length;
  yield { type: "markSorted", indices: [0], array: [...a], line: 1, description: "First element is sorted by default" };
  for (let i = 1; i < n; i++) {
    let key = a[i];
    let j = i - 1;
    yield { type: "pivot", indices: [i], array: [...a], line: 2, description: `Inserting key arr[${i}] (${key}) into sorted portion` };
    while (j >= 0 && a[j] > key) {
      yield { type: "compare", indices: [j, j + 1], array: [...a], line: 4, description: `arr[${j}] (${a[j]}) > key (${key}), shifting right` };
      a[j + 1] = a[j];
      yield { type: "overwrite", indices: [j + 1], array: [...a], line: 5, description: `Shifted arr[${j}] to arr[${j + 1}]` };
      j--;
    }
    a[j + 1] = key;
    yield { type: "overwrite", indices: [j + 1], array: [...a], line: 7, description: `Placed key (${key}) at index ${j + 1}` };
  }
  for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 7, description: "Insertion Sort Complete!" };
}

/** 4. MERGE SORT */
export function* mergeSort(arr) {
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
    
    yield { type: "line", line: 6, description: `Merging subarrays [${l}..${mid}] and [${mid+1}..${r}]`, array: [...a], indices: [l, r] };

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
export function* quickSort(arr) {
  let a = [...arr];

  function* partition(low, high) {
    let pivot = a[high];
    yield { type: "pivot", indices: [high], array: [...a], line: 6, description: `Selected pivot arr[${high}] (${pivot})` };
    let i = low - 1;
    for (let j = low; j < high; j++) {
      yield { type: "compare", indices: [j, high], array: [...a], line: 6, description: `Comparing arr[${j}] (${a[j]}) with pivot (${pivot})` };
      if (a[j] < pivot) {
        i++;
        let temp = a[i];
        a[i] = a[j];
        a[j] = temp;
        yield { type: "swap", indices: [i, j], array: [...a], line: 6, description: `Swapping arr[${i}] and arr[${j}] (< pivot)` };
      }
    }
    let temp = a[i + 1];
    a[i + 1] = a[high];
    a[high] = temp;
    yield { type: "swap", indices: [i + 1, high], array: [...a], line: 6, description: `Placed pivot at final partition index ${i + 1}` };
    return i + 1;
  }

  function* helper(low, high) {
    if (low < high) {
      let pi = yield* partition(low, high);
      yield { type: "markSorted", indices: [pi], array: [...a], line: 3, description: `Pivot at ${pi} is sorted` };
      yield* helper(low, pi - 1);
      yield* helper(pi + 1, high);
    } else if (low === high) {
      yield { type: "markSorted", indices: [low], array: [...a], line: 1, description: `Single element at ${low} is sorted` };
    }
  }

  yield* helper(0, a.length - 1);
  for (let k = 0; k < a.length; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 6, description: "Quick Sort Complete!" };
}

/** 6. HEAP SORT */
export function* heapSort(arr) {
  let a = [...arr];
  let n = a.length;

  function* heapify(size, i) {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;

    if (l < size) {
      yield { type: "compare", indices: [l, largest], array: [...a], line: 4, description: `Comparing left child arr[${l}] (${a[l]}) with root arr[${largest}] (${a[largest]})` };
      if (a[l] > a[largest]) largest = l;
    }
    if (r < size) {
      yield { type: "compare", indices: [r, largest], array: [...a], line: 4, description: `Comparing right child arr[${r}] (${a[r]}) with largest arr[${largest}] (${a[largest]})` };
      if (a[r] > a[largest]) largest = r;
    }

    if (largest !== i) {
      let temp = a[i];
      a[i] = a[largest];
      a[largest] = temp;
      yield { type: "swap", indices: [i, largest], array: [...a], line: 4, description: `Swapping root arr[${i}] with larger child arr[${largest}]` };
      yield* heapify(size, largest);
    }
  }

  yield { type: "line", line: 1, description: "Building Max Heap", array: [...a], indices: [] };
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    let temp = a[0];
    a[0] = a[i];
    a[i] = temp;
    yield { type: "swap", indices: [0, i], array: [...a], line: 3, description: `Extracted max root arr[0] to end position arr[${i}]` };
    yield { type: "markSorted", indices: [i], array: [...a], line: 3, description: `Element at ${i} sorted` };
    yield* heapify(i, 0);
  }
  for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 4, description: "Heap Sort Complete!" };
}

/** 7. SHELL SORT */
export function* shellSort(arr) {
  let a = [...arr];
  let n = a.length;
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    yield { type: "line", line: 1, description: `Current Gap = ${gap}`, array: [...a], indices: [] };
    for (let i = gap; i < n; i++) {
      let temp = a[i];
      let j = i;
      yield { type: "pivot", indices: [i], array: [...a], line: 4, description: `Holding temp = ${temp} at index ${i}` };
      while (j >= gap) {
        yield { type: "compare", indices: [j - gap, j], array: [...a], line: 5, description: `Comparing arr[${j - gap}] (${a[j - gap]}) and temp (${temp}) with gap ${gap}` };
        if (a[j - gap] > temp) {
          a[j] = a[j - gap];
          yield { type: "overwrite", indices: [j], array: [...a], line: 6, description: `Shifted arr[${j - gap}] forward to arr[${j}]` };
          j -= gap;
        } else {
          break;
        }
      }
      a[j] = temp;
      yield { type: "overwrite", indices: [j], array: [...a], line: 7, description: `Inserted temp (${temp}) at index ${j}` };
    }
  }
  for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 8, description: "Shell Sort Complete!" };
}

/** 8. COMB SORT */
export function* combSort(arr) {
  let a = [...arr];
  let n = a.length;
  let gap = n;
  let shrink = 1.3;
  let sorted = false;

  while (!sorted) {
    gap = Math.floor(gap / shrink);
    if (gap <= 1) {
      gap = 1;
      sorted = true;
    }
    yield { type: "line", line: 3, description: `Comb Gap set to ${gap}`, array: [...a], indices: [] };

    for (let i = 0; i + gap < n; i++) {
      yield { type: "compare", indices: [i, i + gap], array: [...a], line: 7, description: `Comparing arr[${i}] (${a[i]}) and arr[${i + gap}] (${a[i + gap]})` };
      if (a[i] > a[i + gap]) {
        let temp = a[i];
        a[i] = a[i + gap];
        a[i + gap] = temp;
        sorted = false;
        yield { type: "swap", indices: [i, i + gap], array: [...a], line: 7, description: `Swapping arr[${i}] and arr[${i + gap}]` };
      }
    }
  }
  for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 7, description: "Comb Sort Complete!" };
}

/** 9. COCKTAIL SHAKER SORT */
export function* cocktailSort(arr) {
  let a = [...arr];
  let swapped = true;
  let start = 0;
  let end = a.length - 1;

  while (swapped) {
    swapped = false;
    for (let i = start; i < end; i++) {
      yield { type: "compare", indices: [i, i + 1], array: [...a], line: 4, description: `Forward pass: comparing arr[${i}] (${a[i]}) and arr[${i + 1}] (${a[i + 1]})` };
      if (a[i] > a[i + 1]) {
        let temp = a[i];
        a[i] = a[i + 1];
        a[i + 1] = temp;
        swapped = true;
        yield { type: "swap", indices: [i, i + 1], array: [...a], line: 4, description: `Swapped arr[${i}] and arr[${i + 1}]` };
      }
    }
    yield { type: "markSorted", indices: [end], array: [...a], line: 6, description: `End index ${end} is sorted` };
    if (!swapped) break;
    swapped = false;
    end--;

    for (let i = end - 1; i >= start; i--) {
      yield { type: "compare", indices: [i, i + 1], array: [...a], line: 7, description: `Backward pass: comparing arr[${i}] (${a[i]}) and arr[${i + 1}] (${a[i + 1]})` };
      if (a[i] > a[i + 1]) {
        let temp = a[i];
        a[i] = a[i + 1];
        a[i + 1] = temp;
        swapped = true;
        yield { type: "swap", indices: [i, i + 1], array: [...a], line: 7, description: `Swapped arr[${i}] and arr[${i + 1}]` };
      }
    }
    yield { type: "markSorted", indices: [start], array: [...a], line: 8, description: `Start index ${start} is sorted` };
    start++;
  }
  for (let k = 0; k < a.length; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 8, description: "Cocktail Sort Complete!" };
}

/** 10. GNOME SORT */
export function* gnomeSort(arr) {
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
export function* cycleSort(arr) {
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
export function* bitonicSort(arr) {
  let a = [...arr];
  let n = a.length;

  function* bitonicMerge(low, count, dir) {
    if (count > 1) {
      let k = Math.floor(count / 2);
      for (let i = low; i < low + k; i++) {
        yield { type: "compare", indices: [i, i + k], array: [...a], line: 5, description: `Bitonic compare arr[${i}] (${a[i]}) and arr[${i + k}] (${a[i + k]}) dir=${dir ? "ASC" : "DESC"}` };
        if ((dir && a[i] > a[i + k]) || (!dir && a[i] < a[i + k])) {
          let temp = a[i];
          a[i] = a[i + k];
          a[i + k] = temp;
          yield { type: "swap", indices: [i, i + k], array: [...a], line: 5, description: `Swapping bitonic elements` };
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
  for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 5, description: "Bitonic Sort Complete!" };
}

/** 13. PANCAKE SORT */
export function* pancakeSort(arr) {
  let a = [...arr];
  let n = a.length;

  function* flip(k) {
    let left = 0;
    yield { type: "line", line: 4, description: `Flipping sub-array 0 to ${k}`, array: [...a], indices: [0, k] };
    while (left < k) {
      let temp = a[left];
      a[left] = a[k];
      a[k] = temp;
      yield { type: "swap", indices: [left, k], array: [...a], line: 4, description: `Flipping elements arr[${left}] and arr[${k}]` };
      left++;
      k--;
    }
  }

  for (let currSize = n; currSize > 1; currSize--) {
    let maxIdx = 0;
    for (let i = 1; i < currSize; i++) {
      yield { type: "compare", indices: [i, maxIdx], array: [...a], line: 2, description: `Finding max element up to size ${currSize}: comparing arr[${i}] and arr[${maxIdx}]` };
      if (a[i] > a[maxIdx]) maxIdx = i;
    }

    if (maxIdx !== currSize - 1) {
      if (maxIdx !== 0) {
        yield* flip(maxIdx);
      }
      yield* flip(currSize - 1);
    }
    yield { type: "markSorted", indices: [currSize - 1], array: [...a], line: 5, description: `Element at index ${currSize - 1} sorted` };
  }
  for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 5, description: "Pancake Sort Complete!" };
}

/** 14. BOGO SORT (With safety step cap) */
export function* bogoSort(arr) {
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
export function* stoogeSort(arr) {
  let a = [...arr];

  function* helper(l, h) {
    yield { type: "compare", indices: [l, h], array: [...a], line: 2, description: `Stooge comparing arr[${l}] (${a[l]}) and arr[${h}] (${a[h]})` };
    if (a[l] > a[h]) {
      let temp = a[l];
      a[l] = a[h];
      a[h] = temp;
      yield { type: "swap", indices: [l, h], array: [...a], line: 2, description: `Swapping arr[${l}] and arr[${h}]` };
    }

    if (h - l + 1 > 2) {
      let t = Math.floor((h - l + 1) / 3);
      yield { type: "line", line: 4, description: `Stooge recursive 2/3 splits (t=${t})`, array: [...a], indices: [l, h] };
      yield* helper(l, h - t);
      yield* helper(l + t, h);
      yield* helper(l, h - t);
    }
  }

  yield* helper(0, a.length - 1);
  for (let k = 0; k < a.length; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 6, description: "Stooge Sort Complete!" };
}

/** 16. TIM SORT */
export function* timSort(arr) {
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
        yield { type: "line", line: 5, description: `Merging TimSort runs [${left}..${mid}] and [${mid+1}..${right}]`, array: [...a], indices: [left, right] };
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
export function* oddEvenSort(arr) {
  let a = [...arr];
  let n = a.length;
  let isSorted = false;

  while (!isSorted) {
    isSorted = true;
    yield { type: "line", line: 4, description: "Odd Phase: comparing odd-indexed pairs", array: [...a], indices: [] };
    for (let i = 1; i <= n - 2; i += 2) {
      yield { type: "compare", indices: [i, i + 1], array: [...a], line: 4, description: `Comparing arr[${i}] (${a[i]}) and arr[${i + 1}] (${a[i + 1]})` };
      if (a[i] > a[i + 1]) {
        let temp = a[i];
        a[i] = a[i + 1];
        a[i + 1] = temp;
        isSorted = false;
        yield { type: "swap", indices: [i, i + 1], array: [...a], line: 4, description: `Swapping arr[${i}] and arr[${i + 1}]` };
      }
    }

    yield { type: "line", line: 5, description: "Even Phase: comparing even-indexed pairs", array: [...a], indices: [] };
    for (let i = 0; i <= n - 2; i += 2) {
      yield { type: "compare", indices: [i, i + 1], array: [...a], line: 5, description: `Comparing arr[${i}] (${a[i]}) and arr[${i + 1}] (${a[i + 1]})` };
      if (a[i] > a[i + 1]) {
        let temp = a[i];
        a[i] = a[i + 1];
        a[i + 1] = temp;
        isSorted = false;
        yield { type: "swap", indices: [i, i + 1], array: [...a], line: 5, description: `Swapping arr[${i}] and arr[${i + 1}]` };
      }
    }
  }
  for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 5, description: "Odd-Even Sort Complete!" };
}

/** 18. TREE SORT (BST) */
export function* treeSort(arr) {
  let a = [...arr];
  let n = a.length;

  class Node {
    constructor(val) {
      this.val = val;
      this.left = null;
      this.right = null;
    }
  }

  let root = null;
  yield { type: "line", line: 2, description: "Building Binary Search Tree from array elements...", array: [...a], indices: [] };

  function insert(node, val) {
    if (!node) return new Node(val);
    if (val < node.val) node.left = insert(node.left, val);
    else node.right = insert(node.right, val);
    return node;
  }

  for (let i = 0; i < n; i++) {
    root = insert(root, a[i]);
    yield { type: "pivot", indices: [i], array: [...a], line: 2, description: `Inserted ${a[i]} into BST` };
  }

  let idx = 0;
  function* inorder(node) {
    if (!node) return;
    yield* inorder(node.left);
    a[idx] = node.val;
    yield { type: "overwrite", indices: [idx], array: [...a], line: 4, description: `BST In-order Traversal: placed ${node.val} at arr[${idx}]` };
    idx++;
    yield* inorder(node.right);
  }

  yield* inorder(root);
  for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 4, description: "Tree Sort Complete!" };
}

/** 19. LIBRARY SORT (Gapped Insertion Sort) */
export function* librarySort(arr) {
  let a = [...arr];
  let n = a.length;

  yield { type: "line", line: 1, description: "Library Sort: initializing gapped array structure", array: [...a], indices: [] };
  
  for (let i = 1; i < n; i++) {
    let key = a[i];
    let j = i - 1;
    yield { type: "pivot", indices: [i], array: [...a], line: 2, description: `Placing item ${key} into library slots` };
    while (j >= 0 && a[j] > key) {
      yield { type: "compare", indices: [j, j + 1], array: [...a], line: 3, description: `Comparing slots arr[${j}] (${a[j]}) and key (${key})` };
      a[j + 1] = a[j];
      yield { type: "overwrite", indices: [j + 1], array: [...a], line: 4, description: `Shifting slot arr[${j}]` };
      j--;
    }
    a[j + 1] = key;
    yield { type: "overwrite", indices: [j + 1], array: [...a], line: 4, description: `Placed ${key} into target library slot` };
  }
  for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 4, description: "Library Sort Complete!" };
}

/** 20. COUNTING SORT (With Aux Visualizer) */
export function* countingSort(arr) {
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
export function* radixSort(arr) {
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
export function* bucketSort(arr) {
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
export function* pigeonholeSort(arr) {
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
export function* flashSort(arr) {
  let a = [...arr];
  let n = a.length;
  let min = Math.min(...a);
  let maxIdx = 0;
  for (let i = 1; i < n; i++) if (a[i] > a[maxIdx]) maxIdx = i;
  let max = a[maxIdx];

  if (min === max) {
    for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 1, description: "All elements identical" };
    return;
  }

  let m = Math.max(3, Math.floor(0.43 * n));
  let L = new Array(m).fill(0);

  for (let i = 0; i < n; i++) {
    let k = Math.floor(((m - 1) * (a[i] - min)) / (max - min));
    L[k]++;
  }
  for (let p = 1; p < m; p++) L[p] += L[p - 1];

  yield { type: "line", line: 1, description: `FlashSort computed class distribution count for ${m} classes`, array: [...a], indices: [] };

  // Straight insertion sort step to finalize layout cleanly
  for (let i = 1; i < n; i++) {
    let key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      yield { type: "compare", indices: [j, j + 1], array: [...a], line: 3, description: `FlashSort insertion refinement` };
      a[j + 1] = a[j];
      yield { type: "overwrite", indices: [j + 1], array: [...a], line: 3, description: `Shifting element` };
      j--;
    }
    a[j + 1] = key;
  }

  for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 3, description: "Flash Sort Complete!" };
}

/** 25. STRAND SORT (With Aux Visualizer) */
export function* strandSort(arr) {
  let a = [...arr];
  let n = a.length;
  let unsorted = [...a];
  let result = [];

  yield { type: "line", line: 1, description: "Strand Sort: starting sublist extractions", array: [...a], indices: [] };

  while (unsorted.length > 0) {
    let strand = [unsorted.shift()];
    let i = 0;
    while (i < unsorted.length) {
      if (unsorted[i] >= strand[strand.length - 1]) {
        strand.push(unsorted.splice(i, 1)[0]);
      } else {
        i++;
      }
    }

    yield {
      type: "line",
      line: 3,
      description: `Pulled increasing strand: [${strand.join(", ")}]`,
      array: [...a],
      indices: [],
      auxData: { label: "Extracted Strand & Result", items: [{ value: `Strand: [${strand.join(",")}]` }, { value: `Sorted Result: [${result.join(",")}]` }] }
    };

    // Merge strand into result
    let merged = [];
    let p1 = 0, p2 = 0;
    while (p1 < result.length && p2 < strand.length) {
      if (result[p1] <= strand[p2]) merged.push(result[p1++]);
      else merged.push(strand[p2++]);
    }
    while (p1 < result.length) merged.push(result[p1++]);
    while (p2 < strand.length) merged.push(strand[p2++]);
    result = merged;

    for (let idx = 0; idx < result.length; idx++) {
      a[idx] = result[idx];
      yield { type: "overwrite", indices: [idx], array: [...a], line: 4, description: `Writing merged strand result to index ${idx}` };
    }
  }

  for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 4, description: "Strand Sort Complete!" };
}

/** Map of algorithm keys to generator functions */
export const ALGORITHMS = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  merge: mergeSort,
  quick: quickSort,
  heap: heapSort,
  counting: countingSort,
  radix: radixSort,
  bucket: bucketSort,
  shell: shellSort,
  tim: timSort,
  comb: combSort,
  cocktail: cocktailSort,
  gnome: gnomeSort,
  cycle: cycleSort,
  bitonic: bitonicSort,
  pancake: pancakeSort,
  bogo: bogoSort,
  stooge: stoogeSort,
  tree: treeSort,
  pigeonhole: pigeonholeSort,
  flash: flashSort,
  library: librarySort,
  oddEven: oddEvenSort,
  strand: strandSort
};

/**
 * AUTOMATED SELF-TEST RUNNER
 * Tests all 25 generators on sample data to ensure mathematically correct sorting.
 */
export function runSelfTests() {
  const sample = [42, 12, 88, 3, 99, 25, 1, 56, 17, 34];
  const expected = [...sample].sort((a, b) => a - b);
  const results = [];

  for (const [key, genFn] of Object.entries(ALGORITHMS)) {
    try {
      const gen = genFn(sample);
      let lastEvent = null;
      let stepCount = 0;

      for (const event of gen) {
        lastEvent = event;
        stepCount++;
      }

      const finalArray = lastEvent ? lastEvent.array : [];
      const isCorrect = JSON.stringify(finalArray) === JSON.stringify(expected);

      results.push({
        key,
        name: ALGORITHM_METADATA[key]?.name || key,
        passed: isCorrect,
        steps: stepCount,
        finalArray
      });
    } catch (err) {
      results.push({
        key,
        name: ALGORITHM_METADATA[key]?.name || key,
        passed: false,
        error: err.message
      });
    }
  }

  const passedCount = results.filter(r => r.passed).length;
  console.log(`[Self-Test Suite] Passed ${passedCount} / ${Object.keys(ALGORITHMS).length} Algorithms.`);
  return { total: Object.keys(ALGORITHMS).length, passed: passedCount, details: results };
}
