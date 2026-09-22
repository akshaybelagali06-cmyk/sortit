import { runAlgorithmTests } from './algorithms.test.js';
import { runPlayerTests } from './player.test.js';
import { runValidationTests } from './validation.test.js';

const suites = [
  ['algorithms', runAlgorithmTests],
  ['player', runPlayerTests],
  ['validation', runValidationTests],
];

let failed = 0;
for (const [name, run] of suites) {
  console.log(`\n=== ${name} ===`);
  const results = run();
  for (const r of results) {
    const ok = r.passed;
    if (!ok) failed += 1;
    console.log(`${ok ? 'PASS' : 'FAIL'} ${r.name}${r.detail ? ` (${r.detail})` : ''}`);
  }
}

console.log(`\n${failed === 0 ? 'ALL PASSED' : `${failed} FAILED`}`);
process.exitCode = failed === 0 ? 0 : 1;
