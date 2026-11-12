# Wave 188 note — backlog-W162 detector noise-sweep (sandbox, executed)

STOP RULE: stopped after one 48-cell sweep + analysis (no follow-up runs inside this wave). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (in-page sandbox only; W168 rig rebuilt from note spec). Clock: R28 5/5 FULL.

## Direct: FA-vs-noise drowning map (48 cells: N x tau x eta x p, 300 trials/cell, 12 families)

Setup: per W168 rig — 12 families x N records; shifted fraction p per family (shifted records truly disagree); noise flips ANY vote w.p. eta; fire iff mean disagreement > tau. Plus analytic null-FA column (normal approx to Binomial(12N, eta) upper tail, continuity-corrected; `binomUp` sign bug caught pre-run: inverted z-condition mirrored the tail — fixed, fix verified by analytic-vs-empirical agreement below).

Drowning points (null-FA p0 crosses .05 / .5):
- N=20: tau=.15 drowns eta .1->.15 (p0 .01->.493); tau=.2 drowns .15->.2 (.027->.44); tau=.3 drowns ~.25->.3 (.047->.457). Rule: detector drowns when eta reaches tau.
- N=5: drowns ~.05 earlier at every tau (tau=.15: .05->.1 gives 0->.097; tau=.2: .15->.2 gives .07->.457; tau=.3: .25->.3 gives .117->.387). N=20 buys ~.05 eta headroom — averaging works, but weakly (12x records for 0.05 eta).
- p=1 column: 1.000 in all 48 cells (saturated signal never missed — ceiling, no information).

Analytic boundary validated: analyticFA within .05 of empirical p0 in 44/48 cells. Exceptions all N=5 mid-shoulder, normal approx OVERESTIMATES: (tau=.2, eta=.15) .183 vs .07; (tau=.3, eta=.25) .228 vs .117; (tau=.3, eta=.2) .038 vs .027; (tau=.15, eta=.1) .141 vs .097. Honest-toy note: continuity-corrected normal approx is fine for locating the drowning point at N>=20 but optimistic-by-~.1 (wrong direction: predicts MORE FA) at N=5 shoulders — use exact binomial there. W168 anchor reproduced: (N=20, tau=.15, eta=.1) p.1=.927 vs W168's .82, p0=.01 vs 0 — ballpark, same qualitative point (sweet spot).

SURPRISE 1 — stochastic resonance (noise AIDES detection): at tau=.15 the detector is BLIND to p=.1 shift at eta=0 (p.1=0.000 — sub-threshold mean .1 < tau .15, zero variance, never fires) and noise lifts it: eta=.05 -> .200, eta=.1 -> .927 with FA still .01. Same at tau=.2 (eta=0: 0; eta=.15: .780, FA .027). The threshold is a quantizer; noise is dither. W168's operating point (tau=.15, eta=.1) sits exactly at the resonance sweet spot — worth knowing it was luck-of-parameters, not robustness: move eta to .15 at same tau and FA goes .493.

SURPRISE 2 — N=5 "sensitivity" is a quantization artifact: p*N=.5 -> Math.round(.5)=1 shifted record -> effective p=.2 > tau=.15 -> fires always (p.1=1.000 at eta=0). Small-N detectors quantize p in units of 1/N; any p in (0, 1/2N] rounds to either 0 (blind) or 1 (alarm). Do NOT read N=5 p.1 column as sensitivity — it measures the rounding rule.

Operating rule of thumb (checked against cells): tau - eta ~= 2.5*se (se=sqrt(eta(1-eta)/12N)) holds null-FA near 0. N=20 tau=.15 eta=.1: gap .05 = 2.6se -> FA .01. tau=.2 eta=.15: 2.2se -> .027. N=5 tau=.3 eta=.25: 0.9se -> .117 (FA higher, as predicted). Spawn carries this forward.

Verdict: USED.

## Tangential: dithering analogy (0-spend, reasoning only)

Threshold detectors ARE 1-bit ADCs, and ADC practice says: add OUT-OF-BAND dither before quantizing to linearize response. Surprise 1 is exactly that — eta is dither. The principled version: INJECT calibrated noise (or equivalently, randomize tau per evaluation by drawing tau ~ Uniform(.1,.2)) to convert the blind/alarmed step into a graded response curve, then read shift magnitude off the fire-rate slope rather than a single binary fire. This reframes the detector from "alarm" to "measurement instrument." NOT validated — offered as design intuition for whoever builds the field version (W178-adjacent). Verdict: covered-by-reference (no finding claimed).

## Spawn (BACK): W179 adaptive-tau(eta) guard (sandbox) — validate tau(eta)=eta+2.5*se rule across the sweep grid; hold null-FA<=.05 over eta in 0..0.3; price detection loss at p=.1 vs best fixed tau; N in {20,5}; use EXACT binomial at N=5 per honest-toy note above.
