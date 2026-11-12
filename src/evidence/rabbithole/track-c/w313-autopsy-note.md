# Wave 313 note (execution; backlog-W266 ignition-predictor autopsy, sandbox)

STOP RULE: stopped after lam-ladder + agreement + subsample-min-n on w232
grids (receipt 0 vs w249 lam1/10; 72 LOO fits + 180 subsampled LOO-AUCs).
1 direct + 1 tangential below. Spend: 0 search, 0 fetch (vendored w249
verbatim). Clock: R49 5/5 (FULL — synthesis R50 due). Pre-reg scored:
(a) CONFIRMED (b) CONFIRMED-upgraded (c) CONFIRMED (d) CONFIRMED after
honest degeneracy correction (raw said 31, corrected 70 — both reported).

## Direct: regularization cannot fix an evaluation disease; min-n is 70-193

Ladder zero-cells (/9): lam 0→6, 0.1→6, 1→6, 10→8 (b). The zeros do not
vanish — they PERSIST flat then WORSEN: at lam=10 the slope is strangled
so held-out probs are intercept-only, and the intercept anti-correlation
acts PURELY (exact-0s at @100 both features, all lam — rank there is .471
mush, yet LOO reports confident 0). Mechanism sharpened beyond W293: the
penalty doesn't fail to cure the disease, it isolates the pathogen.
Agreement (c): mean|ridgeLOO−rank| = .340/.342/.349/.370 — flat then worse
at lam=10, never below .15 anywhere; ridge never converges to rank because
the slope instability is penalty-independent (prePos counts: @100 just
2/32 positive slopes at every lam — the folds agree with each other and
disagree with the data). Min-n (d): raw c/sqrt(n) fits give 193/31/192 —
but the @100 nsub=16 IQR=0 is degeneracy (median LOO pinned at 0 across
all 20 draws: constant, not stable). Excluding iqr==0 cells: 193/70/192.
All > 32: a fitted ignition predictor is disqualified on the W198 feed at
every K; only ranks survive (rank IQR at nsub=24 is .07-.11 vs fit
.18-.26 — ranks are already stable where fits need 3-6x the sample).

Verdict: USED-strong ("just regularize" killed with a ladder + pathogen
isolation + quantified min-n + rank/fit stability split + receipt). No
precursor, no conflict.

## Tangential: a pinned metric is not a stable metric (0-spend)

The nsub=16 @100 IQR=0 looked like perfect stability and was exactly the
opposite — every subsample agreed on AUC=0.000, the artifact value. Rule:
an IQR of zero (or any suspiciously clean number) on a known-pathological
estimator is degeneracy until proven otherwise; always report the median
beside the spread (medLOO=0 exposed it instantly). This is the same family
as W293's exact-0 confession: the harness speaks in constants when it is
broken, and constants are cheapest to check. W283 tests the remaining
W293 suggestion — fixed-intercept/slope-only LOO (does removing the rigged
intercept close ridge-rank agreement; do zeros vanish; min-n recompute).
Spawned W283 (fixed-intercept + slope-only LOO x K on w232; agreement vs
.34-.37 baseline; zero-count vs 6-8 baseline; min-n vs 70-193 baseline).
