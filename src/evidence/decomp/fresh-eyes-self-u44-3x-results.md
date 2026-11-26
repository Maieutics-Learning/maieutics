# Battery: U44-MIXBAND prereg v1.0 -> v1.1 (R1 IMPLEMENTABLE + R2 NEEDS-PATCH + R3 IMPLEMENTABLE)
Reviewers: 3x sealed via root.generateText (labor only, never training signal).
R1: IMPLEMENTABLE, 4/4 HEALTH, no patches. R2: NEEDS-PATCH (H2 FAIL + 3 patches).
R3: IMPLEMENTABLE, 4/4 HEALTH, no patches.
Owner adjudication -> v1.1 pins (clarifications; NO bar changes):
- P1a: "direction-win" IS quantitative as filed: U44-DIRECTION = LOW-MIX >= U + 0.03 at
  quorum 2/3. R2's "arm-weights/reward delta" language does not apply (no weights exist;
  selection-only bench). No change.
- P1b: pure-diet reference = FILED M1 numbers (M1-L collapse 0.305/0.355/0.4 + oracle;
  M1-U 0.565/0.515/0.545) — cited, not re-run (shared-controls rule: M1 ran the exact
  same candidates/losses/evals on the pinned stack). U arm = same-diet mixture control.
  No new control arm (rejected: would break comparability + budget).
- P1c: r = dataRng.int(4) drawn PER SLOT (per b of B=16), ALWAYS consumed identically
  by all three arms; r<3 -> directed pick (min LOW-MIX / max HIGH-MIX), r==3 -> uniform
  (index dataRng.int(C), also always drawn). Diet-stream alignment across arms by
  construction; twin determinism per arm in Wave 0.
Result: v1.0 STANDS with pins -> v1.1. Execution: Wave 0 (twins) + 9T + 9E + verdict.
