# Battery: U45-GATEINPUT prereg v1.0 -> v1.1 (R1 IMPLEMENTABLE + R2/R3 NEEDS-PATCH)
Reviewers: 3x sealed via root.generateText (labor only, never training signal).
R1: IMPLEMENTABLE, 4/4 HEALTH, no patches. R2: NEEDS-PATCH (H3 FAIL + 3 patches).
R3: NEEDS-PATCH (H3 FAIL + 3 patches).
Owner adjudication -> v1.1 pins (clarifications; NO bar changes):
- P1a (grads-flow, H3 FAIL x2 — legitimate precision): features F are deterministic
  functions of round-1 forward activations, recomputed fresh every forward (train AND
  eval). Gate weights w[25]+b are TRAINABLE (same Adam, init zeros) — learning them is
  the experiment. Feature PATHS carry first-order gradients into trunk params (E/W1/...
  via hv/carry activations) during training. At EVAL all weights are FROZEN from the
  ledger (no learning at eval, house standard) — the H3 "silent tuning" worry is void at
  eval by construction. No freezing of features (rejected: would test a different claim).
- P1b (PRED gap): metric as filed — mean-g(clean rows) MINUS mean-g(mismatch rows) >=
  0.10, both means filed in the eval ledger gate stats (paired scrub stream, N=200).
  R3's Accuracy-based restatement rejected (different metric; ours is gate-output
  separation, the D5-relevant quantity).
- P1c (twins): house-standard — two FRESH stacks from the same seed, P0 exact + one
  train step exact, per arm, gate params included (zeros-init identical trivially;
  1-step exact is the live check). Gradcheck is SEPARATE (FD vs analytic on w/b,
  worst <= 1e-5, 12 probes) — not "vacuously passing" (analytic zeros-init still must
  match numeric; a sign/scale bug fails it).
Result: v1.0 STANDS with pins -> v1.1. Execution: Wave 0 (gradcheck + twins) + 9T + 9E.

## P1a-amendment (pre-compute, construction necessity, NO bar change)
- f2 (curVoteDisagree = 1-maxVote/K, vote-COUNT based, piecewise-constant in the logits)
  is STOP-GRADIENT holder (a.e.-zero grad; nothing to flow). f1/f3/f4/f5 carry analytic
  first-order grads (verified in Wave 0 isolated checks): f1+f3 augment dHv (hvLog path),
  f4 augments the carry-input path, f5 adds E[qk]+E[vhat+4] embedding grads. P1a holds as
  "feature paths flow except where mathematically vacuous (f2)".

## P1d methods note (filed pre-compute, bar unchanged)
- Wave-0 FD eeps 1e-6 -> 1e-5 (driver header documents cause + eeps-sweep evidence:
  failing probe num==ana to 1e-11/1e-12 at 1e-5/1e-4, degrading below 1e-6).
  The 1e-5 worst-relative-error BAR is unchanged (house standard); only the instrument
  resolution was corrected, before any U45 compute. Wave-0 PASS recorded in ledger
  (worst 1.65e-6, 0/612 + twins 9/9).
