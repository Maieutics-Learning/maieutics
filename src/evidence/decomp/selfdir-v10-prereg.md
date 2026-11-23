# Self-directed pilot v10 (E4 / rung-3 pilot, countersigned)

Agent approval: this file. User countersign: 2026-11-23.

## Why
Rung-3 asks whether the learner's own choices beat random under equal budget. No precedent for brain-side data choice (all historical selection was experimenter-side). Pilot at bench scale decides if a full rung-3 is worth it.

## Design
Task assocR 1..3 pairs, attn h48/m96/d16, 1200 steps B16 lr5e-3 attnAux+bindLabels (decomp recipe). Two arms, same budget:
- RANDOM: uniform online sampling (recipe default).
- SELF: uncertainty sampling — each step draws 8 candidates, scores by current-model answer-CE (one forward each, no grad), trains on top-4 hardest + 4 random (keeps coverage; avoids collapse to one regime). Overhead ~2x forwards, same grad steps.
Eval: fresh 200 in-dist + 200 5-pair long (B1). R=3 seeds (s=0,1,2).

## Bars (quorum 2/3)
- SELF-HELPS: self in-dist >= random + 0.05 with long held.
- NO-DIFFERENCE: |diff| <= 0.03 both evals.
- SELF-HURTS: self < random - 0.05 (hard-mining poisons, like verH diet lesson).

## Expectation
NO-DIFFERENCE or SELF-HURTS (verH: echo-heavy diet poisons everything; hard-mining risks the same; filed openly).

## Nearest-failure
verH H2/H3 (diet poisons; differs: experimenter diet vs learner-chosen). F4 dose (experimenter concentration helps; here choice is learner-side).

## Cost
6 trains (~2 min) + 12 evals. learn-driver.js runSelfDir.

## Ledgers
`d-selfdir-{random,self}-s{seed}.json` (train+eval combined), `d-selfdir-verdict.json`. Transcript + CHATLOG. NO PUSH.
