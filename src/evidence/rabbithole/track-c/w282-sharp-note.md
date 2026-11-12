# Wave 282 note (execution; backlog-W240 kink-sharpness vs N, sandbox)

STOP RULE: stopped after N{500,2000,8000} P(argmax) grid (same-tapes-extended
to 8000; N=2000 subset == W206 tapes; relative λ ladder ×{0.1..4} at the 4
delta kinks; B=1000 paired bootstrap). 1 direct + 1 tangential below. Spend:
0 search, 0 fetch. Clock: R44 3/5. Pre-reg scored: (a) CONFIRMED-stronger
(b) REJECTED-decisively (c) CONFIRMED-fully.

## Direct: zones halve per 4x — then the kinks resolve

Receipts (c): N=2000 cells reproduce w206-grid EXACTLY (maxDiff 0); N=2000
P(argmax) reproduces w223-map within .02 at all 4 kinks (.539/.466/.470/.487
vs .553/.476/.489/.493). Same tapes, same numbers, 4x the headroom.

Halving (a): toss-up zone (log10-width where neither contender reaches
P≥.93) — N500→N2000 ratios .52/.38/.45/.49 (4/4 in [.3,.7] ✓); N2000→N8000
.47/.57/.56 (3/3 ✓) + narrow.0025 resolved past the ladder (zone → 0).
4x data halves the toss-up zone, twice in a row, at all four kinks — then
the second 4x annihilates one outright. 1/√N holds as a law, not a trend.

Resolution (b) REJECTED: at N=8000 the kink point itself leaves the zone at
all four kinks — max P at λ=kink: .983/.958/.966/.961. The coin flip was
SE, not population: with 4x the evidence every chartered kink resolves into
a winner. And all four resolve the SAME way — toward the above-kink winner
(K2/K15/K2/K15), i.e. the true indifference points sit slightly BELOW the
chartered decimals (inside their delta-CIs). The decimals were estimates;
N=8000 can see their error bars from the inside.

Verdict: USED-strong (halving law ×8 ratios + kink-resolution ×4 + double
receipt). No precursor, no conflict.

## Tangential: precision doesn't sharpen the point, it moves it (0-spend)

The hope behind (b) was that more data sharpens the kink in place. It does
the opposite: the kink stays sharp while its ADDRESS moves — precision
relocates, it doesn't confirm. Every chartered decimal should therefore
ship its detection-N beside it (".0034 @N2000, resolves by N8000").
W257 pins the population addresses. Rule: a threshold without a stated
detection-N is a rumor with confidence intervals.
