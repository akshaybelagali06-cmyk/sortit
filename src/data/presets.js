/**
 * Array experiment presets for the Algorithm Observatory.
 */

import { cloneArray, randomInt } from '../utils/arrayUtils.js';

export const PRESET_IDS = [
  'random',
  'sorted',
  'reversed',
  'nearlySorted',
  'fewUnique',
  'duplicates',
  'mountain',
  'valley',
  'custom',
];

export const PRESET_LABELS = {
  random: 'Random Shuffled',
  sorted: 'Already Sorted',
  reversed: 'Reverse Sorted',
  nearlySorted: 'Nearly Sorted',
  fewUnique: 'Few Unique Values',
  duplicates: 'Many Duplicates',
  mountain: 'Mountain',
  valley: 'Valley',
  custom: 'Custom (from input)',
};

/**
 * Generate an array for a named preset.
 * @param {string} presetId
 * @param {number} size
 * @returns {number[]}
 */
export function generatePreset(presetId, size) {
  const n = Math.max(1, Math.floor(size));

  switch (presetId) {
    case 'sorted': {
      return Array.from({ length: n }, (_, i) => (i + 1) * 3 + 5);
    }
    case 'reversed': {
      return Array.from({ length: n }, (_, i) => (n - i) * 3 + 5);
    }
    case 'nearlySorted': {
      const arr = Array.from({ length: n }, (_, i) => (i + 1) * 3 + 5);
      const swaps = Math.max(1, Math.floor(n / 5));
      for (let k = 0; k < swaps; k++) {
        const i1 = randomInt(0, n - 1);
        const i2 = randomInt(0, n - 1);
        [arr[i1], arr[i2]] = [arr[i2], arr[i1]];
      }
      return arr;
    }
    case 'fewUnique': {
      const uniques = [15, 35, 60, 85];
      return Array.from({ length: n }, () => uniques[randomInt(0, uniques.length - 1)]);
    }
    case 'duplicates': {
      const base = [20, 20, 40, 40, 40, 70, 70, 90];
      return Array.from({ length: n }, () => base[randomInt(0, base.length - 1)]);
    }
    case 'mountain': {
      const mid = Math.floor(n / 2);
      const arr = [];
      for (let i = 0; i < n; i++) {
        const dist = Math.abs(i - mid);
        arr.push(10 + Math.round(((mid - dist) / Math.max(1, mid)) * 90));
      }
      return arr;
    }
    case 'valley': {
      const mid = Math.floor(n / 2);
      const arr = [];
      for (let i = 0; i < n; i++) {
        const dist = Math.abs(i - mid);
        arr.push(10 + Math.round((dist / Math.max(1, mid)) * 90));
      }
      return arr;
    }
    case 'random':
    default: {
      return Array.from({ length: n }, () => randomInt(10, 99));
    }
  }
}

export function snapshotArray(arr) {
  return cloneArray(arr);
}

/** @deprecated alias kept for clarity in imports */
export const presets = PRESET_LABELS;
