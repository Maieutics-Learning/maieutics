# W134exec — rho-boundary calibration (A; backlog-W117)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 sandbox calibration)
- Calibration: generative meaning/signal distances with compositionality strength s ∈ {0, .25, .5, .75, 1}, N ∈ {8, 20, 40}, 200 trials/cell, Spearman rho + 100-perm Mantel p. (Ran sandbox, not bench: the boundary is a statistical decision rule; no network involved.)
- Specificity: P(rho≥0.5 | holistic s=0) = 0.000 at ALL N (0/600 null trials). The 0.5 boundary never fires on pure noise — the bar is specific, not just conventional.
- Power: s=0.25 → fires 0.065/0.000/0.000 (correctly silent: weak compositionality reads holistic by the 0.5 bar); s=0.5 → 0.655/0.920/0.995; s≥0.75 → 1.000. The boundary is a mid-strength detector by construction.
- Divergence found: at s=0.25/N≥20, permutation p<0.05 fires 0.95–1.00 while rho≥0.5 stays silent — magnitude and significance disagree in the weak regime (real-but-small). The conjunction (rho AND p) equals rho everywhere: p is never the binding constraint when rho fires.
- N-dependence: s=0.5 power 0.655 at N=8 vs 0.92+ at N≥20 — small-N verdicts underpowered though still specific. Boundary stands for N≥20; N=8 needs the permutation gate or a no-verdict.
- Verdict USED (calibration table: specific, powered ≥0.5 strength at N≥20, characterized weakness). No precursor, no conflict. Weak-strength verdict policy (significant-but-small rho: third verdict vs binary+magnitude) spawned W134.

## Tangential (reasoning, 0 spend)
- A threshold with measured specificity is a bar; without it, a superstition. The 0.5 line just got its calibration certificate — specific everywhere, powerful past mid-strength, honest about the weak middle where significance outruns magnitude.

## Spend / queue
- Spend: 0 + 0 + 1 calibration (floor). Consumed backlog-W117 removed; spawned W134 to BACK. Backlog 17. Synthesis R19 clock: 5/5 FULL.
