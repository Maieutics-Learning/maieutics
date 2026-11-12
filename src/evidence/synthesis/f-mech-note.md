# F-mech — NMD-analog result (lean s603 vs ignited s602)

Status: RUN 2026-11-12 (post-hoc, no training; ~800 forwards).
Runner: scratch/f-mech.js. Raw: scratch/f-mech-s603-s602.json (killA),
scratch/f-mech-hd-s603-s602.json (killHd).

## Method
TOR-analog: same inputs, two models (memorize-lean s603: killA 1.00 /
killHd 0.365; ignited s602: 1.00 / 0.99), per-neuron mean|diff| of final
state (h=48) + depth-step attention entropy + prediction agreement.
Two exams: killA (both perfect — control) and killHd (behavior differs).

## Results
- killA: DIFFUSE (top-5 share 0.202, mean 1.07 ≈ median 1.01);
  attention entropy 0.001 both (fully sharp); predictions agree 200/200.
  When both models solve the input, their states differ everywhere a
  little and nowhere a lot.
- killHd: DIFFUSE state shift (top-5 share 0.234) BUT attention entropy
  0.396 (lean) vs 0.007 (ignited) — 56× gap; predictions agree only
  74/200. On held-out-distribution inputs the ignited model's read-out
  attention is razor-sharp while the lean model's spreads.
- Top-diff neurons differ by exam (killA: 28/12/26/13/16; killHd:
  26/16/27/32/36) — the shift pattern is input-distribution-dependent,
  not a fixed control set.

## Reading (priced, not proved)
Ignition is NOT a small set of "gen neurons" taking control (TOR-style
localization FAILS in this pair — state shift diffuse on both exams).
Ignition LOOKS LIKE attention sharpening on OOD inputs: same sharpness
in-distribution, 56× sharper out-of-distribution. This reframes the
tor.md F-mech hypothesis (later-layer control shift) toward a
readout-sharpening hypothesis: the lean model retrieves diffusely where
the ignited model retrieves decisively.

## Bounds (honest)
Post-hoc, one pair, correlational — no causal claim (sharpening could
be consequence, not cause, of correct retrieval). KillHd-only effect;
killA shows nothing. Follow-ups: (1) replicate across pairs (s604/s601
vs s603; s602 vs s608 severance); (2) causal probe — clamp/swap the
top-diff dims and test Hd movement; (3) track attention entropy across
generations in Phase 3 chains (does sharpening precede ignition?).
