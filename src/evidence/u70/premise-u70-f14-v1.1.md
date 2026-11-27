# Premise U70-F14 v1.1 (pinned for re-close — proposal `u70-f14-prereg-proposal-v1.1.md`)

## 1. Project (3 lines)

U70 is a context-inference program: a GRU64 + 4-way stochastic-latent model must infer a hidden
2-context state over 300-trial trajectories; a Bayesian oracle ceiling (held-out ctx 0.9537, ECE
0.0237 on seeds 20..39) bounds what any neural model may be penalized for missing. F11 repaired the
discrete forward (probe 0.7183) but its shuffle half never landed on the metric path (correction memo
2026-11-27: helper pure, metric branch still zdet+q); F13 proved collapse on held-out under the SAME
partial metric (probe 0.6227, gap +0.0224, ctx 0.7777, DEGRADES). F14 wires the TRUE intervention
(`u70nApplyShuffle` meaning) into `u70nEval` V4 and re-grades train AND held-out on it.

## 2. Scope agreement

Ability, not drive: the agent proposes/runs/grades; the owner countersigns exact versions and
arbitrates. What accumulates is method + preserved negatives, never cherry-picked winners.
Not a goal: touching LR/optimizer/scale/recurrence (second variables), re-litigating
z-recurrence/unfamiliar-context/ablations/calibration-bar (separately owed), claiming PROCEED or
Phase-2 (this wave cannot pass what it does not test), or moving filed numbers (F4–F13 stand as
measured-as-run; F14 re-labels gap meanings only). One track: eval shuffle branch changes,
training F12-exact, 20 retrains + 80 evals + metric-path tests.

## 3. Verified claims (numbers sacred, regime-bound unless noted)

- Correction (current tree u70-neural.js:392-408 vs :610-623, :799-803/:738-743 call sites): helper `zoh=zdet` pure, metric branch `zoh=zdet+q` partial; filed gaps F4–F13 are C2-partial by construction.
- F11 train-trajectory partial: probe 0.7183 (12/20), gap 0.1360 (20/20) (`d-u70-neural-f11-wave1.json`).
- F13 held-out partial: probe 0.6227 (8/20), gap +0.0224 (12/20), ctx 0.7777 (4/20); deltas dProbe -0.0957 [-0.164,-0.028], dGap -0.1136, dCtx -0.1007; V1 floor held-out 0.7503; oracle held-out 0.9537 shift +0.0039 (`d-u70-neural-f13-wave1.json`, `d-u70-oracle-f13.json`, `self-u70-f13-closeout.md`).
- Determinism filed fact (CPU Float64, mulberry32; F5-k0 0.0000, F10 0/1080, F13 0 mismatches) — train-clean replication sanity expects exactly 0 same-engine.

## 4. Done / Next

Done: task-spec, oracle+identifiability, causal diagram, base prereg + battery, Wave 1
(NO-PROCEED), F1-F13 waves + batteries (F4 FIXED, F5 lottery, F6 killed, F7/F8 persist, F9 partial,
F10 vote-FIXED, F11 REPAIRED gap-half re-labeled partial, F12 VERIFIED, F13 DEGRADES collapse), audit
reconciliation C1-C8, F11-path correction. Next if licensed: smoke (s0 4-eval, T1-T4+T7/T8+T5/T6/E4)
-> 20 F12-exact retrains -> 80 evals (train-clean / train-TRUE / held-clean / held-TRUE) ->
TRAIN + HELDOUT verdicts. Queued behind: z-recurrence, unfamiliar-context, ablations, calibration
bar, sharpened F3, GRU-128, trace study, Phase-2.

## 5. Patches in v1.1 (answer these only)

- T8b: does the independent recompute (no helper, no metric branch; ziShuf+Wc/bc reference, strict ===) close r2's shared-bug hole, or can a leak still pass T7+T8+T8b together — name it.
- Early-HALT: does per-seed train→clean→check-before-shuffled ordering stop a bad wave cheaply without adding compute or judgment calls.
- Glosses: boundary (read-point vs rewrite), TRUE-gap direction (removing +q lowers shuffled ⇒ bar conservative), dual-verdict independence, no-learning-at-eval freshness, 256-bit hash provenance — any still false or smuggling a variable.
- Rejections: trajectory-rewrite arm, bar re-derivation, inverted-shuffle, held-out-void, SHA-256 churn, 40-60/zero-ablation arms — any wrongly rejected (say which + cheapest killer the premise still lacks).

## 6. The ask (re-close)

Hammer this premise. Verdict (STANDS / NEEDS-PATCH) + single hardest test/falsifier. <=150 words,
numbered. Angles (one per reviewer): (1) eval-only change — does retraining vs re-evaluating filed
weights smuggle anything, is replication sanity expect-0 sound; (2) metric-path tests — do T7/T8
prove the intervention landed, what leak could survive both; (3) boundary — is clean-history
read-point the right claim, or is trajectory-rewrite owed; (4) bars — is gap≥0.05 fair on the TRUE
metric, or does pure shuffle demand a re-derived bar; (5) dual verdicts — can TRAIN/HELDOUT split
hide or smuggle a win; (6) held-out reuse — are 20..39 still a valid held-out after F13 spent them;
(7) oracle reuse — is citing F13's ceiling without recompute sound; (8) scope — any second variable;
(9) halts — what stops a bad run; (10) alternative — one rival mechanism for any F14 outcome plus its
cheapest killer test.

## 7. Anti-bias packet

Central claims: (a) training stays F12-exact, only the eval shuffle branch changes; (b) T7/T8 on the
metric path prove q-removal; (c) 20 retrains + 80 evals isolate the TRUE intervention on train and
held-out. Evidence: line refs + correction memo + F13 ledgers above, all verified post-F13 tree.
Contradictory/missing: no TRUE-shuffle run exists yet (that is the licensed compute); TRUE gap
magnitude unknown until the wave. Assumptions: F12/F13 ledgers as replication baselines; F4 v1.1
firewall verbatim. Conclusions depending on assumptions: the leak-size read depends on (b); if T7/T8
pass vacuously, only absolute TRUE bars survive with weakened isolation gloss.
