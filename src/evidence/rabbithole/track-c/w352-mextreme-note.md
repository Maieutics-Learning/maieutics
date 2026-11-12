# Wave 352 (execution; backlog-W298 M-extremes probe, sandbox) 2026-11-12
STOP RULE: stopped after 8-cell M-extreme grid (combo-2.5 frozen + old +
flat-2.5 at M{45,2880} x N{2,80} x match{.05,.15}; FA + DET; w281 receipt
maxDiff 0). 1 direct + 1 tangential below. Spend: 0 + 0 + run. Script
scratch/track-c/w298-mextreme.js; grid scratch/track-c/w298-grid.json.

## Direct: combo's first hole — eh-zero collapse at small-M-low-rate; rivals swap corners along M

- RECEIPT: w281's 8 extreme cells combo FA+DET maxDiff 0 (same seeds/streams).
- (a) REJECTED-with-mechanism: combo holds 6/8 — holes at M45 x match.05
  (N2 .093, N80 .073), holds at M45 x match.15 (.023/.037) and everywhere at
  M2880 (.037/.01/.013/.01). The break is BI-noise-x-rate, not BI-noise
  alone: at bi=.05, M=45, eh~Binomial(45,.05)/45 reads EXACTLY 0 with prob
  .95^45 ≈ .099 — and any rule of form eh+k·se(eh) auto-fires there
  (tau = 0+0 = 0 < any d>0), printing a ~.07–.1 FA floor no k can remove.
  Observed .093/.073 bracket the .099 prediction — the mechanism is
  quantitative, not narrative. Combo needs a third term: a TAU FLOOR for
  eh≈0 (W315 prices candidates). W331's "no hole for a third term" was
  N-conditional; the M axis (at low rate) re-opens it.
- (b) HOLDS: old holes at M2880 x N2 (.39/.313 — kOld .365 under-covers, as
  predicted) and goes valid-but-dead at M45 x N80 (FA .073/.003 valid;
  DET .347/.07 vs combo .63/.233 — kOld=18.5 hyper-conservative, as
  predicted). Both halves of the pre-reg hold.
- (c) CONFIRMED: flat swaps corners along M exactly as predicted — holes at
  M45 (N2 .057/.053 marginal; N80 .337/.29 total — fixed c=2.5 can't cover
  dominant BI noise), valid at M2880 (.033/.017/.013/.003 — BI noise
  vanishes, deployment term suffices). N-axis certificate (W331) now has an
  M-axis mirror: each rival owns exactly one M extreme and collapses at the
  other (old owns M45-validity, flat owns M2880-validity).
- (d) CONFIRMED 4/4: DET combo ≥ old on all valid-old cells (0/0/+.163/0) —
  validity still costs nothing; +.163 at match.15-N80-M45 (the noisiest
  valid cell — reallocation signature fourth round).
- Artifact owned (one line): combo==old EXACTLY (FA+DET) at both N2-M45
  cells — coarse-vote quantization (1/24 steps) absorbing tau differences,
  not physics; N80 granularity shows the real gaps.
- Verdict: USED with teeth (w352-mextreme-note.md is this file). Charter
  question rejected WITH mechanism (eh-zero floor quantified .099 vs
  .093/.073) + rival M-mirror confirmed + reallocation fourth round.
  Spawned W315 (tau-floor third-term probe).

## Tangential: rules of form x+k·se(x) all die at x=0 (0-spend)

The combo form multiplies its protection by se(eh) — at eh=0 the
protection is exactly zero by construction, so the rule fires on pure
noise with both eyes open. Any threshold of the form estimate +
k·stderr(estimate) carries this singularity wherever the estimate can hit
a hard zero (counts, rates at small M). Rule: a threshold ships with its
zero-behavior stated (what fires when the estimate is exactly 0), and a
floor term is not a third mechanism — it is the form's own completion.
W315 prices the cheapest completion (floor candidates x M45 x match.05).
