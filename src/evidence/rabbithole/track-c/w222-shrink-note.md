# Wave 222 note — backlog-W190 shrinkage-rule test (sandbox, executed)

STOP RULE: stopped after 6D x 25-cell x 24-rule x 500-trial grid (same seeds as W202) + tie receipt + q-vs-reff discriminator with rank audit. 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (vendored w173 rig + γ-query arm). Clock: R34 3/5.

## Direct: gamma-at-query is a no-op by theorem; migration tracks reff, not q

Literal test: rules querying sign(m·γ^D), γ {.5,.9,1.0} on hebb + EMA {.2,.5,.8}. THEOREM (pre-registered): γ^D>0 preserves sign and zero → every γ-variant ties its base EXACTLY. Receipt: max|acc_γ − acc_base| = 0.0000 at all six D (bit-ties, same seeds/streams). W202 prediction (i) "shrinkage rule dominates at high D" — REJECTED by proof, not by noise. Prediction (ii) "λ* returns to r/(r+q+c)" — DISSOLVED (a no-op knob restores nothing and breaks nothing; the λ* table is identical by construction). The promotion was aimed at the wrong layer: any linear-positive modification of m is accuracy-invisible under a sign query — only nonlinearities can bite.

Mechanism adjudication (the falsifiable residue): H_noise (mine, pre-reg) — migration pressure rises with q — vs H_shrink — migration tracks reff(D,r), q-independent. Per-D Spearman (tie-averaged ranks) of migration M=λ*(0)−λ*(D): spearReff .053/.367/.616/.687 (D1/D3/D6/D12), spearQ −.33/.085/.205/.233 (D1 ≈ no migration yet, meanM −.005; rest ≈ 0). Pooled partials: reff|q .622 vs q|reff .098. H_shrink CONFIRMED, H_noise REJECTED (against own pre-reg). Reproduction: hebbFrac .20/.20/.29/.25/.30/.40 and r=0 invariance (30/30 hebb) both match W202; r=.2/q=0 fray resolves as degeneracy (DEG from D6 up). W202's reff rejection stands AND is reconciled: reff fails as a λ* LEVEL form but succeeds as the MIGRATION-pressure variable — level vs pressure are different jobs. Honesty receipt: naive ranks (no tie-averaging) printed a fake spearReff=1.000; audit caught it, corrected to .62 — coarse λ-grids tie heavily, always average ties.

Verdict: USED with teeth (theorem-kill + adjudication against own pre-reg + rank-audit catch). No precursor, no conflict.

## Tangential: run the proof before the grid (0-spend, reasoning only)

For every spawned mechanism test, first write down the invariance the spec implies (which transformations leave the outcome unchanged?). If the treatment sits inside the invariance group — sign-query × positive scaling = identity here — the experiment is a theorem with a receipt, not a grid: run one cell to certify the harness, spend the grid budget on the falsifiable residue (the discriminator). W190's grid earned its keep only via the EMA columns the γ arm forced us to remeasure.

## Spend / queue

- Spend: 0 + 0 + 1 grid (6x25x24x500 + discriminator; floor). Consumed backlog-W190 removed; spawned W207 to BACK. Backlog 17. Synthesis R34 clock: 3/5.
- W207 (A, sandbox): window-pressure form — fit λ*(D,r,q) = base(r,q) − pressure(reff) two-term family on saved W190/W202 grids (zero new sims first); does reff-pressure beat base alone on identified cells; confirmatory D-interp cells only if close.
