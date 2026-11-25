# Fresh-eyes battery: self-u35-capacity-escape-prereg.md (3x sealed, this session)

## R1 (verbatim)
GOAL: Does increasing trunk width to H96 allow the compose circuit to escape the "wall" (capacity-starved) when combined with pricing?
IMPLEMENTABLE: yes
CONFOUNDS: L5 (P0 draw-order differs between H48 and H96, preventing direct weight comparison; parity must be behavioral).
MISSING: none
VERDICT: IMPLEMENTABLE
PATCHES: none
HEALTH: goalInAll=yes barsExact=yes streamsPinned=yes noComputeWithoutCountersign=yes

## R2 (verbatim)
GOAL: Does increasing trunk width to H96 allow the compose circuit to escape the "wall" (capacity-escape) when combined with pricing?
IMPLEMENTABLE: yes
CONFOUNDS: P0 draw-order (H96 is not a direct weight-init extension of H48, requiring behavioral parity instead of BIT-exactness); L1 seed fragility.
MISSING: none
VERDICT: IMPLEMENTABLE
PATCHES: none
HEALTH: goalInAll=yes barsExact=yes streamsPinned=yes noComputeWithoutCountersign=yes

## R3 (verbatim)
GOAL: Does increasing trunk width (H48 -> H96) allow the compose circuit to escape the "wall" and improve performance via pricing?
IMPLEMENTABLE: yes
CONFOUNDS: P0 draw-order difference between `inSeqMakeModelH` and `inSeqMakeModel` (handled via behavioral parity check rather than bit-exact P0).
MISSING: none
VERDICT: IMPLEMENTABLE
PATCHES: none
HEALTH: goalInAll=yes barsExact=yes streamsPinned=yes noComputeWithoutCountersign=yes

## Adjudication (same session): v1.0 STANDS (no pins, no bar change)

3x IMPLEMENTABLE unanimous, 12/12 HEALTH, converging confound coverage (all three reviewers independently named the P0 draw-order confound, already controlled by L5 + H48 behavioral parity gate). No v1.1.

NO COMPUTE until fresh countersign for Waves 0-2 (this request covered prereg + battery only).
