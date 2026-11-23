# O3 v10 — harness re-test with mined add (FROZEN for review battery)

Agent approval: this file. User countersign: program standing order 2026-11-23 (O3 pre-declared as the payoff question in filed O2 verdict reading). Scope: O3 = 3 units (zero training; restore filed cb retriever + filed O2a-mined add). Quorum 2/3; CPU-only in-worker; NO PUSH.

## Why (O2 verdict d-o2-verdict.json)
ERRMINE lifted add to 0.975–0.99 (McNemar p ≤ 0.011 all seeds). The program ceiling (T7: 0.85/0.85/0.655, mean 0.785) was add-bound (oracle 0.825–0.925). If composition is truly product-governed, swapping in the mined add must lift composed to ~0.9 on s0/s2. This is the payoff test for the whole OFF1/O2 arc — and a second independent check of product-governance.

## Design (zero training; T7-identical construction)
Per seed: restore filed d-batch2-cb (retriever, posOut[8] vhat) + filed d-o2a (mined add); 200 lines srng 52500+seed (identical lines to T7/O1/R2); report accRetrieve (vhat==v), accComposed (add on vhat), accOracle (add on true v), product = retrieve×oracle, byK. Driver: runO3Harness (r3Restore pattern, ledger d-o3-s{seed}.json).

## Bars (quorum 2/3; seed-matched vs filed T7 composed 0.85/0.85/0.655; verdict d-o3-verdict.json)
- O3-LIFT (primary): composed − t7composed ≥ +0.03 (2/3) → CEILING-MOVED else HOLDS.
- PRODUCT-CHECK (secondary): |composed − retrieve×oracle| ≤ 0.05 (2/3) → governance CONFIRMED again (descriptive if lift fails).

## Expectation (filed open)
HIT 2/3 (s0/s2 lift to ~0.9; s1 marginal — its fwd distortion shouldn't touch the composed path but filed openly as the risk). Product holds 3/3.

## Nearest-failure
- T7 (differs: ADD4 oracle → O2a-mined oracle; only the add snapshot changes).
- T8 (differs: T8 inherited a broken retriever; O3 keeps the proven cb retriever — pure add-swap isolation).

## Amendment v10.1 (pre-compute pins; blind battery 2026-11-23 — 1 CONDITIONAL strict / 1 FAIL / 1 CONDITIONAL)
- Keep +0.03 floor + add BEST-SEED-CEILING descriptive (max composed vs prior best single 0.85; R1 partial adopt).
- R2 leakage-FAIL rejected with program precedent (disjoint-rng = held-out across all 35+ units; harvest 53700 vs test 52500 disjoint).
- R3 format-perturbation queued as O4, not gating O3.
- R1b "oracle inflation" = the product hypothesis restated; product-check measures exactly that.

## Cost
0 trains + 3 harness evals, COMPLETE-gated. NO PUSH.
