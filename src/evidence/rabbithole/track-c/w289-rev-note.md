# Wave 289 note (execution; backlog-W246 reverse-handling, sandbox)

STOP RULE: stopped after 32-cell per-trial counterfactual (2 sub × 2 timing ×
4 deltas × 2 policies, N=20000, W229 bit-identical trials + interim-reverse
stop-accept branch). Zero new sims (same seeds, new recording). 1 direct + 1
tangential below. Spend: 0 search, 0 fetch. Clock: R45 4/5. Pre-reg scored:
(a) CONFIRMED-zero (b) CONFIRMED-32/32 (c) CONFIRMED-to-rounding
(d) CONFIRMED.

## Direct: continuation is pure cost — amend the rule to stop-accept

P(final claim | interim reverse) = EXACTLY 0 in all 32 cells (convN = 0/640k
trials; at null, 1044 tax-I6 revCont trials convert zero). (a) CONFIRMED at
the floor. Stop-accept loses zero claims in 32/32 cells (b) — the swing from
z1<−2.797 to z2>+1.977 with half the data shared is a structural zero, not
a sampling one. E[n] savings match W269's accounting to rounding (0.627 vs
0.626; 1.075 vs 1.075) (c) — the moved-trial price is exact, again.
Reverses exist only at null (revCont .013–.052) and trace at δ=.5 (≤.0013);
at δ≥1 none anywhere (d) — the question is moot where effects live.

Rule amendment (deliverable, v2 of W269's statement): on interim reverse
(z1<−B1) STOP and accept null (n=2·ni) instead of continuing. Price: −0.3 to
−1.1 E[n] at null vs continue (the whole old surcharge, recovered); power
cost: literally zero (32/32 cells, 640k trials). Futility interplay: none
(reverses never touch the |z1|<1 band; both policies identical). The old
"reverse excursions continue, unclaimed" line is superseded — continuation
bought nothing and its price is now refunded.

Verdict: USED-strong (audit → amendment: zero-cost proven, statement v2
shipped). No precursor, no conflict.

## Tangential: a zero over 640k trials is a license, not a number (0-spend)

P=0/1000 is evidence; P=0/640000 with a structural reason (shared-half
anchoring) is a license to change the rule without a confirmatory trial.
The difference matters: licenses close questions (amend now), numbers
defer them (confirm later). W263 is deliberately a confirmation anyway —
not because the license is weak, but because the amended rule's exact
statement numbers (claim ≤.013? savings = futility + reverse?) should be
printed once, from a run, not derived. Licenses authorize; confirmations
inscribe.
