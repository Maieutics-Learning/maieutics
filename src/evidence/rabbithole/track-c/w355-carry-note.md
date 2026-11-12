# Wave 355 (execution; backlog-W301 carryover retry, zero new sims) 2026-11-12
STOP RULE: stopped after carryover-retry recomputation (9 cells x 300 trials:
CAP=2000 full + CAP=150 probe + fresh retry + carryover retry; receipt on
wallFull/wallRetry/nGt150 vs w284). 1 direct + 1 tangential below. Spend:
0 + 0 + 0. Script scratch/track-c/w301-carry.js (w284 rig + KO/BO params,
stream-safe); grid scratch/track-c/w301-grid.json.

## Direct: the retry loss was 90%+ re-escalation; the rest is redraw

- RECEIPT: wallFull/wallRetry/nGt150 per cell vs w284-grid, maxDiff 0 —
  the carryover extends the validated chains, doesn't rebuild them.
- (a) PASS-decisively: carryover collapses the retry gap (+1.1..+29.1) to
  (+0.1..+2.0) — full/carry pairs: 207/207.1, 201.3/201.5, 203.4/203.7,
  220.5/222.2, 204.7/205.3, 205.6/206.3, 223.2/225.2. All within 1% of
  full; carryover beats fresh-retry 7/7. Mean tries = 2.0 everywhere (one
  retry suffices). The capped retry lost by re-paying the climb — keep
  the escalation and the loss nearly vanishes.
- (b) REFINED: the residual (+0.1..+2.0) is NOT overshoot — it tracks tail
  size, not maxed share (biggest residuals +1.7/+2.0 at LOWEST maxed
  .087/.07; highest maxed .33/.25 have residuals +0.3/+0.1). Kcap means
  9–10.5 (escalated, rarely maxed), so maxed-start overshoot barely occurs
  here. The residual is world-redraw cost (fresh need-12s in a new world
  + starting at climbed attempt-rates). Overshoot needs maxed-start cells
  that don't occur naturally — W318 forces them (K0=12/bias=.8 retries).
- (c) REJECTED-narrowly: carryover ≤ full in 0/7 — full wins by a nose
  everywhere (+0.1..+2.0). World-continuity beats fresh-draw +
  kept-escalation by up to 1%. The wall orders full > carryover >> retry,
  with carryover ≈ full. W315's "cap-and-retry the rest" stays scoped to
  memoryless progress AND world-redrawable tails: where the world redraws
  hard targets, even free escalation doesn't beat staying.
- Verdict: USED with teeth (w355-carry-note.md is this file). Re-escalation
  priced (90%+ of the loss) + redraw residual ≤2.0 + overshoot scoped to
  absent condition + wall ordered. Spawned W318 (forced-maxed overshoot
  pricing). Clock R56: 5/5 FULL — synthesis R57 due.

## Tangential: name what the cap keeps, not just what it throws away (0-spend)

W335 priced what the cap throws away (the climb). This wave prices what a
carryover cap KEEPS (escalation) and finds the remainder (redraw) — the
full anatomy is throw-away + keep + redraw-fresh, and each needs its own
number: re-climb +1.1..+29.1, keep-saves −90%+, redraw-costs +0.1..+2.0.
Rule: a restart policy's bill ships as three lines (discard cost, kept
capital, fresh-world tax), never one — optimizing the discard while the
fresh-world tax dominates just moves the loss. W318 prices kept-capital
abuse (forced-maxed starts).
