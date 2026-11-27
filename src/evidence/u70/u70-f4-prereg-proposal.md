# U70-F4 prereg PROPOSAL v1.0 (NOT licensed — needs battery + countersign)

Track: U70-CTX sharpen-dial #1. Base: F2 EXACT (forcing cut Wc←z-onehot, floor 0.05, repw fixed 0.1, GRU64/Cat4-ST, BPTT-50 carry-over, clip 1.0, 1 restart/seed init 90000+s, sampling 91000+s, streams, 200 epochs, Adam 3e-4, argmax eval, paired V4 shuffle, all metrics).

## Change (ONE number; everything else F2 EXACT)
- `U70N_CTXW`: 1.0 → **3.0**. Context loss `L_ctx = 3.0·CE(p̂(c|z-only), true c)`. All other loss weights unchanged (`L_pred` 1.0, `L_dyn` 1.0, `L_rep` 0.1, `L_rho` 1.0).
- Rationale: F2 proved the path is load-bearing (gap 0.117, 19/20) but z-content is lossy (probe 0.6945, 11/20; ctx cost −0.066; KL raw 0.029). The only dense per-trial teacher into z is `L_ctx` through the forced head. 3× raises pressure through z without touching floors, repw, arch, or eval. No new heads, no un-detaching, no schedule.
- UNCHANGED: arch, forcing cut, floor, repw, BPTT/clip/restarts/inits/streams/epochs/lr, eval (argmax), V4 paired shuffle, metrics, FTD/grace handling.

## Design
- Retrain F4-architecture (F2 cut + ctxw 3.0) on SAME 20 seeds (same inits, same streams — paired vs filed F2 rows per seed; the ONLY difference is the ctxw constant, so deltas attribute cleanly). F4-V3-trained? Label: F4 (trained) + F4-V4 (frozen-F4 test-time z-shuffle, forced-use, within-run).
- N=20. Exclusions/stopping/firewall: v1.1 verbatim. No selection, no peeking, 1 restart/seed.
- Driver change (post-battery, pre-countersign): add `U70N_CTXW` const + `opts.ctxw`, multiply `dclog` grad and `L_ctx` by ctxw; variant `F4` = same head-input rule as `F2` (Wc←z-onehot). Smoke 1 seed before Wave 1.

## Outcomes (bars UNCHANGED from F2)
- Primary: z-only probe ≥0.70 (pooled) AND gap = F4act − max(cueAct, F4-V4act) ≥0.05. Paired primary: F4−F2 same-seed deltas (dProbe, dGap, dCtx) + CI.
- ctxAcc ≥0.85 reported (forcing+weight cost is data, not a moved bar). KL raw reported. Delay/FA/ECE/G2/G3 reported, no bar moves.
- Verdicts (locked): **F4-FIXED** = probe pass AND gap pass. **F4-PARTIAL** = probe pass AND gap fail. **F4-PERSISTS** = probe fail (regardless of gap). Near-misses do not move bars.
- No Phase-2 transfer in this wave (sequencing lock carries over: transfer needs FIXED here first; separate proposal).

## Reporting
Per-seed ledger + paired F4−F2 differences + CI, configs + code hashes, verdict. No Phase-E claims. F5 (restart discipline) stays queued behind this.
