/**
 * Shared event contract for algorithm generators → StepPlayer → renderers.
 */

export const EventType = Object.freeze({
  INITIAL: 'initial',
  COMPARE: 'compare',
  SWAP: 'swap',
  OVERWRITE: 'overwrite',
  MARK_SORTED: 'markSorted',
  PIVOT: 'pivot',
  AUX: 'aux',
  LINE: 'line',
});

/**
 * @param {string} type
 * @param {object} fields
 * @returns {object}
 */
export function createEvent(type, fields = {}) {
  return {
    type,
    indices: fields.indices || [],
    array: fields.array ? [...fields.array] : [],
    line: fields.line ?? 1,
    description: fields.description || '',
    auxData: fields.auxData,
    why: fields.why,
  };
}

export function isMetricEvent(type) {
  return (
    type === EventType.COMPARE ||
    type === EventType.SWAP ||
    type === EventType.OVERWRITE
  );
}
