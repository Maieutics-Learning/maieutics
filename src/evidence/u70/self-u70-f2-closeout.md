# U70-F2 Wave 1 closeout — verdict F2-PERSISTS (on the bar; read the margin, 2026-11-27)

Execution: owner "go for it" = execution on exact F2 v1.1. Driver `u70-neural.js` + F2 cut (Wc←z-onehot, verified 4×2) + F1a base (floor 0.05, repw 0.1). 20/20 F2 rows, 0 invalid. Phase 2 did NOT run (sequencing lock: probe bar missed → halt; no V2 retrain spent). Ledgers: `d-u70-neural-f2-wave1.json`, gates `d-u70-f2-gates.json`.

## Numbers (F2 pooled, n=20)
- ctxAcc 0.8608 (13/20 ≥0.85 — bar missed) / probe **0.6945** (11/20 ≥0.70 — bar missed by 0.0055) / gap **0.117** (19/20 ≥0.05 — passed decisively) / usage 0.675 / KL raw 0.029 / delay-med 9.
- Paired F2−F1a same-seed: dProbe +0.074, dGap +0.116, dCtx −0.066 (the forcing cost).

## Verdict: F2-PERSISTS (per locked boundaries: probe fail = PERSISTS regardless of gap; near-miss bars don't move)
Filed without flinching — but the shape matters more than the label:
- The forcing DID work causally: gap went 0.0017→0.117, 0/20→19/20. Shuffling z now destroys the policy. The dial is no longer decorative.
- What failed is probe *magnitude*: z carries context on most seeds (11/20 pass) but weakly on others — pooled 0.6945 vs 0.70. Heterogeneous, not uniformly dead (contrast F1: uniform 0.62, gap 0/20).
- Cost: −6.6 points of context accuracy and slower detection (delay 9) — the bottleneck tax, as predicted.

## Reading
F1's diagnosis ("nothing pushes through") is now inverted: the cut forces use (gap 19/20), but z-content is partial and seed-fragile. The representation is *load-bearing but lossy*. Next questions, each needing own prereg+battery+countersign: (a) probe-robustness — why do 9/20 seeds stall (capacity? FTD-heavy seeds?); (b) Phase-2 transfer of THESE weights (sequencing lock held, but the weights exist and the gap result motivates a gated transfer proposal); (c) F3 detection-speed.
