# U70-F8 prereg PROPOSAL v1.0 (NOT licensed — needs battery + countersign)

Track: U70-CTX de-lottery #3 (birth orientation). Base: F4 EXACT (forcing Wc←z-onehot train+eval, ctxw 3.0, floor 0.05, repw 0.1, GRU64/Cat4-ST, BPTT-50 carry-over, clip 1.0, 200 epochs, Adam FLAT 3e-4 — no warmup, F7 failed, not stacked).

## Diagnosis
F5: same streams, different births → 10/20 split; replication exact. F7: same births + calmer road → same graves (11/20 bit-identical, catastrophes 4→5). The lottery is IN the birth values, not the road. Mechanism hypothesis: at init the Cat-4 posterior is permutation-symmetric (symmetric prior + symmetric init distribution + zero encoder bias), so early flips pick a mapping by pure chance; some births lock backwards (below-chance probes = flipped, not blurry).

## Change (ONE deterministic scalar; everything else F4 EXACT)
- Encoder bias at init: `M.be.w = [0.5, 0, 0, 0]` (fixed, then trained normally). One scalar, one category — minimal canonical orientation shared by ALL births. Same RNG draws (same seeds → same uniform draws; tilt is a deterministic addition), same streams, same loss, flat LR, same eval.
- Why this shape: breaks permutation symmetry without touching scale (init variance unchanged), randomness (no new draws), objective (no loss change), or schedule (flat). If flips are symmetry accidents, a shared orientation removes the accident.
- Self-policing: if the tilt collapses usage to 1 category, probe fails → PERSISTS by the locked rule. Usage histogram filed; collapse reads as collapse, not as success.

## Design
- Retrain on SAME 20 seeds (same inits, same streams — paired vs filed F4; ONLY the init tilt differs). N=20. Exclusions/stopping/firewall verbatim. No selection.
- Sharpest read (DESCRIPTIVE): F4's 4 catastrophe births (seeds 2,6,7,8) on identical inits — do they un-flip? Plus catastrophe counts F8 vs F4, per-seed flip table.
- Driver change (post-battery, pre-countersign): one-line be init. Smoke 1 seed (locked: filed, bugs-only, no tweaks).

## Outcomes (bars UNCHANGED)
- Primary: detached probe ≥0.70 (pooled) AND gap ≥0.05. Paired F8−F4 dProbe/dGap/dCtx + CI.
- Verdicts locked: FIXED / PARTIAL / PERSISTS. Near-misses do not move bars. No Phase-2 in this wave.
- F8 tests same-birth re-orientation, NOT new-birth robustness. Tilt×new-inits only if F8 un-flips same births.

## Reporting
Per-seed ledger + paired diffs + CI + catastrophe/flip/usage tables, configs + hashes, verdict. Capacity arm (GRU-128) queued as ruling-out behind this.
