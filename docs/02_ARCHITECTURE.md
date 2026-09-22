# SortIt V2 --- Architecture

## Layer model

`UI → Application State → Playback Engine → Algorithm Generators → Events → Renderers`

## Target structure

``` text
sort-it/
├── index.html
├── README.md
├── AGENTS.md
├── docs/
├── src/
│   ├── main.js
│   ├── algorithms/
│   ├── engine/
│   │   ├── StepPlayer.js
│   │   ├── events.js
│   │   └── statistics.js
│   ├── renderer/
│   ├── ui/
│   ├── data/
│   │   ├── algorithmRegistry.js
│   │   └── presets.js
│   └── utils/
└── tests/
```

This is a target, not an instruction to create every file immediately.

## Algorithms

Generators operate on local state and yield events. No DOM, UI,
setTimeout, or requestAnimationFrame.

## Events

Core events: `compare`, `swap`, `overwrite`, `markSorted`, `pivot`. New
event types require player/renderer support and documentation.

## StepPlayer

Owns generator lifecycle, playback, history, speed, progress, reset, and
relevant statistics. Do not create competing playback engines.

## Renderers

Convert state/events to bars, colors, pseudocode highlighting,
statistics, explanations, and auxiliary views. Renderers contain no
sorting logic.

## UI

Handles controls, inputs, keyboard shortcuts, accessibility, and user
interactions through application/engine APIs.

## Algorithm registry

One source for algorithm selection and metadata.

## State

Avoid duplicated sources of truth for current array, selected algorithm,
playback status, step, speed, settings, and statistics.

## Non-comparison algorithms

The event system must support auxiliary state such as buckets, count
arrays, digit passes, and bins.

## Refactoring rule

After refactoring, verify the application, controls, console, and 25/25
self-test.
