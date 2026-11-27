# U70-F1 prereg PROPOSAL v1.1 (battery-patched; NOT licensed — needs re-close + countersign)

Battery: barrage v1.0 10/10 NEEDS-PATCH, ONE coherent finding (all 10 converge): the rep-weight anneal is a second, time-varying variable — a disguised sweep, not a parameter fix. Fix adopted: anneal DELETED. F1 changes exactly ONE number.

## Change (ONE number; everything else v1.1 EXACT)
- `U70N_FREEBITS`: 0.25 → **0.05**. Floor sits below the observed raw-KL scale (Wave-1 mean 0.11) so KL gradients flow; 0.05 still guards exact-zero collapse.
- `U70N_REPW`: **fixed 0.1** (v1.1 value, unchanged — no schedule, no ramp, no interpolation to lock).
- UNCHANGED: arch, GRU64/Cat4-ST, BPTT-50, clip 1.0, 1 restart/seed, init RNG 90000+s, sampling RNG 91000+s, streams, 200 epochs, Adam 3e-4, heads, eval (argmax), V4 paired shuffle, all metrics.

## Design
- Retrain V3-architecture with the single changed floor on the SAME 20 seeds (same inits, same streams — paired vs Wave-1 V3 rows per seed; the ONLY difference between the paired runs is the floor constant, so deltas attribute cleanly). F1-V3 (trained) + F1-V4 (frozen-F1 test-time z-shuffle, forced-use, within-run — always a valid causal test of that run; cross-floor gap-magnitude comparison is descriptive, not gated).
- N=20. Exclusions/stopping/firewall: v1.1 verbatim. No selection, no peeking.

## Outcomes (bars UNCHANGED)
- Primary: z-only probe ≥0.70 (pooled) AND gap = F1act − max(cueAct, F1-V4act) ≥0.05.
- KL reported RAW (mean + per-seed) and checked at both floors descriptively (0.25 for Wave-1 comparability, 0.05 as the new floor). If raw KL stays <0.05, gradients are zero again — that outcome is F1-PERSISTS with mechanism (gate open, pressure still insufficient → F2 territory), not a design error.
- G1 delay + G2/G3 reported (no change expected).
- Verdicts (boundaries locked, R7/R10 fixes): **F1-FIXED** = probe pass AND gap pass. **F1-PARTIAL** = probe pass AND gap fail (representation restored, causality dead → F2 territory). **F1-PERSISTS** = probe fail (regardless of gap; gap pass + probe fail = uninterpretable/representation failure, filed as such). Bars do not move on near-misses (0.04 gap = fail; pre-hoc discipline).

## Reporting
Per-seed ledger + paired F1-minus-Wave1 differences (probe, gap, KL, delay) + CI, configs + code hashes, verdict. No Phase-E claims.
