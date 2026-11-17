# Fresh-eyes R3: Detour D1 v1.1 (2026-11-17, 2x closer)

Premise v2 frozen. Artifact GAMEPLAN Detour D1 v1.1.

### closer1
1. Fixed.
2. Fixed.
3. Fixed.
4. Fixed.
5. Fixed.
6. Fixed.
7. Fixed.

Verdict: PASSED.
Hardest falsifier: Position-shuffle control on short-seqs (detecting rote index-mapping vs. associative recall).

BLOCKER: NO BLOCKER.
Falsifier: Template-match failure on permuted-key control.

### closer2
**Review of Patch D1 v1.1**

1. Fixed.
2. Fixed.
3. Fixed.
4. Fixed.
5. Fixed.
6. Fixed.
7. Fixed.

**Verdict:** APPROVED for smoke-run.
**Hardest Falsifier:** Position-shuffle controls. If the model relies on absolute index rather than key-value association, `medComp` will collapse to $\approx 0.0$ regardless of `rho` on static keys.

***

**Steelman: Failure Case (All-Floor)**

1. **Mechanism:** Gradient starvation/interference. Fixed-3 is too narrow; the model learns the *template* (SEP/ID structure) without associating the specific value-byte. It "guesses" based on the distribution of the 4-7 value range rather than the 10-17 key, leading to a statistical floor.
2. **Early Warning:** 2-brain smoke shows `acc` $\approx 0.25$ (random chance for 4-7 range) across both `random-key` and `fixed-3` runs. If $\Delta \text{acc}$ between control and experimental is $< 0.1$, the model has failed to associate and is merely pattern-matching the byte-layout.

