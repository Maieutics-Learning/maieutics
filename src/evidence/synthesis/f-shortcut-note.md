# F-shortcut — value-swap audit result (probe VALID + double dissociation)

Status: RUN 2026-11-12 (post-hoc, no training; 600 forwards).
Runner: scratch/f-shortcut.js. Raw: scratch/f-shortcut.json.
Method (LoopThink permutation logic): swap the queried pair's value
with a distractor's; y = value now paired with the queried key.
Key-lookup → new y; position-heuristic → old y.

## Results (n=200 each)
- s602 (ignited): swapAcc 1.000, oldYRate 0.235 — perfect key lookup.
- s601 (ignited): swapAcc 0.995, oldYRate 0.240 — true lookup.
- s603 (lean): swapAcc 0.785, oldYRate 0.300 — follows the key mostly,
  but 30% position-driven.

## Reading
Probe VALID: ignited models do genuine key-based lookup, not
position/value shortcuts (answers the LoopThink shortcut worry +
TOR last-layer confound + SOAR format-confound at once — the triple
justification in emcomm-kirby.md is discharged). Bonus double
dissociation: the lean model's 0.785/0.30 pattern matches its diffuse
attention (f-mech-note.md) — partial-heuristic retrieval is what
memorize-lean LOOKS LIKE behaviorally. Ignition = heuristic → lookup
transition, measured two independent ways (attention entropy + swap
accuracy).

## Bounds
One exam family (allowed-12, r=4); swap construction mirrors killA
structure. Follow-ups: run swap audit on Phase-3 chains (does swapAcc
jump AT the ignition generation? — predicts a step, not a ramp);
order-shuffle variant as a second control (true lookup is
order-invariant — cheap, same runner pattern).
