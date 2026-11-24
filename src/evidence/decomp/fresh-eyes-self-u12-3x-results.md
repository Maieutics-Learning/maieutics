# Fresh-eyes battery: self U12 hard-routing + critic repair (3x sealed)

Goal line + self-learning framing carried in every prompt. Parallel via root.generateText (Promise.all).

## R1 — NEEDS-PATCH (STE honesty + distribution watch)
1. Numeric central-differences across gc=0.5 will fail/zero — STE is approximation, not identity. ADOPT as pin: grad-check verifies sigmoid-path grads + hard-forward values only; discrete jump excluded by construction; pick-stability asserted on probe (no flip under ±eps, flips counted and reported).
2. Probe-local guard hides global bias if gc clusters near 0.5. ADOPT as report: log gc distribution (mean/var, fraction within 0.1 of threshold) + per-type pick rates; eval-only, no mechanics.
3. Stage-1/2 frozen-critic discipline + twin-matching + COMPLETE-gating sound. CONFIRMED.

## R2 — NEEDS-PATCH (rival: quantization vs selection)
1. Leaky hard-gate (95/5 bleed). REJECT — reintroduces partial credit, defeats the forcing function; collapse priced by HARD-TAXES-BASE trigger.
2. Soft-Repaired control for confound. ALREADY IN DESIGN — u12-softctrl shares stage-1 repair identically; arms differ hard-vs-soft only. Confirmed, no change.
3. Switch-rate entropy killer metric. ADOPT as report: per-type pick rates (adapt vs std, wrong1 vs right1) + binary entropy of overall pick rate + hard-vs-soft decision agreement; eval-only.

## R3 — NEEDS-PATCH (bars/verdicts)
1. Beta gap ≥0.10 too aggressive from ~0.51. REJECT — stage-1 is the F-check setup (frozen critic, mixed diet, BCE) which held calGap 0.5/0.5/0.46; ≥0.10 stands. Operationalize as E[beta|wrong1] − E[beta|right1] ≥ 0.10 (cleaner than lowQ/highQ split).
2. Missing verdict: oscillatory divergence (STE pick-flip instability, non-convergence). ADOPT verdict-only: STABILITY-FAIL trigger (loss curve non-monotone/non-convergent + pick-rate oscillation across curve); mechanics (temperature decay) REJECTED to U13.
3. Leaky-freeze trunk in stage-2. REJECT — U1/U2 proved joint tuning wounds base.
4. Eps-greedy exploration. REJECT to U13 (random exploration without ignorance signal repeats R1 curiosity-noise death).

## Adjudication: 3 NEEDS-PATCH → v1.1 REPORTS-ONLY (no design change)
- PIN: STE check = sigmoid-path grads + hard values; jump excluded by construction; flips counted.
- REPORTS (eval-only): gc distribution/var/near-threshold fraction; per-type pick rates + entropy + hard-vs-soft agreement; critic E[beta|wrong]−E[beta|right].
- VERDICT ADD: STABILITY-FAIL trigger (non-convergence + pick oscillation). Bars unchanged strict. Hard STE + stage-1 repair + 2 arms stand.
