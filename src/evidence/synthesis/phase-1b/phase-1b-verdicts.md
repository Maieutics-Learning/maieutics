# Phase 1.b verdicts (RUN 2026-11-14 against frozen prereg v1.0)

## RULING 2026-11-14 (user): POSITION-INDEPENDENT* — asterisk mandatory

The * means: the filed data pass, but the run carried a bar-design mistake
(see Calibration finding below), and that mistake must travel with the
verdict everywhere it goes — especially into the paper. No busy-work
re-runs: the flat sweep (72/72 killA at ceiling, zero gate fails, no slot
effect in either direction) already answers Q2. The asterisk records that
the answer arrived through a flawed checklist, not that the answer is in
doubt. If §7/Q2 text cites this verdict, it cites it as INDEPENDENT* with
the mistake named, or not at all.

Raw: `src/evidence/synthesis/phase-1b/phase-1b-results.json` (8 retrained
winners, in-worker, same engine as Stage 1). All three frozen conditions were
computed mechanically in-driver.

## Outcomes

- Replication gate: 8/8 BIT-EXACT (retrained slot-0 ev == filed ev on all
  five metrics for every subject). Same-engine determinism confirmed again;
  all subjects valid.
- killA swept: 72/72 cells ≈ 1.0 (zero variance — total ceiling).
- killHd swept: flat per winner (ranges 0.02–0.14), levels differ by winner
  (0.69–0.86 for 313/315, 0.92–1.00 for the rest). No systematic slot-0
  peak: 313 is worst at slot 0, 315 is best at slot 0. Variation is
  winner-level + exam noise, not position-driven.
- cond1 (pooled Spearman ≥ 0.95): ρ ≈ 0.04 → FAIL.
- cond2 (mean range ≤ 0.25): 0.036 → PASS with 7× margin.
- cond3 (worst gap ≤ 0.25, no cell below gate): worst gap 0.175, zero gate
  fails → PASS.
- Mechanical verdict (frozen rule): POSITION-SENSITIVE.

## Calibration finding (my bar-design error, same species as the 1.a δ bug)

cond1 is unpassable on the data shape this system produces: killA sits at
ceiling (zero variance), so rank correlation is pure tie-noise by
construction — ρ≈0 is *guaranteed* whether or not position matters. My
degenerate rule only covered all-144-cells-pass and missed the actual case
(one grid at ceiling). Meanwhile the informative conditions (range, worst
cell, gate floor) pass with wide margins, and the profiles show no
systematic slot effect in either direction. A positional shortcut would peak
all profiles at slot 0; the observed slot-0 cells are a winner's best (315),
another's worst (313), and six neutrals.

## v1.1 RULED 2026-11-14 (user): INDEPENDENT* via (b-i), no busy work

- Mechanical verdict under v1.0 stands on record as filed (SENSITIVE) — kept
  visible above so the mistake trail is intact.
- Ruling takes (b-i): cond1's degenerate rule is widened — either grid at
  ceiling (all cells ≥ 0.99) makes consistency vacuous; the condition passes
  with the reason recorded, the flatness conditions carry the verdict.
  Recomputed from the filed ledger (no new runs): verdict flips to
  POSITION-INDEPENDENT*. Kills stand, Q2 answered, Stage 1/2 verdicts keep
  full standing (never marked provisional).
- (a) declined by user: no kill replacement, no re-gating.
- The * is part of the verdict string everywhere downstream (paper §7/Q2
  text included): INDEPENDENT*, never bare INDEPENDENT. The Calibration
  finding above is the mandatory companion note.
- Former substantive reading (Hypothesis) promoted: position-independent.

## Cost note

8 retrains (174–498 s each — slower than Stage 1's 80–530 s spread, same
worker) + 144 swept evals. Pool spend: 0. T0 blobs for all 8 seeds read from
scratch/ intact.
