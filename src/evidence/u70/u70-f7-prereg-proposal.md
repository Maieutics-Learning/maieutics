# U70-F7 prereg PROPOSAL v1.0 (NOT licensed — needs battery + countersign)

Track: U70-CTX de-lottery #2 (path-only). Base: F4 EXACT (forcing Wc←z-onehot train+eval, ctxw 3.0, floor 0.05, repw 0.1, GRU64/Cat4-ST, BPTT-50 carry-over, clip 1.0, 200 epochs, Adam 3e-4, 1 restart init 90000+s, sampling 91000+s, streams, argmax eval, paired V4 shuffle, all metrics).

## Diagnosis
F5: identical births (k=0) replicate F4 exactly; new births collapse (probe 0.52 pooled, 7/20 dead twice). F4's 3x hard teacher slams z into corners early; flips lock before heads align (ctx-high/probe-low splits). The endpoint objective is fine (F4 FIXED on lucky births) — the ROAD there is what kills most births.

## Change (schedule ONLY; loss/arch/bars untouched)
- LR: 3e-4 flat → **linear warmup 0→3e-4 over epochs 1..20, then flat 3e-4 for epochs 21..200**. Single pre-registered value (10% of training — standard, fixed pre-hoc, no alternatives tried, no tuning).
- Endpoint objective IDENTICAL (same loss, same LR from epoch 21, same everything). Only early step sizes shrink. Any delta is stabilization, not a new destination. Adam momentum trajectories will differ — that IS the treatment (calmer early path), stated openly, not smuggled.
- UNCHANGED: loss weights (incl. ctxw 3.0), floor, repw, arch, forcing, BPTT/clip, inits, streams, epochs, eval.

## Design
- Retrain F7-architecture on SAME 20 seeds (same inits, same streams — paired vs filed F4; ONLY the LR path differs). N=20. Exclusions/stopping/firewall verbatim. No selection.
- Sharpest read (DESCRIPTIVE): the 8 F4-catastrophe seeds (probe<0.50 filed) on identical inits — do they un-flip? Plus catastrophe counts F7 vs F4, per-seed flip table.
- Driver change (post-battery, pre-countersign): lrAt(e) schedule in Adam step. Smoke 1 seed.

## Outcomes (bars UNCHANGED)
- Primary: detached probe ≥0.70 (pooled) AND gap ≥0.05. Paired F7−F4 dProbe/dGap/dCtx + CI.
- Verdicts locked: FIXED / PARTIAL / PERSISTS. Near-misses do not move bars. No Phase-2 in this wave.
- Lottery note: F7 tests same-birth stabilization, NOT new-birth robustness (F5's question). Warmup×new-inits (F8) only if F7 stabilizes same births.

## Reporting
Per-seed ledger + paired diffs + CI + catastrophe/flip tables, configs + hashes, verdict. No Phase-E claims.
