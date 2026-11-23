# O2 v10 — representation work on the add skill (FROZEN for review battery)

Agent approval: this file. User countersign: program standing order 2026-11-23 (O2 pre-declared as adaptive follow-up in countersigned OFF1 spec: "O2 intervention specced AFTER O1 verdict"). Scope: O2 = 6 units (2 arms × R=3 seeds, full retrains). Quorum 2/3; CPU-only in-worker; NO PUSH.

## Why (O1 verdict d-off1-verdict.json)
Calibration CLOSED (margin-AUC 0.60/0.69/0.64, 0/3 ≥ 0.70; correct answers have a long low tail — a reject rule discards correct too). No overshoot bias (pooled 0.45, z=-0.54), no label-marginal bias, no edge/per-k consistency. The residual is representational: the wrap boundary (v+k≥4) is where modular addition actually bites. Two diet-level attacks, both dose-fixed substitutions (300 lines / 800 steps / same arch/optim recipe as filed ADD4 — pure composition effects, no dose confound):

- O2a ERRMINE: stage-1 = 400 steps on filed ADD4 diet (trainSeed 53200+seed*13, auxW 4.0) → harvest errors on 300 FRESH lines (rng 53700+seed) → stage-2 fresh model, 800 steps on filed diet with 100 random lines REPLACED by harvested wrongs (pad with randoms if <100) → eval oracle+fwd (frozen R2 constructions, srng 52500/52400+seed).
- O2b WRAPDOSE: 800 steps on filed diet with random lines substituted until wrap-rate ≥ 0.75 (wrap = v+k≥4; natural 0.375) → same evals. Guard: assert (e.v+e.k)%4===e.y on construction (semantics check, else ABORT arm).

## Bars (quorum 2/3; seed-matched vs filed ADD4 oracle 0.925/0.91/0.825 and O1 obo 1.0/0.444/0.40; verdict d-o2-verdict.json)
- O2a-MINE (primary): oracle − add4oracle ≥ +0.03 AND obo-drop ≥ 0.10 (both, 2/3) → MINES else FLAT.
- O2b-WRAP (primary): same double bar vs same baselines → WRAPS else FLAT.
- DISTORTION watch (both): fwd < seed-matched filed fwd − 0.10 → flagged regardless of oracle.

## Expectation (filed open)
O2b partial HIT (wrap is the boundary; helps s2 most — the 12-extreme-confusion seed). O2a lean MISS (hard-mining on 4-class toys usually sharpens noise, not boundaries). At least one arm routes O3 (carry-explicit supervision or dose-on-wrap).

## Nearest-failure
- ADD4 dose (differs: dose varies total pressure; O2 fixes dose, varies composition).
- K3R skew-poison (differs: skew hurt; WRAPDOSE is skew TOWARD the boundary — could poison too; the double bar + distortion watch is the tripwire).

## Amendment v10.1 (pre-compute pins; blind battery 2026-11-23 — 3x CONDITIONAL)
- O2a stage-1 400 → 800 steps (R1: harvest must be systemic; stage-2 dose unchanged).
- Binding obo condition moves to POOLED obo-drop ≥ 0.10 (R2: s0 1.0-on-15 is noise; per-seed drops descriptive). Lift stays +0.03 2/3 but PAIRED: identical 200 oracle lines as filed ADD4/O1, McNemar discordant-pair p reported per seed (R3 power fix without n=1000 — rejected as 5x waste, filed openly).
- R2c/R1c/R3c pathological-hit rivals are tripwired by the double bar + fwd distortion watch (DISTORTED ≠ win).

## Cost
3 stage-1 (800-step) + 6 stage-2 (800-step) trains + 12 evals, COMPLETE-gated. Driver: runO2Mine + runO2Wrap (+ shared O2 eval). NO PUSH.
