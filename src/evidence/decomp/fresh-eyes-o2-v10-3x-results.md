# Fresh-eyes battery — O2 v10 spec (3 sealed reviewers, verbatim)

## R1 (harvest-stability)
VERDICT: CONDITIONAL. Fix: Extend O2a stage-1 to 800 steps to ensure harvested errors are systemic, not transient noise.

(a) Double bar is right; the 1.0 obo-baseline is a noise-spike, making the 0.10 drop requirement a realistic threshold for genuine shift.

(b) Fixing dose at 300 lines via substitution successfully isolates composition effects from total volume.

(c) Rival: The "hard" set in O2a may trigger a collapse in generalizability rather than a specific representational shift, mimicking the WRAPDOSE effect.

## R2 (skew/strictness)
VERDICT: CONDITIONAL. Fix: Recalibrate obo-drop threshold; 0.10 is too lax given s0 noise.

(a) Too lax. The obo-drop requirement is trivialized by s0's 1.0 noise; a 0.10 drop is statistically invisible.

(b) No. Fixing dose at 300 lines via substitution preserves total volume but doesn't isolate composition if the harvested errors in O2a introduce systemic bias.

(c) Distributional collapse: 75% wrap-case substitution creates a skewed boundary-density that likely triggers the K3R poison-skew, making the "hit" a result of data pathology rather than principled representation.

## R3 (power)
VERDICT: CONDITIONAL. Fix: Increase n to 1000+ per arm; current SE(~0.03) renders a +0.03 lift statistically invisible.

(a) Double bar is too strict; the OBO drop is meaningful, but the lift is buried in seed noise.

(b) Substitution at 300 lines fails to isolate composition because it alters the local gradient density/distribution of the "wrong" samples.

(c) Rival: Sample-efficiency bias (the 100 harvested lines may be "easier" to correct than random errors, inflating lift).

## Adjudication (agent, filed as v10.1)
- ADOPT (R1): O2a stage-1 400 → 800 steps (harvest must be systemic; +400 steps × 3 is cheap; stage-2 dose stays fixed so the dose argument is untouched).
- ADOPT in modified form (R2 strictness + R3 power): per-seed obo-drop stays descriptive; binding condition becomes POOLED obo-drop ≥ 0.10 (answers s0-noise laxity without moving the number). Lift stays +0.03 but analysis becomes PAIRED: O2 arms eval on the identical 200 oracle lines as filed ADD4/O1 (same srng construction) — McNemar on discordant pairs reported per seed; paired design is the power fix.
- REJECT (R3 n=1000): 5x eval compute for an independent-SE framing when the design is already paired (same 200 lines). Filed openly; if paired McNemar is borderline, n-stays-200 is reported as the limit, not patched by brute force.
- NOTED (R2c poison-skew + R1c collapse + R3c easy-hard): all three are what the double bar + fwd distortion watch exist to catch — a pathological "hit" (oracle up, fwd collapsed) trips the watch and is filed as DISTORTED, not a win.
