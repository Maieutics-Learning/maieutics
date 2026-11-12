# Wave 208 note — backlog-W178 OBF-2 field test (analysis, executed)

STOP RULE: stopped after banked-data sequential audit (24 masked W177 runs as arrival stream + 10k-permutation Monte Carlo; no new bench runs; power-under-futility arms — spawned W195, not built). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (disk data only). Clock: R32 1/5. Pre-registered predictions scored: (a) CONFIRMED-illustration (b) CONFIRMED (c) CONFIRMED-with-nuance (d) receipt delivered.

## Direct: OBF-2 never hallucinates on real bench data; naive peeks do

Procedure (adopted VERBATIM from W161/W187): two-sided OBF-2, looks at info fractions [0.5, 1.0] (n=6/arm interim, n=12/arm final), z-bounds [2.797, 1.977], Welch z on hard@1000 gap (h16−h24). Small-n approximation owned — the bounds are z-bounds and the adopted procedure runs as-is; the field test tests the adoption, not a repaired version.
- (a) Chronological illustration (observed history, post-hoc by construction): interim z1 = −1.25 (|·| < 2.797 → continue, correct); final z2 = −0.78 (|·| < 1.977 → no claim, correct null close). The live demo behaves.
- (b) Validity on lumpy bench data ✓: 10,000 arrival permutations → OBF-2 tax claims 0.0000, reverse claims 0.0000, interim stops 0.0000. Zero hallucinations in 10k reshuffles of heavy-tailed data (laggards s10/s15 included in every shuffle pool). Adoption receipt signed on real data, not just the normal sandbox.
- (c) Ban demo ✓-with-nuance: naive (one-sided z1 > 1.645 at interim) claims tax in 0.0091 (91/10000) — strictly more than OBF-2's zero (≥2× criterion met literally). Nuance owned: the stream is null-ish so both rates are low; the reading is the PAIR (0 vs .0091): peeking has a price (~1 hallucinated tax per 110 replications) and OBF-2 doesn't pay it. W167/W187 ban re-confirmed on bench substrate, now with a magnitude.
- (d) Futility curve, binding |z1| < T → stop and accept null: T=0.5 → E[n] 20.2; T=1.0 → 15.3 (−36%); T=1.5 → 12.6 (−48%); tax-claim rate 0.0000 at all three (null stream — futility can't hallucinate what it refuses to test). Chrono |z1|=1.25: T=1.0 continues it, T=1.5 stops it. Power cost under REAL effects unmeasured — efficacy-only adoption stands; the futility amendment needs its own calibration → W195.
- E[n] footnote: efficacy-only OBF-2 used all 24 runs on every permutation (meanN 24.0) — under a null stream looks are pure cost. W187's regime map said exactly this (FIXED wins under null); the field test confirms the map's null row on real data.

Verdict: USED (adoption holds on bench substrate; ban re-confirmed with magnitude; futility engineering numbers delivered). No precursor, no conflict.

## Tangential: field-test the adopted procedure verbatim, warts and all (0-spend, reasoning only)

The small-n z-approximation, the fixed textbook-ish bounds, the efficacy-only rule — all ran unmodified. A field test that "fixes" the procedure before testing it tests nothing; deviations get their own waves (W195 owns futility). Counterpoint owned: verbatim includes known-ugly parts (z at n=6/arm) — that IS the receipt's value. If the adoption survives its ugly parts on hostile data, it survives anywhere in-scope.

## Spend / queue

- Spend: 0 + 0 + 1 analysis (10k-perm Monte Carlo on banked trajs, instant; floor). Consumed backlog-W178 removed; spawned W195 to BACK. Backlog 17. Synthesis R32 clock: 1/5.
- W195 (B, sandbox): binding-futility calibration — OBF-2 + futility T in {.5,1,1.5} x effects {0,.4,.8} in the W161 normal sandbox; power cost + E[n] savings; adopt/reject futility amendment (binding vs non-binding).
