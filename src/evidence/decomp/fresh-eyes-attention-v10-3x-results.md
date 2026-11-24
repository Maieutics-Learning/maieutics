# Fresh-eyes battery: attention-prereg.md (3 sealed, blind)

Date: 2026-11-24. Scope: pre-countersigned attention prototype (user order do-both). Reviewers blind to results, prompts carried goal + directedness lines.

## R1 — math (temperature/scale)
VERDICT = NEEDS-PATCH
Hole: softmax over 6 slots with D=12 query/key risks sparse/vanishing grads through tiny 12x4 head.
Fix: learnable temperature or larger D.
Adjudication: PARTIAL-ADOPT — kept /sqrt(12) + clip 1.0 (filed), noted temp risk; no D change (capacity excuse rejected).

## R2 — impl (att-only definition)
VERDICT = NEEDS-PATCH
Hole: att-only with Hv zeroed at eval may cold-start fail without trunk bias.
Fix: frozen-Hv trunk with zeroed W1.
Adjudication: CLARIFIED — att-only = ensemble-train (Hv+att loss, stable grads), att-eval only (mechanism test). Same trains, different eval. Pinned in v1.1.

## R3 — rival (capacity)
VERDICT = NEEDS-PATCH
Hole: 600 new params = capacity gain, not mechanism; att-only bar 0.40 too low.
Fix: raise att-only to 0.60 + parameter-parity control.
Adjudication: PARTIAL-ADOPT — att-ctl = same param count, att frozen at 0 (no mechanism, same count); capacity diff 3% filed as negligible; att-only bar kept 0.40 as floor (above chance 0.25) + delta as mechanism test (not bar move).

## Disposition
3x NEEDS-PATCH → spec v1.1 (pins + clarifications above, no train/eval change except frozen-att ctl). Compute proceeded under pre-countersignature.
Raw: scratch/att-battery.json (disposable). Filed: this battery + attention-prereg.md + v1.1 note in att verdict.
