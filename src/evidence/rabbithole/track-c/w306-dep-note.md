# Wave 306 (execution; backlog-W260 late-dependence injury, sandbox-zero-new-sims) 2026-11-12
STOP RULE: stopped after full-matrix analysis (n=23: w226-A/B + w243-A; seeds s7/s10/s11 x
sched x dose; dep50/100/200/400 vs hard4). 1 direct + 1 tangential below. Spend: 0 + 0.
Script scratch/track-c/w260-dep.js; grid w260-grid.json.

## Direct: dependence predicts, withdrawal signs, s10 decouples

- (a) PARTIAL: dep200 predicts fade decline moderately (fade spearman −.533, pooled −.412),
  dep400 weakly (−.317/−.242) — MID-late dependence beats terminal dependence (charter's dep400
  guess inverted). Within-seed dose gradients are uniform: dep200/400 rise with dose in all
  seeds while hard4 falls (s7 1.0→.92, s11 .973→.867) or flat-fails (s10 .83/.80/.837).
- (b) DIVERGENCE HOLDS: fade lowers dep200 AND dep400 vs const at same (seed,dose) in 14/14
  pairs (e.g. s10@2 dep400 .6107→.1444) — withdrawal uniformly de-relies. But hard4 signs by
  seed: s7 helped both doses (.943→.957, .857→.92); s10 cratered at low doses (.983→.83,
  .977→.80) but RESCUED at dose 2 (.737→.837); s11 flat at 1, hurt at 2 (.98→.867).
  Withdrawal's benefit is seed-signed, not dep-signed.
- (c) REJECTED-as-stated, UPGRADED: s10-fade dep dose-gradients (.074→.332 dep200) match s7
  (.045→.360) and s11 (.033→.427) — s10's no-window is NOT high-dep. It is dep-DECOUPLED:
  hard4 flat (.83/.80/.837) across a 4x dep swing. Same dependence in, failure out regardless —
  the injury is invariance to the knob, not its level.
- Verdict: USED with teeth (w306-dep-note.md is this file). Spawned W277 (decoupling probe).

## Tangential: decoupled failures need different graphs (0-spend, reasoning)

s10-fade breaks the "more dependence → worse outcome" graph by being flat, not by being steep —
the failure mode is a HORIZONTAL line through a sloped world. Horizontal failures are invisible
to correlational readouts (they attenuate the pooled −.41 toward zero while being the most
injured cell). Rule: before pooling, plot each seed×sched cell's outcome-vs-knob SLOPE; a ~0
slope with low outcome is a different disease (decoupling) than a steep slope (sensitivity) —
pooling them averages a disease with a mechanism. s10-fade's slope ≈ 0 is the finding; the
pooled −.53 is the blur. W261 (plateau-shape) inherits the warning: read shapes per cell first.
