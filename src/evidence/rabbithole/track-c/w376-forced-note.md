# Wave 376 (execution; backlog-W318 forced-maxed overshoot pricing, sandbox) 2026-11-12
STOP RULE: stopped after paired inherited-vs-maxed retry on w284 seeds
(7 tail cells x 300 seeds; receipt clean). 1 direct + 1 tangential below.
Spend: 0 + 0 + run. Script scratch/track-c/w318-forced.js (rig 110/110
line-verified from w284-tail.js + 1-line K0/B0 initial-condition param);
grid scratch/track-c/w318-grid.json.

## Direct: starting maxed wins 27-31x in all 7 tail cells — the climb is pure latency

- RECEIPT: nGt150 + rounded retry-wall exact (0/0) vs w284-grid across all
  7 tail cells — the forced arm differs ONLY in initial (K, bias).
- (a) REJECTED DECISIVELY: pre-reg said maxed loses on wall in ≥6/7 (attempt
  bill dominates). Actual: maxed wins 7/7 by 27-31x (wallRatio 0.032-0.037;
  inh 202-252 vs maxed 7-8.6). At (12, 0.8) every target type covers at
  q=0.95/attempt, so all 20 targets fall in ~2-3 serves: wall ≈ 3.5 plus one
  protocol-wasted retry (≈7 total — the w284 retry loop always spends one
  retry; both arms pay it, receipt intact; unwasted it would be ~50x).
- (b) PASS: first-try done@150 is 1.000 for maxed in ALL 7 cells (vs
  0.857-0.993 inherited — wins 7/7 outright). Finishes more, pays less.
- (c) REFINED: fattest-tail cell (consec pf0.02 PL8, n=43) ratio 0.034 vs
  best 0.032 (consec pf0.03 PL4) — direction right, spread tiny (0.032–0.037).
  The real pattern is flatness: maxed wall is ~constant (7-8.6, phantom-load
  only) while inherited spans 202-252. "Where maxed beats inherited" =
  everywhere; the margin tracks inherited climb latency, not cell type.
- Bill split: maxed attempts-share HIGHER (0.68 vs 0.42-0.44) yet absolute
  attempts ~10x lower (12×3 serves vs 2×200 serves). Shares without levels
  invert the story — the fourth member of the normalize-carefully family.
- Verdict: USED with teeth (w376-forced-note.md is this file). Decisive
  pre-reg kill + exact receipt + bill-split mechanism (climb latency, not
  config cost) + flat-ratio refinement. Spawned W335 (maxed-on-clean-cells
  + climb decomposition, zero new sims on w284 rows/seeds: forced full+retry
  on the 2 zero-tail cells — does maxed win where there is no tail;
  inherited-wall decomposition into stall-serve vs phantom-serve vs attempts
  share — name the latency).

## Tangential: price the climb, not the config

- The inherited ~200+ wall is all climb latency from (2, 0.05): S=8 stall
  detection + escalation steps + phantom stalls. When max config is always
  eventually needed, any adaptive climb is pure overhead — adaptivity only
  pays when the world sometimes doesn't need max. The 2 clean cells decide
  whether climbing ever earns its keep (W335). Rule: a config policy's cost
  is the integral of the climb, not the price of the destination.
