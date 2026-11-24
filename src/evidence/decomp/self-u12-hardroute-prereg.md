# Self U12 delta-prereg: hard routing + critic repair on the split graph (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only. R=3, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only. Push after verdict per user standing order (push after each model).

## Record-search (already-run / nearest prior / what differs)
- U8 COMPARE-USED-WRONG-SIGN: sigmoid gate shuts (corr −0.97), STD holds, SEL fails, wm<0 — soft gate avoids, never chooses.
- U9 ORDER-FAILS: vhat_base fatal to compose pass (floor both arms) — circular dependency, fixed by U10 order.
- U10 SPLIT-HEALS-LEVELS/COMPARISON-DECORATIVE: gated-vhat order restores SEL 3/3 (0.53/0.565/0.435) but cmp==ablate exactly, wm<0, beta ~0.51 chance — openness drives levels, comparison decides nothing.
- U11 STILL-SHUT: wY 2.0 opens gate +0.07 everywhere, routes nothing (wm<0, corr decoupled, cmp==ablate) — weighting a blind gate opens it, does not teach it where.
- Lesson across U8–U11: a sigmoid blend gate NEVER HAS TO CHOOSE — partial credit lets it sit at always-open (U5/U10/U11 ~0.64-0.78) or avoidance-shut (U8) while the loss flows through the blend. Selectivity needs a discrete choice; confidence needs a working critic (beta ~0.51 starves RPcmp of its WHEN feature).
- What differs (user order: working unfrozen model): (a) HARD routing — forward blend is a discrete pick (useHead = gc>=0.5; blend = useHead ? ad : baseMean), backward flows through the sigmoid (straight-through estimator: dgc = sum_o dBlend[o]*(ad[o]-baseMean[o]), identical to soft). The gate must commit per example; no partial-credit parking. (b) CRITIC REPAIR — stage-1 critic-only warmup (200st, gates frozen at init, mixed 50/50 diet, BCE on wrong1 only) before stage-2 gate training with the critic frozen; teeth pattern (U3/U7 precedent). Both arms share the repair; arms differ ONLY in hard-vs-soft blend, so ABLATE isolates hardness.

## Design
- Init per seed: same frozen (W6-s, M2-nb-s, HD=U5-nl-open-s{seed}); RPr fresh (rng +129), RPcmp fresh RP8 / RP6-ablate twin (rng +130/+131, same draws).
- Stage 1 (both arms, identical): freeze all gate params (RPr gate scalars + RPcmp), train ONLY critic (RPr.Wc/bc, BCE on wrong1 from gated-vhat pass-1) 200st/B16 on 50/50 diet. Record beta calibration (lowQ vs highQ gap).
- Stage 2 (800st/B16/lr1e-3, critic frozen): HARD arm uses STE hard pick (forward discrete, backward sigmoid-path); SOFT-CTRL arm uses soft blend (U10/U11 forward). Losses identical: CE(blend,y) + 0.5*CE(ens,v) [+0.5*BCE frozen, no grad]. RPret ← retrieval losses only; blend CE → RPcmp only; beta detached into cmp (U10/U11 architecture kept).
- Arms (2×3 = 6T+6E + 2×3 stage-1 embedded in same runs): u12-hard vs u12-softctrl (soft with repaired critic — isolates hardness from repair).
- Evals identical N=200+200 + full U10/U11 report set (wm/wa/corr/logit/agree/saliency/beta) PLUS: hard pick-rate adapt vs std, pick|wrong1 vs pick|right1, hard-vs-soft decision agreement, beta lowQ-vs-highQ calibration gap, pick-stability note.

## Bars (quorum 2/3)
- U12-CRITIC: repaired critic shows lowQ-vs-highQ beta gap ≥0.10 on 2/3 seeds (repair works; U11 sat ~0.51 flat).
- U12-VITAL: hard pick-rate adapt-missing > standard ≥2/3 with margin ≥0.05 AND pick|wrong1 > pick|right1 ≥2/3.
- U12-SEL: hard adaptY − base-flat ≥ +0.10.
- U12-STD: two within ±0.05 of W6 2/3 (HARD-TAXES-BASE if SEL holds + STD breaks — discreteness must not wound).
- U12-SIGN: wm > 0 ≥2/3 (hard choice flips the sign the soft gate never could).
- U12-ABLATE: hard VITAL holds while soft-ctrl fails (gap ≥0.05 adaptY or VITAL margin) — discreteness, not repair alone, routes.
- Verdicts: HARD-HOLDS (CRITIC+VITAL+SEL+SIGN — WORKING router; graduate to leak-plug/K-head) / HARD-SELECTIVE-SOFT-BLIND (VITAL holds, soft-ctrl fails — discreteness is the mechanism) / CRITIC-FIXED-GATE-BLIND (CRITIC holds, VITAL fails — confidence restored, choice still blind) / STILL-SHUT (wm<0 again — even forced choice can't find the signal).

## Staging + budgets
- Battery on THIS file (3x sealed, goal line + self-learning framing in every prompt) → v1.1 pins-only.
- Then grad-check (STE graph: soft-path grads + hard-forward values; threshold-crossing guarded — probe episodes must not flip pick under ±eps; beta-detach kept) + stage-1+stage-2 6T+6E. Ledgers d-newai-self-{u12-hard,u12-softctrl}-s{seed}-800st.json + evals + verdict d-newai-self-u12-verdict.json. Transcript + CHATLOG + CURRENT_TASK. PUSH after verdict per user standing order (push after each model).
