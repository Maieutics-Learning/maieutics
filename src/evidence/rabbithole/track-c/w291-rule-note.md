# Wave 291 note (execution; backlog-W247 rule-repair, sandbox)

STOP RULE: stopped after k-repair grid (per-N flat-c + single-k combination
fits on match.05, held-out test on match.15, DET on both; 12 cells + receipts).
1 direct + 1 tangential below. Spend: 0 search, 0 fetch (vendored w230
verbatim; receipt maxDiff 0). Clock: R46 1/5. Pre-reg scored: (a) CONFIRMED
(b) CONFIRMED (c) CONFIRMED (d) REJECTED-as-stated, REFINED-honestly.

## Direct: one k covers both noises; the N problem was a missing term

Fits (on match.05): flat-per-N constants c_5 = c_20 = 2.5 (a) — the SAME
constant, which rediscovers fixk25 exactly. Combination single-k = 2.5 too
— both repairs land on 2.5, which is either a coincidence or the problem
telling us the constant was never the issue. It wasn't: c(N)? answered NO.
The old rule's N-scaling failed because its margin covered burn-in noise
(M) only; adding the deployment term (seBI²+seDEP²) fixes N with ONE k.

Validity: combo holds FA≤.05 in 12/12 cells (fit 6/6 + held-out 6/6, max
.033) (b)(c) — old rule holds 7/12 (fails 5/6 N5 cells); flat-2.5 holds
11/12 (single hole: match.15-N20-M180 .073, now precisely located). The
repaired rule is combo-2.5: valid at both N, both regimes, both timings.

Sharpness (d): as-stated 8/12 (misses −.19/−.33/−.33/−.16) — but three
misses compare against INVALID old-rule cells (FA .087–.163: cheating
baseline, W270's own fallacy — void comparison). Honest count on valid-old
cells: 5/7 within −.05, plus 2 genuine dirty-regime costs (match.15:
−.186/−.163). Combo even BEATS old DET in 3 valid cells (+.067/+.146/+.014
— reallocation, not uniform conservatism). Price tag printed: full validity
(12/12 vs 7/12) costs −.16/−.19 DET in 2 dirty cells, parity-or-better in
5 of the other 7 valid cells. Flat-2.5 stays on the menu as sharper-but-
holey (11/12); combo is crowned for validity.

Verdict: USED-strong (single-k repair + c(N)=NO + honest DET price +
flat-hole located + receipt). No precursor, no conflict.

## Tangential: the constant that fits twice is the form confessing (0-spend)

c_5 = c_20 and k_combo = 2.5 — three fits, one number. When every
parametrization returns the same constant, stop fitting constants: the
remaining error is in the FORM (here: the missing noise term), and the
constant was always fine. W264 tests the repaired form's jurisdiction
(combo-2.5 at N{10,40} — inside or outside? the rule's subscripts name its
borders now, on purpose).
