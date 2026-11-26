# Fresh-eyes battery: U53 amendment A1 — 10/10 ACCEPT, 10/10 CORRECTION → discussion 10/10 CONFIRM — CLOSED

**Artifact:** A1 text (D1/D2 findings + relative-bar change + falsifier note). **Reviewers:** 10 NEW sealed (compact prompt, no truncation warnings). **Tool:** scratch/u53-amend-battery.js via page_eval.
## Raws (verbatim)
A1: ACCEPT-AMENDMENT. Absolute bars empirically falsified pre-Phase-2; relative barring prevents spurious VETO-DEAD. Hardest: Delta-0.03 arbitrary, no theoretical basis. TUNING or CORRECTION: CORRECTION (bars set without measured baseline).
A2: ACCEPT-AMENDMENT. Absolute bars logically void at baseline ~0.3. Hardest: no floor for relative bar; ckpt 0.01 would make it trivial. CORRECTION (premise falsified pre-Phase-2).
A3: ACCEPT-AMENDMENT. Incorrect competence premise; relative bars prevent false-negative DEAD. Hardest: delta risks overfitting Phase-1 noise floor. CORRECTION (baseless estimates → empirical ceilings).
A4: ACCEPT-AMENDMENT. Non-existent competence; relative Delta keeps signal-to-noise. Hardest: Delta heuristic without noise-floor derivation. CORRECTION (a priori bars → observed ceilings, pre-Phase-2).
A5: ACCEPT-AMENDMENT. Baseless absolute bars. Hardest: non-representative seeds may mask degradation as relative gain. CORRECTION (unmeasured baseline → observed ceiling).
A6: ACCEPT-AMENDMENT. Unfounded absolute thresholds. Hardest: checkpoint drift — relative barring inherits baseline variance, masking gradual degradation. CORRECTION (premise >=0.95 physically unreachable).
A7: ACCEPT-AMENDMENT. Non-functional absolute bars. Hardest: Delta margin arbitrarily small, risks lucky pass. CORRECTION (theoretical priors → empiricals).
A8: ACCEPT-AMENDMENT. Thresholds decoupled from ceilings; current ones induce false-negative DEAD. Hardest: checkpoint creep — threshold becomes moving target of seed variance. CORRECTION (vacuum-set bars → physical plausibility).
A9: ACCEPT-AMENDMENT. Non-existent competence; relative delta preserves intent. Hardest: no predefined relative floor allows threshold sliding on systemic decay. CORRECTION (vacuum bars; measurement proves unreachable).
A10: ACCEPT-AMENDMENT. Bars decoupled from ceilings; VETO-DEAD would be false positive. Hardest: Delta appears post-hoc curve-fitting to avoid failure. CORRECTION (theoretical → relative checkpointing restores sensitivity to mechanism failure).
## Discussion (10x strict): 10/10 CONFIRM (amendment + SE-derivation + LOWCOMP flag + A5 answer).
## Adjudication (owner)
ACCEPT A1 (unanimous CORRECTION — filed pre-Phase-2 with measured numbers; the alternative, running on, manufactures a false DEAD). ADOPT Delta-derivation (SE~0.032 at N=200/p~0.3 — answers the arbitrariness chorus with a measurement property) + LOWCOMP flag (ckpt<0.28 filed, no quorum change — answers A2/A9 without post-hoc exclusion). ANSWER A5/A6/A8 (same-seed pre/post IS the degradation measure; variance is filed per-seed, quorum handles it). Awaiting: FRESH COUNTERSIGN for amended Phase-2 + evals + verdict (pre-countersign covered v1.0/v1.1 design only).
