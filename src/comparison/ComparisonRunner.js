import { getAlgorithm } from "../data/algorithmRegistry.js";

class ComparisonRunner {
  constructor() {
    this.results = [];
  }

  run(originalArray, algorithmKeys) {
    if (!Array.isArray(originalArray)) {
      throw new TypeError("originalArray must be an array.");
    }

    if (!Array.isArray(algorithmKeys) || algorithmKeys.length === 0) {
      throw new Error("Select at least one algorithm.");
    }

    this.results = [];

    for (const key of algorithmKeys) {
      this.results.push(
        this.runSingle(originalArray, key)
      );
    }

    return this.results;
  }

  runSingle(originalArray, key) {
    const algorithm = getAlgorithm(key);

    if (!algorithm) {
      return {
        key,
        name: key,
        status: "ERROR",
        error: `Algorithm "${key}" was not found.`,
      };
    }

    // Every algorithm gets its own copy.
    const input = [...originalArray];

    const startTime = performance.now();

    try {
      const generator = algorithm.generator(input);

      let lastEvent = null;
      let stepCount = 0;

      for (const event of generator) {
        lastEvent = event;
        stepCount++;
      }

      const endTime = performance.now();

      const finalArray = lastEvent?.array
        ? [...lastEvent.array]
        : [];

      const sorted = this.isSorted(finalArray);

      return {
        key,
        name: algorithm.name,
        status: sorted ? "COMPLETED" : "FAILED",

        time: endTime - startTime,

        steps: stepCount,

        sorted,

        result: finalArray,

        comparisons: null,
        swaps: null,
        writes: null,

        complexity: {
          best: algorithm.bestCase ?? null,
          average: algorithm.averageCase ?? null,
          worst: algorithm.worstCase ?? null,
          space: algorithm.spaceComplexity ?? null,
        },
      };

    } catch (error) {
      const endTime = performance.now();

      return {
        key,
        name: algorithm.name,
        status: "ERROR",

        time: endTime - startTime,

        steps: 0,
        sorted: false,
        result: [],

        comparisons: null,
        swaps: null,
        writes: null,

        error: error.message,
      };
    }
  }

  isSorted(array) {
    if (!Array.isArray(array)) {
      return false;
    }

    for (let i = 1; i < array.length; i++) {
      if (array[i - 1] > array[i]) {
        return false;
      }
    }

    return true;
  }

  getFastest() {
    const completed = this.results.filter(
      (result) =>
        result.status === "COMPLETED" &&
        Number.isFinite(result.time)
    );

    if (completed.length === 0) {
      return null;
    }

    return completed.reduce((fastest, current) =>
      current.time < fastest.time
        ? current
        : fastest
    );
  }

  getComparisonResults() {
    const fastest = this.getFastest();

    return this.results.map((result) => {
      if (
        !fastest ||
        result.status !== "COMPLETED"
      ) {
        return {
          ...result,
          differenceMs: null,
          relativeToFastest: null,
          slowerPercentage: null,
        };
      }

      const differenceMs =
        result.time - fastest.time;

      const relativeToFastest =
        fastest.time > 0
          ? result.time / fastest.time
          : null;

      const slowerPercentage =
        fastest.time > 0
          ? ((result.time - fastest.time) /
              fastest.time) * 100
          : null;

      return {
        ...result,
        differenceMs,
        relativeToFastest,
        slowerPercentage,
      };
    });
  }
}

export { ComparisonRunner };
export default ComparisonRunner;