/**
 * Statistics helpers — kept separate from algorithm generators.
 */

import { EventType } from './events.js';

export function createEmptyStats() {
  return {
    comparisons: 0,
    swaps: 0,
    accesses: 0,
    elapsedSeconds: 0,
  };
}

/**
 * Apply one event's metric contribution (mutates stats).
 */
export function accumulateEvent(stats, event) {
  if (event.type === EventType.COMPARE) {
    stats.comparisons += 1;
    stats.accesses += event.indices?.length || 0;
  } else if (event.type === EventType.SWAP || event.type === EventType.OVERWRITE) {
    stats.swaps += 1;
    stats.accesses += event.indices?.length || 0;
  }
  return stats;
}

/**
 * Recompute metrics for history[1..targetIdx] inclusive.
 */
export function recalculateStats(history, targetIdx) {
  const stats = createEmptyStats();
  for (let i = 1; i <= targetIdx; i++) {
    accumulateEvent(stats, history[i]);
  }
  return stats;
}
