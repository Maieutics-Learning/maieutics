# U70-F16 closeout (EXECUTED 2026-11-28, countersigned v1.2 EXACT)

## Verdicts (locked F14 bars, G1 ordering: assigned BEFORE interaction table)

- A0 anchor: TRAIN-REPAIRED (probe 0.7183 / TRUE-gap 0.1468 / ctx 0.8783) + HELDOUT-DEGRADES
  (probe 0.6227 / TRUE-gap 0.0274 FAIL / ctx 0.7777). Replication: 40/40 per-seed clean rows
  0 mismatches vs filed F14 (`d-u70-neural-f14-wave1.json`); A0 spec == F14 spec; pooled
  bit-identical. Harness moved nothing.
- A1 z-recurrence alone: TRAIN-REGRESSED (probe 0.5473 FAIL / gap 0.1075 PASS / ctx 0.8408) +
  HELDOUT-DEGRADES (0.5243 / -0.0107 FAIL / 0.7397). Feeding back z through frozen random
  columns hurts formation (probe 0.7183 -> 0.5473) while the read-out gap survives.
- A2 GRU-128 alone: TRAIN-REGRESSED (probe 0.6163 FAIL / gap 0.1733 PASS / ctx 0.9060) +
  HELDOUT-DEGRADES (0.6148 / 0.0122 FAIL / 0.7625). Capacity alone does not fix formation;
  held still collapses.
- B folded (z-rec + H128): TRAIN-REGRESSED (probe 0.6002 FAIL / gap 0.1488 PASS / ctx 0.8848) +
  HELDOUT-DEGRADES (0.6118 / 0.0135 FAIL / 0.7638). Between the separates, below the max:
  additive, not interactive.

## Emergence catch (DESCRIPTIVE, firewall holds)

- 40 interaction rows (20 seeds x train/held clean). Synergy graves 0, interference graves 0.
  The folded arm fixed no grave both separates missed and broke none both kept. Composition is
  additive: z-noise + capacity each cost formation independently, with no stray synergy or
  interference at these steps. The catch worked as designed — it caught nothing, which rules out
  the "fixes only compose" rival for this pair.
- Unfamiliar timing (descriptive, own oracle 0.9240/0.0294): A0 unfam probe 0.5863 / ctx 0.70 /
  gap -0.0108; B 0.5347 / 0.668 / -0.0428. Both UNFAM-DEGRADES descriptively — the faster-switch
  world collapses the read the same way held-out does.
- Ablations (descriptive, read-only, hash-stable all seeds): A0 clean action 0.8783 vs z-zero
  0.581 vs h-cut 0.7152; B 0.8848 vs 0.596 vs 0.7123. Use lives in both paths with z dominant;
  the folded arm did NOT move the locus (deltas match to ~0.01). Locus is stable under composition.
- Calibration (reporting-only): held valid-ECE A0 0.187083 / B 0.196476; unfam ECE 0.122098 /
  0.121405. Filed as input to the future calibration-bar proposal — no bar read them.
- Trace (reporting-only): A0 klMean 0.0332 / meanEnt 0.6484; B 0.0286 / 0.6539. No sensor emerges;
  split-rate stays non-sensor per F10.

## Integrity

560 rows (A0 180 + A1 100 + A2 100 + B 180), 0 invalid. Step-count 200/1200 every train seed/arm.
Retention 560/560. Weight hashes 80 distinct; config hashes 4 distinct with A0 == F14. G4 initLog
present all 80 trains; A0-vs-A2 hash inequality holds. T10e hash-stable on all 40 extra evals.
Gates 22/22 pre-smoke + code-grep halves (ZREC widening only, ablation mask-only, T5 mappings).
Unfamiliar oracle 20/20 (`d-u70-oracle-f16-unfam.json`).

## Follow-ups (each own prereg + battery + countersign)

F15 exposure rivals (25-epoch control, block-vs-interleave, shuffled-order); learnable z-input
weights (filed GRU inputs are frozen — ZREC fed noise by construction); quieter-init composition;
sharpened F3; calibration bar (held ECE ~0.19 filed); trace-sensor study; gated Phase-2.
NO PUSH without explicit order + PAT.
