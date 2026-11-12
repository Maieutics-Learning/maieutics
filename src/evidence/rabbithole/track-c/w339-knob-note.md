# Wave 339 (execution; backlog-W287 knob-necessity audit, sandbox) 2026-11-12
STOP RULE: stopped after 3-bin leave-one-knob-out (A/B/C variants + base on
regenerated w253 trials; receipt deep-equal vs w253-grid.json; zero new sims).
1 direct + 1 tangential below. Spend: 0 + 0 + run. Script
scratch/track-c/w287-knobs.js; grid scratch/track-c/w287-grid.json.

## Direct: the GO bin is load-bearing, the .65 knob retires at 1.3e-5

- RECEIPT: res deep-equals w253-grid.json (vendored block untouched) — the
  audit prices the confirmed knobs, not re-fit phantoms.
- (a) CONFIRMED: clamping b6 1→0 costs +.009991 (capture 1.001→.002 — the set
  collapses to pooled). The cap.6 GO bin is load-bearing at 3x the
  second-knob price (.0035): necessity proven, keep unconditionally.
- (b) CONFIRMED-CHEAPER: clamping b65 .04→0 costs +.000013 (1.3e-5 — even
  less than W270's 6e-5 bin-local gap; capture 1.001→1.000). The .65 knob
  does NOT survive: RETIRE. With split-half flips (odd .04/even 0) already on
  the books, keeping it would be superstition at 8x below the .0005 bar. The
  necessary set is 2 taus {1 for cap.6, 0 elsewhere} at capture 1.000.
- (c) CONFIRMED: raising rest 0→.04 costs +.000008 — keep 0 (8e-6 of nothing;
  the zeros are real zeros, not missing small constants).
- Price table (loss): base .003209 | A .013200 (+.009991) | B .003222
  (+.000013) | C .003217 (+.000008). Necessity ranking: b6 >>> b65 ≈ rest.
  Updated ladder: 40=5=3 (sufficiency) → 2 necessary (1.000, −1.3e-5) →
  pooled/const (prices as before). The cheapest sufficient knob was a
  rounding error wearing a tau — retired in public with its number.
- Verdict: USED-strong (w339-knob-note.md is this file). 4/4 pre-reg incl
  receipt; every knob priced; retire-or-keep decided per knob with numbers.
  Spawned W304 (2-bin parsimony validation: split-half stability of {1,0}).

## Tangential: sufficiency counts, necessity weighs (0-spend)

W270 counted joints (5→3 free); W287 weighs knobs (3→2 at 1.3e-5, third knob
worth 770x less than the first: .009991 vs .000013). A sufficient set flatters
every member with the set's performance; leave-one-out makes each knob stand
alone with its price. Rule: never ship a sufficient set without the necessity
audit — the audit is one deterministic recomputation per knob, and it retires
exactly the knobs whose value lives below the bar. W304 checks the retired
set stays retired off-half (split-half {1,0} stability).
