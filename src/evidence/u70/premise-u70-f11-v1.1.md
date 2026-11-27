# Premise U70-F11 v1.1 (frozen for re-close — proposal `u70-f11-prereg-proposal-v1.1.md` v1.1; v1.0 battery: 9/10 NEEDS-PATCH, 3 adoptions)

## 1. Project (3 lines)

U70 is a context-inference program: a GRU64 + 4-way stochastic-latent model must infer a hidden
2-context state (plus cue reliability) over 300-trial trajectories; a Bayesian oracle ceiling
(ctx 0.9498) bounds what any neural model may be penalized for missing. F4 established a pooled
FIXED (probe 0.7192 12/20, gap 0.1362 20/20) and F10 a vote-level FIXED (0.8832/0.1395), but an
outside implementation audit (reconciled 2026-11-27, all claims re-verified in-tree) shows the
forward latent was never discrete. F11 repairs the two offending lines and re-runs F4-exact,
isolating how much of the filed wins was posterior leak-through.

## 2. Scope agreement

Ability, not drive: the agent proposes/runs/grades; the owner countersigns exact versions and
arbitrates. What accumulates is method + preserved negatives, never cherry-picked winners.
Not a goal: beating bars by redefinition, touching LR/optimizer/scale (second variables),
smuggling a trajectory-level shuffle rewrite, or re-litigating ECE/held-out/z-recurrence (separately
owed tracks). One track, two lines, four unit tests, 20 paired retrains.

## 3. Verified claims (numbers sacred, regime-bound to training trajectories seeds 0..19)

- Oracle ceiling: ctxAcc 0.9498 / delay med 2 / FA 0.70 per 100 (`d-u70-oracle-identifiability.json`).
- F4 filed: probe 0.7192 (12/20), gap 0.1362 (20/20), ctx 0.8795 — measured with forward = onehot+q
  (u70-neural.js:152-153, verified current tree) and shuffle = onehot(shuffled)+q(original) (:403).
- F10 filed: vote probe 0.8832, gap 0.1395; member z-probe mean 0.5854 (28/60 ≥0.70, recomputed from
  filed ledger); +0.164 is cross-head (vote context-head vs F4 z-probe), like-for-like +0.0037
  (CI taken-as-filed, Level-2 owed).
- Backward already implements the ST surrogate (`dqlog = dqrep*repw + dz*(1-UNIF)` through the
  softmax jacobian, :273-277) — the repair is forward-only, gradient path pre-exists.
- Calibration (either implementation) is not ECE (fixed-0.95 reference, neural :458 + oracle);
  G1's ECE gate is uninterpretable — F11 does not gate on it and does not fix it (owed track).
- All neural verdicts are training-trajectory performance (same path+obs train+eval, :503/511/516).

## 4. Done / Next

Done: task-spec, oracle+identifiability, causal diagram, base prereg v1.1 + battery, Wave 1
(NO-PROCEED), F1-F10 waves + batteries (F4 FIXED, F5 lottery, F6 killed, F7/F8 persist, F9 partial,
F10 vote-FIXED + disagreement-negative), bio K=4 memo, audit reconciliation. Next if licensed:
F11 smoke (T1-T4 + 1 seed) -> 20 paired retrains -> verdict REPAIRED/QUALIFIED/REGRESSED + leak-size
read. Queued behind: ECE reimplementation, held-out split, z-recurrence wiring, unfamiliar-context.

## 5b. What changed in v1.1 (battery adjudication — verify the patch answers your finding, do not re-litigate v1.0)
1. Manual-coupling fact stated (no autograd; backward uses analytic q, never the forward op).
2. T2 is a pre-smoke HALT gate (1e-6), not a log line.
3. Verdict firewall: absolute corrected bars ONLY; paired/leak-size/loss descriptive, never verdict-moving.
4. F11 ledger logs epoch-checkpoint losses (within-wave sanity; no cross-wave loss claim — filed ledgers lack them).
No new arms, no new bars. Rejected with derivations: null-repair arm, permutation gate, variance gate, noise baseline.

## 5. The ask

Hammer this premise. Verdict (STANDS / NEEDS-PATCH) + single hardest test/falsifier. <=150 words,
numbered. Angles (one per reviewer): (1) forward-edit correctness — does (a) actually implement
ST, or does the manual backward need a coupled change; (2) shuffle-boundary honesty — is
read-point replacement the right claim, or does it smuggle/overclaim; (3) test strength — do
T1-T4 prove what they claim, what slips through; (4) verdict-rule gaming — can REPAIRED be met
without the repair mattering; (5) paired-comparison validity — same-seed pairing fair given the
forward change alters training dynamics; (6) scope discipline — any second variable smuggled in;
(7) leak-size read — descriptive vs verdict weight, is the firewall clean; (8) determinism —
replication conventions intact; (9) halt conditions — what stops a bad run; (10) alternative
explanation — one rival mechanism for any F11 outcome plus its cheapest killer test.

## 6. Anti-bias packet

Central claims: (a) the repair is two lines + tests; (b) the backward needs no change;
(c) 20 paired retrains isolate the repair. Evidence: line refs above, all verified post-change
notice. Contradictory/missing: no corrected-code run exists yet (that is the licensed compute);
CI for like-for-like is taken-as-filed. Assumptions: filed F4 ledger values as pairing baseline;
F4 v1.1 firewall переносится verbatim. Conclusions depending on assumptions: the leak-size read
depends on (c); if pairing is unfair, only the absolute corrected bars (REPAIRED/REGRESSED) survive.
