# F4: sharpness sweep — dose-response causal test v1.0 (PRE-COUNTERSIGNED 2026-11-21 user order; agent approval: this file)

## What do I want to find out
D/F1 show dose-RESPONSE (sharper transform output tracks bigger gain, 3/3 + 3/3).
Response is correlational (sharper weights came from bigger gaps). F4 manipulates
sharpness CAUSALLY: same filed scores (D r1 gaps s0-2), three FLOOR values
{0.05 (filed replication), 0.15, 0.30} -> three sharpness levels -> does gain
move monotonically? A monotone curve proves the transform's concentration (not
the scores' size) drives the lift.

## Research check
Nothing external: gaps/pools/tutor/held-out all filed in-repo. Proceeding.

## Design (same D machinery, floor varied, fresh draws+brains)
SCORES: filed d-r1-s{0,1,2}.json gaps (stand — no recompute).
ARMS per seed s (floor f in {0.05, 0.15, 0.30}): w = transform_floor(gaps)
(need = max(0, gap-0.30) + FLOOR=f; f=0.05 replicates D true-arm exactly).
Fresh draws per (s,f): gen strong 12930+s, detached 12940+s, base structPool
12950+s (n=300 each); draw rng 12961+s*10+fidx; students 12971+s*10+fidx.
Held-out SAME D-strong 12160 (common metric); S1 held recomputed from filed
d-s1mouth-s{s} blobs (deterministic, verifies).
BAR: gain(floor 0.05) > gain(floor 0.30) per seed, 3/3 (directional dose claim).
Descriptive: full 3-point curve per seed + pooled Spearman(gain, concentration
= max(w)).
Controls: NO unif/shuf re-run (D/F1 filed them on the same metric; F4 tests the
slope among weighted arms only — filed scope).

## Expectation (scored at verdict)
PASS 3/3 (D dose-response was monotone within every seed; causal manipulation
should reproduce it; floor 0.30 ~= near-uniform => gain ~= 0).

## Pre-mortem
Strongest objection: floor also changes WHICH cells get mass (not just
sharpness) — answered: filed as the mechanism (concentration ON the target cell
is the treatment; the curve prices it as a bundle, honestly labeled).
Most likely failure: flat curve (dose-response was gap-size epiphenomenon, not
concentration-caused) — informative kill of the mechanism claim.

## Nearest-failure
D-P4 dose-response (differs in the priced way: observational -> manipulated;
same scores, floor is the only move).

## Cost
9 mouth trains (~1 min each) + gen/evals ~ 20 min, resume-safe.

## Ledgers
src/evidence/p4/f4-f{fidx}-s{s}.json (fidx 0/1/2 = floors), f4-sweep-verdict.json.
Driver: runP4FloorSweep (reuses d-pools + L2g9 blob + 12160 held-out).
