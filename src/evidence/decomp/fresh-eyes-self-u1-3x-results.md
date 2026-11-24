# Fresh-eyes battery: self U1 checkpoints-not-freezers (3x sealed, parallel via root.generateText)

Goal line carried in every prompt.

## R1 — IMPLEMENTABLE (verbatim, truncated to 2000 chars in scratch raw)
**VERDICT: IMPLEMENTABLE**

The delta-prereg is technically sound and logically closed. By transitioning from "frozen trunk + learnable head" to "full-graph unfreeze," you are shifting from a linear probing task to a full-model fine-tuning task. The inclusion of the `u1-unf-flat` arm is the critical control; without it, any gain in `u1-unf-gate` could be attributed to the trunk learning the task internally rather than the gate learning to "look outside."

Concrete Review Points:

1. Isolation of "Outside-Use": The comparison between `u1-unf-gate` and `u1-unf-flat` correctly isolates the utility of the external signal. Since both arms are unfrozen, any delta in `adaptY` must be attributed to the gate's ability to route to the "outside" (notebook/critic) rather than the trunk simply getting better at the task via joint tuning.
2. Baseline Integrity: Using `r3-gate` (frozen) as a baseline for `u1-unf-gate` (unfrozen) is a fair and necessary "Turing test" for the architecture. If `U1-FIX` holds, it proves that joint optimization of the carry-mechanism and the gating-mechanism is synergistic, not just additive.
3. The STD "Abort Gate": The ±0.05 threshold for `standard two` is strict but appropriate. In a full-unfreeze scenario, "catastrophic forgetting" of the base distribution is the primary risk.
4. VITAL Test Logic: The requirement for `wrong1 > right1` (the "teeth test") is the only way to verify the gate isn't just a bias-dominant switch.
5. Compute Guardrails: CPU/in-worker + NO PUSH keep this a controlled delta; twin-matched seed stream preserves validity.

## R2 — IMPLEMENTABLE (verbatim, truncated to 2000 chars in scratch raw)
**VERDICT: IMPLEMENTABLE**

The protocol is rigorous, the baselines are well-defined, and the "unfreeze-all" approach is the logically correct next step to determine if the architectural bottleneck is the frozen trunk or a failure of the learning signal.

1. Isolation of the "Carry" Confound: pairing `u1-unf-gate` against `u1-unf-flat` (gate forced 0) isolates whether the AI uses external info to solve the missing-flat carry problem or guesses better via general updates. Δ ≥ +0.10 is strict and fair.
2. The "Vitality" Guardrail: `U1-VITAL` (adapt-missing vs standard-present) prevents false positive where gate stays open always (b-dominance). Forces selective ignorance.
3. Stability via STD-Hold: `U1-STD` (±0.05 of W6) ensures unfreeze is additive, not trade-off.
4. Twin-Matching Integrity: seed-only init/data/mask/eval streams eliminate lucky seeds.
5. Risk Mitigation (Re-poisoning): mixed 50/50 diet regularizes; AI must reconcile cNew with standard distribution to hold STD.

## R3 — IMPLEMENTABLE (verbatim, truncated to 2000 chars in scratch raw)
**VERDICT: IMPLEMENTABLE**

The delta-prereg is rigorous, logically consistent with prior R3/M2 benchmarks, and accounts for the primary risk of unfreezing (catastrophic forgetting of the base trunk). The verdict space is comprehensive.

1. Verdict Exhaustivity: four-way (CHECKPOINT-WORKS / UNFREEZE-HURTS / STILL-BLIND / COMPOSE-ONLY) maps carry-repair × gate-sharpening intersection; distinguishes fixed-but-blind from selective.
2. The "Vital" Bar: VITAL (adapt-missing > standard-present AND wrong1 > right1 3/3) is the correct teeth test; prevents R3 always-open false positive.
3. Stability Safeguard: U1-STD is the most critical safety check given full-trunk unfreeze and gradient drift risk.
4. Baseline Integrity: r3-gate frozen + M2-nb descriptive baselines isolate the unfreeze variable.
5. Compute Constraint: CPU/in-worker only + NO PUSH adhered to. U1-GAP ratio toward 1.0 proves compose internalized missing-flat carry logic.

## Adjudication: 3 IMPLEMENTABLE → v1.0 STANDS (no amendment)
- unf-gate vs unf-flat isolation stands (both unfrozen → delta = outside-use).
- Frozen filed baselines as descriptive comparators stands (isolates unfreeze variable).
- STD ±0.05 abort gate stands (catastrophic-forgetting guard for full-graph tune).
- VITAL both-framings 3/3 stands (teeth against b-dominance).
- Mixed 50/50 diet as re-poisoning regularizer noted; no spec change needed.
- Raw truncated replies in scratch/fresh-eyes-self-u1-3x.json (2000-char slices; full texts not retained — filed honestly as truncated).
