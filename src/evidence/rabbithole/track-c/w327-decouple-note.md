# Wave 327 note (execution; backlog-W277 decoupling probe, sandbox)

STOP RULE: stopped after per-cell slopes + ramp + dose-gap audit (zero new
sims, 23 rows; receipt exact vs w260). 1 direct + 1 tangential below.
Spend: 0 search, 0 fetch. Clock: R52 1/5. Pre-reg scored: (i) CONFIRMED
(ii) REJECTED-badly (1/5) (iii) REJECTED-inverted (iv) REJECTED-as-framed,
REFINED (v) CONFIRMED-technically, REFINED.

## Direct: the spectrum, not the split — and flat needs a level

Slopes (hard4-on-dep200): s10-const −.44 / s11-fade −.28 / s7-fade −.25 /
s7-const −.18 / s11-const +.06 / s10-fade +.04. (i) holds: s10-fade is
flattest (|.04|) and under .3. But (ii) collapses: only 1 of the other 5
clears −.3 — coupling is a SPECTRUM (cliff→moderate→mild→flat), not a
split. The disease refines to flat × LOW: s11-const is equally flat
(+.06) but healthy (.95–1.0); s10-fade is flat and failed (.80–.84).
Flatness alone diagnoses nothing — the second axis is the level. (iii)
inverts: spear(ramp,hard4) = +.30 fade vs −.02 const — neither predicts
(|.|≤.3 both), so ramp is not an address in EITHER sched (decoupling is
total, as spirit-predicted, ordering bet lost). (iv) as framed fails
(ratio 1.65×, not within 30%) but both ramps are ~0 (−2.8e-4 vs −1.7e-4,
gap 1.1e-4 ≪ dep scale): no shape difference detectable; the 30% bar was
ill-conditioned near zero (owned). (v) holds by .004: const−fade dose-gap
s10 .087 vs s11 .083 vs s7 .028 — the cliff-flat split is NOT s10-specific,
s11's fade-steepens split is 96% as big; s7 (both mild) is the odd seed.

Verdict: USED with teeth (flattest-cell confirmed + spectrum replaces
split + flat×low rule + gap generalizes to s11 + receipts; three bets
lost, all three sharpen). No precursor, no conflict.

## Tangential: multiply the axes before naming the disease (0-spend)

"Decoupled" (slope~0) looked like one thing until s11-const showed the
same slope with opposite health — one axis underdetermines the diagnosis,
and the pooled −.41 was averaging across a CLIFF (s10-const), two MODERATES,
a MILD, a HEALTHY-FLAT, and a SICK-FLAT. Rule: a slope finding ships with
the outcome level beside it (flat×low vs flat×high are different diseases
sharing a readout), and a pooled correlation ships with the per-cell
spectrum or not at all. s11-const earns the follow-up: healthy-flat needs
its own audit (which readouts, how far in dose). W294 (healthy-flat audit:
in1/in4/hard1 slopes per cell — is flat-high on all readouts; is s10-fade
flat-low everywhere; flatness contrast with level as second axis).
Spawned W294 (healthy-flat audit + readout generality, zero new sims).
