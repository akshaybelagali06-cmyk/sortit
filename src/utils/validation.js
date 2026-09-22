/**
 * Input validation for arrays and algorithm constraints.
 */

import { getAlgorithm } from '../data/algorithmRegistry.js';

export const GLOBAL_MIN_SIZE = 1;
export const GLOBAL_MAX_SIZE = 200;
export const BOGO_SAFE_MAX = 8;

/**
 * Parse a comma/space-separated array string into integers.
 * @param {string} raw
 * @returns {{ ok: boolean, values: number[], error?: string }}
 */
export function parseArrayInput(raw) {
  if (raw == null || String(raw).trim() === '') {
    return { ok: false, values: [], error: 'Array input is empty.' };
  }

  const tokens = String(raw)
    .split(/[\s,]+/)
    .map((t) => t.trim())
    .filter(Boolean);

  if (tokens.length === 0) {
    return { ok: false, values: [], error: 'No numbers found in input.' };
  }

  const values = [];
  for (const token of tokens) {
    if (!/^-?\d+$/.test(token)) {
      return {
        ok: false,
        values: [],
        error: `Invalid value "${token}". Use integers only.`,
      };
    }
    values.push(parseInt(token, 10));
  }

  if (values.length > GLOBAL_MAX_SIZE) {
    return {
      ok: false,
      values: [],
      error: `Array too large (${values.length}). Max size is ${GLOBAL_MAX_SIZE}.`,
    };
  }

  return { ok: true, values };
}

/**
 * Validate an array against an algorithm's constraints.
 * @param {number[]} values
 * @param {string} algoKey
 * @returns {{ ok: boolean, values: number[], error?: string, warning?: string }}
 */
export function validateForAlgorithm(values, algoKey) {
  if (!Array.isArray(values) || values.length === 0) {
    return { ok: false, values: [], error: 'Array must contain at least one number.' };
  }

  const entry = getAlgorithm(algoKey);
  if (!entry) {
    return { ok: false, values, error: `Unknown algorithm "${algoKey}".` };
  }

  const maxSize = Math.min(entry.maxSize ?? GLOBAL_MAX_SIZE, GLOBAL_MAX_SIZE);
  if (values.length > maxSize) {
    return {
      ok: false,
      values,
      error: `${entry.name} is limited to ${maxSize} elements (got ${values.length}).`,
    };
  }

  if (algoKey === 'bogo' && values.length > BOGO_SAFE_MAX) {
    return {
      ok: false,
      values,
      error: `Bogo Sort is capped at ${BOGO_SAFE_MAX} elements for safety.`,
    };
  }

  if (entry.allowsNegatives === false && values.some((v) => v < 0)) {
    return {
      ok: false,
      values,
      error: `${entry.name} expects non-negative integers for this visualizer.`,
    };
  }

  let warning;
  if (entry.note) warning = entry.note;

  return { ok: true, values: [...values], warning };
}

/**
 * Combined parse + algorithm validation.
 */
export function validateArrayInput(raw, algoKey) {
  const parsed = parseArrayInput(raw);
  if (!parsed.ok) return parsed;
  return validateForAlgorithm(parsed.values, algoKey);
}
