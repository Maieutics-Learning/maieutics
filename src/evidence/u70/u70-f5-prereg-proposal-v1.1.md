# U70-F5 prereg PROPOSAL v1.1 (battery-patched; NOT licensed — needs re-close + fresh countersign)

Track: U70-CTX lottery-vs-discipline #2. Base: F4 EXACT (forcing cut Wc←z-onehot in train+eval, ctxw 3.0, floor 0.05, repw fixed 0.1, GRU64/Cat4-ST, BPTT-50 carry-over, clip 1.0, 200 epochs, Adam 3e-4, argmax eval, paired V4 shuffle, all metrics).

## Change (discipline ONLY; no arch/loss/bar change)
- Restarts per seed-path: 1 → 3. Inits pre-registered: k=0: 90000+s, k=1: 94000+s, k=2: 98000+s. Sampling RNG 91000+s UNCHANGED across k (only init differs). Eval RNG 73000+s unchanged. Same 20 streams, same 200 epochs, same weights.
- Total 60 rows, ALL filed. No dropping. Non-finite = INVALID, re-run once per restart.

## Battery patch (barrage 10/10 NEEDS-PATCH → adopted)
- k=0 is REPLICATION-CHECK ONLY: must match filed F4 same-seed within floating noise (same init+stream+sampling+code path except ctxw handling identical). Mismatch = driver bug, halt. k=0 excluded from every primary number.
- PRIMARY SAMPLE = 40 new-init RUNS (k=1,2 × 20 seeds), unit = run. Pooled probe/gap over 40, same bars: probe ≥0.70 AND gap ≥0.05. Same single-run meaning as F4 pooled-20 — no mean-of-means for the verdict.
- Paired attribution DESCRIPTIVE ONLY: per-seed mean(k=1,2) − F4 same-seed dProbe/dGap + CI, labeled stability-delta (2-mean vs single variance shrinkage acknowledged, not a verdict input).
- LOTTERY-CEILING is an analysis heading only (per-seed 2/2, 1/2, 0/2 pass counts + max table), never a verdict.
- ctx ≥0.85, KL, delay/FA/ECE/G2/G3 reported, no bar moves.

## Verdicts (locked)
**F5-FIXED** = pooled-40 probe pass AND pooled-40 gap pass. **F5-PARTIAL** = probe pass AND gap fail. **F5-PERSISTS** = probe fail. Near-misses do not move bars. Mean/max tables cannot promote a verdict.

## Cost / reporting
60 rows + replication table + pooled-40 primary + paired stability-delta + consistency/max tables, configs + code hashes, grad-norm logs. ~20 min. No Phase-2 in this wave. No Phase-E claims.
