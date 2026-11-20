# Fresh-eyes battery: Exp-E stillbirth + pool (4 unarmed reviewers, 2026-11-20)

Premise: src/evidence/p4/fresh-eyes-expE-premise-v1.md (frozen v1, inlined to
reviewers verbatim). Sealed disjoint briefs, parallel generateText, ≤150 words.

## Raw replies (verbatim, quotes stripped of JSON escaping)

R1 (CAUSE): Verdict init luck. Reasoning: held loss ≈ chance with converged
train = memorized subset, failed to generalize; same recipe hit 2.63 on another
init, so hyperparams viable; seed 10300 failed symmetry-breaking. Falsifier:
10-mouth pool — ≥80% stall ≈2.93 → systematic; ≥3/10 break 2.7 → luck.

R2 (POOL STATS): Verdict unsound — n=10 vanity sample, no baseline stillborn
rate; demands binomial test vs historical (run-7) rate and n=50; if 3/10 ratio
persists as minority → luck hypothesis falsified in favor of high-variance
landscape. (Note: reviewer inverts the burden — the pool tests luck vs
systematic, not either vs a third rate; logged as reviewer error class
misframed-null.)

R3 (ETHICS): Verdict contaminated — viewing the distribution makes selection
strategic. Rule proposed: blind pre-select index via external RNG before reading
any performance; stillborn pick voids the trial. Falsifier: luck-gap test
(blind pick outcome vs pool distribution).

R4 (RIVAL): Mechanism offered is distributional sampling (i.e., restates the
pool) + zero-luck rerun (re-run 10300; consistent 2.93 → deterministic). Says
pool design lacks breadth (single-instance trial — stale: premise already
proposes the pool; reviewer argues against the pre-pool state). Verdict: pool
proposal sound. Hardest falsifier: ≥8/10 stall ≈2.93 kills luck.

## Adjudication (mine — rulings, not moods)

- R1 ACCEPT: luck reading + pool falsifier adopted (pool already ordered).
- R2 PARTIAL: ACCEPT the binomial framing for reading the distribution
  (report exact counts + Clopper-Pearson-style honesty, no threshold worship);
  REJECT n=50 (infeasible ≈21h wall; filed power caveat instead). Reviewer err:
  misframed null (a 30% stillborn rate IS the luck hypothesis quantified, not
  a rival to it).
- R3 ACCEPT principle, MOOTED by design: v2.2 runs ALL lineages, no selection
  occurs — the contamination channel is closed structurally, cleaner than any
  blind-pick rule. Blind pre-selection recorded as the fallback if a future
  vote ever requires picking.
- R4 ACCEPT (zero-luck rerun already in v2.1: lin-0 determinism check;
  8/10-stall kills luck adopted as the strong reading of the 0/10 band).
- No code assertions made by reviewers (nothing to verify against driver).
  Score: 3 accept / 1 partial(1 accept-inside) / 0 rejects-with-cause (R2's n=50
  rejected on feasibility, not merit). No patch to v2.2 required — battery
  findings already contained except the binomial-reporting note, adopted here.
