# Fresh-eyes battery: self-u34-trunkcomp-prereg.md (3x sealed, this session)

## R1 (verbatim)
GOAL: Determine if pricing the compose circuit during trunk training (via oracle-aux term) lifts composition performance without causing retrieval collapse or oracle-dependence.
IMPLEMENTABLE: yes
CONFOUNDS: Oracle-dependence (controlled by U34-ORACLE-CHECK), retrieval collapse (controlled by U34-RET), and setup instability (controlled by U34-PIN/c0 bit-exactness).
MISSING: none
VERDICT: IMPLEMENTABLE
PATCHES: none
HEALTH: goalInAll yes; barsExact yes; streamsPinned yes; noComputeWithoutCountersign yes

## R2 (verbatim)
GOAL: Determine if adding an oracle-compose auxiliary loss during trunk training lifts composition performance (two) without causing retrieval collapse (scr) or oracle-dependence.
IMPLEMENTABLE: yes
CONFOUNDS: Oracle-dependence (lifted by shortcutting rather than composing) and retrieval collapse (capacity reallocation). Both are controlled via U34-ORACLE-CHECK and U34-RET.
MISSING: None.
VERDICT: IMPLEMENTABLE
PATCHES: none
HEALTH: goalInAll yes; barsExact yes; streamsPinned yes; noComputeWithoutCountersign yes

## R3 (verbatim)
GOAL: Determine if pricing the compose circuit via an oracle-aux term during trunk training lifts composition performance without inducing retrieval collapse or oracle-dependence.
IMPLEMENTABLE: yes
CONFOUNDS: Oracle-dependence (controlled by U34-ORACLE-CHECK) and capacity reallocation/retrieval collapse (controlled by U34-RET).
MISSING: none
VERDICT: IMPLEMENTABLE
PATCHES: none
HEALTH: goalInAll yes; barsExact yes; streamsPinned yes; noComputeWithoutCountersign yes

## Adjudication (same session): v1.0 STANDS (no pins, no bar change)

3x IMPLEMENTABLE unanimous, 12/12 HEALTH, converging confound coverage (all three reviewers independently named the two load-bearing confounds, both already controlled). No v1.1.

NO COMPUTE until fresh countersign for Waves 1-2 (this request covered prereg + battery only).
