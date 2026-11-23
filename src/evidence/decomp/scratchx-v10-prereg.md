# Scratch extras v10 — teacher-forced scratch (post-verdict extra 1/5)

Agent approval: this file. Countersign: scratch-v10 program (post-verdict extras ≤5; this is 1/5).

## Why
d-scratch-verdict (DUMMY-KILLS-SLOT 0/5): training scr=dummy-constant teaches the final head the slot is uninformative — oracle is chance in BOTH arms (T 0.255-0.325, U 0.25-0.275), so the add-step is never learned and two-pass is OOD-worse. Supervision installs only a weak readout (T scratch 0.41-0.675 > U 0.255-0.33). Fix: WRITE the scratch at train (teacher-forced scr=true v), standard scratchpad practice. T vs T2 then differ ONLY in scr input values (supervision identical, same trainSeed 53200+seed*13, same nested data rngs) — clean isolation of the dummy rule.

## Design (arm T2; same probe recipe: 150 fwd + 150 shift-scratch, 800 steps, batch 16, lr 5e-3, attnAux true, auxW 1.0, T labels)
- Train lines: shift-scratch with scr=true v (found by key lookup, same as the label). Forward lines unchanged. Same rngs/seeds as T (identical line contents except the scr token).
- Evals: identical battery (fwd + scratch/one/two/oracle + len two-pass, same test rngs).

## Bars (quorum 2/3; T refs paired by seed: two 0.265/0.265/0.295, oracle 0.325/0.255/0.26)
- TF-ORACLE: T2 oracle >= 0.80 (the add-step is learnable given v).
- TF-TWO: T2 two-pass >= 0.60 AND T2 two-pass - T two-pass >= +0.15 (fix works at mechanism scale).
- TF-FWD: T2 fwd >= 0.75.

## Expectation (filed open)
ORACLE HIT (~0.9 — the add is a 4x4 map, trivially learnable once v is addressable); TWO MISS-or-near (~0.5: two-pass final ≈ scratch-acc × oracle ≈ 0.55 × 0.9 — retrieve-bottlenecked, since T2 pass-1 is the same dummy-scr task T failed at ~0.5); FWD HIT. Net: ADD-LEARNABLE + RETRIEVE-WALLED — the 0.5 ceiling decomposes into retrieve-into-position (~0.55, the new wall: NOT the 0.85 forward) + add-given-v (~0.9). Next program then targets retrieve-into-scratch (stronger aux scale, forward-format scratch query), not the add.

## Cost
3 trains (~2 min) + 6 evals. Driver: runScratchTF (trainSeed shared) + reuse runScratchEval/Len (arm t2). NO PUSH.
