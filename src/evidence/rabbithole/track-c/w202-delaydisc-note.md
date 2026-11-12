# Wave 202 note — backlog-W173 delay-discount of lambda-star (sandbox, executed)

STOP RULE: stopped after Dxrxq grid (6 D x 25 cells x 12 rules x 500 trials) + form fits (no shrinkage-rule arm — spawned, not built). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (vendored w156 rig + D loop + fits + degeneracy flags). Clock: R31 1/5. Pre-registered predictions scored: (1) CONFIRMED (2) partial (3) REJECTED (4) CONFIRMED.

## Direct: delay demands shrinkage, not reweighting; reff form fails

Grid: D {0,1,3,6,12,25} x (r,q) 5x5 x {hebb + EMA .0-1.0} x 500 trials; T=150 obs + D silent flips; degeneracy flag (acc*-.5<.02 → λ* unidentified, excluded from fits).
- (1) r=0 column D-INVARIANT ✓: hebb at every (q,D) cell (30/30). Truth frozen → history average → ±1 correctly → delay harmless → averaging always wins. Cleanest result of the wave.
- (2) q=0 frays toward hebb, THEN NOISE: r=.2: .5(D0) → .5(D1) → .3(D3) → .4!(D6) → hebb!(D12) → .5!(D25). Fall holds D0→D12; D25 bounces (near-flat accuracies → argmax noise). r=.05 non-monotone (.5→.6→.6→.2) within weak-identification noise. Owned as partial: pure-delay effect confirmed where identified, noise-owned where not.
- (3) EFFECTIVE-VOLATILITY REJECTED: λ* = reff/(reff+q+.1), reff = gap-flip-prob, loses to base r/(r+q+.1) at every D (D3: .192 vs .140; D6: .185 vs .143; D12: .308 vs .214; D25: .431 vs .243; D0: .344 vs .086). With free-c reff wins D3-D12 narrowly (.113/.114/.166 vs .140/.143/.214) but that's 2 params (form + c(D)) vs 1 — wash at best. Delay ≠ more volatility.
- (4) HEBB TERRITORY GROWS ✓: hebbFrac .20/.20/.29/.25/.30/.40 across D (D6 dip within noise; trend clear).
- Unified mechanism (replaces reff): the silent gap demands SHRINKAGE toward 0 (post-gap truth ~ independent of history at high D×r → best m ≈ 0). The rule set has no shrinkage knob, so λ absorbs it: lower λ = longer average = closer to 0; hebb = max shrinkage. r=0 exempt (average → ±1, still correct). q=0 fray = shrinkage without noise. W190 (spawned): add explicit shrinkage m×γ^D at query — predicts (i) shrinkage rule dominates EMA/hebb at high D, (ii) λ* returns to r/(r+q+c) once shrinkage is explicit.

Verdict: USED (invariance + fray + rejection + growth + mechanism). No precursor, no conflict.

## Tangential: give the model the knob the phenomenon wants (0-spend, reasoning only)

λ spent the whole wave mimicking a knob it doesn't have (shrinkage via averaging). Whenever a fitted parameter drifts systematically with a condition (λ* falling in D), ask what missing knob it is compensating — then ADD the knob and watch the fit snap back. This is the inverse of the usual overfitting worry: instead of distrusting the drift, promote it to structure. W190 is that promotion made flesh (γ explicit). If γ doesn't restore λ*, the mechanism is wrong and the drift stays drift — decisive either way. Cheap generality: audit any fitted-constant-vs-condition table on the trail for compensation drift (c(D) drifting .1→.48 in reff_freeC is the same smell).

## Spend / queue

- Spend: 0 + 0 + 1 grid (6x25x12x500 + fits; floor). Consumed backlog-W173 removed; spawned W190 to BACK. Backlog 17. Synthesis R31 clock: 1/5.
- W190 (A, sandbox): shrinkage-rule test — explicit m×γ^D at query, γ {.5,.8,.9,1.0} x D {3,6,12,25} x r,q grid; dominance test + λ* restoration test; same trials/seeds.
