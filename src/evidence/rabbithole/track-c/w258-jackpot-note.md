# Wave 258 note (execution; backlog-W220 jackpot-timing + rate-power, bench)

STOP RULE: stopped after 64-run grid (attn h16 auxW{.5,2} x seeds 7-38, 600 steps;
l80 trajs {100,200,300,400,500} + endpoints; live-page TinyNN) + Fisher/gate/feed
analysis. 1 direct + 1 tangential below. Spend: 0 search, 0 fetch. Clock: R40 3/5.
Pre-reg scored: (a) REFINED-earlier (b) CONFIRMED-kill (c) CONFIRMED-deliverable.

## Direct: the rate gap was lottery noise; the gate opens by 300, maybe 200

Receipt first: seeds7-18 subsets match W238 EXACTLY (auxW.5 4/12, auxW2 5/12) —
same rig, same seeds, same numbers; everything else is signal.

Rate at lottery scale (b): 9/32 (.281) vs 6/32 (.188), Fisher two-sided p=.556 —
the 1-vs-5 orders, flips, and dies. W217's bonus line is now killed twice (W238's
within-grid kill + this wave's powered kill). Ordering even reversed (.5 > 2).
Jackpot rate is lottery-dominated; rate claims ship at n≥32 or as flags (W238's
rule, now with its worked example).

Timing (a): both-audits gate (feat = l80@t≥.8, pass = ratio≥2) on pooled 64 runs
(nJ=15): @200 2.80 PASS, @300 7.00, @400 16.33, @500 Inf (P(feat|F)=0 — clean
separation). W238's @200 1.91 FAIL revised upward — the fail-by-a-hair was small-n
gate noise (nJ=12 then, nJ=15 now; both small, owned). Window pins to ≤300:
decisively open by @300, marginally open at @200. W238's "later than ignition"
softens; the actionable revision: feed W198's predictor l80@300, not @400 (saves
100 steps at ratio 7.0 — @200's 2.80 is too close to the gate to trust).

Feed (c): `scratch/track-c/w220-feed.json` — 64 rows {seed, auxW, l80@{100–500},
endpoint, l10, testIn, jackpot}, 15 positives ≥ 8-bar. W198's pipeline input,
delivered.

Verdict: USED-strong (exact replication + powered rate-kill + window revision +
feed). No precursor, no conflict.

## Tangential: the gate estimate is itself a lottery count (0-spend, reasoning)

1.91-vs-2.80 at @200 across two waves is the same p≈.07-class wobble as the rate
curve — gate ratios over nJ≈12–15 carry the same lottery variance as jackpot
counts, and we nearly shipped "fails at 200" as a timing finding. Rule extension:
gate ratios ship with seed-resampled CIs (or the nJ beside the ratio) the same
way rate claims ship with n≥32. Spawned W237 accordingly (bootstrap the @200/@300
ratios + LOO predictor check on the feed: does the earlier feed cost accuracy?).

## Spend / queue

- Spend: 0 + 0 + 64 runs (floor). Consumed backlog-W220 removed; spawned W237 to
  BACK. Backlog 17. Synthesis R40 clock: 3/5.
- W237 (C, sandbox/bench-analysis, zero new sims on w220-feed): gate-stability +
  predictor check — bootstrap (seed-resample) CIs on both-audits ratio at
  @200/@300 (does @200 hold?); LOO simple-predictor AUC on feed at @300 vs @400
  features (earlier feed costs what accuracy?).
