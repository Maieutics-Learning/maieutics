# U70-F1 prereg PROPOSAL v1.0 (NOT licensed; needs battery + countersign)

Target: the exact flaw Wave 1 measured — raw KL (0.11) permanently under the 0.25 free-bits floor → dynamics/representation KL gradients identically zero → z decorative (gap 0.0017, probe 0.62, V2≈V3).

## Change (TWO numbers + schedule; everything else v1.1 EXACT)
- `U70N_FREEBITS`: 0.25 → **0.05** (floor sits below the observed raw-KL scale so gradients flow; 0.05 still guards exact-zero collapse).
- `U70N_REPW`: fixed 0.1 → **linear anneal 0 → 0.3 over epochs 1..100, hold 0.3 for 101..200** (no rep pressure while heads/prior align early; ramped pressure after; 0.3 compensates the smaller floor — filed judgment, battery to ratify or patch).
- UNCHANGED: arch, GRU64/Cat4-ST, BPTT-50, clip 1.0, 1 restart/seed, init RNG 90000+s, sampling RNG 91000+s, streams, 200 epochs, Adam 3e-4, heads, eval (argmax), V4 paired shuffle, all metrics.

## Design
- Retrain V3-architecture with F1 settings on the SAME 20 seeds (same inits, same streams — paired comparison against Wave-1 V3 rows per seed). Variants: F1-V3 (trained) + F1-V4 (frozen-F1 test-time z-shuffle, forced-use). No other variants (V1/V2/V5 already filed and unchanged).
- N=20 seed-runs. Exclusions/stopping/firewall: v1.1 verbatim. No selection, no peeking.

## Outcomes (bars UNCHANGED from v1.1 except where stated)
- Primary: z-only probe ≥0.70 (pooled) AND G4 gap = F1act − max(cueAct, F1-V4act) ≥0.05 (0/20 → must move).
- KL reported RAW (mean + per-seed) and evaluated at BOTH floors: 0.25 (comparability with Wave 1) and 0.05 (new floor). G5-usage ≥50% unchanged.
- G1 delay + G2/G3 reported (no change expected; delay-6 may persist — that is F3's territory, not F1's).
- Verdicts: **F1-FIXED** (probe pass AND gap pass) / **F1-PARTIAL** (probe pass only — representation restored, causality still dead → F2 territory) / **F1-PERSISTS** (neither — dead-KL theory wrong, rethink) / INVALID (non-finite → one rerun).

## Reporting
Per-seed ledger + paired F1-vs-Wave1-V3 differences per seed (probe, gap, KL, delay) + CI, configs + code hashes, verdict. No Phase-E claims. TOTAL cap + halt-levels per U64e conventions.
