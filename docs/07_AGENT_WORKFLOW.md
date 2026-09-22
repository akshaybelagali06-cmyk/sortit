# SortIt --- AI Agent Workflow

## 1. Establish reality

Run:

``` powershell
git status
git log --oneline --decorate -15
git branch -a
git remote -v
git diff --stat
```

Inspect the actual tree.

## 2. Read project documents

Read the PRD, architecture, rules, design, tasks, and memory.

## 3. Inspect implementation

Documentation does not prove implementation.

## 4. Classify state

Use IMPLEMENTED / PARTIALLY IMPLEMENTED / PLANNED / UNKNOWN.

## 5. Plan one milestone

State objective, files affected, risks, tests, and checkpoint.

## 6. Implement

Make the smallest coherent change. Avoid unrelated cleanup.

## 7. Verify

Check app load, console, self-tests, representative algorithms, and the
feature.

## 8. Review

Report files created/changed/removed, behavior changes, tests, results,
and remaining issues.

## 9. Git checkpoint

``` powershell
git status
git diff --stat
git add .
git commit -m "Meaningful milestone"
git push origin main
```

## 10. Continue

Only begin the next milestone after the previous one is stable.

## Rollback warning

`git restore .` and `git clean -fd` can destroy uncommitted work. Never
use them without explicit approval.
