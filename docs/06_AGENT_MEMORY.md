# SortIt --- Agent Memory / Handoff

## Golden rule

`Repository > Git history > runtime tests > documentation > previous AI messages.`

Documentation describes intent. Source code proves implementation. Tests
prove behavior.

## Baseline

Known commits: - `9961f59` --- Initial working sorting visualizer -
`2b2627e` --- 1 algo updated

Verify with Git.

## Architecture intent

Algorithms are generators. They yield events. They do not touch the DOM.
A playback engine consumes events. Renderers display them.

## V2 intent

Modular architecture, registry/metadata, presets, validation, operation
explanations, timeline, comparison, specialized visualizations, race
mode, accessibility, tests, documentation, deployment.

These are goals, not proof of implementation.

## Session recovery

On every new agent session: 1. Read project docs. 2. Run `git status`.
3. Run `git log --oneline --decorate -15`. 4. Inspect tree. 5. Inspect
affected source. 6. Verify runtime behavior. 7. Classify features as
IMPLEMENTED / PARTIALLY IMPLEMENTED / PLANNED / UNKNOWN. 8. Make one
milestone change. 9. Test. 10. Report. 11. Commit.

## Current milestone

`RECOVERY / STATE VERIFICATION`

Do not change this until repository state is inspected.

## User expectation

The user wants AI-assisted development but does not want agents to
hallucinate prior work or blindly rewrite the project.

## Regression gate

25/25 algorithm self-tests should remain passing. If not, stop feature
development and diagnose the regression.

## Never

-   claim a file exists without inspecting it
-   claim a feature works without testing it
-   delete working code without reason
-   rewrite all algorithms unnecessarily
-   add frameworks/dependencies without justification
-   implement several large milestones at once
-   hide failed tests
