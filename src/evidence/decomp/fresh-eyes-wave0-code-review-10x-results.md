# Code review — Wave-0 sanity implementations (static, no execution)

**Scope:** full-logic implementations (not stubs) of W0-RAND / W0-TRIV in
`src/evidence/decomp/newai-selfu58-driver.js` (runU58Wave0Rand, runU58Wave0Triv,
u58RunStreamScrambled) and `src/evidence/decomp/newai-selfu59-driver.js`
(runU59Wave0Rand, runU59Wave0Triv, u59Phase2StepScrambled).
Parse: u58 23985B ok, u59 41199B ok, 0 STUB tokens left.

**Checks demanded:** (1) scramble destroys contingency, (2) gates face the right
direction, (3) no shared mutable state between arms, (4) frozen-trunk assert
present, (5) no threshold/diet changes to main tracks.

## 10x independent static review
- C1: CODE-OK
- C2: CODE-OK
- C3: CODE-OK
- C4: CODE-OK
- C5: CODE-OK
- C6: CODE-OK
- C7: CODE-OK
- C8: CODE-OK
- C9: CODE-OK
- C10: CODE-OK
Raws: scratch/code-review-r1.json.

**Arbitration (owner final):** CODE-OK unanimous. Notes for the record:
zero execution happened here — functional behavior (RAND collapses, TRIV fires)
is still unverified until Wave-0 runs under a fresh countersign. U58-TRIV is
explicitly a response-level positive control (pipeline check, not a model
capability claim). U59 arms each call u32FreshStack fresh (own params/opt/rng)
and veto arms assert trunk-grad-0 every step; the shared frozen trunk is
identical initialization, never shared mutable state. Wave-0 gates are go/no-go
safeguards, not inferential tests — no family-wise correction owed; main-track
bars/thresholds/diet untouched; any Wave-1/2 tuning to Wave-0 is forbidden.
AWAITING fresh countersign for Wave-0 execution (NO compute ran).
