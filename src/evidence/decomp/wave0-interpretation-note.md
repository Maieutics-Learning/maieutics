# Outcome-interpretation note (review-adopted; doc-only, no bar moves, no compute)

**Cover:** user 2026-11-26 "Last review". Answers the review's core caveat —
W0-RAND/W0-TRIV validate the pipeline, not the theory. This note files, BEFORE
any Wave-0 execution, how every outcome pattern will be read, including the
shortcut alternative. If any pattern below is ambiguous, that is filed here now,
not discovered after seeing data.

## 1. What each U58 verdict means (frozen U33 canon, 2/3 trunks)
- DET2-HEALTHY (NONDEGEN + DISSOCIATE 4/5 + INDEPEND): licenses E-NE1 consumers
  in H-language (proves nothing about biology). Shortcut check already
  pre-registered: W0-RAND must have passed (scrambled → COLLAPSED/UNDER, never
  HEALTHY), DISSOCIATE must hold with AND without the OLS second net, INDEPEND
  |r|<0.7 (A''/B'' not the same signal). A HEALTHY that needed OLS, or with
  |r|>=0.7, is ENTANGLED evidence, not HEALTHY — the gating already says so.
- DET2-ENTANGLED: a single scalar fires. Do NOT split into validity/carry
  consumers. Single-signal serving only.
- DET2-COLLAPSED: signals absent. Do not build. (Reachable by construction
  since v1.2 fixed-tolerance POWER — effect-relative uw was the bug that
  deleted it.)
- UNDERPOWERED / PIN-FAIL: no license either way; measurement, not a result.

## 2. What each U59 verdict means (20 seeds, quorum 15/20 v1.1 Q1)
- SUP-FIXED: veto holds under B-heavy with its own objective AND vetoTASK
  replicates U57's leak (~0.059 ± 0.02). Licenses scheduling/replay program.
  Without the replication check it would be TASK-NOREP, not FIXED — the
  control against reinterpreting a broken baseline as success is in the gate.
- SUP-PERSISTS: leak deeper than the objective (capacity/blend pathology).
  Veto line dead even with direct supervision.
- TASK-NOREP: baseline suspect — halt, audit U57, do not interpret candidate.
- FLOOR-FAIL / PIN-FAIL: guards, not results.

## 3. Cross-experiment patterns (the review's "both HEALTHY" case)
- U58 HEALTHY + U59 SUP-FIXED: both mechanisms viable. Permitted claim:
  detector readouts + supervised veto each work under their diets. NOT
  permitted: any biology claim (H-language), any "same mechanism" claim
  (different tracks, different diets, INDEPEND gate on the detector side).
  Shortcut alternative is filed-against by: W0-RAND passed on both tracks,
  OLS-independent dissociation, |r|<0.7, replication control. Filed-against
  is not proven-absent — the final report says exactly that.
- U58 HEALTHY + U59 SUP-PERSISTS: detection exists, veto leak is structural.
  Detector line advances alone; veto line dead.
- U58 COLLAPSED + U59 SUP-FIXED: veto works, detector absent. No E-NE1.
- U58 COLLAPSED + U59 SUP-PERSISTS: both lines dead on evidence. Architecture
  track (per Turn-174 kill-switch logic), not more pricing.
- Any ENTANGLED: single-scalar serving only, no split consumers.

## 4. Final-report changelog (protocol changes to state + justify)
- 14/20 → 15/20 quorum (user order Turn-218; U57 CLOSED verdict frozen at
  14/20, not rewritten).
- W0-RAND + W0-TRIV added to both tracks (review-adopted, v1.3/v1.1).
- 4SE effect-relative POWER → fixed 2SE > 0.25 tolerance (v1.2; restored
  COLLAPSED reachability).
- Per-stream centering → precision-weighting (v1.1; centering cancels
  identically in a difference-of-means).
- Diet remap into qk {0..3} (v1.4; HALT-fix, substrate only has 4 keys).
- Review history: 10x R1 + 10x discussion per prereg version, 10x static
  code review on full W0 logic (fresh-eyes-wave0-code-review-10x-results.md).

## 5. On the review's limitations paragraph
The reviewer notes it has not run the code or seen the logs. Everything it
asked for is inspectable at commit 0847eec7: drivers
(newai-selfu58-driver.js 23985B, newai-selfu59-driver.js 41199B), preregs
(self-u58-det2-prereg.md v1.3, self-u59-ext3-prereg.md v1.1), batteries +
code-review doc, all filed verdict ledgers (d-newai-self-u*.json). No
execution has occurred on v1.3/v1.1 — that is the Wave-0 countersign now owed.
