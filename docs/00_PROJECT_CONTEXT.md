# SortIt --- Project Context

**Purpose:** SortIt is an interactive sorting-algorithm visualizer
intended to evolve into a DSA learning platform.

## Current technology

-   HTML, CSS, vanilla JavaScript
-   ES6 generator functions
-   Web Audio API
-   Client-side only
-   No backend
-   No React or TypeScript unless explicitly requested

## Intended 25 algorithms

Bubble, Selection, Insertion, Merge, Quick, Heap, Counting, Radix,
Bucket, Shell, Tim, Comb, Cocktail/Shaker, Gnome, Cycle, Bitonic,
Pancake, Bogo, Stooge, Tree, Pigeonhole, Flash, Library, Odd-Even,
Strand.

The repository is always the source of truth for which algorithms
actually exist and work.

## Core architecture

Sorting algorithms should be pure generators. They yield operation
events such as `compare`, `swap`, `overwrite`, `markSorted`, and
`pivot`. Algorithms must not manipulate the DOM or playback timers.

A playback layer consumes events and controls animation. Rendering
converts state/events into UI.

## Known V1 capabilities

Potentially include algorithm selection, custom/random arrays, speed,
Play/Pause, Step Forward/Back, Reset, pseudocode highlighting,
narration, statistics, audio, keyboard controls, responsive UI, and
self-tests. These must be verified from the repository before being
claimed as working.

## Known Git history

-   `9961f59` --- Initial working sorting visualizer
-   `2b2627e` --- 1 algo updated

These commit facts must be verified with Git.

## V2 direction

Planned: modular architecture, algorithm registry/metadata, array
presets, input validation, operation explanations, step timeline,
algorithm comparison, specialized non-comparison visualizations,
Algorithm Race, accessibility, automated tests, documentation,
deployment.

Plans are not proof of implementation.
