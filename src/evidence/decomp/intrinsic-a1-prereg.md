## Intrinsic brain A1 — CLOSED-LOOP OWNERSHIP (prereg v1.1 AMENDED; battery-adjudicated 2026-11-23; supersedes v1.0 where they differ)

Agent approval: this file. Battery: fresh-eyes-intrinsic-a1-3x-results.md (3 sealed parallel; 1 accepted + 2 partial). Pre-countersignature: user pre-countersign 2026-11-23 (4 steps + intermediates + follow-ups; CPU/in-worker only) + user 2026-11-23 "feel free to use any of the pools materials if you want, just don't use extra resources as the panacea" — pool use filed below as review-labor only, never as mechanism. Battery owed before any driver. CPU/in-worker only; NO GPU; NO PUSH without explicit order.

### Owned decision (from skills synthesis 2026-11-23)
v11 verdict = PARTIAL (M HOLD 3/3; E HOLD-2/3 on Div; C calibration-and-parity without gain; wide-killer neutralizes diversity-accuracy; weight-diversity metric failed). Next is NOT harder static gain (still averages over someone else's selection), NOT metric-only fix (measurement not mechanism), NOT standalone bootstraps (reserve as repair). Next is A1: disagreement-selected rehearsal into carry with delayed cue-only query payoff. Static averaging cannot show arbitration or ownership; A1 must make disagreement decide what gets rehearsed into carry and be graded by delayed payoff.

### Amendment note (v1.1, battery-adjudicated 2026-11-23)
- R2 accepted: rehearsal budget renamed B_reh=2 (R=3 stays seeds-only — no collision). Disagree hook fixed: vote-split on the binding forward pass (5 head argmax votes on the bind line with current carry; disagree = 1 - maxVote/5; rank the 6 candidates, deterministic top-B_reh). Overlap fixed: per-head top-B_reh list identity (Jaccard/identical coverage; ~100% = functionally clones despite masks). Repair fixed: per-head data bootstraps reserved (each head trains on a different subset; not run now — fires only if overlap audit shows clones).
- R1 partial: joint-gate scoring explicit (OWNED = gain AND audit AND shuffle-collapse AND floor; COMPUTE-ONLY = gain holds but shuffle fails to collapse). v11 static gains (0/0.035/0.005) do NOT cap A1 rehearsal gain (different mechanism); no threshold move on reviewer prediction. Per-seed values + range on every ledger; effect-size gates, not p-values at n=3.
- R3 partial: Hebbian/static-associative rival filed as the interpretation of COMPUTE-ONLY (any rehearsal helps, selection irrelevant => shuf == own > rand). Composite-cue symmetry probe rejected as A1 gate (new task, not cheapest); parked as after-series. 6-to-20 load stress also parked as after-series capacity probe.

### Design (one trunk, one forward pass, selection owns the write)
- Base: Div population (K=5 fixed per-head subspaces, seeds 91000+seed, keep 0.6 masks regenerable eval-side) + 8-dim slow carry with learned forget, same MLP-trunk prototype deviation as v11 (1-layer trunk on flat+carry, 1-gap episodes; filed openly — tests population/carry/selection logic, not recurrence).
- Episode (all arms, twin-matched): Phase 1 observe N=6 candidate bindings sequentially (bind lines, carry updates normally). Phase 2 rehearsal budget R=2 extra passes through the SAME trunk (same forward/backward code path, no external queue, no command token): re-present selected items, carry updates via learned forget exactly as in normal experience. Phase 3 delayed query: cue-only query for one target uniformly drawn among the 6, unknown at rehearsal time (bind key withheld; distractor pairs avoid target key; probe asks held-out binding).
- Arms (same steps/B/lr/seeds, twin-matching rule from v11.1: shared init/LR/steps/rng-offsets except the lesion; LR/init sweeps to rescue a twin forbidden):
  - A1-own: rank 6 candidates by current population functional disagreement (1 - maxVote/K from the same forward pass), deterministic top-2 rehearsed.
  - A1-rand: same R=2 extra passes, uniform random selection (same compute, selection destroyed).
  - A1-none: no rehearsal passes (floor: does rehearsal matter at all).
  - A1-oracle: externally ranked by true difficulty (items the frozen pre-rehearsal model gets wrong; ceiling, never a bar).
  - A1-shuf: compute ownership ranking, then shuffle before write (same ranking compute + same writes, selection unlinked). Killer control with teeth (fresh-eyes staff-audit rule).
- Inbuilt status: ranking IS the forward-pass output (mean/vote/disagree computed every pass, as in v11 driver). Top-k is a deterministic harness budget (v11.1 R2 clarification), not a learned controller, not a call, not a tool. No pool LLM, no external re-query, no verifier is consulted at train or test. Pool materials (pool LLMs / src/pool/*) are review-labor only for the blind battery, never data, never labels, never capacity.

### Functional disagreement metric (A1 adopts; weight-cosine retired)
- v11 finding: weight mean-cos 0.9997-0.9998 in ALL arms including Div (metric-fail); functional meanDisagree 0.035-0.049 with calibration 0.38/0.12/0.22 HOLD 3/3 is the metric that survived. A1 bars use ONLY functional disagreement: per-item vote-split rate + calibration quartile gap. Weight-cosine reported descriptively, never gated.
- Selection audit must also report per-head top-k overlap: if the 5 heads' individual top-2 lists overlap ~100% (identical coverage), heads are functionally clones despite masks — file as MISSELECT-clone and trigger the reserved repair (per-head data bootstraps), not a metric patch.

### Bars (ledgers d-intrinsic-a1-*.json; R=3 seeds 0/1/2, quorum 2/3; per-seed values + range reported, v11.1 R1 rule)
- OWNERSHIP-GAIN (primary): delayed-query acc own >= rand + 0.05 quorum 2/3.
- SELECTION-AUDIT (primary): mean disagree(retained top-2) >= mean disagree(pool of 6) + 0.10 quorum 2/3, AND top-quartile enrichment >= 2x random expectation descriptively. Proves the selector looked at disagreement.
- SHUFFLE-COLLAPSE (killer, teeth): |shuf acc - rand acc| <= 0.03 quorum 2/3. If shuffle still wins, gain is extra compute, not selection → verdict COMPUTE-ONLY even if OWNERSHIP-GAIN holds.
- FLOOR (validity): own acc >= chance (0.25) + 0.10 = 0.35 quorum 2/3, else VOID (task too hard/easy — no ownership claim either way). Taken-acc reported; E-style accuracy floor from v11 kept.
- ORACLE-CEILING: oracle acc reported as ceiling, never a bar. Expectation: oracle >= own (sanity; if oracle < own, construction bug).
- Verdicts: OWNED (gain + audit + shuffle-collapse + floor all hold) / EMPTY (gain fails) / COMPUTE-ONLY (gain holds but shuffle fails to collapse) / MISSELECT (audit fails) / CLONE (per-head overlap ~100% → bootstraps repair owed) / FLAT-FAIL / VOID (floor fails). Nearest-failure: v11 PARTIAL (differs: static ranking without closed-loop write; here ranking owns the write and payoff is delayed).

### Cost / honesty
- Prototype ext to intrinsic-driver.js (~80 lines: episode loop 6+2+1, ranking hook reusing inForward vote/disagree, 5 arms sharing train path). Trains stay tiny-MLP cheap (minutes/cell, same 3000st/B16/lr5e-3 as v11). Risks: pool too easy (all 6 already known → rehearsal moot; floor catches); disagreement chases noise (accuracy floor + oracle ceiling catch); heads cover identical items (overlap audit → bootstraps repair, not extra width — extra width as solution is the forbidden panacea).
- Pool-use boundary (user 2026-11-23): pools may supply sealed reviewer labor for the battery (3 short calls, same as all prior batteries). They supply NO training signal, NO labels, NO rehearsal items, NO capacity. Any spec change that adds parameters, data, or outside compute to chase the bar is rejected as panacea-by-resources.

## Ledgers
`d-intrinsic-a1-train-<arm>-s<seed>-3000st.json` + `d-intrinsic-a1-eval-*` + verdict + driver ext + this spec + battery file. Transcript + CHATLOG + CURRENT_TASK as usual. NO PUSH without order.
