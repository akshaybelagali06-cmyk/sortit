# SortIt --- Agent Memory / Handoff

## Golden rule

`Repository > Git history > runtime tests > documentation > previous AI messages.`

Documentation describes intent. Source code proves implementation. Tests
prove behavior.

## Baseline (verified 2026-09-22)

Git commits: - `9961f59` --- Initial working sorting visualizer -
`2b2627e` --- 1 algo updated (also `origin/main`) - `5ad77b0` --- v2
project architecture (local `main` only; **1 commit ahead of origin**)

Working tree: **clean** (no uncommitted changes).

Remote: `https://github.com/akshaybelagali06-cmyk/sortit.git`

## Runtime source of truth (IMPLEMENTED)

The live app still boots from V1 monoliths:

- `index.html` → `app.js` (module) + `styles.css`
- Algorithms: `algorithms.js` (25 generator functions + metadata +
  `runSelfTests`)
- Playback / UI / audio / rendering: all inside `app.js`

Verified:

- Node `runSelfTests()` → **25/25**
- Browser load (`http://127.0.0.1:8765/`) → badge **Self-Test: 25/25
  Passed ✓**
- Bubble Sort Visualize → Pause → metrics/narration update; step controls
  enable
- Loaded assets: `app.js`, `styles.css` (Google Fonts also requested)
- No failed module bootstrap observed (bars rendered, self-test UI
  updated)

## V2 scaffold (PLANNED / stubs only — NOT wired)

Commit `5ad77b0` added folder layout and placeholders under `src/`,
`styles/`, `tests/`, plus `docs/` and `AGENTS.md`. These are **not**
used by `index.html`.

Notable stub behavior:

- `src/algorithms/*.js` — placeholders (e.g. `bubbleSort` returns
  `[...array].sort(...)`, not a generator)
- `src/engine/StepPlayer.js` — empty shell
- `src/data/algorithmRegistry.js` — `export const algorithmRegistry = []`
- `src/main.js` — comment only
- `tests/*.test.js` — placeholder `expect(true).toBe(true)`
- `styles/main.css` etc. — nearly empty; live CSS remains `styles.css`
- `README.md` — **removed** in `5ad77b0` (file absent)

## Feature classification (post-recovery)

| Area | Status |
| --- | --- |
| 25 algorithms (generators in `algorithms.js`) | IMPLEMENTED |
| StepPlayer / history / speed (in `app.js`) | IMPLEMENTED |
| Bar viz, metrics, narration, audio, keyboard | IMPLEMENTED |
| Pseudocode + complexity metadata | IMPLEMENTED |
| Self-test 25/25 | IMPLEMENTED (verified) |
| Presets (random / nearly / reversed / fewUnique) | PARTIALLY IMPLEMENTED |
| Full preset set (sorted, mountain, valley, …) | PLANNED |
| Input validation / Bogo safety limits | UNKNOWN / PARTIAL — inspect before claiming |
| Modular `src/` architecture wired to UI | PLANNED (scaffold only) |
| Central algorithm registry module | PLANNED (empty) |
| Operation “Why?” explanations panel | PLANNED |
| Step timeline UI | PLANNED |
| Comparison / Race / specialized aux views | PLANNED / PARTIAL (aux DOM exists) |
| Automated `tests/` suite | PLANNED (placeholders) |
| README / deployment docs | PLANNED (README deleted) |

## Architecture intent

Algorithms are generators. They yield events. They do not touch the DOM.
A playback engine consumes events. Renderers display them.

## V2 intent

Modular architecture, registry/metadata, presets, validation, operation
explanations, timeline, comparison, specialized visualizations, race
mode, accessibility, tests, documentation, deployment.

These are goals, not proof of implementation.

## Current milestone

`RECOVERY / STATE VERIFICATION` — **complete** (verified 2026-09-22).

## Next recommended milestone

`ARCHITECTURE` — begin modularization by extracting **without breaking
the live path**: event contract + registry wiring, then move algorithms
out of `algorithms.js` one-by-one or as a thin re-export layer. Keep
`index.html` on a working entry until cutover. **Do not** replace
working generators with the current stub files.

## Regression gate

25/25 algorithm self-tests should remain passing. If not, stop feature
development and diagnose the regression.

## Never

- claim a file exists without inspecting it
- claim a feature works without testing it
- delete working code without reason
- rewrite all algorithms unnecessarily
- add frameworks/dependencies without justification
- implement several large milestones at once
- hide failed tests
- treat `src/` stubs as implemented algorithms
