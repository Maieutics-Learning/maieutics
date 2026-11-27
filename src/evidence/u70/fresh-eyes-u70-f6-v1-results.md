# U70-F6 battery barrage results (9/9 NEEDS-PATCH + 1 truncated, 2026-11-27)

Premise: `premise-u70-f6-v1.0.md`. Verbatims: `f6-battery/r1..r10` (r1 truncated mid-sentence — filed verbatim, excluded from convergence).

## Convergent finding (r2–r10, same two charges)
1. **Redundancy (all 9):** the soft q-teacher is ctxw-by-another-name — a disguised sweep of alignment pressure via a different path, not a mechanism flip. Loss-path is fully explored (F1 floor, F4 weight); this is a third turn of the same dial.
2. **Teacher-is-judge (7/9):** shaping q with grad then reading it with the detached probe contaminates the probe — the manifold is built to satisfy the teacher.
3. **Ancillaries:** w=1.0 arbitrary magic number (r2/r7/r9); the new head's own random init breaks F4-exact comparability (r8 — fixable via zero-init, but doesn't save the concept); hard-vs-soft gradient conflict/oscillation risk (r10).

## Adjudication (for owner arbitration)
Recommend KILL F6-soft-teacher, not patch: zero-init + re-weight would answer the ancillaries but not the convergent core (redundancy + judge-by-proxy). Taken at face value, the battery closes the whole loss-path: the next move must be OUTSIDE the objective.
- Pivot: F7-LR-warmup (path-only — linear 0→3e-4 over first 20 epochs, then identical; endpoint objective UNCHANGED, so any delta is stabilization, not a new destination; directly targets early corner-slam flips). Draft F7 v1.0 next.
- Alternative (owner overrule): patch F6 (zero-init head, teacher w tied to repw 0.1 scale, conflict pre-registration) + re-close. Not recommended — core charges survive patching.
