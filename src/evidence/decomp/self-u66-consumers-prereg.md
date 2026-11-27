# U66-CONSUMERS (E-NE1+E-ACh1) prereg v1.0 — wire the detector to behavior, alone first

**Track:** U66 (success-recipe steps 2b+3; gated on U65 DETECTOR-READY — no consumers without a detector).
**Cover:** user 2026-11-26 pre-countersign = this prereg + 10x battery now; driver + Waves covered ONLY
once U65 DETECTOR-READY is filed (checked at build; else HALT). Alone-first, then interaction only if
both pass. NO PUSH without order.
**Lesson encoded:** U50 proved perturbation helps OUTCOMES under drift but contains zero evidence it
helps because the system ADAPTED (no adapt-speed separation — U52 ledger re-analysis). Every consumer
below is therefore graded on the DOUBLE metric (outcome + adapt-speed) with budgets matched, or the
"pure diversity" rival (U52 P1a) wins by default.

## Design (U64 rule-switch diet verbatim; U65 detector for timing; oracle-switch as control arm only)
- E-NE1 TRIGGERED gain: T=0.15 stable quarters / T=1.0 for K=25 slots post-trigger (filed). Controls:
  (b) STOCH-const T=0.5 (U50 champion dose); (c) SHUFFLED (same total high-T budget, random placement —
  P2a: TRIGGERED must beat BOTH const and shuffled on BOTH metrics to claim timing; beating const alone
  = amount effect). Entropy budget equalized (T×steps matched).
- E-ACh1 MODED scheduling: post-trigger ENCODE window K=25 slots (fresh-slot weight ×G=2.0, plasticity
  on, feedback ×g=0.5) then RETRIEVE (inverse); control (b) constant-plasticity with TOTAL budget matched
  (lr×steps equalized — isolates scheduling, not amount); (c) G=1 ablation (scheduling without
  fresh-weighting — P2c separates the spatial-sparsity prior from the scheduling claim). Quantify
  fresh-weight xG as effective update magnitude per arm (filed diagnostic).
- Alone-first (attribution discipline, U52 §59): run TRIGGERED block and MODED block as SEPARATE
  Waves (1a, 1b); 2×2 interaction (gain×scheduling) ONLY if both pass alone — never first.
- Metrics: outcome two (U64 eval verbatim) + adapt-speed (U64 operator verbatim).
**Bars (quorum 15/20, per consumer):** TRIGGERED ≥ const+0.03 AND ≥ shuffled+0.03 on outcome, same
double-margin on adapt-speed (≥+0.10 faster recovery) → GAIN-HOLDS. MODED ≥ budget-matched+0.03 on
outcome, same on adapt-speed, AND G=1 ablation < full MODED (else the prior, not scheduling, did it)
→ MODE-HOLDS. Else (either ≈ const on both metrics) → PURE-DIVERSITY (U50 benefit explained, no
adaptive regulation in this substrate — close P1 consumers, keep detector as diagnostic).
**Waves:** 0 (budget-equality audit: injected entropy / plasticity budget numerics per arm + twin
determinism, COMPLETE-gated); 1a (TRIGGERED block: 3 arms×20 = 60 trains + 60 evals); 1b (MODED block:
3 arms×20 = 60 trains + 60 evals); 2 (verdict; interaction 2×2 NOT run unless both hold).
**Verdicts:** GAIN-HOLDS / MODE-HOLDS / BOTH-HOLD (licenses 2×2 interaction prereg) / PURE-DIVERSITY /
INCONCLUSIVE (floor) / PIN-FAIL. Filed expectation: at least one holds (U64 PROCEED + U65 READY imply
timing information exists and is usable). Falsifiers: K/G/T changes post-Wave-0 need new version.
