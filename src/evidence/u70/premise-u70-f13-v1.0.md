# Premise U70-F13 v1.0 (frozen for barrage — proposal `u70-f13-prereg-proposal-v1.0.md` v1.0)

## 1. Project (3 lines)

U70 is a context-inference program: a GRU64 + 4-way stochastic-latent model must infer a hidden
2-context state over 300-trial trajectories; a Bayesian oracle ceiling (ctx 0.9498 on seeds 0..19)
bounds what any neural model may be penalized for missing. F11 repaired the discrete forward
(corrected probe 0.7183, gap 0.1360, paired deltas ~0) and F12 made calibration measurable
(oracle valid 0.0208, neural 0.245974, retention 20/20), but every neural verdict is still
training-trajectory performance (same path+obs train+eval). F13 spends the reserved seeds 20..39:
train F12-exact on 0..19, eval each model on paired fresh 20+s, isolating generalization.

## 2. Scope agreement

Ability, not drive: the agent proposes/runs/grades; the owner countersigns exact versions and
arbitrates. What accumulates is method + preserved negatives, never cherry-picked winners.
Not a goal: beating bars by redefinition, touching LR/optimizer/scale/recurrence (second
variables), smuggling a calibration bar, re-litigating z-recurrence/unfamiliar-context/ablations
(separately owed), or claiming PROCEED (this wave cannot pass what it does not test). One track:
eval trajectories change, training identical, 20 paired units + provenance.

## 3. Verified claims (numbers sacred, regime-bound to training trajectories seeds 0..19 unless noted)

- Oracle ceiling seeds 0..19: ctxAcc 0.9498 / valid ECE 0.0208 (F12 recompute; filed fixed 0.0614 stands as measured-as-run) / MCE 0.2527 (`d-u70-oracle-f12.json`).
- F11 corrected (training-trajectory): probe 0.7183 (12/20), gap 0.1360 (20/20), ctx 0.8783 (16/20); paired F11-F4 deltas ~0 (leak-size ~0); detection 13/20->2/20 (`d-u70-neural-f11-wave1.json`, `f11-analysis.json`, `self-u70-f11-closeout.md`).
- F12 retention: neural valid ECE 0.245974/MCE 0.286, probe/gap/ctx bit-identical to F11, retention 20/20, drift ≤7.2e-5 (`d-u70-neural-f12-wave1.json`, `self-u70-f12-closeout.md`).
- Train/eval share trajectories in every filed wave (u70-neural.js:778/794-800, verified current tree); seeds 20..39 never used as paths in any filed wave (U70N_SEEDS 0..19; grep-verified). Base prereg reserves 20..39 for held-out (u70-prereg-proposal-v1.1.md line 7).
- Determinism is filed fact (hand-rolled CPU Float64, mulberry32; F5-k0 maxDiff 0.0000, F10 0/1080) — same-seed retrain replication sanity expects exactly 0.

## 4. Done / Next

Done: task-spec, oracle+identifiability, causal diagram, base prereg v1.1 + battery, Wave 1
(NO-PROCEED), F1-F12 waves + batteries (F4 FIXED, F5 lottery, F6 killed, F7/F8 persist, F9 partial,
F10 vote-FIXED + disagreement-negative, F11 REPAIRED, F12 VERIFIED), bio K=4 memo, audit
reconciliation (C1-C8 adjudicated). Next if licensed: F13 Phase A (oracle 20..39 reads-only) ->
smoke (s0→s0/s20, T5+T6+E4) -> 20 paired retrains + held-out evals -> verdict
GENERALIZES/DEGRADES/BROKEN. Queued behind: z-recurrence, unfamiliar-context, ablations,
calibration bar, sharpened F3, GRU-128, trace study, Phase-2.

## 5. The ask

Hammer this premise. Verdict (STANDS / NEEDS-PATCH) + single hardest test/falsifier. <=150 words,
numbered. Angles (one per reviewer): (1) held-out freshness — are 20..39 truly fresh, what could
contaminate them; (2) paired mapping — is s→20+s the right unit, or does 1:1 pairing smuggle
dependence; (3) bar fairness — do train-derived bars (0.70/0/0.85) fairly test held-out, or is the
ceiling shift unaccounted; (4) replication sanity — is expect-exactly-0 too strong, what breaks it;
(5) hash sufficiency — do weight/config hashes prove what they claim, what is missing; (6) scope
discipline — any second variable smuggled in; (7) verdict-rule gaming — can GENERALIZES be met
without generalization mattering, can DEGRADES hide a harness break; (8) oracle Phase A — is the
held-out ceiling the right comparator; (9) halt conditions — what stops a bad run; (10) alternative
explanation — one rival mechanism for any F13 outcome plus its cheapest killer test.

## 6. Anti-bias packet

Central claims: (a) training stays F12-exact, only eval trajectories change; (b) 20..39 are fresh;
(c) 20 paired units + hashes isolate generalization. Evidence: line refs + seed grep above, all
verified post-F12 tree. Contradictory/missing: no held-out run exists yet (that is the licensed
compute); oracle held-out ceiling unknown until Phase A. Assumptions: filed F12 ledger values as
replication baseline; F4 v1.1 firewall carries verbatim. Conclusions depending on assumptions: the
generalization read depends on (b); if 20..39 are contaminated, only the absolute held-out bars
survive with a weakened freshness gloss.
