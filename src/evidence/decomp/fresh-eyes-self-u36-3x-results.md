# Fresh-eyes battery: self-u36-diverse-dynamic-prereg.md (3x sealed, this session)

## R1 (verbatim)
GOAL: Test if a diverse training diet combined with a dynamic (oscillating) scorer improves composition retrieval (two-hop) over a diverse diet with a static scorer.

IMPLEMENTABLE: yes

CONFOUNDS: none

MISSING: none

VERDICT: IMPLEMENTABLE

PATCHES: none

HEALTH: goalInAll=yes barsExact=yes streamsPinned=yes noComputeWithoutCountersign=yes

## R2 (verbatim)
GOAL: Test if a diverse training diet combined with a dynamic (oscillating) scorer improves composition performance (U36-COMPOSE) compared to a static scorer on a diverse diet.

IMPLEMENTABLE: yes

CONFOUNDS: none (Twin-matched seeds across c0/c1 and fixed H48 architecture isolate the dynamic scorer as the sole variable).

MISSING: none

VERDICT: IMPLEMENTABLE

PATCHES: none

HEALTH: goalInAll=yes barsExact=yes streamsPinned=yes noComputeWithoutCountersign=yes

## R3 (verbatim)
GOAL: Evaluate if a diverse training diet and a parameter-free oscillating inhibition scorer can break the "compose wall" in an H48 model.
IMPLEMENTABLE: yes
CONFOUNDS: none
MISSING: none
VERDICT: IMPLEMENTABLE
PATCHES: none
HEALTH: goalInAll=yes barsExact=yes streamsPinned=yes noComputeWithoutCountersign=yes

## Adjudication (same session): v1.0 STANDS (no pins, no bar change)

3x IMPLEMENTABLE unanimous, 12/12 HEALTH, no converging confound. Single-variable split (c0 diverse+static vs c1 diverse+dynamic) isolates dynamics; diet-mix/schedule fixed per L2/L3; H48 keeps in-memory cost at U34 level.

NO COMPUTE until fresh countersign for Waves 0-2 (this request covered prereg + battery only).
