# Compose extras v10 — raise the shift ceiling without leading with resources (FROZEN for review battery)

Agent approval: this file. User countersign: 2026-11-23 "go ahead... be careful not to just solve every problem with more resources but it is there if you need it" (bench scale, in-worker/CPU only; R=3 quorum 2/3; NO GPU; NO PUSH without explicit order).

## Why
Compose v10 verdict (LIFTS-BUT-REALLOCATES + JOINT-HOLDS-AT-CEILING): joint forward+shift mixing holds both skills (S1 fwd 0.78/0.865/0.785, shift 0.475/0.505/0.51; KEEPS 3/3 over S0), but shift tops out ~0.5. The wall is the shift SKILL, not interference. Standing user constraint: clever-first, resources-if-needed. So X1/X2 use the SAME budget as S1 (800 steps, same compute envelope); X3 (2x steps) is gated and runs ONLY if both X1 and X2 miss.

## Design (all attn h48/m96/d16 from scratch, probe recipe: batch 16, lr 5e-3, attnAux true)
- X1 PROCESS (arm x1): S1-identical data (150 fwd 1..3 + 150 shift, same train rngs 52200/52300/52600+seed → same train sets, supervision is the only delta) + retrieve supervision via prefixLabels (auxW 1.0): forward lines use filed A.bindLabels; shift lines label the qk-token position (x.length-3) with the retrieved value v (found in flat pairs). 800 steps. Tests whether pricing the retrieve step stacks onto a skill that already avoids the lure (echo ~0.14).
- X2 DATA (arm x2): 150 fwd (same rng) + 300 shift (same drng base, first 150 nested-identical to S1's + 150 new), shuffled, 800 steps. Same steps/compute as S1, more shift variety. Tests data-variety ceiling.
- X3 STEPS (arm x3, GATED): S1-identical data, 1600 steps. Runs ONLY if X1 and X2 both miss their bars (filed gate below). Explicit resource escalation, not the opener.
- Evals (frozen, seed-matched, identical test rngs 52400/52500+seed for all arms): 200 forward 1..3 + 200 shift, per-k + echo reporting (R3 commitment carried).

## Bars (quorum 2/3; verdict d-composex-verdict.json; S1 refs paired by seed)
- PROCESS-HELPS: X1 shift - S1 shift >= +0.05 (S1 refs 0.475/0.505/0.51) AND X1 fwd >= 0.75.
- DATA-HELPS: X2 shift - S1 shift >= +0.05 AND X2 fwd >= 0.75.
- GATE-X3: run X3 iff PROCESS-HELPS misses AND DATA-HELPS misses (both <2/3). If run: STEPS-HELPS: X3 shift - S1 shift >= +0.05 AND X3 fwd >= 0.75.
- Scope note: parity-with-duplicates stays out (diet-fragility precedent H2/H3); width-dose (h64) stays out unless X3 also misses (future extra, not this spec).

## Expectation (filed open)
X1 HIT (retrieve supervision stacks: lure already avoided, pricing the first hop should add +0.05-0.10); X2 HIT-or-near (variety helps a ~0.5 skill, expect +0.03-0.08, bar may miss at margins); X3 UNRUN (gate trips only if both miss — expected stay-closed).

## Nearest-failure
- S1 joint (shift 0.475-0.51, fwd 0.78-0.865; differs: X1 adds labels, X2 adds variety, X3 adds steps).
- verS AUX8-inert (aux dose did nothing; differs: aux here prices the retrieve hop of the tested op, not a duplicate main loss — E1/Lane1 lesson: price what the task reads).
- decomp tutor bindLabels (filed prefix supervision teaches lookup; differs: shift labels the qk position with v, the compositional bottleneck).
- H2/H3 CORRUPT (duplicate-key diet poisons; differs: all lines here use distinct keys).

## Cost
X1 3 + X2 3 trains (~2-2.5 min each) + 6 evals now; X3 3 trains (~4 min each) + 3 evals only if gated open. Driver: runProcessTrain/runDataTrain (+ runStepsTrain if gated) + reuse runShiftEval on arms x1/x2(/x3). NO PUSH.
