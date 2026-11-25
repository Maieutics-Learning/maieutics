# Fresh-eyes battery: self-u37-learned-inhib-prereg.md (3x sealed, this session)

## R1 (verbatim)
GOAL: Implement a learned per-class inhibition mechanism (4 parameters per class) to replace a fixed schedule, testing if learning these weights improves performance on a diverse diet.
IMPLEMENTABLE: yes
CONFOUNDS: none
MISSING: none
VERDICT: IMPLEMENTABLE
PATCHES: none
HEALTH: goalInAll=yes barsExact=yes streamsPinned=yes noComputeWithoutCountersign=yes

## R2 (verbatim)
GOAL: Evaluate if learned per-class inhibition (U37) can be implemented as a variable against a scheduled baseline (U36) using a specific 4-parameter per-class weight system.

IMPLEMENTABLE: yes

CONFOUNDS: none (Diet is held constant across arms; seeds are twin-matched; ablation is performed on the same rows/streams).

MISSING: none

VERDICT: IMPLEMENTABLE

PATCHES: none

HEALTH: goalInAll=yes barsExact=yes streamsPinned=yes noComputeWithoutCountersign=yes

## R3 (verbatim)
GOAL: Evaluate if learned per-class inhibition (U37) can be implemented as a controlled extension of the U36 diverse diet baseline.
IMPLEMENTABLE: yes
CONFOUNDS: none
MISSING: none
VERDICT: IMPLEMENTABLE
PATCHES: none
HEALTH: goalInAll=yes barsExact=yes streamsPinned=yes noComputeWithoutCountersign=yes

## Adjudication (same session): v1.0 STANDS (no pins, no bar change)

3x IMPLEMENTABLE unanimous, 12/12 HEALTH, no converging confound. Single-variable split (same U36-D1 diet both arms; scheduled c0 vs learned inh[4] c1) with forced-zero ablation teeth on the same rows.

NO COMPUTE until fresh countersign for Waves 0-2 (this request covered prereg + battery only).
