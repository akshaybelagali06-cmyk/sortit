/**
 * Algorithm correctness self-tests (Node-runnable).
 */

import { runSelfTests, ALGORITHM_KEYS, getAlgorithm } from '../src/data/algorithmRegistry.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

export function runAlgorithmTests() {
  const results = [];

  const suite = runSelfTests([42, 12, 88, 3, 99, 25, 1, 56, 17, 34]);
  results.push({
    name: 'all 25 algorithms sort sample',
    passed: suite.passed === suite.total && suite.total === 25,
    detail: `${suite.passed}/${suite.total}`,
  });

  const edgeCases = [
    { name: 'single element', sample: [7] },
    { name: 'duplicates', sample: [5, 1, 5, 2, 5] },
    { name: 'already sorted', sample: [1, 2, 3, 4, 5] },
    { name: 'reverse sorted', sample: [9, 7, 5, 3, 1] },
  ];

  for (const edge of edgeCases) {
    const expected = [...edge.sample].sort((a, b) => a - b);
    let allOk = true;
    for (const key of ALGORITHM_KEYS) {
      // Bogo is unbounded; skip in edge-case matrix (covered by main 25/25 sample).
      if (key === 'bogo') continue;
      const gen = getAlgorithm(key).generator(edge.sample);
      let last = null;
      for (const ev of gen) last = ev;
      const finalArr = last?.array || [];
      if (JSON.stringify(finalArr) !== JSON.stringify(expected)) {
        allOk = false;
        results.push({
          name: `${edge.name} — ${key}`,
          passed: false,
          detail: JSON.stringify(finalArr),
        });
      }
    }
    results.push({
      name: `edge: ${edge.name}`,
      passed: allOk,
      detail: allOk ? 'ok' : 'failed',
    });
  }

  return results;
}
