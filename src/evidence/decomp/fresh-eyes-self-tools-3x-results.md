# Fresh-eyes battery: self-tools prereg (3x sealed, parallel via root.generateText)

Goal line carried in every prompt (self-learning machine; directedness; newly-trained-AI prescription).

## R1 — IMPLEMENTABLE
1. Fresh-eyes paradox: F blends pass1 vs verify through the same Hv; without distinct projection or
   stochasticity the model risks confirmation bias (re-reads the same error). Patch: noise vector or
   different temperature on verify re-read. 2. Memory bottleneck: S=4 FIFO too shallow for
   multi-step chains. 3. Cold-start calibration (truncated): F must calibrate before M/R enable.
## R2 — IMPLEMENTABLE
1. Cold-start paradox: critic predicts own error but gates may saturate at 0/1 before calibration is
   met. Patch: high-variance noise floor on gate init to force exploration. 2. Memory bottleneck:
   S=4 FIFO may flush support context before query. Patch: priority (salience) eviction over FIFO.
   3. Echo risk (truncated): R and F both blend outputs...
## R3 — IMPLEMENTABLE
1. Dead-rehearsal gap: S=4 too shallow to replace rehearsal (A1/A2). Patch: bigger S or decaying
   priority buffer. 2. Symmetry break: shared-Hv blend with no disagreement penalty may converge to
   trivial identity (pass1 == verify), nullifying calibration. 3. Gating saturation (truncated):
   bounded sigmoids on narrow H48 trunk...

## Adjudication: 3 IMPLEMENTABLE → v1.1 pins-only
- ADOPTED (pin, not mechanism): critic/gate biases init 0 (σ=0.5, max-gradient start; directly
  answers R2.1/R3.3 saturation/cold-start without new machinery). Driver documents init.
- REJECTED with reasons: noise/temperature on verify (R1.1 — new machinery; verify input already
  differs [vhat1 fed back + fresh carry], and confirmation bias is MEASURED by F-GAIN: parroting
  fails the gain bar honestly); priority eviction / bigger S (R1.2/R2.2/R3.1 — S=4 fits the 4-support
  diet by construction; larger/priority is a licensed follow-up iff M reads); per-item loss
  additions (R3.2 — verify input differs architecturally so identity is impossible; collapse to
  constant-β is MEASURED by F-VITAL vitality bar); R2.3 echo (R blends compose means, F blends
  retrieve Hv — different readouts, no echo path); R1.3 staging (disagree-only fallbacks already
  in prereg for M/R).
- Watched risks (no new code; covered by bars): confirmation bias → F-GAIN; gate collapse →
  F-VITAL/R-VITAL; write-without-read → M-CTL comparison (choosy echo detector).
