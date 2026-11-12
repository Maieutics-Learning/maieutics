# Wave 346 (execution; backlog-W293 LR-local NaN curves, sandbox) 2026-11-12
STOP RULE: stopped after 6 new cells x 20 seeds + 2 receipt cells exact vs
w259/w276 (LR.12 x B{4,16,32} ladder; LR{.15,.17,.2} bar-bisects B{24,24,96}).
1 direct + 1 tangential below. Spend: 0 + 0 + run. Script
scratch/track-c/w293-curves.js; grid scratch/track-c/w293-grid.json.

## Direct: four LR-local bars, all tightened, ordered by LR

- RECEIPT: exact (LR.2/B32 vs w259, LR.12/B8 vs w276, maxDiff 0) — the rig
  extends the validated line, doesn't rebuild it.
- LR.12 ladder (grade holds within-LR): NaN 13/0/0 across T .06/.03/.0212.
  The top rung breaks (B4 nan13) — the bar is bracketed from above now,
  not just below.
- Bar-bisects tighten all four zero-NaN bars (highest-T clean cell, lowest-T
  dirty cell]: LR.12 (.0424,.06] (B8 clean, B4 dirty); LR.15 (.0306,.0375]
  (B24 nan0 splits the old (.0265,.0375]); LR.17 (.0301,.0347] (B24 nan6
  splits (.0301,.0425]); LR.2 (.0204,.025) (B96 nan0 splits [.0177,.025)).
- The bars are ORDERED by LR: bar-top ~.02 (LR.2) < ~.031-.037 (LR.15) <
  ~.034 (LR.17) < ~.042-.06 (LR.12). Smaller LR, higher bar, more stable —
  the family is one LR-parameterized law, not four local accidents.
- Rescue re-tabulated by reference (zero new sims; B32 receipt re-run exact):
  LR.2 NaN 16/2/0 at B32/64/128 (w259/w259/w276/w259) — monotone rescue grade.
- Floor datum (free, same runs): LR.12 strands 8-13/20 everywhere it
  survives (B8/B16/B32: 8/8/13); LR.2/B96 settles 19/20. Survival is T's,
  landing is LR's — again.
- Pre-reg scored: (a) down-ladder clean (B16+B32 NaN 0) PASS; (b) matched-T
  .06: LR.12/B4 nan13 < LR.17/B8's 20 PASS (smaller LR blows up less,
  W325's inversion extended up-ladder); (c) B96 nan<=2 (got 0) PASS;
  (d) bars differ across LR PASS (4/4 tightened, ordered).
- Verdict: USED with teeth (w346-curves-note.md is this file). 4/4 pre-regs
  + 4 bars tightened + ordered family + rescue cited + floor datum. Spawned
  W310 (floor-grade audit: settle-among-survivors across the survival range).

## Tangential: ordered locals are one law with a parameter (0-spend)

W325 subscripted the collapse per LR (three local curves); this wave
shows the subscripts are ORDERED — bar-top rises as LR falls. Rule: when a
universal address dissolves into local curves, always check whether the
locals are ordered by the variable that broke them. Ordered = one law with
a parameter (bar(LR), monotone here); unordered = genuinely separate
regimes needing separate stories. The check costs one sorting of numbers
already on the table. W310 runs the same check on the floor (settle
fraction among survivors: grades with T within LR, or steps with LR?).
