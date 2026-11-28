# Premise U70-F15 v1.0 (frozen for barrage — proposal `u70-f15-prereg-proposal.md` v1.0)

## 1. Project (3 lines)

U70 is a context-inference program: a GRU64 + 4-way stochastic-latent model must infer a hidden
2-context state over 300-trial trajectories; a Bayesian oracle ceiling (held-out ctx 0.9537, ECE
0.0237 on seeds 20..39) bounds what any neural model may be penalized for missing. F14 proved the
filed wins survive the TRUE full-latent intervention on the training trajectory (train probe 0.7183 /
TRUE-gap 0.1468 / ctx 0.8783, TRAIN-REPAIRED) but collapse on held-out (probe 0.6227 / TRUE-gap
0.0274 FAIL / ctx 0.7777, HELDOUT-DEGRADES); leak-size ~0 on both, so filed gaps were hard-category
use, not leak. F15 tests the verified root cause: every retrain so far trained each seed on ONE
fixed path+obs x 200 epochs (`runU70Neural`: `path=u70nGenPath(s)`, `obs=u70nGenObs(s,path)`,
200-epoch loop on the same pair).

## 2. Scope agreement

Ability, not drive: the agent proposes/runs/grades; the owner countersigns exact versions and
arbitrates. What accumulates is method + preserved negatives, never cherry-picked winners.
Not a goal: touching LR/optimizer/scale/recurrence/ctxw/floor (second variables), re-litigating
z-recurrence/unfamiliar-context/ablations/calibration-bar (separately owed), claiming PROCEED or
Phase-2 (this wave cannot pass what it does not test), moving filed numbers (F4–F14 stand as
measured-as-run), or moving bars on reviewer opinion (F14 bars reused verbatim). One track:
training distribution changes (1 trajectory -> 8-trajectory round-robin, total steps identical);
eval keeps the F14 TRUE intervention as metric path (T7/T8/T8b retained).

## 3. Verified claims (numbers sacred, regime-bound unless noted)

- Single-trajectory training (current tree `u70-neural.js:926-927,937-938`): each seed s trains
200 epochs on the same `(path s, obs s)` pair; optimizer state persists, hidden state resets per
epoch. Filed fact, verified 2026-11-27.
- F14 TRAIN TRUE (`d-u70-neural-f14-wave1.json`, `f14-analysis.json`): probe 0.7183 (12/20), gap
0.1468 (20/20), ctx 0.8783 (16/20). HELD TRUE: probe 0.6227 (8/20), gap 0.0274 (8/20 FAIL 0.05),
ctx 0.7777 (4/20). Train-heldout deltas all exclude 0. Oracle held-out 0.9537 reused.
- Determinism filed fact (CPU Float64, mulberry32; F5-k0 0.0000, F13/F14 0 mismatches) — same-engine
rerun is bit-identical; F15 keeps this (new schedule is deterministic round-robin).
- Pool reservation (proposed, NOT yet run): P(s) = {1000 + s*8 + k, k=0..7}, 160 seeds, all
disjoint from 0..39 and pairwise distinct (T9 asserts in code + ledger grep).

## 4. Done / Next

Done: task-spec, oracle+identifiability, causal diagram, base prereg + battery, Wave 1
(NO-PROCEED), F1-F14 waves + batteries (F4 FIXED, F5 lottery WITH-TAIL, F6 killed, F7/F8 persist,
F9 partial, F10 vote-FIXED, F11 REPAIRED, F12 VERIFIED, F13 DEGRADES, F14 TRAIN-REPAIRED +
HELDOUT-DEGRADES), audits C1-C8 reconciled, newest-review adjudicated. Next if licensed: smoke
(s0 pool-8 schedule check + 18-eval shape) -> 20 multi-trajectory retrains (200 epochs total,
round-robin over P(s), same Adam/BPTT/clip/init/sampling as F14) -> 360 evals (8 pool-clean +
8 pool-TRUE + held-clean + held-TRUE per seed) -> TRAIN-pool + HELDOUT verdicts. Queued behind:
z-recurrence, unfamiliar-context, ablations, calibration bar, sharpened F3, GRU-128, trace study,
Phase-2.

## 5. The ask

Hammer this premise. Verdict (STANDS / NEEDS-PATCH) + single hardest test/falsifier. <=150 words,
numbered. Angles (one per reviewer): (1) pool size — is K=8 the right diversity-vs-exposure trade,
does 25 exposures/trajectory risk underfit-confound; (2) schedule — does round-robin e-mod-8 smuggle
order/curriculum effects, is there a cleaner schedule at identical steps; (3) eval meaning — is
pool-mean the right TRAIN quantity, or should TRAIN stay single-canonical; (4) bars — are F14 bars
fair unchanged on a new training surface, or does the surface change demand re-derivation; (5) dual
verdicts — can TRAIN-pool/HELDOUT split hide or smuggle a win; (6) disjointness — does P(s) stay
disjoint from held-out s+20 and across s, what leak survives T9; (7) determinism/replication — what
replaces F14's F12-bit-identical sanity now that training moved; (8) scope — any second variable
(LR/epochs/steps changed in disguise); (9) halts — what stops a bad run; (10) alternative — one
rival mechanism for any F15 outcome plus its cheapest killer test.

## 6. Anti-bias packet

Central claims: (a) training is the ONLY change (1 trajectory -> 8 round-robin, total gradient
steps identical 200x6 chunks/seed); (b) eval is F14-exact (TRUE intervention metric path,
T7/T8/T8b-gated); (c) 20 retrains + 360 evals isolate the training-distribution effect on train-pool
and held-out. Evidence: line refs + F14 ledgers above, pool formula pre-registered. Contradictory/
missing: no multi-trajectory run exists yet (that is the licensed compute); pool-mean magnitude and
held-out lift unknown until the wave. Assumptions: F13 oracle ceiling reusable (same held-out
20..39, same determinism checks); F4 v1.1 firewall verbatim. Conclusions depending on assumptions:
the distribution-effect read depends on (a); if the schedule changes total steps or LR implicitly,
only absolute bars survive with weakened isolation gloss (filed openly).
