# Agent Exp-B prereg (agent-approved under 2026-11-19 user pre-countersign; no user input needed)
What do I want to find out: F1c mouth diverged (NaN) distilling confident-wrong G-s502
logits at alpha 0.5. Is there a STABLE alpha? Maps the safe-distillation boundary across
pool families — direct input to P2/P3 crossed-pool design (distillation IS the learning
mechanism; this bounds where it breaks).

## Lever
F1c bundles regenerated (G-s502 forwards on v44 pair-0 lines: tLogits + rule tEar; forwards
only, cheap). Fresh student (init 9850), S1 200 steps ONLY (no replay — stability shows by
then or never), alpha in {0.1, 0.5, 0.9}, same seed 9903. Else identical.
1 pair (pair-0) — boundary-mapping pilot, THIN by construction.

## Read (diagnostic, no revival bars)
Per alpha: finite? (loss finite all 200 steps) + S1e (vs S0e baseline ~3.18 — learns = S1e
meaningfully below S0e without exploding). "Stable" = finite AND S1e < S0e - 0.20 (same
delta discipline as CLAIM1, descriptive here).
Promise: >=1 alpha stable with learning (maps usable boundary).
Expectation: 0.1 stable-ish (finite, S1e ~3.0 — weak learning, mostly anchor),
0.5/0.9 NaN (F1c point reproduced + extended) → P2/P3 rule: cross-pool alpha <= 0.1 or
match pools / temper targets.
Pre-mortem: all three NaN → even 0.1 too hot cross-pool (finding upgrades: need tempered
targets, not just low alpha — follow-up, not this pilot). All three stable → F1c divergence
was an 0.5-point accident, boundary wider than feared (welcome miss).
Nearest-failure: F1/F1b ABORTs (single-point design) — addressed by sweep (3 alphas, same
bundles/seeds); v45 joint NaN (different mechanism: head graft vs KL — cited, not repeated).
