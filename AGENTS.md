# SortIt --- Master Agent Instructions

Read this before modifying the project.

## Source of truth

The actual repository, Git history, and runtime behavior are
authoritative.

## Required docs

Read: - `docs/00_PROJECT_CONTEXT.md` - `docs/01_PRD.md` -
`docs/02_ARCHITECTURE.md` - `docs/03_RULES.md` - `docs/04_DESIGN.md` -
`docs/05_TASKS.md` - `docs/06_AGENT_MEMORY.md` -
`docs/07_AGENT_WORKFLOW.md`

## First actions

``` powershell
git status
git log --oneline --decorate -15
git branch -a
git remote -v
git diff --stat
```

Inspect the actual source tree.

## Never assume

Do not assume a feature, file, test result, refactor, or previous-agent
action exists. Verify it.

## Development loop

``` text
Inspect → Understand → Plan one milestone → Implement → Test → Review diff → Commit → Next milestone
```

## Regression gate

The existing 25-algorithm self-test should remain 25/25.

## V2 target

Modular, educational sorting/DSA platform with registry, metadata,
presets, validation, explanations, timeline, comparison, specialized
visualization, race mode, accessibility, tests, documentation, and
deployment.

## Current milestone

`RECOVERY / STATE VERIFICATION` — verified complete (see
`docs/06_AGENT_MEMORY.md`). Next: `ARCHITECTURE` (await approval).

## Required handoff

After each milestone report: - what changed - why - files affected -
tests run - results - remaining issues - next recommended milestone

Never claim verification that did not occur.
