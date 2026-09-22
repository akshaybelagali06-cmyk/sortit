/**
 * Central algorithm registry — single source for selection + metadata.
 */

import bubbleSort from '../algorithms/bubbleSort.js';
import selectionSort from '../algorithms/selectionSort.js';
import insertionSort from '../algorithms/insertionSort.js';
import mergeSort from '../algorithms/mergeSort.js';
import quickSort from '../algorithms/quickSort.js';
import heapSort from '../algorithms/heapSort.js';
import shellSort from '../algorithms/shellSort.js';
import combSort from '../algorithms/combSort.js';
import cocktailSort from '../algorithms/cocktailSort.js';
import gnomeSort from '../algorithms/gnomeSort.js';
import cycleSort from '../algorithms/cycleSort.js';
import bitonicSort from '../algorithms/bitonicSort.js';
import pancakeSort from '../algorithms/pancakeSort.js';
import bogoSort from '../algorithms/bogoSort.js';
import stoogeSort from '../algorithms/stoogeSort.js';
import timSort from '../algorithms/timSort.js';
import oddEvenSort from '../algorithms/oddEvenSort.js';
import treeSort from '../algorithms/treeSort.js';
import librarySort from '../algorithms/librarySort.js';
import countingSort from '../algorithms/countingSort.js';
import radixSort from '../algorithms/radixSort.js';
import bucketSort from '../algorithms/bucketSort.js';
import pigeonholeSort from '../algorithms/pigeonholeSort.js';
import flashSort from '../algorithms/flashSort.js';
import strandSort from '../algorithms/strandSort.js';

