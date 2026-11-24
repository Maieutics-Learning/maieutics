# Self U13 delta-prereg: pass-2-confidence routing (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only. R=3, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only. Push after verdict per user standing order (push after each model).

## Record-search (already-run / nearest prior / what differs)
- U8 COMPARE-USED-WRONG-SIGN: soft comparative gate shuts (corr −0.97), wm<0 — avoids, never chooses.
- U10 SPLIT-HEALS-LEVELS/COMPARISON-DECORATIVE: cmp==ablate exactly, beta ~0.51 chance — pass-1 features (H/beta/dis) starve the router.
- U11 STILL-SHUT: wY 2.0 opens-all, routes-nothing — magnitude is not the missing ingredient.
- U12 STILL-SHUT: STE hard pick quantizes to always-head (gc∈[0.5,0.6), gcVar 1e-5); stage-1 BCE flat at chance — forcing choice without signal just hardens blindness; pass-1 h carries no linear wrong-predictive signal.
- U12 verdict queued: confidence from PASS-2 OUTCOME features (margin/agreement after head-vs-base compare — the signal U12 proves pass-1 lacks).
- What differs (user order: find a way of opening it): route on what each candidate LOOKS like, not on pass-1 vibes. At blend time both candidates exist (baseMean, ad). Two arms: (a) u13-mrule — FIXED normalized-margin pick (no params, eval-only): pick the candidate with the larger scale-normalized top1−top2 gap. Tests whether the signal exists at all. (b) u13-p2learn — LEARNED soft gate on pass-2 features only (normalized margins, relative confidence, agreement, candidate entropies + detached beta/dis continuity). Tests whether the learner can capture it. Baseline reference: U12 ledgers (same seeds, twin-matched) — no rerun.

## Design
- Init per seed: same frozen (W6-s, M2-nb-s, HD=U5-nl-open-s{seed}); RPr fresh (rng +133); RPcmp fresh u13 9-scalar set (rng +134). Same seeds/streams as U12 for cross-run comparison.
- Normalized margin: mN(x) = (top1−top2)/(max−min+1e-9) over the 4 logits — scale-free in [0,1], comparable across head/base scales. Scale report (mean|ad| vs |baseMean| ranges) guards comparability.
- mrule (0T+3E): pick = mN(ad)>=mN(baseMean) ? ad : baseMean. Reports: pickHead|adapt, pickHead|std, pick-accuracy vs always-head / always-base on BOTH diets, scale report. Writes trivial COMPLETE train ledger (no params — keeps ledgerPattern uniform, disclosed).
- p2learn (3T+3E): stage-1 critic warmup IDENTICAL to U12 (useless but keeps critic pipeline comparable — disclosed, not re-justified) then stage-2 soft blend with gate on [mAdN, mBaseN, dmN=mAdN−mBaseN, a, H_ad, H_base, beta(detached), dis]. Losses identical to U12 (CE + 0.5CE(ens); critic frozen in stage-2). RPret ← retrieval only; blend CE → RPcmp only.
- Evals N=200+200 + full U12 report set for p2learn (gc dist, pick-pseudo-rates, betaGap, wm-analogue on dm weight) + rule reports for mrule.

## Bars (quorum 2/3)
- U13-RULE-SELECTIVE: pickHead|adapt − pickHead|std ≥ 0.20 AND pickAcc ≥ best-single − 0.02 per diet (selective without cratering).
- U13-RULE-USEFUL (stronger): mixed-50/50 pick-accuracy ≥ best fixed-candidate + 0.03.
- U13-LEARN-VITAL: E[gc|adapt] > E[gc|std] ≥2/3 margin ≥0.05 AND wrong>right 2/3 (soft gate finally selective).
- U13-LEARN-SEL/STD/SIGN: adaptY−flat ≥ +0.10; two within ±0.05 W6 2/3; w_dm > 0 2/3 (comparison with the RIGHT sign at last).
- U13-LEARN-MATCHES-RULE: learn mixed-accuracy within 0.03 of rule (learner captured the signal).
- Verdicts: ROUTER-OPENS (RULE-USEFUL + LEARN-VITAL + MATCHES — WORKING selectivity; graduate to hardness/leak-plug) / SIGNAL-WITHOUT-LEARNER (rule selective/useful, learn blind — distill from rule next) / SEALED-SHUT (rule fails selective — pass-2 observables don't separate either; routing needs new representations) / LEARN-ALONE (learn vital, rule fails — trust learn, probe how).

## Staging + budgets
- Battery on THIS file (3x sealed, goal line + self-learning framing in every prompt) → v1.1 pins-only.
- Then grad-check (new 9-scalar RP, smooth graph, standard numeric) + 3T+6E. Ledgers d-newai-self-{u13-mrule,u13-p2learn}-s{seed}-800st.json + evals + verdict d-newai-self-u13-verdict.json. Transcript + CHATLOG + CURRENT_TASK. PUSH after verdict per user standing order (push after each model).
