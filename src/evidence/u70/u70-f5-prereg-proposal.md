# U70-F5 prereg PROPOSAL v1.0 (NOT licensed — needs battery + countersign)

Track: U70-CTX lottery-vs-discipline #2. Base: F4 EXACT (forcing cut Wc←z-onehot in train+eval, ctxw 3.0, floor 0.05, repw fixed 0.1, GRU64/Cat4-ST, BPTT-50 carry-over, clip 1.0, 200 epochs, Adam 3e-4, argmax eval, paired V4 shuffle, all metrics).

## Change (discipline ONLY; no arch/loss/bar change)
- Restarts per seed-path: 1 → **3**. Inits pre-registered: k=0: 90000+s (IDENTICAL to F4 — exact replication check), k=1: 94000+s, k=2: 98000+s. Sampling RNG 91000+s UNCHANGED across k (training z-sampling identical — only init differs, isolating init lottery). Eval RNG 73000+s unchanged.
- Everything else F4 EXACT: same 20 streams, same 200 epochs, same loss weights (ctxw 3.0 included), same heads, same eval.
- N: 20 seed-paths × 3 restarts = 60 rows, ALL filed. No dropping, no picking for the primary. Exclusions: non-finite loss = INVALID, re-run once per restart (v1.1 rule carried over). No peeking across k.

## Primary unit (pre-registered to avoid the mini-sweep)
- Primary: per-seed MEAN over k=0..2 (20 units), pooled = mean of means (= pooled over 60, balanced). Bars UNCHANGED: probe ≥0.70 AND gap ≥0.05 (paired F4-V4-style shuffle per row), ctx ≥0.85 reported.
- Replication check (descriptive): k=0 vs filed F4 same-seed — must match within floating noise (same init+stream+sampling); mismatch = driver bug, halt.
- Lottery ceiling (DESCRIPTIVE ONLY, not gated): per-seed MAX over k (best-of-3) — quantifies how much of the 8/20 tail is init luck. Never the verdict.
- Paired primary: per-seed-mean(F5) − F4 filed same-seed (dProbe/dGap/dCtx) + CI. Expectation: mean ≈ F4 if lottery is pure noise; max > mean quantifies lottery headroom without endorsing cherry-picking.

## Verdicts (locked)
**F5-FIXED** = mean-probe pass AND mean-gap pass. **F5-PARTIAL** = mean-probe pass AND mean-gap fail. **F5-PERSISTS** = mean-probe fail. Near-misses do not move bars. A max-pass + mean-fail outcome is filed as LOTTERY-CEILING (descriptive) — it motivates ensemble/arch work, not a FIXED claim.

## Cost / reporting
60 rows + per-seed means + k=0 replication table + max table, configs + code hashes, gradient-norm logs. 3× compute (~20 min). No Phase-2 in this wave. No Phase-E claims.
