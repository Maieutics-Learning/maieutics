# Composite extras v10 — price / capacity / fade / select-washout (post-verdict)

Agent approval: this file. User countersign: 2026-11-23 composite program (≤5 post-verdict).

## Why
v10.1 verdict RETAINS-BUT-CAPPED: retention solved (A−B fwd +0.66..+0.70), no tax, but reverse ~0.75 in ALL arms (= bottleneck K4 baseline → capacity, not interference); CE-select decorative at 7900 steps (A−C ≈ 0). Four targeted follow-ups:

- E1 PRICE-OFF (arm d: R1 gates + R2 6 CE-reverse + 2 replay, NO price). Bar PRICE-HOLDS: A rev − D rev ≥ +0.05, 2/3 (price carries R2 skill) — or D fwd − A fwd ≤ −0.05 (price carries retention); either HIT counts, both reported. Expectation open.
- E2 CAPACITY (arm a at K=8/sig0.5, own rng streams). Bar CAP-LIFTS: K8 rev ≥ K4 rev + 0.05, 2/3 AND K8 BOTH-HELD (fwd ≥ 0.80 & rev ≥ 0.80, 2/3). Expectation HIT (kcliff K-dose gradual).
- E3 FADE-LOADED (arm e: like A, price weight 1→0 linear over R2). Bar FADE-KEEPS: E rev ≥ A rev − 0.05, 2/3 (fading a USED channel differs from Lane1's vacuous fade). Expectation HIT.
- E4 SELECT-SHORT (arms a-short vs c-short: R2 capped 800 steps, all else v10.1). Bar SELECT-SHORT-HELPS: A rev − C rev ≥ +0.05, 2/3 (L3-X3 retest: select matters when training is short). Expectation HIT — washout hypothesis says select accelerates only.

## Cost
E1 3 + E2 3 (wider net, similar) + E3 3 + E4 6 = 15 trains, split across calls, COMPLETE-gated. Ledgers `d-composite-{d,K8,e,ashort,cshort}-s{seed}.json` + evals + verdict. NO PUSH.
