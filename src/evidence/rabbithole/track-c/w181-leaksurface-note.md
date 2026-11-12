# W181exec — leak-surface fit (A; backlog-W156)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 2 sandbox builds: bug + fit, floor)
- Killed bug (recorded): `rule === "hebb"` compared object to string — hebb column ran the leaky branch with lam=undefined (NaN → coin flip, .49–.54 everywhere). Caught because the anchor DEMANDED hebb≈1.0 in the noise corner and got chance: anchors are load-bearing, not decorative. One-token fix (`rule.id`), verified by anchor closure.
- Validation (anchors close after fix): noise corner hebb 1.0 / l0.1 1.0 / delta .806 (=1−q exactly ✓); reval edge hebb .534 (W161: .535 ✓✓) < leak .594 ≤ delta .594; interior leaky wins outright both cells (l0.3 .852 / .576); chaos (r=.35 row) all ≤.548. W161's three territories reproduce with rankings intact on the fine grid.
- λ* surface (25 cells, ties→maximal-averaging): rises with r, falls with q (row .05: hebb/.3/.3/.2/.2; row .1: .5/.5/.5/.4/.1). Fit λ*=r/(r+q+c): MAE .255/.205/.159/.144/.146 for c=0/.02/.05/.1/.2 — best c≈.1–.2. W161's level-effect claim NOT reproduced: (.05,.05) and (.2,.2) both star λ.3 on the fine grid (their coarse {0.2,0.5,0.8} grid couldn't see .3/.4 — the "effect" was grid-coarseness). Residual story: q=0 column frays ((.2,0): actual .3 vs formula .67) — silent-delay flips punish recency, a delay discount on top of r/(r+q); isolated as W173.
- Chaos edge located: best-rule acc < .56 for r≳.35 at any q (truth flips faster than any memory horizon); q=.35 column degrades smoothly with r (.926→.524).
- Verdict USED (territories confirmed + λ* fitted with pedigree + level-effect corrected + chaos edge). No precursor, no conflict. Delay-discount of λ* (vary D; isolate delay vs noise in the residual) spawned W173.

## Tangential (reasoning, 0 spend)
- The hebb bug is the round's parable about common random numbers: CRN made the broken column look merely mediocre (.53, plausible!) instead of NaN-obvious — variance reduction also reduces the visibility of bugs. The anchor caught what the SEs couldn't. Always run the column whose answer you already know.

## Spend / queue
- Spend: 0 + 0 + 2 builds (1 bug-fix). Consumed backlog-W156 removed; spawned W173 to BACK. Backlog 17. Synthesis R27 clock: 4/5.
