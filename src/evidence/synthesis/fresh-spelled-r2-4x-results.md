# Fresh-eyes R2: Detour D1 v1.1 (2026-11-17, 4x recheck)

Premise: `src/evidence/synthesis/fresh-spelled-premise-v2.md` (frozen v2).
Artifact: `src/GAMEPLAN.md` Detour D1 v1.1 DRAFT.
Ran: 4 sequential root.generateText calls, per-patch recheck + verdict + hardest falsifier, <=200 words each. Same-model caveat.

## Raw replies

### recheck-math
1. Fixed.
2. Fixed.
3. Fixed (confound isolated).
4. Fixed.
5. Fixed.
6. Fixed.
7. Fixed.

**Verdict:** PASS. Patching is comprehensive; D1 v1.1 resolves the R1 conflation and scale-creep.

**Hardest Falsifier:** The "8-12 fill bar" threshold. If $\ge 3$ brains fail to hit $acc \ge 0.6$ despite the 200/200 loader and lineHash verification, the "Tutor spelled-killA" gate is a failure of feasibility, not a fluke of noise. This is the primary kill-switch before scaling to $n=50$.

### recheck-impl
1. Fixed.
2. Fixed (Byte map 10-17/4-7/18/8 frozen; deviation=HALT).
3. Fixed (Split reported).
4. Fixed (Eval-only controls locked).
5. Fixed (12-letter zero-shot defined).
6. Fixed (Gate redefined as feasibility start).
7. Fixed (Scale rule: $\ge$ 8-12 fill bar required).

**Verdict:** APPROVED for execution.

**Hardest Falsifier:** The "fill bar" threshold ($\ge 3$ acc $\ge 0.6$ AND $\ge 3$ acc $< 0.5$). If the model achieves high accuracy across the board without the expected failure rate on hard keys, the "associative recall" claim collapses into simple template matching or leakage. One "perfect" brain fails the gate.

### recheck-rival
1. Fixed (Zero-run banner active; D1 bars unfired).
2. Fixed (Byte layout frozen; 10-17/4-7/18/8; TERM excluded).
3. Fixed (Short-vs-long split logged).
4. Fixed (Eval-only controls: random/shuffle/permuted/omit-q implemented).
5. Fixed (12-letter zero-shot cheapest follow-up).
6. Fixed (Tutor spelled-killA defined as feasibility gate).
7. Fixed (Scale rule n=50/100 gated by 8-12 fill bar).

**Verdict:** PASS (v1.1 functionally closes R1 gaps).

**Hardest Falsifier:** Position-shuffle vs. Permuted-key across the 8-12 fill bar. If pooled accuracy stays $\ge 0.6$ while position is randomized but key-mapping is preserved, the model is likely exploiting spatial patterns or token-frequency biases rather than associative recall. Fail = template-match.

### recheck-scope
1. Fixed. Zero-runs banner implemented; bars unfired.
2. Fixed. D1a byte layout frozen; deviation = HALT.
3. Fixed. Short-vs-long split reported.
4. Fixed. Eval-only controls locked to pilot brains.
5. Fixed. 12-letter zero-shot follow-up defined.
6. Fixed. Gate defined as feasibility, not generality.
7. Fixed. Scaling rule gated by 8-12 fill bar.

**Verdict:** COMPLIANT. D1 v1.1 is sufficiently quarantined to prevent data leakage and premature scaling.

**Hardest Falsifier:** The "Fill Bar" threshold (≥3 acc≥0.6 AND ≥3 acc<0.5). If the pilot brains exhibit uniform failure or uniform success without the expected variance in the 8-12 range, the "feasibility start-gate" is void, and the project must ABANDON/shorten per the floor rule.

