# U70-F7 prereg PROPOSAL v1.1 (battery-patched; NOT licensed — needs re-close + fresh countersign)

Track: U70-CTX de-lottery #2 (path-only). Base: F4 EXACT (forcing Wc←z-onehot train+eval, ctxw 3.0, floor 0.05, repw 0.1, GRU64/Cat4-ST, BPTT-50 carry-over, clip 1.0, 200 epochs, Adam 3e-4, 1 restart init 90000+s, sampling 91000+s, streams, argmax eval, paired V4 shuffle, all metrics).

## Diagnosis
F5: identical births replicate F4 exactly; new births collapse (probe 0.52 pooled, 7/20 dead twice). F4's 3x hard teacher slams z into corners early; flips lock before heads align (ctx-high/probe-low splits). Endpoint objective is fine — the ROAD kills most births.

## Change (schedule ONLY; loss/arch/bars untouched)
- LR: 3e-4 flat → **linear warmup 0→3e-4 over epochs 1..20, then flat 3e-4 for epochs 21..200**. Single pre-registered value: 10% of training, literature-standard warmup fraction, fixed pre-hoc, no alternatives tried, no tuning. (Justification gloss — barrage r1/r2/r6/r7/r10.)
- Adam momentum trajectories WILL differ after epoch 20 — that IS the treatment (calmer early path), disclosed, not smuggled. Loss, LR-from-21, and everything else identical. (Trajectory-purity demand rejected as unsatisfiable — see battery results; paired same-seed standard since Wave 1 holds.)
- UNCHANGED: loss weights (incl. ctxw 3.0), floor, repw, arch, forcing, BPTT/clip, inits, streams, epochs, eval.

## Battery patches (barrage 10/10 NEEDS-PATCH → partial adopt)
1. **Smoke-lock (r5/r7/r8 ADOPTED):** smoke 1 seed output filed verbatim; abort on implementation-bug ONLY; zero design tweaks permitted on smoke basis.
2. **Reading rule (r3/r5/r7/r9/r10 ADOPTED as reporting, not a bar):** FIXED reads "stabilized" iff catastrophe count (probe<0.50) drops vs F4's 8/20. Pooled-pass WITHOUT catastrophe-drop files as FIXED-WITHOUT-STABILIZATION and names F8. Pooled verdict boundaries do not move.
3. **REJECTED with derivation:** trajectory-identity (any intervention alters trajectory; paired design IS the control); ramp counterfactual (demanding 10-vs-30 is demanding a sweep); survivor-mining (paired same-seed is the program standard since Wave 1).

## Design
- Retrain on SAME 20 seeds (same inits, same streams — paired vs filed F4; ONLY the LR path differs). N=20. Exclusions/stopping/firewall verbatim. No selection.
- Sharpest read (descriptive): 8 F4-catastrophe seeds on identical inits — un-flip table + catastrophe counts F7 vs F4.
- Driver change (post-battery, pre-countersign): lrAt(e) = 3e-4·min(1,(e+1)/20) in Adam step. Smoke 1 seed (locked).

## Outcomes (bars UNCHANGED)
- Primary: detached probe ≥0.70 (pooled) AND gap ≥0.05. Paired F7−F4 dProbe/dGap/dCtx + CI.
- Verdicts locked: FIXED / PARTIAL / PERSISTS. Near-misses do not move bars. No Phase-2 in this wave.
- F7 tests same-birth stabilization, NOT new-birth robustness. Warmup×new-inits (F8) only if F7 stabilizes same births.

## Reporting
Per-seed ledger + paired diffs + CI + catastrophe/flip tables, configs + hashes, verdict. No Phase-E claims.
