# Wave 278 note (execution; backlog-W237 gate-stability + predictor check, sandbox)

STOP RULE: stopped after zero-new-sim analysis on w220-feed.json (64 rows,
15 positives): B=2000 bootstrap on both-audits ratios @200/@300/@400 + LOO
1-feature logistic AUC @200/@300/@400. 1 direct + 1 tangential below. Spend:
0 search, 0 fetch. Clock: R43 FULL (5/5 — synthesis next). Pre-reg scored:
(a) CONFIRMED (b) REJECTED-narrowly (c) REJECTED-inverted.

## Direct: the gate holds early and strengthens late — no free early lunch

Point ratios (feat = l80@t>=.8): @200 2.80 (P(feat|J)=.80, P(feat|F)=.286);
@300 7.00 (1.0/.143); @400 16.33 (1.0/.061). Bootstrap 95% CIs: @200
[1.72,5.03] P(<1)=.0005 — (a) CONFIRMED, the @200 gate excludes chance
comfortably. But selectivity is monotone in time: CIs @200/@300/@400 do not
overlap ([1.72,5.03] vs [4,17.67] vs [7.29,52]) — failures wash out
(pF .286→.143→.061) while jackpots saturate (pJ=1.0 by @300). (c) REJECTED:
ratio@200 (2.8) < ratio@300 (7.0), inverted as stated — the early gate is
real but the late gate is far stronger.

LOO AUC: @200 .732 → @300 .895 → @400 .970. (b) REJECTED-narrowly: @300
costs .075 vs @400 (bar was .05) — each 100 steps back costs .07-.16, graded
not free. @300 remains a good operating point (.895) but the check prices it
honestly: early feed costs real accuracy.

Verdict: USED with teeth (gate-stability confirmed + two owned rejections
that sharpen the claim into monotone selectivity with priced early cost). No
precursor, no conflict.

## Tangential: price the operating point, don't crown it (0-spend, reasoning)

@300/AUC.895 tempts "the @300 gate" as doctrine — but doctrine needs a price
tag (compute saved vs .075 AUC lost), and this wave priced only the accuracy
half. A gate is an operating point on a cost curve, not a finding about the
world. Rule: whenever a wave anoints a threshold, the child wave brings the
other axis (here: slope-vs-level — is the gate about where you are @300, or
how you got there? W254 asks with zero new sims).
