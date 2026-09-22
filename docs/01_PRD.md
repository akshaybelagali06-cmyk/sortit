# SortIt V2 --- Product Requirements Document

## Vision

Turn SortIt from a sorting demo into an interactive DSA learning
platform that explains what an algorithm does, why each operation
occurs, how the array changes, and how algorithms differ.

## Core user flow

1.  Enter or generate an array.
2.  Select an algorithm.
3.  Read its information.
4.  Visualize it step by step.
5.  Play, pause, step, reset, and change speed.
6.  See pseudocode and the active line.
7.  See statistics and current-operation explanations.
8.  Optionally compare algorithms.

## V2 requirements

### P0 --- Stability

-   Preserve existing functionality.
-   Preserve all 25 algorithms.
-   Preserve generator/event architecture.
-   Preserve 25/25 self-test behavior.
-   Modularize without unnecessary behavior changes.

### P1 --- Algorithm registry

Central metadata for name, generator, category, description, pseudocode,
complexity, stability, in-place status, and input constraints.

### P1 --- Array presets

Random, Sorted, Reverse Sorted, Nearly Sorted, Few Unique, Many
Duplicates, Mountain, Valley, Custom.

### P1 --- Input validation

Handle empty/malformed input, invalid values, excessive sizes,
algorithm-specific restrictions, and safe limits for Bogo Sort.

### P1 --- Operation explanation

Explain compare, swap, overwrite, pivot, and mark-sorted events locally
and deterministically.

### P2 --- Step timeline

Show current step, total steps, and progress using the existing playback
history.

### P2 --- Algorithm comparison

Run 2--4 algorithms against the same input and display raw comparisons,
writes, accesses, operations, and theoretical complexity separately.

### P2 --- Specialized visualization

Support auxiliary representations for Counting, Radix, Bucket,
Pigeonhole, and Flash Sort where appropriate.

### P2 --- Algorithm Race

Multiple independent visualization lanes using the same input. Show
measurements; avoid subjective rankings.

### P2 --- Accessibility

Keyboard navigation, semantic controls, ARIA/status updates, visible
focus, color-independent states, and reduced motion.

### P2 --- Automated tests

Algorithm correctness, edge cases, validation, presets, event contracts,
StepPlayer, and reset.

### P3 --- Documentation/deployment

README, architecture, adding-an-algorithm guide, testing instructions,
screenshots, and deployment.

## Success criteria

Every milestone must preserve existing behavior, pass relevant tests,
introduce no unexplained console errors, and be committed separately in
Git.
