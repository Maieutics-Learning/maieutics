# Wave 229 note — backlog-W196 estimated-eta adaptive tau (sandbox, executed)

STOP RULE: stopped after v1 single-draw grid (12 regimes x 4 arms, flaw owned mid-wave) + v2 per-trial grid (12 x 5 arms x 300 trials, M {60,240,960}). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (w179 rig + burn-in estimator). Clock: R35 4/5.

## Direct: the guard needs 4x burn-in; learned-eta is fragile both ways

v1 owned flaw: one eta-hat draw per cell conflates draw-luck with frequency behavior (match.05 drew .025 → FA .377). v2 fixes it (per-trial burn-in, frequency-correct); v1 kept as the single-deployment illustration.
- Matched (burn-in regime = run regime), null FA oracle → h60/h240/h960: N20/.05: .007 → .217/.09/.02; N20/.15: .013 → .17/.05/.01; N5/.05: .003 → .147/.053/.01; N5/.15: .03 → .08/.007/.013. M=240 (1x detection volume 12N) BREAKS the guard (.05–.09, borderline at best) — pre-reg (a) REJECTED. M=960 (4x) restores everywhere (.01–.02). ehat means verify unbiased (.048–.051/.147–.152) — the failure is pure variance: eta-hat noise must sit well inside the 2.5se margin. Rule: burn-in ≥ 4x detection volume. Detection shape preserved at all M (hat tracks oracle within .1 once FA controlled).
- Mismatch ✓(b): misUp (tau low) siren (FA .92–1.0, "detection" 1.0 forfeited per W209 tangential); misDn (tau high) blind (det .01–.31, FA 0). Drift ✓(c): driftUp breaks FA (.27–.74 — burn-in can't see the future); driftDn conservative FA (~0) paying detection (.11–.46).
- Fixed.15 under drift — NUANCED, pre-reg (d) partial: fixed wins driftUp honestly (FA 0, det .947 vs siren-hat — .15 sits luckily above the drifted range); sirens in match.15/misUp (FA .43–.46); FA .087 in driftDn. Learned-eta (M≥960) beats fixed everywhere except luck-of-level driftUp.
- Single-deployment caveat: frequency FA .09 (M=240) averages deployments; v1's match.05 deployment drew .025 → FA .377. A 4%-likely burn-in breaks that deployment. Report unlucky-deployment risk beside frequency FA.

Verdict: USED with teeth (4x rule + fragility-both-ways + v1 flaw owned + single-vs-frequency cut). No precursor, no conflict.

## Tangential: price the burn-in, not the bound (0-spend, reasoning only)

The guard's cost was quoted as a margin (2.5se) — v2 moves it to a budget (4x votes before the first real look). Unpriced-burn-in is W187's unpriced-looks wearing a new hat and W224's scaffolding with numbers: every adaptive procedure's headline constant hides a data bill, and the comparison that omits it (oracle-eta vs fixed) flatters the adaptive arm. Rule: adaptive-vs-fixed grids print the burn-in volume in the arm label (hat960, not hat) — the arm IS its data cost.

## Spend / queue

- Spend: 0 + 0 + 2 grids (v1 + v2 per-trial; floor). Consumed backlog-W196 removed; spawned W213 to BACK. Backlog 17. Synthesis R35 clock: 4/5.
- W213 (B, sandbox): burn-in economizer — shorter burn-in + wider margin (3.5se/4se) vs M=960+2.5se; margin-vs-burn-in exchange rate; adaptive margin k(M) rule (tau = ehat + k(M)·se); single-deployment risk curve P(FA>.05 | M).
