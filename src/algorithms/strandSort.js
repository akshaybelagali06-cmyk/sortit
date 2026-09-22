/**
 * Pure generator sorting algorithm.
 * Yields operation events; does not touch DOM, timers, or UI.
 */
export default function* strandSort(arr) {
  let a = [...arr];
  let n = a.length;
  let unsorted = [...a];
  let result = [];

  yield { type: "line", line: 1, description: "Strand Sort: starting sublist extractions", array: [...a], indices: [] };

  while (unsorted.length > 0) {
    let strand = [unsorted.shift()];
    let i = 0;
    while (i < unsorted.length) {
      if (unsorted[i] >= strand[strand.length - 1]) {
        strand.push(unsorted.splice(i, 1)[0]);
      } else {
        i++;
      }
    }

    yield {
      type: "line",
      line: 3,
      description: `Pulled increasing strand: [${strand.join(", ")}]`,
      array: [...a],
      indices: [],
      auxData: {
        label: "Extracted Strand & Result",
        items: [
          { value: `Strand: [${strand.join(",")}]` },
          { value: `Sorted Result: [${result.join(",")}]` }
        ]
      }
    };

    // ---- MERGE strand into result ----
    let merged = [];
    let p1 = 0, p2 = 0;
    while (p1 < result.length && p2 < strand.length) {
      yield {
        type: "compare",
        indices: [],
        array: [...a],
        line: 4,
        description: `Merging: comparing result[${p1}] (${result[p1]}) and strand[${p2}] (${strand[p2]})`,
        auxData: {
          label: "Merge Progress",
          items: [
            { value: `Result: [${result.join(",")}]` },
            { value: `Strand: [${strand.join(",")}]` },
            { value: `Merged: [${merged.join(",")}]` }
          ]
        }
      };
      if (result[p1] <= strand[p2]) merged.push(result[p1++]);
      else merged.push(strand[p2++]);
    }
    while (p1 < result.length) merged.push(result[p1++]);
    while (p2 < strand.length) merged.push(strand[p2++]);

    result = merged;

    yield {
      type: "line",
      line: 5,
      description: `Merged strand into result: [${result.join(", ")}]`,
      array: [...a],
      indices: [],
      auxData: {
        label: "Merge Result",
        items: [{ value: `Sorted So Far: [${result.join(",")}]` }]
      }
    };
  }

  // Write the final sorted result back into `a` for the bar visualizer
  for (let k = 0; k < n; k++) {
    a[k] = result[k];
    yield {
      type: "overwrite",
      indices: [k],
      array: [...a],
      line: 6,
      description: `Copying final sorted value ${result[k]} to arr[${k}]`
    };
  }

  for (let k = 0; k < n; k++) {
    yield {
      type: "markSorted",
      indices: [k],
      array: [...a],
      line: 6,
      description: "Strand Sort Complete!"
    };
  }
}

/** Map of algorithm keys to generator functions */
