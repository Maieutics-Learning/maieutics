# Wave 351 (execution; backlog-W297 mixing-curve probe, sandbox) 2026-11-12
STOP RULE: stopped after 48-cell mixture grid (8 null cells x {w0,.25,.5,.75
sep-family + w1 sep-family + w1 pool-family}, N=20000, amended v2 rule;
16 endpoint receipts exact). 1 direct + 1 tangential below. Spend: 0 + 0 +
run. Script scratch/track-c/w297-mix.js; grid scratch/track-c/w297-grid.json.

## Direct: the bar breaks at the first mixture — and mixtures hump above both banks

- RECEIPT: all 16 endpoint cells bit-EXACT vs w280-grid.json (w0 == sep,
  w1-pool-family == pool — trial rng intact through the assignment stream;
  the mixture extends the validated rig, doesn't rebuild it).
- (a) PASS: w=0 range .0059–.0131 (the bar, exactly); pool endpoint .0234–
  .0278 (the scope, exactly).
- (b) REFINED-upward: the bar breaks at the FIRST mixture step in ALL 8
  cells (w=.25 min .0251 > .0131 — not one cell survives any pooling), AND
  the curve HUMPS: max .0336/.0394/.0343/.0281 at w=.25/.5/.75/1 — the
  mixture is worse than BOTH pure banks, peaking mid-mixture (w=.5 worst in
  6/8 cells). Not concave interpolation but a third regime: mixing
  ceiling-piled arms with spread arms creates variance-mismatched pairs
  that inflate the directional z beyond either homogeneous bank. Small-n
  (I6) cells hump most (.0394); I12 cells hump flatter (still above pool).
- (c) PASS: futility rides along — futSave share .28–.35 across all w
  (absolute futSave rises slightly with w; E[n] decomposition intact;
  revSave collapses under any pooling .3–1.0 → .05–.18 — reverse-side
  stops shrink as the positive tail fattens, the same amputation W330
  saw, deepened).
- (d) PASS: w=1 sep-family max .0281 vs pool .0278 (construction valid);
  bands stay narrow at each w (widths .007/.009/.015/.009/.006 —
  systematic across sub/timing/policy, not noise).
- Verdict: USED with teeth (w351-mix-note.md is this file). Endpoints
  exact + break-at-first-step + hump-above-both + futility-rides +
  construction-validated. Spawned W314 (break-localization: w{.05,.1,.15,.2}
  — does ANY pooling break it; hump onset).

## Tangential: mixtures are regimes, not interpolations (0-spend)

The natural mental model was a slider (sep → pool, monotone, concave).
The data is a hump (both endpoints below the middle). Rule: a mixture
weight is a NEW bank with its own physics (here: variance-mismatch
inflation), not a blend of two known banks — never interpolate validity
numbers across w, measure the curve. W330's scope amendment (.0131/.028)
needs a mixture clause: any w in (0,1) reads ABOVE .028 (up to ~.04).
