# W78exec — position×level Thompson matrix (A/B; backlog-W70)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 3 sandbox toys, floor)
- Problem: per-slot hint arms (W58 ablation × W46 Thompson) naively = 12 flat arms (4 slots × 3 levels); exploration dilutes.
- Toy v1 (HONEST NEGATIVE): flat 12-arm matrix 34 solves vs level-only 55 at 120 pulls. Finer arms need more pulls; killed as a flat design. (Level-only baselines vary across toy runs as RNG streams diverge: 55 here, 43 in v2 — noise-scale, reported exactly.)
- Toy v2 (priors rescue to parity): ablation-drop priors (W77 drops) on slots lift matrix 34 → 42, vs level-only 43. Parity, not victory — priors necessary but not sufficient.
- Toy v3 (hierarchical): level first (3 arms), then slot within level (4 arms, ablation priors) = 7 arms per decision path, slot posteriors shared across levels. 44 vs 43 vs 34. Margins are noise-scale; the argument is STRUCTURAL (fewer arms per decision, prior reuse across levels), not the +1.
- Adopted: hierarchical Thompson (level → slot), ablation priors on slots, masked positions (W77) prune missing-slot arms. Cross-level slot-transfer check spawned W87.
- Verdict USED (design + 3 toys, one kill one parity one structural win). No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- Arm design is bias-variance again (W68's thresholds, W71's budgets): coarse arms decide fast and wrong-ish, fine arms decide slow and right-ish, hierarchy splits the difference. Every allocation problem on this trail resolves to the same shape — decide coarse, refine where it pays.

## Spend / queue
- Spend: 0 + 0 + 3 toys (floor). Consumed backlog-W70 removed; spawned W87 to BACK. Backlog 17. Synthesis R10 clock: 3/5.
