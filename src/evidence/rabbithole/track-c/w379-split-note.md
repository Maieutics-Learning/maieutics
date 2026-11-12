# Wave 379 (execution; backlog-W321 split-robustness, zero new sims) 2026-11-12
STOP RULE: stopped after 2-split x 2-half x 3-bin tau refit on w287
poolTrials (receipt deep-equal). 1 direct + 1 tangential below. Spend: 0 +
0 + run. Script scratch/track-c/w321-split.js (helpers + poolTrials regen
133/133 line-verified from w287-knobs.js); grid scratch/track-c/w321-grid.json.

## Direct: b65 flips inside every split — the knob is unstable, not the split

- RECEIPT: res deep-equals w253-grid.json (regenerated poolTrials bit-match
  the w287 rows) — the audit reuses the validated trials, doesn't rebuild
  them.
- (a) PASS: b65 flips on BOTH splits — depParity even→0 / odd→.04, idx100
  first→0 / second→.04. Each split holds one 0-half and one .04-half, so the
  flip is not split-specific (not an i-parity artifact, not a dep-parity
  artifact): the .04 survives in exactly half the halves. Knob-unstable.
- (b) PASS: b6 stays 1 and rest stays 0 on all four halves — the
  load-bearing knobs are split-stable; only the vestigial knob wobbles.
- (c) PASS: per-half captures 1.004 / 0.995 / 1.006 / 0.992 (global price
  denominator) — the instability is in the knob VALUE, never the
  performance. Prices sit at ~1e-5 either way; retiring b65 was free.
- Mechanism, owned: bestTau keeps the EARLIEST tau on ties (strict <), so
  the 0-halves are exact ties-or-worse (edge 0.0) while the .04-halves hold
  a hair of real edge (2.5e-5, deterministic, not a tie). The fitted tau is
  a tie-break readout of noise at 1e-5 scale — below any price that matters.
- Verdict: USED with teeth (w379-split-note.md is this file). Flip on every
  split + stable load-bearers + ~=1.0 captures + tie-break mechanism priced
  to 2.5e-5. Spawned W338 (quadrant-cross audit, zero new sims on w321
  poolTrials: 2x2 depParity x idx100 per-quadrant b65 taus + edges — is the
  .04 edge carried by one quadrant (odd-d x second-100); capture per
  quadrant).

## Tangential: fit the knob, then price the knob

- The full-data fit said .04; the halves say 0 half the time; the price of
  the disagreement is 1.3e-5 — four orders below the pooled price. Rule: a
  refit that moves the knob but not the loss retires the knob, it doesn't
  refine it. Stability audits end in prices, not in taus.
