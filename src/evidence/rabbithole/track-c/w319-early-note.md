# Wave 319 note (execution; backlog-W271 gate-earliness curve, sandbox)

STOP RULE: stopped after earliness curve on w220-feed (receipt .916/.907/
.908 exact; 4 levels + 3 slopes + 3 combos + 3 LOO checks). 1 direct + 1
tangential below. Spend: 0 search, 0 fetch. Clock: R50 5/5 (FULL —
synthesis R51 due). Pre-reg scored: (a)(b)(c)(d)(e) ALL CONFIRMED (5/5
clean sweep on pre-regs).

## Direct: the gate has addresses — .8-grade at 200, .9-grade at 300

Level curve: @100 .429 / @200 .812 / @300 .916 / @400 .999 (a monotone).
Earliest usable address is @200 (.812 clears .8; @100 at .429 is
actively misleading — inverted, same family as W293's @50 .292). The .9
grade needs @300 (.916 vs @200 .812 — (d) holds both halves). Trajectory
never leads (c): slope@100-200 .802 loses to level@200 .812 by .01;
slope@200-300 .710 loses to level@300 by .206; combos gain ≤ +.005 over
the closing level (.817/.852/.908 — (e)). W198 feed, final: gate on
level@200 for the .8-grade (cheapest address that clears), level@300 for
the .9-grade; skip @100 (misleads) and skip slopes (never lead); @400
.999 is the ceiling reference. Bonus methods finding: ridge-LOO @100 =
.016 (exact-0 pathology RETURNS at n=64!) vs sane @200 .732 / @300 .895.
W299's scoping needs scoping: the artifact boundary is signal-strength ×
n, not n alone — where rank itself says mush (.429), LOO pins to ~0
(slope tilt ~0, intercept anti-correlation rules alone, exactly W293's
mechanism). Artifact-check mandatory whenever rank-AUC is far from 1,
whatever n is.

Verdict: USED-strong (5/5 pre-regs + addresses pinned + combos killed
early too + artifact boundary refined + receipt). No precursor, no conflict.

## Tangential: sweep the address, not just the knob (0-spend)

This run varied WHEN, not WHAT — and the answer (.8@200, .9@300, mush@100)
is more actionable than any estimator comparison. Most gate work tunes
the classifier at a fixed address; the address curve dominates every
within-address choice (level-vs-slope gaps ≤ .2 within, address gaps up
to .57 across). Rule: before comparing features, sweep the address —
the best feature at the wrong time loses to the median feature at the
right time (level@100 .429 vs slope@100-200 .802: later window beats
better statistic). W288 autopsies the one near-tie (slope@100-200 .802
vs level@200 .812: nested or complementary jackpots; split-half
stability; @400 ceiling-vs-overfit). Spawned W288 (gate-tie autopsy +
@200/@300/@400 split-half stability, zero new sims).
