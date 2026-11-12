# Wave 366 (execution; backlog-W310 floor-grade audit, zero new sims) 2026-11-12
STOP RULE: stopped after 20-cell settle-frac audit (w259+w276+w293 rows;
receipt = w346 floor datum reproduced). 1 direct + 1 tangential below.
Spend: 0 + 0 + 0. Script scratch/track-c/w310-floor.js (self-contained,
receipt-arbitrated); grid scratch/track-c/w310-grid.json.

## Direct: the floor steps with LR at fixed batch — and dimples by batch within LR

- RECEIPT: w346 floor datum reproduced from the rows (LR.12 strands 8/8/13
  @B8/B16/B32; LR.2/B96 settles 19/20) + flip=stuck=0 everywhere — the audit
  reads the validated rows, nothing else.
- Settle frac among survivors (frac ± se): B16: LR.12 .60±.11 / LR.15
  .882±.078 / LR.17 .80±.18; B24: LR.15 .45±.11 / LR.17 .786±.11; B32:
  LR.12 .35±.11 / LR.15 .90±.07 / LR.17 .85±.08 / LR.2 .50±.25(n=4); B128:
  LR.15 .80±.09 / LR.2 1.0; B8: LR.12 .60±.11; B64/B96: LR.2 .833/.95.
- (a) CONFIRMED: LR-step holds at EVERY fixed B with ≥2 surviving LRs —
  B16 (.60<.882≈.80), B24 (.45<.786, 2.1σ), B32 (.35<.90/.85, 4.4σ),
  B128 (.80<1.0). Lower LR always lands worse; LR.12 bottoms every ladder
  it stands on. The pooled "inversion" (LR.15/B24 .45 < LR.12/B16 .60) is a
  cross-B comparison artifact, not an LR failure.
- (b) REFINED (was: no within-LR grade): within-LR shape is ITSELF
  LR-dependent. LR.2 grades monotonically with B (.50→.833→.95→1.0, T
  .0354→.0177); LR.12 flats-then-dips (.571/.60/.60→.35 at B32);
  LR.15 craters mid-ladder (.882→.45 at B24→.90). One variable's envelope,
  another variable's interior — the floor has two knobs, and the second
  knob's shape is set by the first.
- (c) CONFIRMED with address: matched-survival extremes split .35 vs .95
  (LR.12/B32 vs LR.2/B96, both nan=0); the middle is B-dimple, priced above.
  Small-n cells owned as noise-limited (LR.2/B32 n=4, LR.17/B16 n=5 —
  direction consistent, bars wide).
- Verdict: USED with teeth (w366-floor-note.md is this file). LR-step
  confirmed at fixed B, within-LR shape refined to LR-dependent, two dimple
  cells priced with addresses. Spawned W327 (batch-dimple replication, bench:
  LR.15/B24 + LR.12/B32 x 40 seeds — dimple replicates or fills; neighbor-B
  fill B20/B28 + B24/B40; arrival-speed readouts).

## Tangential: slice before you pool — the envelope and the interior can have different owners (0-spend)

Pooled, LR.15 looks worse than LR.12 (.45 < .60) and T looks unrelated to
landing; sliced, LR never loses a fixed-B ladder and B owns two dimples.
Rule (third instance of the slicing moral: W292's both-conventions,
W305's threshold-vs-mechanism): when two variables both move an outcome,
the FIRST table is the cross-tab (fixed-B LR-ladders + fixed-LR B-runs),
never the pooled scatter — pooling assigns the interior's variance to the
envelope's variable and manufactures inversions. Costs one group-by on rows
already on disk. W327 inherits the habit (replicate the dimple cells at
their own B before theorizing batch).
