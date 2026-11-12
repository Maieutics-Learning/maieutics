# F-induction — post-hoc probe result (signature TRACKS ignition)

Status: RUN 2026-11-12 (post-hoc, no training; 800 forwards).
Runner: scratch/f-induction.js. Raw: scratch/f-induction.json.
Probe: x = [ka, va, kb, vb, ka], read final-posOut mass on va
(second-occurrence readout — induction-head norm, Olsson et al. via
mamba.md). Chance = 0.25.

## Results (n=200; copyRate / meanVaMass)
- s602 (ignited, Hd 0.99): 0.44 / 0.350
- s601 (ignited, Hd 0.99): 0.35 / 0.319
- s603 (lean, Hd 0.365): 0.225 / 0.278
- s608 (severance, Hd 0.285): 0.205 / 0.244

## Reading
Monotone four-point gradient s602 > s601 > s603 > s608 — the SAME order
as killHd. Ignited models show a genuine induction signature (0.35–0.44
vs 0.25 chance); lean/collapsed models sit at chance. Third independent
measure of the heuristic→lookup transition (attention entropy +
swap accuracy + induction copy-rate all agree). Mechanism picture
sharpens: ignition = the model learns to complete the repeated key
with its value — induction IS (part of) the lookup mechanism, not a
separate trick.

## Bounds
Post-hoc, four models, one probe shape. Causal direction open
(induction causes lookup vs both reflect the same circuit). Follow-ups:
(1) probe across Phase-3 chains — does copyRate jump AT ignition gen?
(2) F-induction-on-delta once F-deltanet builds (candidate↔meter loop);
(3) mid-sequence variants (longer distractors between occurrences).
