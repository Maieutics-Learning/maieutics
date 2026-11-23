# P1 — torch training parity (torchport-v10 phase P1)

Agent approval: this file. Pre-countersignature: 2026-11-22 STEP 1 (CPU only, zero GPU spend).

## Why
P0 proved torch forward === JS forward (1.15e-14). Training is the real port:
torch autograd must reproduce the JS hand-written backward (full BPTT through
recurrence + attention) AND the exact Adam/loop semantics. Until a torch round
matches a JS round, P2 scale means nothing.

## What gets ported (all CPU-verifiable)
- `cycleStep` loss as ONE scalar per set: L = -log(E+1e-12) - log(E2+1e-12) from
  the same 10 forwards (F, 4xRV, R, 4xFK), plus bindLabels aux CE terms at the
  same 1/(B*len) scale. JS equivalence note (filed in verdict): per-job
  dSoftmax(soft(z),g)/B + accumulated manual backward === backward of
  (sum L_set)/B + aux terms, by linearity + chain rule through the -log.
- `distillStep` KL(teacher||student): L = sum_lines sum_i pt_i*(log pt_i -
  log ps_i)*(W/B), teacher detached.
- Adam: torch.optim.Adam(lr=5e-3) — defaults betas (0.9,0.999), eps 1e-8 match
  nn.js exactly. One opt.step() per round-step, fresh optimizer per round
  (re-anchor semantics preserved).
- Streams: mirror.py Rng (proved exact) with the SAME seeds as JS
  (rng 15000+s / drng 15100+s), B=8, W=4, 300-step round recipe.

## Bars (ledger d-torch-p1-parity.json, from Kaggle CPU job logs)
- P1a single-batch grad parity (fixed filed-tutor params, fixed first-step
  batch): max relative param-grad diff <= 1e-6 → GRAD-PARITY. This is the sharp
  test: autograd vs hand-BPTT must agree or the port is wrong.
- P1b 10-step trajectory (same streams both sides): per-step (cyc,con) loss
  relative diff <= 1e-6 AND final-param max abs diff <= 1e-5 → TRAJ-PARITY.
  (Slightly looser params bar: accumulation, not bug, is the expected drift;
  per-step growth rate diagnoses chaos vs error.)
- Verdict TRAIN-PARITY iff both pass; else DIVERGED with step-of-divergence.
- JS side: novel-driver.js += runP1GradDump (one canonical first step: 8x
  cycleStep + distillStep B=8 W=4 on streams 15000/15100+s=0, dumps per-param
  grads + losses) and runP1Traj (10 full steps + per-step losses + final
  params). Torch side: torch_bench.py += forward-with-posOut, cycle/distill
  losses, Adam loop, same dump format. Kaggle CPU bundles as P0 (no imports of
  own parts; user/slug versioning).

## Expectation (scored at verdict)
TRAIN-PARITY, tight on P1a (math is math; autograd differentiates the same
ops), with P1b inside tolerance (10 steps should not chaotic-diverge at
float64). Residual risk: aux-scale transcription slips — which P1a exists
to catch line-by-line.

## Cost
Two CPU kernels (grad job seconds, traj job ~minutes), zero GPU. JS dumps
in-worker (minutes).

## Ledgers
`d-p1-js-grad.json` (JS grad dump), `d-p1-js-traj.json` (JS traj dump),
`d-torch-p1-parity.json` (job verdicts), torch_bench.py additions, this spec.
Transcript + CHATLOG + CURRENT_TASK as usual. NO PUSH without order. P2
(GPU scale) needs a fresh order: P1 passing does NOT authorize spend.
