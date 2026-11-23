# Lane 1 v10 — representational fade (priced + load-bearing + faded intermediates)

Agent approval: this file. User countersign: 2026-11-23 practice program (lanes 2→3→1).

## Why
AUX-vs-bottleneck left open whether priced intermediates can be load-bearing AND survive fading (verS AUX1/AUX8: aux inert — grim precedent, filed). Lane 1 forces it: message must carry a pair-set property (nPairs) under an aux price that fades to zero, leaving the skill in the reader.

## Design (bottleneck channel K=4/sig0.5, T-frozen tutorSeed=seed; 8000st/B8/lr1e-3 filed recipe)
- Arms (3, R=3 seeds s=0,1,2): FADE (aux weight 1.0→0 linear), CONST (aux const 1.0), NOAUX (aux 0 — floor).
- Aux head: linear K→3 (nPairs 1/2/3) on the message, joint CE with weight w(t); grads flow message→projection (priced). Inference always S-only (aux shapes training, never test).
- Train lines: distinct-reverse 1..3 (bnGenReverse). Eval: 200 novel lines — intact acc, scrambled acc (reads-message check), 4 single-dim lesions (max drop).

## Bars (quorum 2/3; verdict d-lane1-verdict.json)
- DECORATION-ABORT: CONST intact <= NOAUX intact + 0.03 (aux never priced anything; fading vacuous) → ABORT, lane VOID.
- FADED-HOLDS: FADE intact >= CONST intact - 0.05 AND >= 0.55.
- DISTRIBUTED: FADE max single-dim lesion drop <= 0.25 (no single-dim master; cf. msglesion DISTRIBUTED).
- Expectation: open — FADED-HOLDS or DECORATION-ABORT (verS inert precedent vs bottleneck COMPRESSES precedent; both filed).

## Nearest-failure
- verS AUX arms (aux dose inert; differs: aux here prices the MESSAGE, the only channel, not side supervision).
- depth C (rounds decorative; differs: ABORT bar is the same shape — aux-off equivalence).
- bottleneck COMPRESSES (message carries answer-bindings; here it must also carry pair-count under fade).

## Cost
9 trains (~2 min each, filed recipe) + 9 evals (frozen). Driver: lane-driver.js runLane1Train/Eval (reuses bottleneck-driver fns). NO PUSH.
