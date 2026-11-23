# Lane 3 v10 — verifier-gated auto-curriculum (competence gates; random sampling within rungs)

Agent approval: this file. User countersign: 2026-11-23 practice program (lanes 2→3→1).

## Why
Selfdir E4 tied (learner CE-mining == random): the selector had no learnability signal. Fix the GATES first (competence probes decide rung moves), keep sampling random inside; verifier-scored selection becomes the curated extra if gates help. The probe is the SecondHead in harness form.

## Design (assocR; equal 1200-step budget; R=3)
- Rungs: R1 1-pair only; R2 mixed 1..3; R3 long 4-pair (A.gen 4, clean — all 4 keys, valid query).
- GATED arm: train R1 until R1-probe (100×1-pair, rng 18000+s) >= 0.95 or 400 steps; then R2 until R2-probe (200×1..3, rng 18100+s) >= 0.90 or +400 steps; remainder to R3. Probes every 50 steps (frozen probe lines, no grad).
- FIXED arm: 1200 steps uniform 1..3 (selfdir-random recipe verbatim).
- Both arms: attn h48/m96/d16, B16, lr5e-3 Adam, attnSupervision + bind aux (selfdir recipe); same init rng per seed (16500+seed*100 → both arms identical init; data streams differ); same total grad steps.
- Eval (frozen): in-dist 200×1..3 (rng 18200+s), long 200×4-pair (rng 18300+s).

## Bars (quorum 2/3; verdict d-lane3-verdict.json)
- GATES-HELP: gated long >= fixed long + 0.05 with in-dist held (|Δin| <= 0.03).
- ABORT (staircase): any gate advances in <100 steps (probe saturates in 1 block = memorization, not competence) → lane VOID, verifier-selection extras do not run.
- Expectation: GATES-HELP or narrow miss (filed openly; R1/R2 may be too easy to matter at bench scale).

## Nearest-failure
- selfdir E4 (CE selection == random; differs: gates replace the selector).
- verH H2/H3 (narrow diet poisons; differs: R3 keeps length + gates keep mix; watch R3-only tail).
- F4 dose (concentration helps when experimenter-chosen; here learner-gated).

## Cost
6×1200-step trains + probes/evals (selfdir-scale; split across calls). Driver: lane-driver.js runLane3. Ledgers `d-lane3-{gated,fixed}-s{seed}.json` + verdict. NO PUSH.

## Amendment v10.1 (pre-verdict; pilot s0 ceiling under v10.0)
- Pilot s0 (2 ledgers d-lane3-*-s0.json, SUPERSEDED, kept): gated r1=50/r2=300/r3=850 vs fixed; both arms in-dist 1.0 AND long-4pair 1.0. Clean forward 4-pair generalizes FREELY from 1..3 (keys always distinct → lookup unaffected by length); R3-as-longer-forward is unnecessary, curriculum pointless on this substrate. Same lesson as the bug audit: filed long difficulty was the undefined-query bug, not length.
- v10.1: R3 = REVERSE-direction (query-by-value, distinct-values, 1..3 pairs — unseen format for both arms) instead of forward-long. Tests add rev (1..3 reverse, R3 distribution) + revLong (4-pair reverse, held-out from BOTH arms = transfer test). Ledgers `d-lane3b-{gated,fixed}-s{seed}.json`.
- Bars v10.1: R3-LEARNED gated rev >= 0.60 (quorum 2/3); GATED-REVERSE gated rev >= fixed rev + 0.10 (2/3); TRANSFER gated revLong >= fixed revLong + 0.05 (2/3); in-dist held |Δ|<=0.05. ABORT staircase narrowed to R2 gate <100 steps (R1 exempt: 1-pair space is 16 closed lines — 50-step pass is full-space competence, not probe-memorization; recorded, not voided).
