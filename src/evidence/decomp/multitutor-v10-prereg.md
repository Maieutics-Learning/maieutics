# Multi-tutor generality v10 (E1, countersigned)

Agent approval: this file. User countersign: 2026-11-23 (5 more experiments).

## Why
Bottleneck COMPRESSES rests on ONE tutor (s0, an assoc-echo tutor). If compression is a quirk of s0's state geometry, generality fails. Tests whether the rule survives the channel from other tutors' states.

## Design
Frozen-tutor bottleneck, recipe filed (8000st/B8/lr1e-3, distinct-values lines). Fixed cell K=4 sigma=0.5 (the COMPRESSES cell). Tutors s1,s2 (filed d-novel-tutor-s1/s2, gate PASS). R=3 student seeds (s=0,1,2) per tutor => 6 trains + 6 evals. Controls: scrambled-message per eval (chance ~0.25).

## Bars (quorum 2/3 per tutor)
- GENERALIZES: per-tutor mean intact >= 0.60 AND scrambles chance (0.15-0.35).
- TUTOR-SPECIFIC: one tutor passes while other fails (split => state-geometry matters).
- COLLAPSE: both fail.

## Expectation
GENERALIZES (tutor states all carry pair bindings via same recipe; echo differences are answer-side, student never sees answers).

## Nearest-failure
Bottleneck-v10 (single-tutor prototype; this is its filed follow-up).

## Cost
6 trains (~2 min each) + 6 evals. Reuses runBottleneckTrain/Eval.

## Ledgers
`d-bottleneck-train-K4-sig0p5-s{seed}-8000st-lr0p001-t{tutor}.json` scheme via learn-driver wrapper (tutorSeed param), evals likewise, `d-multitutor-verdict.json`. Transcript + CHATLOG. NO PUSH.
