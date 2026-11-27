# Focused re-close U64e v1.3 results (6 fresh scouts, parallel)

**Premise:** `reviews-u64e/premise-u64e-v1.3.md` (frozen 2026-11-27). **Replies verbatim:**
`reviews-u64e/barrage-v1.3-reclose-S1..S6.md`. **Method:** focused re-close; six
fresh scouts (never reused), sealed, one Promise.all; STANDS or NEEDS-PATCH, ≤2
findings each. A repeat of an answered complaint counts only if it says what v1.3
missed, else stale.

## Re-close verdicts: 3 STANDS / 3 NEEDS-PATCH (one real clarity hit)
- S1 NEEDS-PATCH: halt-logic contradiction (HALT/LINE-HALT vs countersign-halt) +
  total-cap race at g=6.
- S2 STANDS (joint bound + quorum compatible; D1 diagnostic-only, no hidden gate).
- S3 NEEDS-PATCH: halt conflation (same as S1.1) + firewall-vs-D2 contradiction
  (blindHit gap as F2 input vs firewall reads).
- S4 STANDS (randBlind honest null; no shared state; firewall isolation).
- S5 NEEDS-PATCH: termination contradiction (same as S1.1) + F-tree incompleteness
  (no verdict-to-tree mapping).
- S6 STANDS (no findings).

## Adjudication
**ADOPTED → v1.4 (1, gloss only, no behavior change):**
- D6 halt-levels one-liner (S1.1/S3.1/S5.1, same genuine point thrice): the three
  stops live at different levels — HALT = run abort (examHash mismatch / W0 gate
  failure, pre-verdict, driver aborts the run); LINE-HALT = line-terminal verdict
  (the shape line stops; revival needs owner order + fresh battery);
  countersign-decline = program halt between generations (NO compute without
  countersign IS the program halt — mechanical). D5's "iff" is loosened
  accordingly: countersign-decline is the program-level halt; HALT/LINE-HALT are
  run/line-level stops. No design change; the sentence is gloss.
**REJECTED with reasons:**
- S1.2 race at g=6 (no race): gen g's verdict carries g; the NEXT generation's W0
  asserts g+1 ≤ 6 before any compute. Gen-6 verdict filed normally (6 ≤ 6 pass);
  gen-7 W0 HALTs with no verdict and no compute, recorded in the W0 check log.
  Sequential, driver-enforced — the imagined overwrite never occurs.
- S3.2 firewall-vs-D2 (STALE): round-1 A2 + round-2 C-series already ruled — the
  firewall governs the BARS (win/INCONCLUSIVE decision reads only accRec + filed
  dice); diagnostic logs are consulted at verdict time ONLY to select the F-shape
  under NEITHER. v1.3 states both ("never a gate", "one F2 input among margins").
  Repeat without saying what v1.3 missed → stale per premise rule.
- S5.2 F-tree mapping (misreading with pointer): mapping IS filed — bars first
  (LOOP-CLOSED / RESET-VALUE @quorum + demotion rule), floor second
  (INCONCLUSIVE), then NEITHER invokes the strict-priority tree to file the shape
  ("file the failure shape F1–F5 below with the measured numbers").
  ORACLE-ONLY/TRIGGER-INSENSITIVE are bar-outcome labels; PIN-FAIL/HALT/LINE-HALT
  are process terminals. The tree fires only under NEITHER, so it maps no win
  label — by filed design.
**Score:** 1 clarity finding → 1 adoption (D6 gloss). 5 clean-equivalent.

## Output
- v1.4 patch (D6 one-liner) → micro-confirm (3 fresh scouts on the halt paragraph
  only) → STANDS → countersign. Compute UNLICENSED throughout.
