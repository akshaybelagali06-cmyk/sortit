export default function pigeonholeSort(array) {
  return [...array].sort((a, b) => a - b);
}
