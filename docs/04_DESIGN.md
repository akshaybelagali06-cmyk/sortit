# SortIt V2 --- Design

## Visual language

Preserve the existing dark modern identity unless a redesign is
explicitly requested.

Operation states: - Compare: yellow - Swap: red - Sorted: green -
Pivot/key: purple - Auxiliary: cyan

Color must not be the only indicator.

## Layout

``` text
┌─────────────────────────────────────────────┐
│ Header / Algorithm / Self-test              │
├──────────────┬──────────────────┬───────────┤
│ Controls     │ Visualization    │ Learning  │
│ Input        │ Bars/auxiliary   │ Metadata  │
│ Presets      │                  │ Pseudocode│
│ Playback     │                  │ Explain   │
├──────────────┴──────────────────┴───────────┤
│ Statistics / Timeline                       │
└─────────────────────────────────────────────┘
```

## Learning panel

Show description, category, complexity, stability, in-place status,
pseudocode, active line, current operation, and explanation.

## Explanation examples

-   Compare: `Comparing arr[2] = 8 with arr[3] = 3.`
-   Swap: `8 is greater than 3, so the elements are swapped.`
-   Pivot: `42 is selected as the pivot for this partition.`
-   Overwrite: `Writing 15 into position 4.`
-   Sorted: `This element has reached its final sorted position.`

## Timeline

Show `Step X / Y` and progress. Reuse existing history; do not build a
second player.

## Comparison

Show raw measurements in tables/charts. Keep theoretical complexity
separate from browser visualization time.

## Race

Multiple lanes, same input snapshot, independent generators,
per-algorithm progress and metrics. Do not use subjective winner/best
labels.

## Specialized views

Counting: count/frequency array. Radix: digit passes and buckets.
Bucket: bucket contents. Pigeonhole: holes/frequencies. Flash:
distribution/classes where meaningful.

## Accessibility

Semantic HTML, keyboard access, ARIA, visible focus, text alternatives
to color, reduced-motion support.
