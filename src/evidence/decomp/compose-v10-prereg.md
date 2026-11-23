# Compose v10 — length transfer + first composition step (FROZEN for review battery)

Agent approval: this file. User countersign: 2026-11-23 "go ahead and try and improve this, and figure out a way to tackle composing" (bench scale, in-worker/CPU only; R=3 quorum 2/3; NO GPU; NO PUSH without explicit order).

## Project
Small-brain composition at bench scale. Filed walls: reverse-long transfer 0.30-0.53 everywhere (K4 A revlong 0.35/0.345/0.41 mean 0.368; K8 A revlong 0.395/0.44/0.485 mean 0.44) while forward-long holds (K4 0.905/0.82/0.875; K8 0.985/0.935/0.985); composition ops at zero/chance (verifier R2 shift 0.035/0.105/0.05 systematic lure-answering; parity 0.25/0.29/0.255 chance; from-scratch probes shift 0.385 FAIL, parity 0.325 FAIL, gate 0.50). Goal: (1) lift reverse-long by removing the length OOD, (2) establish whether a 2-step op (shift = retrieve + k mod 4) can be added alongside the base skill without erasing it.

## Design
- L LONG-MIX (channel K=8/sig0.5, MiniMLP student, frozen filed tutor): R1 identical to composite (forward assocR 1..3 to frozen forward-probe >= 0.90 or 2500 steps, probes every 50). R2 = 8000 - r1 steps, batches of 8 = 3x uniform reverse-distinct 1..3 + 3x uniform reverse-distinct 4-pair (bnGenReverse, distinct keys+values, clean — avoids H2/H3 duplicate-key poison) + 2x random forward-replay 1..3. Uniform (select hurts on channel, E4), no price (decorative, E1). New rng streams (base 51000+seed) so filed K4/K8 streams stay bit-identical.
- S0 SHIFT-ONLY (attn h48/m96/d16 from scratch, same recipe as filed probes: 150 shift lines, 800 steps, batch 16, lr 5e-3, attnAux true): supervised shift ceiling, R=3. genShift bit-identical to novel-driver (3 distinct pairs, qi, k=1..3, y=(v+k)%4, echo=v, x=flat+[qk,k,8]). New seed-matched rngs (train 52000+seed, test 52100+seed).
- S1 FORWARD+SHIFT JOINT (same attn recipe, 150 forward 1..3 + 150 shift lines, shuffled, 800 steps): tests whether the new op composes with the base skill. Same evals as S0.
- Evals (frozen, seed-matched): L = composite battery (200 each: fwd 1..3, flong 4, rev 1..3, revlong 4-pair distinct, scrambled control). S0/S1 = 200 forward 1..3 + 200 shift lines (fresh test rngs, same for S0/S1 per seed).
- Gate firewall: L gates read ONLY the frozen R1 forward-probe; R2 length-mix never gate-visible. S arms have no gates (fixed 800 steps, probe recipe). Nothing else gate-visible.

## Bars (quorum 2/3; verdict d-compose-verdict.json)
- LONG-LIFTS: L revlong - K8A revlong >= +0.10, paired by seed (K8A refs 0.395/0.44/0.485).
- LONG-HOLDS: L rev >= K8A rev - 0.05 (refs 0.835/0.81/0.815) AND L fwd >= 0.80.
- SHIFT-CEIL: S0 shift >= 0.50 (probe PASS gate), 2/3. Retests filed 0.385 single-seed probe at R=3.
- JOINT-COMPOSES: S1 shift >= 0.50 AND S1 fwd >= 0.80, 2/3 (both hold = op added without erasing base).
- JOINT-KEEPS (secondary): S1 shift >= S0 shift - 0.10, 2/3 (mixing doesn't tax the new op).

## Expectation (filed open)
LONG-LIFTS HIT (revlong is OOD length, mixing fixes it) + LONG-HOLDS HIT; SHIFT-CEIL FAIL (probe 0.385 stands, shift needs more than 150 lines/800 steps); JOINT-COMPOSES SPLIT (fwd PASS, shift FAIL — same op boundary as verifier shift ~0); JOINT-KEEPS HIT (mixing is neutral, verH-style poison needs duplicate keys which shift avoids).

## Nearest-failure
- Composite E2 (K8 BOTH-HELD rev 0.81-0.835, revlong 0.395-0.485; differs: length-mix in R2).
- Filed shift probe 0.385 FAIL / parity 0.325 FAIL (differ: R=3 + joint arm).
- verX frontier shift 0.035-0.105 systematic zero, parity chance (differ: supervised joint instead of stacked verifier cycles).
- verH H2/H3 CORRUPT (duplicate-key diet poisons; differs: shift uses distinct keys only; parity with duplicates deferred to post-verdict extras with explicit diet-fragility warning).

## Cost
9 trains (3 channel-K8 ~2-4 min each + 6 attn ~1.5-2 min each, split across calls, COMPLETE-gated) + 15 frozen evals. Driver: compose extension in lane-driver.js (runComposeLongTrain/Eval + runShiftTrain/Eval; reuses bottleneck + probe recipes; filed composite/probe streams untouched). NO PUSH.
