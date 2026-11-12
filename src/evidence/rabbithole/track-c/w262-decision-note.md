# Wave 262 note (execution; backlog-W223 decision-map with bands, sandbox)

STOP RULE: stopped after paired-bootstrap decision map (CRN tapes bit-exact vs
W206 digits — reproduction, zero new sims; B=1000 P(argmax) x 21 λ x 3 regimes +
B=2000 kink CIs). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch.
Clock: R41 1/5. Pre-reg scored: (a) CONFIRMED (b) CONFIRMED (c) CONFIRMED
(d) CONFIRMED (median-exact).

## Direct: the kinks are indifference points, confirmed twice

P(argmax) map (a)(b): mid fix0405 .828@.001 → K2 .95@.005 → K15 .953@.009 (all
≥.80 ✓); narrow K2 1.00@.0015, K15 1.00@.004 ✓. Between kinks confidence ≥.93;
wide K3 owns λ<.0018 (P≈1) → fix0405 owns .005+ (1.00), transition [.001,.002].

Indifference cross-check: bootstrap P(argmax) lands 50/50 within .03 at three of
four delta-method kinks (mid-.0034: .553/.446; mid-.0071: .476/.523;
narrow-.0025: .493/.507) — paired-bootstrap argmax and delta-method λ* are
independent computations that agree to the digit. Kink CIs (d): medians .0035 /
.0071 / .0009 / .0025 vs delta .0034/.0071/.0009/.0025 (three exact), widths ≈
delta 95% width. The λ* duels and the argmax map are the same object seen twice.

Tie (c): mid λ=0 is fix0510 .688 / fix0405 .312 — genuine decision uncertainty
(neither ≥.80 ✓), resolving to fix0405 by λ=.0005 (.614); dM +.0003±.0007 ns
replicates W241. The tie region is narrow but real: at exactly λ=0 the point
argmax (fix0510) wins only 69% of resamples — print the band, not the point.

fix0410: P(argmax)=0 at all 63 (λ,regime) cells — the duel-win region (λ<.0002
wide) is decision-irrelevant in probability form too. K25: 0 except a .016 blip
at narrow@0.

Products (durable, se-free): `src/evidence/rabbithole/track-c/w223-map.md`
(winner-interval map with P-bands + never-graph + kink CI ledger);
intermediates `scratch/track-c/w223-map.json`.

Verdict: USED-strong (two published products + digit-exact cross-validation +
tie resolved as narrow-but-real). No precursor, no conflict.

## Tangential: the map is the duel's apology (0-spend, reasoning only)

W241's rule ("every λ* ships with its argmax") was half the fix: the argmax is
a point, and at the kink the point is a coin flip. P(argmax) completes it —
duels inform, argmax decides, BANDS qualify. Any published decision map whose
boundaries lack confidence is a duel table with better marketing. Spawned W240
accordingly (does evidence sharpen the kinks — N scaling of the toss-up zone).

## Spend / queue

- Spend: 0 + 0 + 0 new sims (reproduction + bootstraps; floor). Consumed
  backlog-W223 removed; spawned W240 to BACK. Backlog 17. Synthesis R41 clock: 1/5.
- W240 (C, sandbox): kink-sharpness vs N — N{500,2000,8000} P(argmax) transition
  slope at the 4 kink points (does 4x data halve the toss-up zone; evidence-price
  of sharp decisions; new sims, same tapes extended).
