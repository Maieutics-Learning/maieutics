# Wave 324 note (execution; backlog-W275 churn census, sandbox)

STOP RULE: stopped after full D-ladder class-track census (20 cells x 6
delays, validated barL/barH rule; receipt exact vs w258). 1 direct + 1
tangential below. Spend: 0 search, 0 fetch. Clock: R51 4/5. Pre-reg
scored: (a) CONFIRMED (b) REJECTED-narrowly, REFINED (c) REJECTED-
narrowly, REFINED (d) CONFIRMED.

## Direct: churn passes through; one cell never comes back

Tracks (D0,1,3,6,12,25): never-dip 10, dip-once 8, dip-twice 1
(0.35/0.2: D3+D25, re-admitted between), persistent 1 (0.2/0: D6+D12+D25,
never re-admits). (a) once(8) > twice+persistent(2) holds 4:1. (b) misses
by one: exactly ONE persistent cell exists — 0.2/0, late-onset (level
through D3, falls at D6) and never returns; it alone accounts for BOTH
non-readmits. (c) 6/8 = 75% vs the 80% bar — ex-0.2/0, re-admission is
6/6 = 100%: every passing-through dip re-admits at the very next delay.
The census sharpens W304's tangential to a number: churn = pass-through
(8 once + 1 twice-with-return) plus a singleton absorber (0.2/0). D25-
terminal dips (0.1/0.05, 0.1/0.35, 0.2/0.1 + 0.2/0) are censored — no
later D measured. (d) Geography holds: 8/10 ever-dipped have r>=.2;
the two low-r dippers (0.1/0.05, 0.1/0.35) are both D25-terminal singles.
Churn lives on the high-r edge, and the edge's interior (0.2/0) holds
the one absorber.

Verdict: USED with teeth (pass-through quantified + absorber isolated +
censoring flagged + geography confirmed + receipt; two bars missed by
one cell). No precursor, no conflict.

## Tangential: name the absorber, censor the terminal (0-spend)

The census upgraded "no weak set" to "one absorber + pass-through flow":
a roster with exactly one permanent entry is a rate with an exception,
and the exception (0.2/0) is now the most interesting cell on the board
(is it degen-forever or slow-return? D50 decides). Rule: a census that
finds ~1 persistent item has found its next experiment — don't average
the absorber into the flow (6/8) or drop it for the clean number (6/6);
report both, then go measure the absorber. The four D25-terminal dips
are right-censored, not resolved — W292 must say so before counting
them as returns. W292 (margin-rank forward prediction, zero new sims:
D3 margins rank D6 dippers? D6->D12? D12->D25? is .887 a one-step
predictor at every step). Spawned W292 (forward-rank audit + absorber
watch: which step's margins predict best; 0.2/0 margin trajectory).
