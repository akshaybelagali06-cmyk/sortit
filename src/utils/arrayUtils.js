/**
 * Shared array helpers.
 */

export function cloneArray(array) {
  return [...array];
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomArray(length, min = 10, max = 99) {
  return Array.from({ length }, () => randomInt(min, max));
}

export function isSortedAscending(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i - 1] > arr[i]) return false;
  }
  return true;
}
