export function cloneArray(array) {
  return [...array];
}

export function randomArray(length, min = 0, max = 100) {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}
