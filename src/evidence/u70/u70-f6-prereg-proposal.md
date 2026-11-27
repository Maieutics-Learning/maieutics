# U70-F6 prereg PROPOSAL v1.0 (NOT licensed — needs battery + countersign)

Track: U70-CTX de-lottery #1. Base: F4 EXACT (forcing Wc←z-onehot train+eval, ctxw 3.0, floor 0.05, repw 0.1, GRU64/Cat4-ST, BPTT-50 carry-over, clip 1.0, 1 restart init 90000+s, sampling 91000+s, streams, 200 epochs, Adam 3e-4, argmax eval, paired V4 shuffle).

## Diagnosis driving the bet
F5 pattern: collapsed runs show ctx-head HIGH + detached probe catastrophically LOW on the SAME brain (k2-s11: ctx 0.91 / probe 0.08; F4-s8: ctx 0.86 / probe 0.14). The ctx-head (straight-through one-hot path, WITH grad into z) stays aligned because it moves z; the eval probe (detached one-hot, NO grad) chases a flipping target with stale Adam momentum and locks anti-correlated (below chance = flipped, not blurry). F4's 3x hard teacher slams corners; nothing smooths.

## Change (ONE addition; everything else F4 EXACT)
- ADD soft teacher head: `L_pt = 1.0·CE(softmax(Wpt·q + bpt), c)` where q = soft posterior (NOT one-hot). Grad flows into encoder via the q-logits softmax-jacobian path (same machinery as the KL-rep term). Small MLP: Cat4→2 linear, own Adam state, same 3e-4.
- Eval probe Wq stays DETACHED exactly as now (same code, same metric) — comparability exact; the teacher is never the judge.
- Why not ctxw 6.0: the existing teacher reads hard zoh (corner-slams); the new teacher reads soft q (smooth, dense from epoch 1, works through argmax flips). Different path, different signal — the F4 barrage's redundancy worry is answered by construction, and the paired F6−F4 delta isolates it.
- Stability gloss carried over (F4 battery): Adam/clip UNCHANGED, grad norms logged, INVALID on non-finite. No LR/retune/rescale (2nd variables).

## Design
- Retrain F6-architecture on SAME 20 seeds (same inits 90000+s, same streams — paired vs filed F4 per seed; ONLY difference is the added head+weight). N=20. Exclusions/stopping/firewall: v1.1 verbatim. No selection, 1 restart.
- Driver change (post-battery, pre-countersign): Wpt/bpt params + forward q-teacher + backward add into dqlog accumulator. Smoke 1 seed.

## Outcomes (bars UNCHANGED)
- Primary: z-only detached probe ≥0.70 (pooled) AND gap ≥0.05. Paired F6−F4 dProbe/dGap/dCtx + CI.
- Robustness read (DESCRIPTIVE, not gated — lottery is F7's verdict business): count of catastrophic runs (probe<0.50) F6 vs F4 (8/20 in F4 filed); per-seed flip table.
- Verdicts locked: FIXED / PARTIAL / PERSISTS (same rule). Near-misses do not move bars. No Phase-2 in this wave.

## Reporting
Per-seed ledger + paired diffs + CI + catastrophe counts, configs + hashes, verdict. F7 (warmup/ensemble/init-scale) stays queued behind this.
