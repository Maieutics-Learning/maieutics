# Fresh-eyes battery: self U3 teeth two-stage (3x sealed, parallel via root.generateText)

Goal line carried in every prompt.

## R1 — NEEDS-PATCH (verbatim, truncated to 1800 chars in scratch raw)
1. Control insufficiency: u3-t2-flat (g=0, critic trains) tests critic value-learning, not gate mechanism; need randomized/fixed-nonzero gate baseline. 2. Harm masking: STD vs U2 base measures stability vs frozen state, hides silent degradation / local-artifact fitting. 3. Parametric imbalance: 53 params at 5e-3 on frozen trunk risks overfitting-to-freeze; no slow-leak trunk update. 4. Metric ambiguity: GATE descriptive (b-dominance/wd) qualitative — TEETH-HOLD becomes subjective.

## R2 — NEEDS-PATCH (verbatim, truncated to 1800 chars in scratch raw)
1. Baked-in risk: U2 trunk may already internalize adapt; fresh RP (112/113) is cosmetic (new wheel, welded column). 2. Parametric leverage: 53 params must invert the inversion (wb/wd negative baked); SEL +0.10 unlikely before critic collapses at 5e-3/B16. 3. NO-OUTSIDE collision: no boundary TEETH-HOLD vs NO-OUTSIDE; positive SEL could be frozen-U2 recall; missing blind baseline (U2 base sans gate). 4. GATE vague: no predefined sign-check; cherry-pick risk.

## R3 — NEEDS-PATCH (verbatim, truncated to 1800 chars in scratch raw)
1. VITAL 3/3 rigidity: 53-param gate on wounded base, one noisy framing discards functional gate — false negatives. 2. Do-no-harm paradox: STD ±0.05 punishes real modulation (variance should shift). 3. Verdict gap: GATE-HURTS trigger undefined (SEL drop vs STD breach?). 4. Parameter starvation: no warmup/burn-in for critic; 50/50 at 5e-3 risks immediate collapse.

## Adjudication: 3 NEEDS-PATCH → v1.1 PINS + VITAL/GATE QUANTIFICATION (no new arms, no diet/lr changes)
- ADOPT (pin): flat control STANDS (same g=0 + critic-trains logic as R3/U1/U2 — comparability; randomized/fixed-nonzero gate parked as follow-up, not a 3rd arm today).
- ADOPT (pin): STD dual — primary vs U2-anch-gate two ±0.05 3/3 (do-no-further-harm on the frozen base) AND descriptive vs W6 (do-not-pretend-base-healthy). Harm-masking closed by reporting both; SILENT-DEGRADATION watch = loss curves + gate variance, logged.
- ADOPT (bar clarification): VITAL quorum 2/3 per framing (was 3/3 both) — wounded-base noise concession (R3.1). TEETH-HOLD = SEL∧(adapt>std ≥2/3)∧(wrong>right ≥2/3). STILL-BLIND = SEL∧¬VITAL under same quorum. Preserves teeth meaning, removes single-seed fragility.
- ADOPT (pin): GATE-HURTS trigger = two worse than U2 base by >0.05 (beyond STD bar) on ≥2/3 seeds (closes R3.3). NO-OUTSIDE = SEL 0/3 (with VITAL ≤1/3) — base internalized adapt, gate adds nothing (closes R2.3; U2-base-sans-gate descriptive = U2-anch-flat already filed: adaptY 0.15-0.27).
- ADOPT (pin): GATE quantitative — report we/wb/wd/b + gAdapt/gStd/gWrong/gRight (already in eval); sign-checks: wb>0 and we>0 open-on-ignorance (predicted), wd reported (negative = inversion repeats per R3/U1/U2), |b| vs R3 +1.3 (dominance) vs U1/U2 +0.2-0.5 (mid). TEETH-HOLD expects wb>0 ≥2/3 tied to VITAL.
- REJECT as change: warmup/burn-in, slow-leak trunk (breaks freeze isolation — the experiment's point), new forced-open arm (follow-up). Baked-in risk ACKNOWLEDGED openly: if NO-OUTSIDE, that IS the finding (U2 internalized adapt; gate redundant) — not a failed control.
- Raw truncated replies in scratch/fresh-eyes-self-u3-3x.json (1800-char slices; filed honestly as truncated).
