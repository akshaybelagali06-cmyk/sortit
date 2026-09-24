# SortIt — Algorithm Observatory

## Overview

SortIt is an interactive sorting-algorithm visualization and DSA learning application. It is designed to help users understand how common sorting algorithms work by showing live comparisons, swaps, state changes, and performance characteristics in an accessible browser-based interface.

The repository currently contains a working sorting visualizer alongside a newer modular V2 source tree under `src/`, which is organized around algorithm generators, playback, renderers, and UI modules. The live app remains centered on the legacy `app.js` + `algorithms.js` structure, while the newer modular structure documents the intended architecture for future work.

## Features

The current project includes:

- Sorting algorithm visualization
- 25 sorting algorithms
- Interactive array input and generation
- Algorithm selection and switching
- Animated visualization of sorting operations
- Play/Pause controls
- Step forward/backward controls where supported
- Speed control
- Sound control using the Web Audio API
- Live narration/explanation during playback
- Pseudocode visualization
- Real-time statistics and progress feedback
- Algorithm information and complexity details
- Responsive interface for different screen sizes
- Comparison Lab support in the modular V2 source tree, while the active runtime remains the legacy visualizer structure

## Algorithms

The project currently supports these 25 algorithms:

1. Bubble Sort
2. Selection Sort
3. Insertion Sort
4. Merge Sort
5. Quick Sort
6. Heap Sort
7. Counting Sort
8. Radix Sort
9. Bucket Sort
10. Shell Sort
11. Tim Sort
12. Comb Sort
13. Cocktail Sort / Shaker Sort
14. Gnome Sort
15. Cycle Sort
16. Bitonic Sort
17. Pancake Sort
18. Bogo Sort
19. Stooge Sort
20. Tree Sort
21. Pigeonhole Sort
22. Flash Sort
23. Library Sort
24. Odd-Even Sort
25. Strand Sort

## Technology Stack

The project currently uses:

- HTML
- CSS
- Vanilla JavaScript
- ES6 module/generator-based algorithm logic
- Web Audio API for sound feedback
- Node.js and npm for local tooling
- Vite as the development server (`npm run dev` in `package.json`)

This project is not built with React, TypeScript, a backend, or a database layer.

## Project Structure

The repository is organized as follows:

- `index.html` — main HTML entry point
- `app.js` — legacy application bootstrap and runtime logic
- `algorithms.js` — legacy algorithm definitions and setup
- `styles.css` — global legacy stylesheet
- `docs/` — project context, architecture, rules, design, tasks, and workflow documents
- `scripts/` — project helper scripts such as registry and algorithm split utilities
- `src/` — modular V2 source tree containing the newer architecture, including:
  - `algorithms/` — sorting algorithm modules
  - `engine/` — playback, events, statistics, and audio logic
  - `renderer/` — visualization and explanation renderers
  - `ui/` — controls and interface logic
  - `data/` — registry and preset definitions
  - `utils/` — shared utility logic
- `styles/` — modular CSS files for components, layout, and responsiveness
- `tests/` — test runner and validation suites

## Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

This uses Vite to provide the local development server. The project can be stopped with `Ctrl+C` in the terminal.

## Testing

The repository includes a Node-based test runner in `tests/run.mjs`.

Run the test suite with:

```bash
node tests/run.mjs
```

This project does not currently define a separate `npm test` script in `package.json`.

## Development Principles

The current architecture follows these principles documented in the project materials:

- Algorithms remain separated from the UI layer.
- Algorithms should not directly manipulate the DOM.
- The playback engine (`StepPlayer` and related engine modules) handles animation and state progression.
- Renderer modules handle visualization of bars, statistics, pseudocode, and explanations.
- Algorithms should remain deterministic and testable where applicable.
- Existing architecture should be preserved when adding new functionality.

## Branches / Development

Feature work should be done on dedicated feature branches instead of committing directly to `main`.

## License

License: Not specified yet.
