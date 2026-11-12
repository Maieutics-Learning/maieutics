# Wave 224 note — backlog-W192 schedule x dose interaction (bench, executed)

STOP RULE: stopped after 18-run grid (fade@.5 + late@{.25,.5} x seeds 7-12, paired with W204) + completed 3x4 auxW×sched table. 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (w175 rig + dose param; live-page TinyNN). Clock: R34 5/5 FULL.

## Direct: headroom closes the fade gap; late needs headroom more

New arms (hard4, seeds 7-12): fade@.5 → 1/.987/.993/.83/.973/1 (mean .964, 5/6); late@.25 → .993/1/.61/.863/.497/.93 (mean .816, 2/6 — seeds 9/11 collapse even testIn .734/.438: base task unlearned, not just length); late@.5 → .99/1/.943/.963/1/.957 (mean .976, 6/6).
- (a) Headroom closes the fade gap ✓: fade−const paired diffs −.006 @.5 (0/+.094/−.007/−.153/+.023/+.007 — reshuffle again, seed10 loses under fade while seed8 wins) vs −.058 @.25 (W204). Fading is safe iff dose has headroom.
- (b) Late needs headroom MORE ✓: late−late@1 paired gaps −.177 @.25 (+.02/+.01/−.39/−.127/−.503/−.07) vs −.017 @.5. Late = extreme fade (scaffolding arrives after the window it was needed in) — predicts worse, confirmed ~10x worse.
- (c) Grid complete (hard4 means, ignite): const .902(4/6)/.984(6/6)/.970(5/6)/.955 — minimal .25; fade .925(5/6)/.964(5/6)/.948(5/6) — minimal .5 at 5/6 and never 6/6; late .816(2/6)/.976(6/6)/.992 — minimal .5. Minimal dose is schedule-ordered: const .25 < fade/late .5, and fade never reaches 6/6 at any dose.
- Seed finding: seed10 fails fade at EVERY dose (@1 .8, @.5 .83, @.25 lottery .63-class) — fade-intolerance is seed-persistent, not dose-fixable. Scaffolding-need lives in the seed, headroom only covers the marginal ones.

Verdict: USED (headroom nuance quantified + schedule-ordered minima + seed-persistent intolerance). No precursor, no conflict.

## Tangential: minima are schedules, not numbers (0-spend, reasoning only)

"Minimal sufficient dose = .25" (W204) is now wrong three ways: .25-const yes, .25-fade no, .25-late catastrophically no. Report minima as (schedule, dose) pairs and order schedules by scaffolding-generosity (const > fade > late at equal dose — late withholds when needed, fade tapers through need, const never withholds). Any future "minimal X" claim ships as a table over the withholding dimension, not a scalar. W209 chases the seed side: what makes seed10 scaffolding-needy.

## Spend / queue

- Spend: 0 + 0 + 1 grid (18 runs; floor). Consumed backlog-W192 removed; spawned W209 to BACK. Backlog 17. Synthesis R34 clock: 5/5 FULL.
- W209 (A, bench): scaffolding-need seeds — characterize fade/late-intolerant seeds across all saved grids (seed10 + any repeat losers); early-window probe for an intolerance signature (first-50-step aux-dependence?); targeted rescue (high-dose const for intolerant seeds only — does rescue beat blanket high dose).
