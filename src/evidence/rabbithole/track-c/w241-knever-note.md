# Wave 241 note — backlog-W206 k-ladder completion + never-graph (sandbox, executed)

STOP RULE: stopped after full-pairwise CRN rerun (7 policies x 3 regimes x 2000 trials on regenerated W189 tapes + 126 ordered-pair λ*/never cells + argmax winner intervals). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (vendored w189 rig; tapes bit-reproduce W221 — vsFix0405 rows match to the digit). Clock: R37 4/5.

## Direct: 126-cell map; never-graph published; winner intervals have one kink (wide) or two (mid/narrow)

- Receipt: tape regeneration is bit-exact — all 18 vsFix0405 rows reproduce W221 digits (e.g. wide fix0410 .7551/7.31, mid-K2 λ* .0034±.0007, narrow-K25 λ* −.0003). The 126 ordered pairs are computed on the same tapes, so every leg below is paired (se .0005–.0010).
- Never-graph (A>B = A dominates B both legs 2se; B never beats A — the se-free product):
  - wide: fix0405>fix0510, fix0405>adaptK2, fix0405>adaptK15, adaptK3>fix0410.
  - mid: fix0405>fix0410, fix0405>adaptK25, fix0405>adaptK3, fix0510>fix0410, fix0510>adaptK25, fix0510>adaptK3, adaptK2>fix0410, adaptK25>fix0410, adaptK25>adaptK3, adaptK3>fix0410.
  - narrow: fix0405>fix0410, fix0405>adaptK3, fix0510>fix0410, fix0510>adaptK3, adaptK2>fix0410, adaptK25>fix0410, adaptK25>adaptK3, adaptK3>fix0410.
- K15 all-regimes COMPLETE (the chartered gap): wide NEVER (dominated by fix0405: −.0336/−1.16); mid clears iff λ>.0055±.0005 (fastest Lbar 9.02, lowest mean — the impatience-lover's policy); narrow clears iff λ>.0018±.0001 (fastest Lbar 12.07). K15 is fastest everywhere except wide and wins only at high λ — speed without accuracy, priced exactly.
- Fixed-vs-fixed legs (chartered): wide fix0410 leads mean .7551 vs .7545 (+.0006±.0005) at worse Lbar (7.31 vs 4.76) → beats fix0405 only iff λ<.0002±.0002 — and that region belongs to K3 (adaptK3>fix0410 edge), so fix0410 is never the argmax anywhere. fix0510 dominated by fix0405 in wide, tied (dM ns) mid/narrow. fix0405 is the fixed-family champion in every regime — the wide "lead" was real decimals, zero decision.
- Winner intervals (argmax of mean−λLbar; kinks at paired λ*):
  - wide: λ<.0018 K3 → else fix0405. Single kink (same shape as W221's kink, K3 decimal .0018±.0004 reproduced).
  - mid: λ≈0 fix0510/fix0405 tie (dM +.0003 ns) → fix0405 → (λ* .0034±.0007 vs fix0405; .0024±.0004 vs fix0510) K2 → (λ* .0071±.0009 vs K15) K15. DOUBLE kink. K25 never (NEVER vs both fixeds), K3 never, fix0410 dominated by everyone.
  - narrow: fix0405 → (.0009±.0002) K2 → (.0025±.0002 vs K15) K15. DOUBLE kink. K25 never for λ≥0 (λ* −.0003; mean leg 1.8σ — threshold-negative, not both-legs), K3 never, fix0410 dominated by all.
- K25-minimax obituary, all regimes: wide tie-ish (λ*≈+.0001, dM ns — never argmax: K3 owns λ<.0038); mid NEVER both fixeds; narrow never for λ≥0. Dead everywhere, third sighting, strongest form.

Verdict: USED with teeth (126-cell completion + se-free graph + two double-kinks + fixed-champion + K15 priced). No precursor, no conflict.

## Tangential: pairwise wins without argmax context mislead (0-spend, reasoning only)

fix0410 "beats fix0405 in wide" (λ<.0002) is true and decision-irrelevant — K3 beats both there. A λ* threshold says who wins a duel; only the argmax says who to run. Rule: every reported λ* ships with the argmax of its winning region ("K3 owns λ<.0018 wide, so fix0410's λ<.0002 is moot"). Duels inform, argmax decides — print both, lead with the argmax.

## Spend / queue

- Spend: 0 + 0 + 1 CRN grid (21 cells x 2000 trials + 126 pairwise cells, all paired on one tape set; floor). Consumed backlog-W206 removed; spawned W223 to BACK. Backlog 17. Synthesis R37 clock: 4/5.
- W223 (C, sandbox): decision-map with bands — P(argmax) per λ on the W206 tapes (paired, zero new sims): mid double-kink (.0034/.0071) and narrow double-kink (.0009/.0025) with boundary CIs; λ≈0 tie region (fix0510 vs fix0405 mid); publish winner-interval map + never-graph as the two se-free products.
