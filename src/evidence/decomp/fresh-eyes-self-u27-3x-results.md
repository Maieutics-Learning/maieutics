# Fresh-eyes battery: self-u27-detached-prereg (3x sealed; 3x IMPLEMENTABLE → v1.0 STANDS)

Goal line carried in thinking + all 3 prompts: "The final goal is we are building a machine that learns by itself — continuity + selection + appetite living in weights + forward pass, tools as controls only."
Sealed via root.generateText Promise.all (3 parallel). Raw: scratch/u27-battery-raw.json (verbatim below). Health: goalInAll true, nonEmpty 3/3, hasVerdict 3/3, distinct true.

## R1 — IMPLEMENTABLE (verbatim)
(a) **Implementability**: High. Stop-gradient routing is explicitly defined: the completion path (CE/MSE) is blocked at the INH node, while the selection path (hinge) remains open. This effectively transforms INH into a selection-only substrate. Hinge-only gradients for INH are sound, as they isolate the "gap-opening" pressure from the "completion" pressure that caused the U26 parking failure. Twin-matching is preserved via disjoint arm codes (169/170) and seed-only streams.

(b) **Bar Math**: Coherent. The `INHIB-SEPARATES` bar (+0.10) is the critical "Kim signature" for selective suppression. `INHIB-USE` is now a falsifiable load-bearing test; because INH is now detached from the completion gradient, any failure to move off-constant directly tests the inseparability of the 8-dim encodings rather than gradient interference. Quorum (2/3) is standard.

(c) **Leakage**: Controlled. Held-out integrity is maintained via the 66300+seed set. Frozen discipline is strictly applied to teacher and OOD scales. New arm codes (169/170) ensure no leakage from U26 training signals.

(d) **Confounds/Rivals**: The detachment successfully isolates routing. The grad-check design is robust: INH is strictly hinge-driven, while S/C/HF remain joint-driven. If INH still "parks" (constant offset), the spec forces a "WHY" analysis among three specific failure modes: (i) feature inseparability, (ii) hinge-on-means under-constraint, or (iii) suboptimal learning rates for the subnet. This prevents the "black box" failure of U26.

**Ambiguity Flag**: None. The transition from "shared-linear" (U25) to "shared-MLP" (U26) to "detached-MLP" (U27) is logically sequenced.

VERDICT: IMPLEMENTABLE

## R2 — IMPLEMENTABLE (verbatim)
**Reviewer R2 Implementability Report: U27 Delta-Prereg**

**(a) Implementability**
The stop-gradient routing is well-defined. By specifying `allowINH=false` during the completion path backward pass and `allowINH=true` during the hinge path, the spec creates a hard architectural boundary for gradient flow. The hinge-only gradient for INH is sound; it transforms the inhibition layer into a dedicated selection substrate, preventing the "washout" effect observed in U26 where CE gradients dominated. Twin-matching is intact via unique arm codes (169/170) and disjoint RNG seeds (78000-family), ensuring no leakage between the competition and shuffle streams.

**(b) Bar Math**
The `INHIB-SEPARATES` bar (+0.10) is coherent as a measure of selective suppression (Kim signature). `INHIB-USE` is now a critical, falsifiable, load-bearing bar; because INH is now trained *only* on the hinge, a failure to show an ablation drop ($\ge 0.05$) would directly prove that the hinge-only pressure is insufficient or the features are inseparable. Quorum (2/3) is correctly applied to all performance bars.

**(c) Leakage**
Held-out integrity is maintained via seed-separated mining (65300) and evaluation (66300). The "frozen discipline" is strictly enforced across the teacher and scale-OOD models. New arm codes 169/170 ensure the U27 run is disjoint from the U26 baseline.

**(d) Confounds/Rivals**
The detachment successfully isolates routing. The grad-check design is sound: verifying that $\nabla \text{INH} = 0$ for the CE/MSE path while $\nabla \text{INH} \neq 0$ for the hinge path. If INH still "parks" (fails `INHIB-USE`), the spec forces a diagnostic "WHY" among:
(i) Feature inseparability (8-dim encodings too narrow),
(ii) Pressure failure (means-hinge vs. max-hinge),
(iii) Optimization failure (learning rate/weight decay mismatch).
This prevents the "silent failure" of U26 by forcing a theoretical justification for failure.

**Ambiguous Lines:** None. The spec is mathematically and procedurally complete.

VERDICT: IMPLEMENTABLE

## R3 — IMPLEMENTABLE (verbatim)
(a) **Implementability**: Sound. Stop-gradient routing is explicitly defined via the `allowINH` boolean flag in the pool backward pass. This creates a hard bifurcation between the completion path (CE/MSE) and the selection path (hinge), ensuring the requested detachment. Hinge-only gradients for INH are sound as they isolate plasticity to the contrastive objective. Twin-matching is intact via disjoint arm codes (169/170) and unique RNG families.

(b) **Bar Math**: Coherent. `INHIB-SEPARATES` (+0.10) is a necessary prerequisite for `INHIB-USE` (ablation drop $\ge$ 0.05) to be believable; if the weights don't differentiate true vs. distractor, the ablation cannot be load-bearing. Quorum (2/3) is clearly defined. Falsifiability is high: if `INHIB-USE` fails despite the stop-gradient, the "interference hypothesis" is debunked in favor of "inseparability" or "regime failure."

(c) **Leakage**: Integrity is maintained. The use of held-out seeds (66300+) and frozen teacher/miner assets prevents training signal bleed. Frozen discipline is enforced across the scale OOD and teacher heads. New arm codes 169/170 ensure no overlap with U26 state.

**Ambiguities**: None. The transition from U26 to U27 is a clean variable-routing delta with no architectural changes.

VERDICT: IMPLEMENTABLE

## Adjudication (agent): v1.0 STANDS, no patches
3x IMPLEMENTABLE unanimous. No ambiguous lines (R1's earlier U26 naming notes resolved by U26 filing). Proceed to grad-check + stage-1 + 6T + evals.
