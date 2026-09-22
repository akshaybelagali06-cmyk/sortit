import fs from 'fs';

const src = fs.readFileSync('algorithms.js', 'utf8');
const start = src.indexOf('export const ALGORITHM_METADATA');
const end = src.indexOf('/* ==========================================================================');
const metaBlock = src.slice(start, end).replace(/^export\s+/, '');
const fn = new Function(`${metaBlock}; return ALGORITHM_METADATA;`);
const meta = fn();

const extras = {
  bubble: { stable: true, inPlace: true, maxSize: 200, allowsNegatives: true },
  selection: { stable: false, inPlace: true, maxSize: 200, allowsNegatives: true },
  insertion: { stable: true, inPlace: true, maxSize: 200, allowsNegatives: true },
  merge: { stable: true, inPlace: false, maxSize: 200, allowsNegatives: true },
  quick: { stable: false, inPlace: true, maxSize: 200, allowsNegatives: true },
  heap: { stable: false, inPlace: true, maxSize: 200, allowsNegatives: true },
  shell: { stable: false, inPlace: true, maxSize: 200, allowsNegatives: true },
  comb: { stable: false, inPlace: true, maxSize: 200, allowsNegatives: true },
  cocktail: { stable: true, inPlace: true, maxSize: 200, allowsNegatives: true },
  gnome: { stable: true, inPlace: true, maxSize: 200, allowsNegatives: true },
  cycle: { stable: false, inPlace: true, maxSize: 200, allowsNegatives: true },
  bitonic: { stable: false, inPlace: true, maxSize: 128, allowsNegatives: true, note: 'Works best when n is a power of 2.' },
  pancake: { stable: false, inPlace: true, maxSize: 200, allowsNegatives: true },
  bogo: { stable: false, inPlace: true, maxSize: 8, allowsNegatives: true, note: 'Hard-capped for safety — unbounded expected runtime.' },
  stooge: { stable: false, inPlace: true, maxSize: 40, allowsNegatives: true },
  tim: { stable: true, inPlace: false, maxSize: 200, allowsNegatives: true },
  oddEven: { stable: true, inPlace: true, maxSize: 200, allowsNegatives: true },
  tree: { stable: false, inPlace: false, maxSize: 200, allowsNegatives: true },
  library: { stable: true, inPlace: false, maxSize: 120, allowsNegatives: true },
  counting: { stable: true, inPlace: false, maxSize: 200, allowsNegatives: false, note: 'Non-negative integers recommended.' },
  radix: { stable: true, inPlace: false, maxSize: 200, allowsNegatives: false, note: 'Non-negative integers recommended.' },
  bucket: { stable: true, inPlace: false, maxSize: 200, allowsNegatives: false },
  pigeonhole: { stable: true, inPlace: false, maxSize: 200, allowsNegatives: true, note: 'Range should be close to n for efficiency.' },
  flash: { stable: false, inPlace: true, maxSize: 200, allowsNegatives: true },
  strand: { stable: true, inPlace: false, maxSize: 200, allowsNegatives: true },
};

const keyToImport = {
  bubble: 'bubbleSort',
  selection: 'selectionSort',
  insertion: 'insertionSort',
  merge: 'mergeSort',
  quick: 'quickSort',
  heap: 'heapSort',
  shell: 'shellSort',
  comb: 'combSort',
  cocktail: 'cocktailSort',
  gnome: 'gnomeSort',
  cycle: 'cycleSort',
  bitonic: 'bitonicSort',
  pancake: 'pancakeSort',
  bogo: 'bogoSort',
  stooge: 'stoogeSort',
  tim: 'timSort',
  oddEven: 'oddEvenSort',
  tree: 'treeSort',
  library: 'librarySort',
  counting: 'countingSort',
  radix: 'radixSort',
  bucket: 'bucketSort',
  pigeonhole: 'pigeonholeSort',
  flash: 'flashSort',
  strand: 'strandSort',
};

const order = Object.keys(keyToImport);
const imports = order
  .map((k) => `import ${keyToImport[k]} from '../algorithms/${keyToImport[k]}.js';`)
  .join('\n');

function esc(str) {
  return JSON.stringify(str);
}

const entries = order.map((key) => {
  const m = meta[key];
  const e = extras[key];
  const gen = keyToImport[key];
  return `  ${key}: {
    id: ${esc(key)},
    name: ${esc(m.name)},
    category: ${esc(m.category)},
    description: ${esc(m.description)},
    timeBest: ${esc(m.timeBest)},
    timeAvg: ${esc(m.timeAvg)},
    timeWorst: ${esc(m.timeWorst)},
    space: ${esc(m.space)},
    stable: ${e.stable},
    inPlace: ${e.inPlace},
    maxSize: ${e.maxSize},
    allowsNegatives: ${e.allowsNegatives},
    note: ${e.note ? esc(e.note) : 'null'},
    pseudocode: ${JSON.stringify(m.pseudocode, null, 6).replace(/\n/g, '\n    ')},
    generator: ${gen},
  }`;
}).join(',\n');

const out = `/**
 * Central algorithm registry — single source for selection + metadata.
 */

${imports}

export const algorithmRegistry = {
${entries}
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
export function runSelfTests(sample = [42, 12, 88, 3, 99, 25, 1, 56, 17, 34]) {
  const expected = [...sample].sort((a, b) => a - b);
  const results = [];

  for (const key of ALGORITHM_KEYS) {
    const entry = algorithmRegistry[key];
    try {
      const gen = entry.generator(sample);
      let lastEvent = null;
      let stepCount = 0;
      for (const event of gen) {
        lastEvent = event;
        stepCount += 1;
      }
      const finalArray = lastEvent ? lastEvent.array : [];
      const isCorrect = JSON.stringify(finalArray) === JSON.stringify(expected);
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
  console.log(\`[Self-Test Suite] Passed \${passedCount} / \${ALGORITHM_KEYS.length} Algorithms.\`);
  return { total: ALGORITHM_KEYS.length, passed: passedCount, details: results };
}
`;

fs.writeFileSync('src/data/algorithmRegistry.js', out);
console.log('wrote registry with', order.length, 'entries');
