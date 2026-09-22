# SortIt V2 --- Engineering Rules

1.  **Repository is the source of truth.** Never assume previous-agent
    work exists.
2.  Inspect before modifying.
3.  Implement one milestone at a time.
4.  Preserve working functionality.
5.  Do not rewrite all algorithms unnecessarily.
6.  Algorithms remain pure generators with no DOM/UI/timer access.
7.  Treat the event contract as an API.
8.  Do not create duplicate StepPlayers, registries, statistics systems,
    or array state.
9.  Avoid unnecessary dependencies.
10. V2 remains vanilla JS unless explicitly requested otherwise.
11. Test after meaningful changes.
12. 25/25 is a regression gate; if it falls below 25, stop feature work
    and fix it.
13. Review Git diff before committing.
14. Commit meaningful milestones separately.
15. Never claim a test was run if it was not.
16. Never claim a feature is implemented merely because it appears in
    documentation.
17. For large refactors, provide plan, affected files, risks, and
    rollback/checkpoint first.
18. Accessibility must not depend only on color.
19. Protect expensive/unbounded algorithms such as Bogo Sort with safe
    limits.
20. Separate operation counts, visualization time, and theoretical
    complexity.
21. Avoid abstraction for abstraction's sake.
22. When an agent says "done", verify the result independently.

Use these status labels: - IMPLEMENTED - PARTIALLY IMPLEMENTED -
PLANNED - UNKNOWN
