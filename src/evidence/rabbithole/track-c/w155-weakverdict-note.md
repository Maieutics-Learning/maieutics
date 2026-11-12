# W155exec — weak-strength verdict policy (A; backlog-W134)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 sandbox decision analysis, floor)
- Setup: W134's calibration as likelihoods — in-band (p<0.05 & rho<0.5) at N=20: P(band|null)=0.04, P(band|weak)=0.95, P(band|mid)=0.08, P(band|strong)=0. Priors {null .5, weak .3, mid .15, strong .05} → posterior in-band: 90% weak, 6% null, 4% mid. The band is a nearly-pure weak detector — significance-without-magnitude isolates emerging compositionality, not noise.
- Policy costs: binary-in-band ("holistic") abandons 90%-weak lines: +5.3 expected; ternary ("emerging" → cheap hedge probe): −2.8 (the probe pays for itself). Ternary dominates for ALL nonnegative abandon costs — the dominance condition reduces to "the hedge probe has any value at all". Binary is optimal only if followups are worthless AND abandonment is free, i.e., when no verdict is needed anyway.
- Prior-robustness: null prior 0.5→0.9 keeps weak-majority in-band (64%); ternary holds until weak lines are ~50× rarer than nulls. Adopted: ternary verdict (compositional / emerging / holistic) with the emerging band defined as (p<0.05 & rho<0.5) at N≥20; no-verdict below N=20 (W134's power floor).
- Verdict USED (ternary + dominance proof + robustness). No precursor, no conflict. Hedge-probe design (the cheap action the "emerging" verdict buys) spawned W151.

## Tangential (reasoning, 0 spend)
- Binary verdicts force a tax on the middle: every weak line pays either abandonment or overconfidence. The third verdict isn't indecision — it's the only decision priced for what the band actually contains (90% promise, 6% noise). Two buckets for three populations is a rounding error with consequences.

## Spend / queue
- Spend: 0 + 0 + 1 decision analysis (floor). Consumed backlog-W134 removed; spawned W151 to BACK. Backlog 17. Synthesis R23 clock: 2/5.
