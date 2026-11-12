# Wave 315 note (execution; backlog-W267 rescue price curve, sandbox)

STOP RULE: stopped after price table + serves-to-finish + per-seed bisection
(9 failing cells x 300 saved seeds; receipt maxDiff 0 vs w250; bisection ==
serves_needed on 2700/2700 seeds). 1 direct + 1 tangential below. Spend: 0
search, 0 fetch (vendored w250 verbatim; deterministic recomputation on saved
seeds — no new randomness). Clock: R50 1/5. Pre-reg scored: (a) CONFIRMED-
stronger (b) REJECTED-as-stated, REFINED (c) REJECTED-as-stated, REFINED-
split (d) CONFIRMED.

## Direct: the rescue is cheap at the median and long in the tail

Price (d): wall240/wall120 = 1.00-1.08 window/decrement, 1.08-1.18 consec,
exactly 1.000 all S4 cells (nothing to rescue — zero price, already done).
12/12 cells <= 1.20. Consec premium (a): consec wall240 highest in ALL 4
cell-groups (+4 to +9.5% over the next counter: 207 vs 189.1, 220.5 vs
203.4, 120 vs 115.4, 223.2 vs 205.6) — the premium is real, uniform, and
modest. Serves-to-finish: medians 106-128 (barely over budget — the W294
story HOLDS at the median), p90 121-155, p99 136-177, max 143-198. But
(b) fails: frac>120 is 11.7-65% per cell, not <15% — only pf.02
window/decrement are under 15%; consec cells are 45-65%. And (c) fails:
min-CAP(1.000) = 143-198, not <=160 (2/9 comply); consec p99 = 157/174/177
vs the <=150 bar. The refinement both rejections force: TWO rescues, not
one — .99-rescue needs min-CAP 136-177, full rescue 143-198; the last 1%
costs +3 to +29 CAP (worst: pf.03-window 149->178). Budget 240 is generous
overkill for the median (which needs ~110-130) and exactly-right for the
tail (which needs up to 198). Bisection side-proof: literal per-seed
bisection on [1,240] equals serves_needed on 2700/2700 seeds — min-CAP is
not an approximation here, it is the order statistic of a deterministic
recomputation (max for 1.000, 99th pct for .99).

Verdict: USED with teeth (median story holds + tail story corrects it +
premium quantified + bisection proof + receipt). No precursor, no conflict.

## Tangential: report the median AND the tail price separately (0-spend)

W294's "barely over budget" (means 106-127) was true and incomplete — the
tail needs 1.5x the median's budget, and the last 1% alone costs up to +29
CAP. Any downstream rule that budgets the median fails 12-65% of trials;
any that budgets the max overpays the median by ~70%. The .99 table (136-
177) is the actionable product: budget the 99th percentile, cap-and-retry
the rest. Rule: a rescue curve is two numbers (median price, tail price),
never one. W284 anatomizes the tail (which trials need >150 serves:
phantom-clustered vs need-12-starved; cap-and-retry vs full-budget wall).
Spawned W284 (tail anatomy, zero new sims on saved seeds: serves_needed vs
phantomServes/need-12 decomposition; capped-150+retry wall vs full-budget).
