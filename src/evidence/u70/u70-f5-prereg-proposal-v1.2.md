# U70-F5 prereg PROPOSAL v1.2 (battery-patched x2; NOT licensed — needs delta battery + fresh countersign)

Track: U70-CTX lottery-vs-discipline #2. Base: v1.1 (F4-exact base: forcing Wc←z-onehot train+eval, ctxw 3.0, floor 0.05, repw 0.1, GRU64/Cat4-ST, BPTT-50 carry-over, clip 1.0, 200 epochs, Adam 3e-4, argmax eval, paired V4 shuffle). Discipline: 3 restarts/seed (k=0: 90000+s, k=1: 94000+s, k=2: 98000+s; sampling 91000+s fixed across k), 60 rows filed, k=0 replication-only.

## v1.2 change (bar companion; no arch/loss/discipline change)
- PRIMARY SAMPLE stays 40 new-init RUNS (k=1,2 × 20), unit = run.
- Median definition (pre-registered): sorted pooled-40 values a[0..39]; median = (a[19]+a[20])/2.
- Bars (both must pass — either fails = fail):
  - probe: pooled-40 MEAN ≥0.70 AND pooled-40 MEDIAN ≥0.70
  - gap: pooled-40 MEAN ≥0.05 AND pooled-40 MEDIAN ≥0.05
  - ctx ≥0.85 (mean reported; median descriptive), KL/delay/FA/ECE/G2/G3 reported, no other moves.
- Rationale: mean alone lets a lucky tail drag a weak middle over; median alone ignores magnitude. The pair requires both central tendency and typical-run strength. Retrospective (descriptive, verdicts UNCHANGED): F2 mean 0.694 fail/median 0.772 pass → PERSISTS under either rule; F4 mean 0.719 pass/median 0.837 pass → FIXED under either rule. No filed verdict moves.
- Everything else v1.1 EXACT: k=0 replication check (match F4 within float noise, else halt; excluded from primary), paired stability-delta descriptive, LOTTERY-CEILING analysis-only (2/2, 1/2, 0/2 + max table), no peeking, INVALID re-run once.

## Verdicts (locked)
**F5-FIXED** = all four pass (mean+median × probe+gap). **F5-PARTIAL** = probe pair pass AND gap pair fail. **F5-PERSISTS** = probe pair fail (either mean or median below 0.70). Near-misses do not move bars.

## Cost / reporting
60 rows + replication table + pooled-40 mean+median + sorted run-list + consistency/max tables, configs + hashes, grad-norm logs. ~20 min. No Phase-2 in this wave. No Phase-E claims.
