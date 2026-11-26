# Detector-vs-paper gap analysis: why U60/U60b/U60c fail, and the success recipe (filed 2026-11-26)

**Question:** is the detector line a papers-mismatch, or something else? Answer: both — the
papers were ported as diets without their task structures, and our substrate lacks three named
mechanisms. Each gap below cites the filed brief, the failed prediction, and the repair.

## 1. Yu & Dayan (brief-15): we built half of one variable out of two, with zero consumers
- Paper requires: TWO uncertainty variables with DIFFERENT consumers — (i) expected (ACh analogue):
  within-context reliability → down-weight noisy cues (caution); (ii) unexpected (NE analogue):
  context switches → up-regulate learning/exploration (revision). "They must not share one scalar:
  E2c's failure (degenerate single disagreement detector, always ~zero) is exactly what a collapsed
  uncertainty representation predicts."
- We built: half of (ii) — switch elevation in carry (U60: 10/20) / priced excursion (U60b: 16/20,
  uninformative) / slow-trace absence (U60c: 0/20) — driving NOTHING. Zero of (i): our diet has no
  noisy-cue manipulation at all, so caution has no target. E-UNC1's crossed 2×2 (noise × switches,
  double dissociation, each detector with its own consumer) was never run.
- Repair: rule-switch diet (below) + BOTH arms with wired consumers from day one.

## 2. Aston-Jones & Cohen (brief-14): the point is WHEN, and ours is un-timed
- Paper requires: state-dependent gain driven by a utility monitor; "not add noise — WHEN to add
  noise"; entropy budget matched across arms so timing, not amount, is tested.
- We have: U50's constant-T win (diversity without timing — the paper's non-point) and a BLOCKED
  E-NE1 ("blocked until E2c's degenerate-signal failure is repaired"). U60/U60b/U60c confirm the
  blocker is real: the switch signal itself is degenerate/absent/uninformative. The brief names
  our exact state three generations early.
- Repair: E-NE1 as filed (TRIGGERED vs constant-T entropy-matched + adapt-speed double metric),
  gated on a learned (non-oracle) detector; oracle-switch allowed as control arm only.

## 3. Hasselmo (brief-16): no mode variable — always encode, never consolidate
- Paper requires: ENCODE mode (fresh input up, plasticity on, feedback suppressed) vs RETRIEVE /
  CONSOLIDATE mode (structure up, replay redistributes). Testable as scheduled multipliers with
  matched plasticity budgets (E-ACh1).
- We have: no mode. Every train step commits permanently (STC brief's complaint verbatim); replay
  redistribution never runs. Diet-only pressure under always-encode is precisely the regime that
  cannot consolidate by regime.
- Repair: E-ACh1 as filed (post-switch ENCODE window then RETRIEVE, budget-matched); pair with
  E-NE1 only after each passes alone (attribution discipline).

## 4. Redondo & Morris STC (brief-19): all commit, no tags — and our timescale is outside the window
- Paper requires: cheap local TAG (eligibility) + expensive global RESOURCE captured within a time
  window; most plasticity provisional. Filed signature: window-dependence (inside ≈ strong-task
  retention, outside ≈ weak-alone), yoked-tag control.
- We have: Adam commits every step; U60b's price is anti-tagging (forces commit every row instead
  of provisional-then-capture). Timescale mismatch additionally: weak-tag+PRP horizon ~30 steps
  (filed leftover) vs our 100-row quarters — even a tag would decay before capture.
- Repair: E-STC1 as filed (weak+strong pairing, inside/outside window, yoked control); design block
  lengths to fit capture windows or extend the window by design — never assume 100-row tags persist.

## 5. Abraham/Frey metaplasticity (brief-11): fixed lam=2.0 is the suspect, filed twice
- Paper requires: SLIDING thresholds tracking trailing activity (BCM θM: high activity → LTP harder;
  NMDAR priming: threshold shift 60–90 min, not blockade) + heterosynaptic facilitation windows.
- We have: fixed lam=2.0 everywhere (suspect per Turn-180 leftovers AND U52 synthesis P3-SPLIT).
  Uniform diets → uniform trailing activity → thresholds should slide to differentiate; fixed lam
  treats all rows alike (U34 over-chasing / flat lifts mechanism).
- Repair: BCM-scheduled aux (scale auxW/lam by trailing loss-drop) with inverted-scheduling control
  (if inverted wins, the analogy is backwards — filed falsifier) + yoked-tag control for STC.

## 6. Lippl (brief-09, highest stakes): rules OUT the easy excuse, points at binding
- Kill-switch (adjudicated): slope<1 + neutralize-collapse → kernel regime → architecture track.
  Our standing: U42 shortcut DEAD, compression real but leak-less → binding dynamics, NOT cheating
  (learnings §7.3). So the trunk is not a hopeless kernel — the failure is U37-style INDIFFERENCE:
  ablation changes nothing because nothing binds to the weights. Consistent with carry-overwrite:
  quarter never binds to state, so state stays indifferent to quarter.
- Repair direction this licenses: binding machinery (tags that bind experience to eligibility,
  subgraph routing that binds pieces to addresses) — not capacity (U35 already closed widening).

## 7. Turn-180 leftovers that name the substrate gaps directly
- (c) RULE randomization: U36 varied the MIX, never the RULE. Our quarters rotate on a FIXED
  schedule per trunk — a clock, not a surprise. There is nothing unexpected to detect; phase within
  a fixed cycle is expected uncertainty at best. Real unexpected uncertainty needs per-episode rule
  switches (new orders, new hot sets).
- (d) Astrocyte second-store: a SEPARATE slow store with its OWN learning dynamics biasing the fast
  store. U60c's trace was driver-side averaging with no plasticity — a thermometer, not an organ.
- (e/f) Subgraph-engram + hop-count routing: memory as routed subgraph (capacity combinatorial in
  links); our carry is dense-shared-everything, so regime marks fight the task for the same 8 dims
  with total interference. Route-not-widen (U35 closed widening; Wei/Kozachkov in U16 prereg).

## Success recipe (ordered, cheapest first; each its own prereg + battery + countersign)
1. Rule-switch diet + oracle controls: per-episode randomize rotation order AND hot sets; verify
   the task REQUIRES detection (oracle-gated arms must beat constant-diversity on outcome +
   adapt-speed; if not, the task doesn't need a detector — kill honestly).
2. Learned (non-oracle) switch detector approaching oracle performance; E-UNC1 double dissociation
   (caution × revision, each with its consumer).
3. Consumers with matched budgets: E-NE1 triggered gain + E-ACh1 mode scheduling (alone first,
   interaction only after both pass).
4. Provisional plasticity: E-STC1 window-dependence + yoked-tag control; block lengths fit windows.
5. Sliding thresholds: BCM-scheduled auxW/lam + inverted control.
6. Second store with own learning; subgraph routing for capacity without interference.
- Explicitly NOT licensed: any fourth carry variant (3 strikes, all signatures); fixed-schedule
  diets; detectors without consumers; constant-diversity re-tests; capacity widening (U35).
