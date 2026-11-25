# Fresh-eyes battery: self-u31d-resample-prereg.md v1.0 (3x sealed, parallel)

Method: file text read from workspace + 3 parallel reviewer calls (reviewer labor only, never training signal). Each reviewer saw ONLY the prereg + ≤150-word return shape (VERDICT / patches / HEALTH / cheapest killer).

## Verbatim
U31d-R1: VERDICT: NEEDS-PATCH. Patches: (1) P1 logic: permuted-p only proves gate utility vs random, not necessity vs retry-all — P1 must compare sel-retry vs all-retry. (2) Tie-handling: ties->forced biases toward original error; subtract tie-count from LIFT numerator. (3) DETERM needs explicit epsilon for Float64. HEALTH: yes/yes/yes/yes. Cheapest killer: all-retry vs sel-retry; if all lift not > sel lift, gate is placebo.
U31d-R2: VERDICT: IMPLEMENTABLE. Critiques: LIFT +0.05 low vs SE~0.03 (lucky-sample false positive risk); P1 is the real killer control (sel matched by shuf = gate useless, retry may still work); ties->forced is conservative, report tie-rate primary; DETERM essential. HEALTH: 4x yes.
U31d-R3: VERDICT: IMPLEMENTABLE. Critiques: (1) non-binding P1 hides gate-null behind retry-positive. (2) Ties->forced underestimates LIFT. (3) DETERM essential. Cheapest killer: sel-retry vs all-retry; no gain over all = gate is efficiency-only. HEALTH: 4x yes.

## Adjudication (2x IMPLEMENTABLE + 1x NEEDS-PATCH -> v1.1 pins, no design change)
- ACCEPT (R1+R3): gate-vs-retry confound is real. P1a: binding GATEVAL bar (sel >= all minus 0.02, 2/3, + cost ratio) + verdict split RETRY-WORKS+GATE-VALUABLE vs RETRY-WORKS+GATE-PLACEBO.
- PARTIAL (R1-ties, R2/R3-ties): policy unchanged (conservative by construction); P1b adds tie-rate as primary metric + tie-excluded LIFT reporting.
- ACCEPT-CLARIFICATION (R1-DETERM): P1c pins 4dp-exact comparison; determinism expected, no epsilon at 4dp.
- REJECT-WITH-MATH (R2-threshold): no bar move on reviewer opinion alone (skill rule); P1d files chance math (joint ~= 0.017 at quorum). Bar stands.
Round score: 2 accepts + 1 partial + 1 clarification, 1 reject-with-math. v1.1 filed in prereg. Proceed to driver + 3E.
