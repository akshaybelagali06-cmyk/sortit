import ComparisonRunner from "../comparison/ComparisonRunner.js";
const runner = new ComparisonRunner();

const input = [
  42,
  12,
  88,
  3,
  99,
  25,
  1,
  56,
  17,
  34,
];

const originalCopy = [...input];

const results = runner.run(input, [
  "bubble",
  "selection",
  "insertion",
  "merge",
  "quick",
]);

console.log("\n=== COMPARISON TEST ===");

for (const result of results) {
  console.log(
    `${result.name}: ${result.time.toFixed(4)} ms | ` +
    `steps: ${result.steps} | ` +
    `sorted: ${result.sorted ? "✓" : "✗"}`
  );
}

console.log("\nOriginal array unchanged:");
console.log(
  JSON.stringify(input) === JSON.stringify(originalCopy)
    ? "✓ PASS"
    : "✗ FAIL"
);

console.log("\nFastest in this experiment:");

const fastest = runner.getFastest();

console.log(
  fastest
    ? `${fastest.name} — ${fastest.time.toFixed(4)} ms`
    : "No completed algorithms"
);

console.log("\nDetailed comparison:");

console.table(runner.getComparisonResults());