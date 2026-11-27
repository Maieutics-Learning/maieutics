# U70-F8 prereg PROPOSAL v1.1 (battery-patched; NOT licensed — needs re-close + fresh countersign)

Track: U70-CTX de-lottery #3 (birth orientation). Base: F4 EXACT (forcing Wc←z-onehot train+eval, ctxw 3.0, floor 0.05, repw 0.1, GRU64/Cat4-ST, BPTT-50 carry-over, clip 1.0, 200 epochs, Adam FLAT 3e-4, 1 restart init 90000+s, sampling 91000+s, streams, argmax eval, paired V4 shuffle, all metrics).

## Change (ONE deterministic-per-seed tilt; everything else F4 EXACT)
- Encoder bias at init: magnitude fixed 0.5, DIRECTION per seed: d(s) = floor(mulberry32(76000+s)()*4) ∈ {0,1,2,3}; `M.be.w[d(s)] = 0.5`, rest 0. Fixed, filed, then trained normally. Same base RNG draws, same streams, flat LR, same loss/eval.
- Why random-direction (barrage core ADOPTED): fixed `[0.5,0,0,0]` cannot distinguish symmetry-breaking from prior-leak. Under the symmetry hypothesis ANY per-birth asymmetry un-flips (direction-independent); under the leak hypothesis only the canonical direction works. One arm, N=20, no doubling.
- Self-policing: usage histogram filed per seed; tilt-collapse (usage→1 cat) fails the locked probe rule → PERSISTS. Direction-vs-outcome table filed as tripwire (r5/r7/r8/r9).

## Battery patches (barrage 10/10 NEEDS-PATCH → partial adopt)
- ADOPT: random-direction disambiguator + direction/outcome table.
- REJECT with derivation: comparability-purity (paired same-draws isolates the tilt; basin shift IS the treatment — same standing rejection as F7; accepting it invalidates F1/F2/F4/F7 retroactively).

## Design
- Retrain on SAME 20 seeds (same inits/draws/streams — paired vs filed F4; ONLY the tilt differs). N=20. Exclusions/stopping/firewall verbatim. No selection.
- Sharpest read (DESCRIPTIVE): F4's 4 catastrophe births (seeds 2,6,7,8) on identical births — un-flip? Correlate un-flip with tilt direction (symmetry predicts none).
- Driver change (post-battery, pre-countersign): be init tilt by d(s). Smoke 1 seed (locked).

## Outcomes (bars UNCHANGED)
- Primary: detached probe ≥0.70 (pooled) AND gap ≥0.05. Paired F8−F4 dProbe/dGap/dCtx + CI.
- Verdicts locked: FIXED / PARTIAL / PERSISTS. Near-misses do not move bars. No Phase-2 in this wave.

## Reporting
Per-seed ledger + paired diffs + CI + catastrophe/flip/usage/direction tables, configs + hashes, verdict. Capacity arm (GRU-128) queued behind this.
