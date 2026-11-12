# Wave 276 note (execution; backlog-W235 ridge-identity prospective test, sandbox)

STOP RULE: stopped after 96-world prospective grid (cap{.65,.75} x pT{.7,.8} x
4 gates x seeds 7-12, 8 m-arms) + m.9 tie-vs-loss decomposition (new + old
w218 grid, zero extra sims). 1 direct + 1 tangential below. Spend: 0 search, 0
fetch (vendored w218 semantics verbatim; m arms + {.65,.75}). Clock: R43 3/5.
Pre-reg scored: (a) CONFIRMED-with-owned-near-miss (b) REJECTED-as-stated,
REFINED (c) delivered.

## Direct: the ridge holds off-grid; m.9 splits, it does not tie

Prospective identity (a) — bestM by mean diff (hyb vs abs0), predicted == cap,
no refit. cap.65/pT.8: ridgeM=.65 EXACT (.0231 vs .0215, wins 24/24).
cap.75/pT.7: ridgeM=.75 EXACT (.0092, 16/24). cap.75/pT.8: ridgeM=.75 EXACT
(.0144, 20/24). cap.65/pT.7: ridgeM=.7, NEAR-MISS owned — m.65 +.0148 vs m.7
+.0152, margin .0004 on adjacent arms, wins 20/24 both. 3/4 exact, 4th inside
noise: the ridge is a {.65,.7}-plateau at cap.65/pT.7, not a point. Argmax is
a point estimate (cf. W218 cap.6 anchor: m.7 within noise of m.6) — identity
holds as a BAND of width ~.05, exact within it. Recovery holds off-grid
(ridge wins 16-24/24; pT.8 cleaner than pT.7 as before).

m.9 decomposition (b)(c) — REJECTED-as-stated, and the rejection corrects
W218's loose language: m.9 non-wins are 100% LOSSES, 0% ties, at all 4 new
cells (12/12 and 4/4, |diff|<=.001 tie bar) AND all 6 old-grid cells (same
0-tie split). "Converges to the baseline (ties)" was wrong — over-strictness
SPLITS (wins + small losses) with the mean still positive. No inversion
anywhere: m.9 mean diff +.0029 (pT.7) / +.006 (pT.8), >= 0 in all 10 cells.
Mechanism: m.9 is meter-blind by construction for cap < .9 (gated non-harmed
s <= cap < .9 always abstains; harmed retrieval needs r >= .857,
cap-independent) — hence m.9 rows are IDENTICAL across caps within pT. The
arm stops seeing the meter above the cap range, so its record cannot vary
with cap. Predicts its own test: at cap.9 m.9 rejoins the meter (W252).

Verdict: USED-strong (prospective identity 3/4-exact-1/4-in-noise + m.9
ties-to-losses correction + blindness mechanism with self-predicting test).
No precursor, no conflict.

## Tangential: a named thing that never occurs is a debt (0-spend, reasoning)

W218 named 28 non-wins "ties" without counting them; this wave counted and
found zero. The tie was a feeling (mean near zero) promoted to a noun. Every
wave mints such nouns — "convergence", "plateau", "blindness" — and each one
is a debt until something counts it. Rule: no mechanism noun survives first
use without a counting rule beside it (|diff|<=.001 here). W252's "rejoining"
is pre-counted the same way before it is claimed.