export const algorithmRegistry = {
  bubble: {
    id: "bubble",
    name: "Bubble Sort",
    category: "Simple O(N²)",
    description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
    timeBest: "O(N)",
    timeAvg: "O(N²)",
    timeWorst: "O(N²)",
    space: "O(1)",
    stable: true,
    inPlace: true,
    maxSize: 200,
    allowsNegatives: true,
    note: null,
    pseudocode: [
      "do",
      "  swapped = false",
      "  for i = 0 to n - 2",
      "    if arr[i] > arr[i+1] then",
      "      swap(arr[i], arr[i+1])",
      "      swapped = true",
      "while swapped"
    ],
    generator: bubbleSort,
  },

  selection: {
    id: "selection",
    name: "Selection Sort",
    category: "Simple O(N²)",
    description: "Divides the array into sorted and unsorted regions, repeatedly finding the minimum element from the unsorted region.",
    timeBest: "O(N²)",
    timeAvg: "O(N²)",
    timeWorst: "O(N²)",
    space: "O(1)",
    stable: false,
    inPlace: true,
    maxSize: 200,
    allowsNegatives: true,
    note: null,
    pseudocode: [
      "for i = 0 to n - 1",
      "  minIdx = i",
      "  for j = i + 1 to n - 1",
      "    if arr[j] < arr[minIdx] then minIdx = j",
      "  if minIdx != i then",
      "    swap(arr[i], arr[minIdx])"
    ],
    generator: selectionSort,
  },

  insertion: {
    id: "insertion",
    name: "Insertion Sort",
    category: "Simple O(N²)",
    description: "Builds the final sorted array one item at a time by repeatedly inserting an unsorted element into its correct position.",
    timeBest: "O(N)",
    timeAvg: "O(N²)",
    timeWorst: "O(N²)",
    space: "O(1)",
    stable: true,
    inPlace: true,
    maxSize: 200,
    allowsNegatives: true,
    note: null,
    pseudocode: [
      "for i = 1 to n - 1",
      "  key = arr[i]",
      "  j = i - 1",
      "  while j >= 0 and arr[j] > key",
      "    arr[j + 1] = arr[j]",
      "    j = j - 1",
      "  arr[j + 1] = key"
    ],
    generator: insertionSort,
  },

  merge: {
    id: "merge",
    name: "Merge Sort",
    category: "Efficient O(N log N)",
    description: "A divide-and-conquer algorithm that recursively splits the array in half, sorts each half, and merges them.",
    timeBest: "O(N log N)",
    timeAvg: "O(N log N)",
    timeWorst: "O(N log N)",
    space: "O(N)",
    stable: true,
    inPlace: false,
    maxSize: 200,
    allowsNegatives: true,
    note: null,
    pseudocode: [
      "function mergeSort(arr, left, right):",
      "  if left >= right then return",
      "  mid = (left + right) / 2",
      "  mergeSort(arr, left, mid)",
      "  mergeSort(arr, mid + 1, right)",
      "  merge(arr, left, mid, right)"
    ],
    generator: mergeSort,
  },

  quick: {
    id: "quick",
    name: "Quick Sort",
    category: "Efficient O(N log N)",
    description: "Picks a pivot element and partitions the array such that elements smaller than pivot are on the left and larger on the right.",
    timeBest: "O(N log N)",
    timeAvg: "O(N log N)",
    timeWorst: "O(N²)",
    space: "O(log N)",
    stable: false,
    inPlace: true,
    maxSize: 200,
    allowsNegatives: true,
    note: null,
    pseudocode: [
      "function quickSort(arr, low, high):",
      "  if low < high then",
      "    pivotIdx = partition(arr, low, high)",
      "    quickSort(arr, low, pivotIdx - 1)",
      "    quickSort(arr, pivotIdx + 1, high)",
      "partition: select pivot, swap elements < pivot to left"
    ],
    generator: quickSort,
  },

  heap: {
    id: "heap",
    name: "Heap Sort",
    category: "Efficient O(N log N)",
    description: "Converts the array into a Max-Heap binary tree, then repeatedly extracts the maximum root element to the end.",
    timeBest: "O(N log N)",
    timeAvg: "O(N log N)",
    timeWorst: "O(N log N)",
    space: "O(1)",
    stable: false,
    inPlace: true,
    maxSize: 200,
    allowsNegatives: true,
    note: null,
    pseudocode: [
      "buildMaxHeap(arr)",
      "for i = n - 1 down to 1",
      "  swap(arr[0], arr[i])",
      "  heapify(arr, 0, i)"
    ],
    generator: heapSort,
  },

  shell: {
    id: "shell",
    name: "Shell Sort",
    category: "Efficient O(N log N)",
    description: "Generalization of insertion sort that allows exchanges of items that are far apart, reducing gap distance gradually.",
    timeBest: "O(N log N)",
    timeAvg: "O(N^1.3)",
    timeWorst: "O(N²)",
    space: "O(1)",
    stable: false,
    inPlace: true,
    maxSize: 200,
    allowsNegatives: true,
    note: null,
    pseudocode: [
      "gap = n / 2",
      "while gap > 0",
      "  for i = gap to n - 1",
      "    temp = arr[i], j = i",
      "    while j >= gap and arr[j - gap] > temp",
      "      arr[j] = arr[j - gap], j -= gap",
      "    arr[j] = temp",
      "  gap = gap / 2"
    ],
    generator: shellSort,
  },

  comb: {
    id: "comb",
    name: "Comb Sort",
    category: "Efficient O(N log N)",
    description: "Improves bubble sort by using a gap > 1 with a shrink factor of 1.3 to eliminate small values near the end of the list.",
    timeBest: "O(N log N)",
    timeAvg: "O(N² / 2^p)",
    timeWorst: "O(N²)",
    space: "O(1)",
    stable: false,
    inPlace: true,
    maxSize: 200,
    allowsNegatives: true,
    note: null,
    pseudocode: [
      "gap = n, shrink = 1.3, swapped = true",
      "while gap > 1 or swapped",
      "  gap = floor(gap / shrink)",
      "  if gap < 1 then gap = 1",
      "  swapped = false",
      "  for i = 0 to n - gap - 1",
      "    if arr[i] > arr[i + gap] swap & swapped = true"
    ],
    generator: combSort,
  },

  cocktail: {
    id: "cocktail",
    name: "Cocktail Shaker Sort",
    category: "Simple O(N²)",
    description: "A variation of Bubble Sort that traverses the list in both directions alternately.",
    timeBest: "O(N)",
    timeAvg: "O(N²)",
    timeWorst: "O(N²)",
    space: "O(1)",
    stable: true,
    inPlace: true,
    maxSize: 200,
    allowsNegatives: true,
    note: null,
    pseudocode: [
      "swapped = true, start = 0, end = n - 1",
      "while swapped",
      "  swapped = false",
      "  for i = start to end - 1: compare & swap left to right",
      "  if not swapped break",
      "  end--",
      "  for i = end - 1 down to start: compare & swap right to left",
      "  start++"
    ],
    generator: cocktailSort,
  },

  gnome: {
    id: "gnome",
    name: "Gnome Sort",
    category: "Simple O(N²)",
    description: "Similar to Insertion Sort, moves elements to their proper position by a series of swaps, like a garden gnome sorting flower pots.",
    timeBest: "O(N)",
    timeAvg: "O(N²)",
    timeWorst: "O(N²)",
    space: "O(1)",
    stable: true,
    inPlace: true,
    maxSize: 200,
    allowsNegatives: true,
    note: null,
    pseudocode: [
      "pos = 0",
      "while pos < n",
      "  if pos == 0 or arr[pos] >= arr[pos - 1]",
      "    pos++",
      "  else",
      "    swap(arr[pos], arr[pos - 1])",
      "    pos--"
    ],
    generator: gnomeSort,
  },

  cycle: {
    id: "cycle",
    name: "Cycle Sort",
    category: "Simple O(N²)",
    description: "An in-place sorting algorithm that minimizes the total number of memory writes by decomposing array permutations into cycles.",
    timeBest: "O(N²)",
    timeAvg: "O(N²)",
    timeWorst: "O(N²)",
    space: "O(1)",
    stable: false,
    inPlace: true,
    maxSize: 200,
    allowsNegatives: true,
    note: null,
    pseudocode: [
      "for cycleStart = 0 to n - 2",
      "  item = arr[cycleStart], pos = cycleStart",
      "  count smaller elements after cycleStart to find pos",
      "  if pos == cycleStart continue",
      "  put item to correct pos (swap)",
      "  rotate remaining elements in cycle until back at start"
    ],
    generator: cycleSort,
  },

  bitonic: {
    id: "bitonic",
    name: "Bitonic Sort",
    category: "Efficient O(N log N)",
    description: "Parallel sorting algorithm that creates bitonic sequences (monotonically increasing then decreasing) and merges them.",
    timeBest: "O(N log²N)",
    timeAvg: "O(N log²N)",
    timeWorst: "O(N log²N)",
    space: "O(N log²N)",
    stable: false,
    inPlace: true,
    maxSize: 128,
    allowsNegatives: true,
    note: "Works best when n is a power of 2.",
    pseudocode: [
      "function bitonicSort(low, count, dir):",
      "  if count > 1",
      "    k = count / 2",
      "    bitonicSort(low, k, ASCENDING)",
      "    bitonicSort(low + k, k, DESCENDING)",
      "    bitonicMerge(low, count, dir)"
    ],
    generator: bitonicSort,
  },

  pancake: {
    id: "pancake",
    name: "Pancake Sort",
    category: "Simple O(N²)",
    description: "Sorts the array using only flip operations (reversing prefixes of the array), akin to flipping a stack of pancakes with a spatula.",
    timeBest: "O(N)",
    timeAvg: "O(N²)",
    timeWorst: "O(N²)",
    space: "O(1)",
    stable: false,
    inPlace: true,
    maxSize: 200,
    allowsNegatives: true,
    note: null,
    pseudocode: [
      "for currSize = n down to 2",
      "  maxIdx = findMax(arr, currSize)",
      "  if maxIdx != currSize - 1",
      "    flip(arr, maxIdx)",
      "    flip(arr, currSize - 1)"
    ],
    generator: pancakeSort,
  },

  bogo: {
    id: "bogo",
    name: "Bogo Sort",
    category: "Exotic / Esoteric",
    description: "Permutes the array randomly until it happens to be sorted. Features a safety step limit for visualization.",
    timeBest: "O(N)",
    timeAvg: "O((N+1)!)",
    timeWorst: "Unbounded",
    space: "O(1)",
    stable: false,
    inPlace: true,
    maxSize: 8,
    allowsNegatives: true,
    note: "Hard-capped for safety — unbounded expected runtime.",
    pseudocode: [
      "while not isSorted(arr)",
      "  shuffle(arr)",
      "check if arr is sorted"
    ],
    generator: bogoSort,
  },

  stooge: {
    id: "stooge",
    name: "Stooge Sort",
    category: "Exotic / Esoteric",
    description: "Recursive sorting algorithm that sorts first 2/3, last 2/3, then first 2/3 again.",
    timeBest: "O(N^2.71)",
    timeAvg: "O(N^2.71)",
    timeWorst: "O(N^2.71)",
    space: "O(N)",
    stable: false,
    inPlace: true,
    maxSize: 40,
    allowsNegatives: true,
    note: null,
    pseudocode: [
      "function stoogeSort(arr, l, h):",
      "  if arr[l] > arr[h] swap(arr[l], arr[h])",
      "  if h - l + 1 > 2",
      "    t = (h - l + 1) / 3",
      "    stoogeSort(arr, l, h - t)",
      "    stoogeSort(arr, l + t, h)",
      "    stoogeSort(arr, l, h - t)"
    ],
    generator: stoogeSort,
  },

  tim: {
    id: "tim",
    name: "Tim Sort",
    category: "Efficient O(N log N)",
    description: "Hybrid sorting algorithm derived from Merge Sort and Insertion Sort, used natively in Python and Java V8.",
    timeBest: "O(N)",
    timeAvg: "O(N log N)",
    timeWorst: "O(N log N)",
    space: "O(N)",
    stable: true,
    inPlace: false,
    maxSize: 200,
    allowsNegatives: true,
    note: null,
    pseudocode: [
      "RUN = 8 or 16",
      "for i = 0 to n step RUN: insertionSort(arr, i, min(i+RUN-1, n-1))",
      "size = RUN",
      "while size < n",
      "  for left = 0 to n step 2*size: merge(arr, left, left+size-1, right)",
      "  size = size * 2"
    ],
    generator: timSort,
  },

  oddEven: {
    id: "oddEven",
    name: "Odd-Even Sort (Brick)",
    category: "Simple O(N²)",
    description: "Variation of Bubble Sort that compares all odd/even indexed pairs with their adjacent elements in alternating passes.",
    timeBest: "O(N)",
    timeAvg: "O(N²)",
    timeWorst: "O(N²)",
    space: "O(1)",
    stable: true,
    inPlace: true,
    maxSize: 200,
    allowsNegatives: true,
    note: null,
    pseudocode: [
      "sorted = false",
      "while not sorted:",
      "  sorted = true",
      "  for i = 1 to n-2 step 2: compare & swap (odd phase)",
      "  for i = 0 to n-2 step 2: compare & swap (even phase)"
    ],
    generator: oddEvenSort,
  },

  tree: {
    id: "tree",
    name: "Tree Sort (BST)",
    category: "Efficient O(N log N)",
    description: "Inserts all elements into a Binary Search Tree (BST) and then performs an in-order traversal to reconstruct the sorted array.",
    timeBest: "O(N log N)",
    timeAvg: "O(N log N)",
    timeWorst: "O(N²)",
    space: "O(N)",
    stable: false,
    inPlace: false,
    maxSize: 200,
    allowsNegatives: true,
    note: null,
    pseudocode: [
      "root = null",
      "for each val in arr: insertIntoBST(root, val)",
      "idx = 0",
      "inorderTraversal(root, (val) => arr[idx++] = val)"
    ],
    generator: treeSort,
  },

  library: {
    id: "library",
    name: "Library Sort",
    category: "Efficient O(N log N)",
    description: "Also called Gapped Insertion Sort. Uses empty spaces inside array to speed up insertions, like putting books on library shelves.",
    timeBest: "O(N)",
    timeAvg: "O(N log N)",
    timeWorst: "O(N²)",
    space: "O(N)",
    stable: true,
    inPlace: false,
    maxSize: 120,
    allowsNegatives: true,
    note: null,
    pseudocode: [
      "Initialize target array with gaps between elements",
      "Binary search to find position for next element",
      "If gap available, insert directly without shifting",
      "Rebalance gaps when target array fills up"
    ],
    generator: librarySort,
  },

  counting: {
    id: "counting",
    name: "Counting Sort",
    category: "Non-Comparison",
    description: "Counts occurrences of each unique value, then calculates prefix sums to determine exact positions without comparing elements.",
    timeBest: "O(N+K)",
    timeAvg: "O(N+K)",
    timeWorst: "O(N+K)",
    space: "O(K)",
    stable: true,
    inPlace: false,
    maxSize: 200,
    allowsNegatives: false,
    note: "Non-negative integers recommended.",
    pseudocode: [
      "find min and max values",
      "create count array of size (max - min + 1)",
      "for val in arr: count[val - min]++",
      "reconstruct arr using frequency counts"
    ],
    generator: countingSort,
  },

  radix: {
    id: "radix",
    name: "Radix Sort (LSD)",
    category: "Non-Comparison",
    description: "Sorts numbers digit-by-digit starting from the least significant digit (LSD) up to the most significant digit using buckets.",
    timeBest: "O(N * K)",
    timeAvg: "O(N * K)",
    timeWorst: "O(N * K)",
    space: "O(N + K)",
    stable: true,
    inPlace: false,
    maxSize: 200,
    allowsNegatives: false,
    note: "Non-negative integers recommended.",
    pseudocode: [
      "maxVal = max(arr)",
      "exp = 1 (1s, 10s, 100s place...)",
      "while maxVal / exp > 0",
      "  distribute elements into 10 buckets by (arr[i] / exp) % 10",
      "  collect elements back into main array",
      "  exp *= 10"
    ],
    generator: radixSort,
  },

  bucket: {
    id: "bucket",
    name: "Bucket Sort",
    category: "Non-Comparison",
    description: "Distributes elements into a set number of buckets, sorts each bucket individually (e.g. with Insertion Sort), and concatenates them.",
    timeBest: "O(N + K)",
    timeAvg: "O(N + K)",
    timeWorst: "O(N²)",
    space: "O(N)",
    stable: true,
    inPlace: false,
    maxSize: 200,
    allowsNegatives: false,
    note: null,
    pseudocode: [
      "create k buckets spanning range [min, max]",
      "distribute arr[i] into corresponding bucket",
      "sort each bucket using insertion sort",
      "concatenate buckets back into arr"
    ],
    generator: bucketSort,
  },

  pigeonhole: {
    id: "pigeonhole",
    name: "Pigeonhole Sort",
    category: "Non-Comparison",
    description: "Suitable when element range is similar to number of elements. Places each element into its corresponding 'pigeonhole' bin.",
    timeBest: "O(N + Range)",
    timeAvg: "O(N + Range)",
    timeWorst: "O(N + Range)",
    space: "O(Range)",
    stable: true,
    inPlace: false,
    maxSize: 200,
    allowsNegatives: true,
    note: "Range should be close to n for efficiency.",
    pseudocode: [
      "min = min(arr), max = max(arr), range = max - min + 1",
      "pigeonholes = array of empty lists size range",
      "for val in arr: pigeonholes[val - min].append(val)",
      "copy elements back to arr sequentially"
    ],
    generator: pigeonholeSort,
  },

  flash: {
    id: "flash",
    name: "Flash Sort",
    category: "Non-Comparison",
    description: "Distribution sort that computes bucket classes for elements in O(N) time and uses in-place permutation to move items.",
    timeBest: "O(N)",
    timeAvg: "O(N)",
    timeWorst: "O(N²)",
    space: "O(M)",
    stable: false,
    inPlace: true,
    maxSize: 200,
    allowsNegatives: true,
    note: null,
    pseudocode: [
      "class count L[m] computed using formula (m-1)*(arr[i]-min)/(max-min)",
      "permute elements into their class locations in-place",
      "run insertion sort on final resulting layout"
    ],
    generator: flashSort,
  },

  strand: {
    id: "strand",
    name: "Strand Sort",
    category: "Non-Comparison / Sublist",
    description: "Repeatedly pulls sorted sublists ('strands') out of the main list and merges them into a cumulative output list.",
    timeBest: "O(N)",
    timeAvg: "O(N²)",
    timeWorst: "O(N²)",
    space: "O(N)",
    stable: true,
    inPlace: false,
    maxSize: 200,
    allowsNegatives: true,
    note: null,
    pseudocode: [
      "while unsorted list is not empty:",
      "  pull increasing strand from unsorted list",
      "  merge strand into sorted main list"
    ],
    generator: strandSort,
  },
};

