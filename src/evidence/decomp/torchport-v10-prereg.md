# Torch-port track v10 — off-laptop compute, parity-gated

Agent approval: this file. User authorization: 2026-11-22 ("Lets try it" for the
torch-port + scale track; CPU parity jobs burn no quota).

## Why
The load-bearing objection over the whole program is scale: every bound (flat,
no-transfer, OPAQUE) might be a small-model artifact. Kaggle GPUs answer it, but
Kaggle runs Python-only and every filed result depends on the JS stack's exact
behavior. W2 proved a Python translation can be faithful (2.9e-14). This track
extends that proof to training, then to scale. Nothing downstream runs until its
gate passes.

## Phase P0 — torch forward parity on Kaggle CPU (this session, zero quota)
`src/port/torch_bench.py`: torch (float64) port of AttnModel.forward + param
loader (same JS param order as mirror.py). Verification job runs ON KAGGLE CPU
via the verified jobs lane (submit + poll + output; no machineShape → no spend):
single-file bundle (mirror.py + torch_bench.py + runner + embedded filed
d-novel-tutor-s0.json params), 200 reverse (rng 19000) + 200 forward (rng 19100)
lines generated independently in numpy-mirror and torch, argmax + max|dlogit|.
Bar: 400/400 argmax agreement AND max diff <= 1e-6 → FORWARD-PARITY, else
DIVERGED with diagnosis. Ledger `d-torch-p0-parity.json` (filed from job log).

## Phase P1 — torch training parity on Kaggle CPU (next, zero quota, own prereg)
Port backward/Adam/train loop (distill4 single round); trajectory parity vs JS
harness on fixed streams (same tutor, same rng streams, N steps): loss curves +
final-battery agreement within tolerance. Bar TBD in P1 prereg. Gated on P0.

## Phase P2 — scale ladder on Kaggle GPU (gated on P0+P1, weekly quota, own prereg)
h96/h192 (and torch-native arch variants only if P1 shows a hinge): which bounds
break with scale. Burns weekly use-or-lose GPU hours; submit Sat–Mon discipline
per kaggle-spend-plan. Gated on P1.

## Expectation (P0, scored at verdict)
PARITY (same math, float64; residual risk is transcription bugs, which the gate
catches). P1/P2 expectations filed in their own preregs.

## Cost
P0: one CPU kernel (~minutes, 0 GPU seconds) + bundle assembly here. P1: CPU
kernels. P2: GPU hours from weekly grant.

## Ledgers
`src/port/torch_bench.py`, `src/evidence/decomp/d-torch-p0-parity.json`,
this spec. Transcript + CHATLOG + CURRENT_TASK as usual. NO PUSH without order.
