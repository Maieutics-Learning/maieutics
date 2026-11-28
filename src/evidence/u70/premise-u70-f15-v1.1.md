# Premise U70-F15 v1.1 (frozen for re-close — proposal `u70-f15-prereg-proposal-v1.1.md`)

## 1. Project (3 lines)

U70 is a context-inference program: a GRU64 + 4-way stochastic-latent model must infer a hidden
2-context state over 300-trial trajectories; a Bayesian oracle ceiling (held-out ctx 0.9537, ECE
0.0237 on seeds 20..39) bounds what any neural model may be penalized for missing. F14 proved the
filed wins survive the TRUE full-latent intervention on the training trajectory (train probe 0.7183 /
TRUE-gap 0.1468 / ctx 0.8783, TRAIN-REPAIRED) but collapse on held-out (probe 0.6227 / TRUE-gap
0.0274 FAIL / ctx 0.7777, HELDOUT-DEGRADES); leak-size ~0 on both. F15 tests the verified root
cause: every retrain so far trained each seed on ONE fixed path+obs x 200 epochs; F15 trains each
seed on 8 trajectories round-robin at identical total steps (WITH-THINNING: 25 exposures each).

## 2. Scope agreement

Ability, not drive: the agent proposes/runs/grades; the owner countersigns exact versions and
arbitrates. What accumulates is method + preserved negatives, never cherry-picked winners.
Not a goal: touching LR/optimizer/scale/recurrence/ctxw/floor (second variables), re-litigating
z-recurrence/unfamiliar-context/ablations/calibration-bar (separately owed), claiming PROCEED or
Phase-2, moving filed numbers (F4–F14 stand), or moving bars (F14 bars reused verbatim per F14-r4
precedent). One track: training distribution 1 -> 8 round-robin; eval F14-exact (TRUE metric path,
T7/T8/T8b). Extra arms (25-epoch control, block-vs-interleave, shuffled-order) are queued rivals,
not this wave.

## 3. Verified claims (numbers sacred)

- Single-trajectory training (`u70-neural.js:926-927,937-938`): 200 epochs on the same pair;
F14 TRAIN TRUE 0.7183/0.1468/0.8783 vs HELD TRUE 0.6227/0.0274/0.7777 (deltas exclude 0).
- Pool P(s) = {1000+s*8+k}: 160 seeds, disjoint from 0..39 and pairwise distinct (T9).
- Schedule e-mod-8, hidden resets each epoch start (no cycle-index input — r2 gloss); total
1200 chunk-updates/seed asserted in T9(d) (r8 adoption). Determinism = same-order identical
(r7 gloss); permutation invariance is unsatisfiable and not required.
- TRAIN quantity is pool-mean by construction (single-canonical 0..19 is OOD for F15 — r3/r5
gloss); pool-min/max filed alongside (descriptive, stops mean-hiding). Bars stay F14 verbatim;
pool spread is the variance read (r4).

## 4. Done / Next

Done: F14 TRAIN-REPAIRED + HELDOUT-DEGRADES + v1.0 barrage (7 NEEDS-PATCH / 3 STANDS, 1 functional
T9(d) + 4 glosses, queued rivals filed). Next if licensed: smoke (s0 8-pool + 18 evals) -> 20
multi-trajectory retrains -> 360 evals -> TRAIN-pool + HELDOUT verdicts. Queued behind:
z-recurrence, unfamiliar-context, ablations, calibration bar, sharpened F3, GRU-128, trace study,
Phase-2, plus F15-queued rivals (25-epoch control, block-vs-interleave, shuffled-order).

## 5. The ask (re-close)

Re-close v1.1 only: does the patch answer your v1.0 finding without new scope? Verdict (STANDS /
NEEDS-PATCH) + what still blocks. <=150 words, numbered. Angles: (1) step-count T9(d); (2) hidden-
reset gloss vs periodicity; (3) pool-mean category-error gloss; (4) bars-unchanged + variance
descriptive.

## 6. Anti-bias packet

Central claims: (a) training is the ONLY change (total steps identical); (b) eval is F14-exact;
(c) 20 retrains + 360 evals isolate the distribution effect. Missing: no multi-trajectory run
exists yet. Assumptions: F13 ceiling reusable; F4 firewall verbatim. If the schedule changes total
steps implicitly, T9(d) HALTs the wave (BROKEN) — the isolation is enforced, not asserted.
