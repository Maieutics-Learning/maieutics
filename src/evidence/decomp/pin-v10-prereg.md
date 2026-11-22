# Semi-supervised pin v1.0 (user-ordered 2026-11-22; agent approval: this file)

## What do I want to find out
v11 showed answer-free cycles collapse to echo from BOTH starts (B0 1.00→0.24-0.34,
echo 1.0, loss ~0.001): corrupting forward into echo is the easier gradient path
than learning reverse. Does a tiny labeled pin — 16 forward anchors, not a
curriculum — block the echo fixed point so the cycles can do the real work?

## Research check
In-repo only (assoc stack, soft-cycle machinery from novel-driver.js). Proceeding.

## Design
TUTOR start: filed 1-hop tutors d-novel-tutor-s{s}.json (forward skill anchor, s in {0,1,2}).
PIN SET (per seed): 16 fixed forward assocR lines (1..3 pairs), rng 15000+s. Fixed
for the whole run — a pin, not a curriculum.
ARMS (300 steps, Adam 5e-3, batch 8 cycle-sets + full 16-pin every step):
- pin-tutor: L = L_cycle_mean8 + L_sup_mean16. Cycle part is EXACT v11 soft
  L_A+L_B (+ bindLabels aux via auxFor, same code path). Sup part is CE on all
  16 anchors (mean) + bindLabels aux on anchors (finetuneFrom pattern, /16
  scaling). Equal gradient weight by construction (two means summed).
- anchor-only: same 16 anchors, same 300 steps, NO cycles (sup mean + aux).
  Control: pin alone teaches no reverse.
EVAL: identical v11 battery (B0/B1/B2/B3+echo, B4 long-reverse, B5 flip-reverse)
via runCycleEval. B0 on FRESH lines is the tripwire (memorizing 16 lines cannot
hold fresh-line B0 — only real forward skill does).
BARS (preregistered):
- P1 (pin holds): pin-tutor B0 >= 0.90, 3/3.
- P2 (cycles teach under pin): pin-tutor B3 > 0.35 quorum 2/3 AND anchor-only
  B3 <= 0.35 quorum 2/3 (lift comes from cycles, not the pin).
VERDICT logic: BLOCKS (both pass) / HOLDS-BUT-TEACHES-NOTHING (P1 pass, P2 fail)
  / OVERWHELMED (P1 fail — pin insufficient, echo wins anyway).

## Expectation (scored at verdict)
P1 PASS 3/3 (16 anchors held supmix's forward with 256 mixed; 16 forward-only
should hold fresh B0 — uncertain, honest 60%). P2 weak PASS (theory: pin forces
pF onto true vf, then L_A forces reverse(vf)->kf, the CORRECT mapping — the pin
turns the cycle from degenerate to instructive).

## Pre-mortem
Strongest objection: pin is memorized as 16 lines while general forward still
corrupts (fresh B0 dies anyway) — answered: B0 is on fresh lines, memorization
cannot pass P1, so P1 fail is the honest OVERWHELMED finding.
Most likely failure: cycle gradient overwhelms the pin (8 sets vs 16 anchors,
equal means — cycles may still win) — filed as OVERWHELMED with loss traces,
quantifies how much pin weight is needed (follow-up: lambda sweep).

## Nearest-failure
v11 cycle (differs: no labels at all, echo wins from both starts; here one
trusted fragment is added and nothing else changes).

## Cost
6 trains x 300 steps x (80 cycle + 16 sup forwards, h48) ~ 30-45 min + evals,
resume-safe.

## Ledgers
src/evidence/decomp/d-pin-tutor-s{s}.json, d-pin-anchoronly-s{s}.json,
d-pin-verdict.json. Driver: novel-driver.js (runPinTrain, reuses cycleStep +
runCycleEval).
