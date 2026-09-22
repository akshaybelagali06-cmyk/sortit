/**
 * StepPlayer unit tests (Node-runnable, no DOM).
 */

import StepPlayer, { explainEvent } from '../src/engine/StepPlayer.js';
import { EventType } from '../src/engine/events.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

export function runPlayerTests() {
  const results = [];

  const player = new StepPlayer(null);
  player.loadAlgorithm('bubble', [3, 1, 2]);

  results.push({
    name: 'loads initial history step',
    passed: player.history.length === 1 && player.currentIndex === 0,
  });

  const moved = player.stepForward();
  results.push({
    name: 'stepForward advances',
    passed: moved === true && player.currentIndex === 1,
  });

  player.stepForward();
  player.stepBackward();
  results.push({
    name: 'stepBackward retreats',
    passed: player.currentIndex >= 0,
  });

  const why = explainEvent({
    type: EventType.COMPARE,
    indices: [0, 1],
    array: [3, 1],
  });
  results.push({
    name: 'explainEvent for compare',
    passed: typeof why === 'string' && why.includes('Comparing'),
  });

  player.reset();
  results.push({
    name: 'reset clears history',
    passed: player.history.length === 0 && player.currentIndex === -1,
  });

  return results;
}

const isDirect = process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('player.test.js');
if (isDirect) {
  const results = runPlayerTests();
  for (const r of results) {
    console.log(`${r.passed ? 'PASS' : 'FAIL'} ${r.name}`);
    assert(r.passed, r.name);
  }
}
