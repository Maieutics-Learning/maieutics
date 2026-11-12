# W223 decision-map with bands (log Wave 262) — winner intervals + never-graph

STOP RULE: paired CRN tapes (N=2000, bit-exact reproduction of W206 digits).
P(argmax) = paired-bootstrap fraction (B=1000) of `mean − λ·Lbar` argmax per λ.
Kink CIs = paired-bootstrap 95% of λ* (B=2000). Machine-readable: `scratch/track-c/w223-map.json` (private intermediates; this file is the public product).

## Winner-interval map (P(argmax) bands)

- wide: λ<.0018 → K3 (P 1.00 at 0, .993 at .001) → else fix0405 (P .674 at .002, 1.00 at .005+). Single kink; transition zone [.001,.002].
- mid: λ≈0 tie (fix0510 .688 / fix0405 .312 — real decision uncertainty, resolves by .0005) → fix0405 (.828–.965 up to .002) → λ* .0035 [.0024,.0054] → K2 (.95 at .005) → λ* .0071 [.0056,.0093] → K15 (.953 at .009, 1.00 at .012). Double kink; mid-interval confidence ≥.93.
- narrow: fix0405 (.961 at .0005) → λ* .0009 [.0006,.0012] → K2 (1.00 at .0015) → λ* .0025 [.0021,.0029] → K15 (1.00 at .004+). Double kink; intervals razor-sharp.
- Indifference cross-check: P(argmax) ≈ 50/50 EXACTLY at three of four delta-method kinks (mid-.0034: .553/.446; mid-.0071: .476/.523; narrow-.0025: .493/.507) — two independent methods agree to the digit.
- fix0410: P(argmax) = 0 at every λ, every regime — decision-irrelevant (duel wins moot). K25: 0 except narrow@0 blip .016.

## Never-graph (A>B = A dominates B both legs 2se; se-free)

- wide: fix0405>fix0510, fix0405>adaptK2, fix0405>adaptK15, adaptK3>fix0410.
- mid: fix0405>fix0410, fix0405>adaptK25, fix0405>adaptK3, fix0510>fix0410, fix0510>adaptK25, fix0510>adaptK3, adaptK2>fix0410, adaptK25>fix0410, adaptK25>adaptK3, adaptK3>fix0410.
- narrow: fix0405>fix0410, fix0405>adaptK3, fix0510>fix0410, fix0510>adaptK3, adaptK2>fix0410, adaptK25>fix0410, adaptK25>adaptK3, adaptK3>fix0410.

## Kink CI ledger (bootstrap med [95%] vs delta-method point±se)

- mid K2-vs-fix0405: .0035 [.0024,.0054] vs .0034±.0007 ✓
- mid K15-vs-K2: .0071 [.0056,.0093] vs .0071±.0009 ✓ (median exact)
- narrow K2-vs-fix0405: .0009 [.0006,.0012] vs .0009±.0002 ✓ (median exact)
- narrow K15-vs-K2: .0025 [.0021,.0029] vs .0025±.0002 ✓ (median exact)
- mid λ≈0 tie: dM fix0510−fix0405 = +.0003±.0007 (ns, replicates W241)
