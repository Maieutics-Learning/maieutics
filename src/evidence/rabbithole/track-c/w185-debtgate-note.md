# W185exec — dependence-gated debt (A; backlog-W159)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 pilot + 2 bench grids, floor)
- Protocol (W164's, relocated to dependence): SeqModel parity6 + prefix-aux; pilot maps testIn trajectory (acc .45/.74 at steps 50/100; ignition 100–200); cut aux at steps {50,80,100} (≈m .45/.6/.74) vs never-cut; f = hard-acc(cut)/hard-acc(control) at step 400, 4 seeds.
- Debt exists HERE (W164's f≡1 was the substrate, not the spec): f(m) = .86/.92/.96 for m≈.45/.6/.74. testIn stays 1.0 everywhere — debt is invisible in-distribution, lives entirely on len10 generalization. Dependence gate confirmed: same protocol, assoc f≡1, parity f<1.
- Variance finding: early-cut debt is a lottery — c45 hard {.747,.973,1.000,.637} (range .36!) vs control {.943,.997,.983,.983}. Cutting pre-ignition gambles re-ignition: full recovery or stuck, coin flip. c65/c78 tight (±.05). W83's f(0.6)≈0.67 stands, bounded: G-scale hints carry deeper dependence than bench parity (.92) — same direction, regime-bound magnitude.
- Verdict USED (debt-where-dependence spec + measured f(m) + lottery variance + W83 bound). No precursor, no conflict. Cut-recovery horizon (extend post-cut training; permanent failure vs delayed ignition) spawned W176.

## Tangential (reasoning, 0 spend)
- Debt has an address: not "the model" but the generalization set, not "training" but pre-ignition steps. The ledger's debt column finally has a where and a when — f(m) falls with mastery and vanishes in-distribution, which is why every in-distribution debt meter read zero. Measure where the borrowing happened.

## Spend / queue
- Spend: 0 + 0 + 1 pilot + 2 grids (floor). Consumed backlog-W159 removed; spawned W176 to BACK. Backlog 17. Synthesis R28 clock: 2/5.
