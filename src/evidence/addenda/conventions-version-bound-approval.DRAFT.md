# COUNTERSIGNED addendum (user countersign 2026-11-16 — applied to GAMEPLAN v22 Conventions)

## Proposed: Conventions addition — version-bound approval (borrow-gameplan item 6)

**Text to insert** (as new bullet under `## Conventions`, after the selection-pressure bullet):

> - Version-bound approval: an approval (countersign, gate pass, design freeze) binds to the exact evidence/plan version reviewed (version tag + date; fingerprint where cheap). A new version re-opens approval — no inherited approvals, no grandfathering. A decision record carries `{version, fingerprint, decision}`; applying a vX approval to vY without a re-verify flag is a process violation, caught at filing time.

**Motivating gap (raw log, live):** amendment approvals live in chat ("countersigned" labels) with version stamps in prose only — nothing mechanical stops a v21 approval being cited for a v22 change. Grandfather-check (run 2026-11-16): ask whether a v21 countersign covers a v22 amendment — under current process the answer is "researcher discipline," i.e. the gap is demonstrated, not hypothetical.

**Why not fingerprinting alone:** run fingerprints (2.d.v) track execution context; version-binding tracks the logical approval. Distinct failure modes (approval leakage vs stale outputs).

**Status:** countersigned 2026-11-16; applied to GAMEPLAN v22 Conventions.
