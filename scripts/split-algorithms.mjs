import fs from 'fs';
import path from 'path';

const src = fs.readFileSync('algorithms.js', 'utf8');

const nameToFile = {
  bubbleSort: 'bubbleSort.js',
  selectionSort: 'selectionSort.js',
  insertionSort: 'insertionSort.js',
  mergeSort: 'mergeSort.js',
  quickSort: 'quickSort.js',
  heapSort: 'heapSort.js',
  shellSort: 'shellSort.js',
  combSort: 'combSort.js',
  cocktailSort: 'cocktailSort.js',
  gnomeSort: 'gnomeSort.js',
  cycleSort: 'cycleSort.js',
  bitonicSort: 'bitonicSort.js',
  pancakeSort: 'pancakeSort.js',
  bogoSort: 'bogoSort.js',
  stoogeSort: 'stoogeSort.js',
  timSort: 'timSort.js',
  oddEvenSort: 'oddEvenSort.js',
  treeSort: 'treeSort.js',
  librarySort: 'librarySort.js',
  countingSort: 'countingSort.js',
  radixSort: 'radixSort.js',
  bucketSort: 'bucketSort.js',
  pigeonholeSort: 'pigeonholeSort.js',
  flashSort: 'flashSort.js',
  strandSort: 'strandSort.js',
};

const start = src.indexOf('25 GENERATOR FUNCTIONS');
if (start < 0) throw new Error('marker not found');
const algosBody = src.slice(start);
const algosEnd = algosBody.indexOf('export const ALGORITHMS');
const generatorsSection = algosBody.slice(0, algosEnd);

const parts = generatorsSection.split(/(?=export function\*)/);
const outDir = path.join('src', 'algorithms');
fs.mkdirSync(outDir, { recursive: true });

const header = `/**
 * Pure generator sorting algorithm.
 * Yields operation events; does not touch DOM, timers, or UI.
 */
`;

let written = 0;
for (const part of parts) {
  const trimmed = part.trim();
  const m = trimmed.match(/^export function\* (\w+)/);
  if (!m) continue;
  const fnName = m[1];
  const file = nameToFile[fnName];
  if (!file) {
    console.warn('Unknown function', fnName);
    continue;
  }
  const body = trimmed.replace(/^export function\*/, 'export default function*');
  const content = header + body + '\n';
  fs.writeFileSync(path.join(outDir, file), content);
  written += 1;
  console.log('wrote', file);
}
console.log('total written', written);