export const ALGORITHM_KEYS = Object.keys(algorithmRegistry);

export function getAlgorithm(key) {
  return algorithmRegistry[key] || null;
}

export function listAlgorithms() {
  return ALGORITHM_KEYS.map((key) => algorithmRegistry[key]);
}

/** Compatibility map: key → generator (legacy ALGORITHMS shape). */
export const ALGORITHMS = Object.fromEntries(
  ALGORITHM_KEYS.map((key) => [key, algorithmRegistry[key].generator])
);

/** Compatibility map: key → metadata without generator. */
export const ALGORITHM_METADATA = Object.fromEntries(
  ALGORITHM_KEYS.map((key) => {
    const { generator, ...metaOnly } = algorithmRegistry[key];
    return [key, metaOnly];
  })
);

/**
 * Run correctness self-test across all registered algorithms.
 */
export function runSelfTests(
  sample = [42, 12, 88, 3, 99, 25, 1, 56, 17, 34]
) {
  const expected = [...sample].sort((a, b) => a - b);
  const results = [];

  for (const key of ALGORITHM_KEYS) {
    const entry = algorithmRegistry[key];

    try {
      const gen = entry.generator([...sample]);

      let lastEvent = null;
      let stepCount = 0;

      for (const event of gen) {
        lastEvent = event;
        stepCount += 1;
      }

      const finalArray = lastEvent ? lastEvent.array : [];
      const isCorrect =
        JSON.stringify(finalArray) === JSON.stringify(expected);

      results.push({
        key,
        name: entry.name,
        passed: isCorrect,
        steps: stepCount,
        finalArray,
      });
    } catch (err) {
      results.push({
        key,
        name: entry.name,
        passed: false,
        error: err.message,
      });
    }
  }

  const passedCount = results.filter((r) => r.passed).length;

  console.log(
    `[Self-Test Suite] Passed ${passedCount} / ${ALGORITHM_KEYS.length} Algorithms.`
  );

  return {
    total: ALGORITHM_KEYS.length,
    passed: passedCount,
    details: results,
  };
}