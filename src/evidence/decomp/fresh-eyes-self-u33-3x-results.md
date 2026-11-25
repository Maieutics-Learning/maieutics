# Fresh-eyes battery: self-u33-canonical-repair-prereg.md (3x sealed, this session)

## R1 (verbatim)
GOAL: Establish a version-pinned canonical rebuild target (U33) by proving that a stranger can retrain a model from scratch that meets specific capability bars.
IMPLEMENTABLE: yes
CONFOUNDS: Floating point variance across different JS engines could cause a BIT failure despite functional equivalence; the prereg controls this via the U33-FUNC bar (±0.02 tolerance).
MISSING: none
VERDICT: IMPLEMENTABLE
PATCHES: none
HEALTH: goalInAll yes; barsExact yes; streamsPinned yes; noComputeWithoutCountersign yes

## R2 (verbatim)
GOAL: Establish a version-pinned canonical rebuild target (U33) by proving that a stranger can reproduce the model's capabilities using a pinned stack and init checkpoints.
IMPLEMENTABLE: yes
CONFOUNDS: Cross-engine floating point variance could trigger a BIT failure while maintaining FUNC success; the prereg controls this by providing a ±0.02 tolerance bar (U33-FUNC).
MISSING: None.
VERDICT: IMPLEMENTABLE
PATCHES: none
HEALTH: goalInAll yes; barsExact yes; streamsPinned yes; noComputeWithoutCountersign yes

## R3 (verbatim)
GOAL: Establish a version-pinned canonical rebuild target (U33) by proving a stranger can retrain a model to meet specific capability bars using a frozen code stack and initialization checkpoints.
IMPLEMENTABLE: yes
CONFOUNDS: Floating-point variance across different JS engines could cause a BIT failure while still passing FUNC; the prereg controls this by defining a ±0.02 tolerance for the "stranger" (confirm-B) versus the canonical (canon-A).
MISSING: Explicit definition of the "two" metric in the U33-FLOOR bar (though implied as a capability measure).
VERDICT: IMPLEMENTABLE
PATCHES: none
HEALTH: goalInAll yes; barsExact yes; streamsPinned yes; noComputeWithoutCountersign yes

## Adjudication (same session): v1.0 STANDS + v1.1 pin (no bar change, no compute)

3x IMPLEMENTABLE unanimous, 12/12 HEALTH. Converging note (R3): `two` is used but never expanded. Pin adopted as clarification only:

- P1a (terminology, non-binding): `two` = accTwo = round-2 compose accuracy on the N=200 shift eval rows (x2m with vhat), exactly as filed in `d-newai-w-eval-w6-s{seed}.json` and reproduced by `runWinnerEval`/`u32RunEvalRows`. `scr` = accScratch (hv round). No bar, threshold, or row-set change.

NO COMPUTE until fresh countersign for Waves 0-2 (this request covered prereg + battery + driver build only).
