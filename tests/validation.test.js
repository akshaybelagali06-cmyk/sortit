/**
 * Validation + preset tests (Node-runnable).
 */

import { generatePreset } from '../src/data/presets.js';
import {
  parseArrayInput,
  validateForAlgorithm,
  validateArrayInput,
  BOGO_SAFE_MAX,
} from '../src/utils/validation.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

export function runValidationTests() {
  const results = [];

  const parsed = parseArrayInput('10, 3, 7, x');
  results.push({
    name: 'rejects malformed input',
    passed: parsed.ok === false,
  });

  const ok = parseArrayInput('5, 2, 9');
  results.push({
    name: 'parses integers',
    passed: ok.ok && ok.values.length === 3,
  });

  const bogo = validateForAlgorithm([1, 2, 3, 4, 5, 6, 7, 8, 9], 'bogo');
  results.push({
    name: 'blocks oversized bogo',
    passed: bogo.ok === false && BOGO_SAFE_MAX === 8,
  });

  const countingNeg = validateArrayInput('3, -1, 2', 'counting');
  results.push({
    name: 'counting rejects negatives',
    passed: countingNeg.ok === false,
  });

  const mountain = generatePreset('mountain', 11);
  const valley = generatePreset('valley', 11);
  results.push({
    name: 'mountain/valley presets length',
    passed: mountain.length === 11 && valley.length === 11,
  });

  const sorted = generatePreset('sorted', 5);
  results.push({
    name: 'sorted preset ascending',
    passed: sorted.every((v, i, a) => i === 0 || a[i - 1] <= v),
  });

  return results;
}

const isDirect = process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('validation.test.js');
if (isDirect) {
  const results = runValidationTests();
  for (const r of results) {
    console.log(`${r.passed ? 'PASS' : 'FAIL'} ${r.name}`);
    assert(r.passed, r.name);
  }
}
