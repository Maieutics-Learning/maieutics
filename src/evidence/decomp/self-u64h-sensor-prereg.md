# U64h-SENSOR (H-SEN1) prereg v1.3 — can the brain notice? (sensor validity first)
**Changelog v1.2→v1.3 (red round: 10 claimed kills, 2 adopted; details in
`reviews-u64h/fresh-eyes-self-u64h-v3-red-results.md`):** D-graded
continuous-tracking enrichment (per-switch latency + per-sensor precision
scatter, descriptive); K6 rival-prediction check (per-sensor precision vs 0.42
chance baseline from hit-window coverage).
**Changelog v1.1→v1.2 (round-2: 10 fresh barrage + 3 staff audit, 4 adopted; details in
`reviews-u64h/fresh-eyes-self-u64h-v2-plus-audit-results.md`):** W0-vs-runtime
phase gloss (canned inputs vs live slots — cannot interact); HALT/PIN-FAIL
recording gloss (run-abort outcomes live in the wave log; verdict file written
only on completion); H1 exactness (mean hits <1); orTrig unit-check scope
(positional trigger, covered by twin + crash).
**Changelog v1.0→v1.1 (round-1 barrage: 10/10 NEEDS-PATCH, 3 adopted; details in
`reviews-u64h/fresh-eyes-self-u64h-v1-barrage-results.md`):** burst-derivation
gloss (4 slots = burst + min-condition context; 8 dilutes, ≤2 can't host the
guard; relativity forced by B0 range); flat-line W0 check (constant-m → zero
fires all sensors, else HALT); verdict-order sentence (PIN → HALT → floor →
Gate 1 → Gate 2; W0/burn-in halts are run aborts, never verdicts).

**Track:** U64h (F4 follow-up, reviewer step 3 + standing sensor-validity rule,
2026-11-27). Reads filed U64 det trunks + U64b exam operators as ARTIFACTS; zero
new trains; 20 seeds; log everything.
**Cover:** drafted 2026-11-27 under reviewer-reply instruction; battery now (pool
labor); COMPUTE (80 reads-only re-evals) UNLICENSED pending fresh countersign on
this exact version. NO PUSH.
**Lesson encoded:** U64e proved the reset works when the trigger is right
(orReset +0.092, 16/20; orBlind ≈ same) and proved candidate-mean surprise never
fires (0 triggers in 3000 slots). Window-mean surprise is flat across windows
(U64e ledgers: w1 1.048 / w2 1.068 / w3 0.998 — no level shift to detect), burn-in
baselines vary by seed (B0 0.755–1.266 — absolute thresholds meaningless), blind
picks cost nothing (orBlind blindHit 0.73–1.0, diet is hot-heavy), and resets
sometimes hurt (orReset m3 down to −0.40 on one seed — false alarms cost real
accuracy). The failure is upstream of the mechanism. This track tests three
fixed alternative sensors with the trigger response held exactly constant.

## Design (reads-only on filed det trunks; E1 recovery windows ONLY; zero new trains)
- **Exam:** U64b E1 verbatim (50 slots per filed true boundary, diet-mix verbatim,
  correctness = picked qk ∈ current true hot, fresh qkCount per pass, frozen
  weights) with ONE change: fresh disjoint e1Rng draws
  `G.makeRng(53700+seed*104729+55+armCode)` (new base — no overlap with U64e 53500,
  U64b 53100, or training 42000; same reads-only-validity argument as U64b I2).
  E2 SKIPPED (ceiling, filed in U64b/U64d; reason filed here so reds need not flag
  it). Masks 91000+seed (U64-eval construction verbatim).
- **Why bursts, not levels:** U64e's trailing-8 + min-condition gate was built for a
  sustained mood shift; the closeout measured the actual event as a 1–2 slot jump.
  All three sensors use trailing-4 (burst scale: 1–2 slots of post-switch evidence
  + minimal context for the min/max-condition to bite; 8 dilutes a burst — U64e
  measured; ≤2 slots cannot host a min/max-condition at all; v1.1 gloss, no
  behavior change) + min/max-condition (false-alarm guard, same A1 logic as U64e). Thresholds are
  relative to per-pass burn-in (seed B0 range 0.755–1.266 forbids absolutes).
- **Sensors (fixed set; all use burn-in B0 = mean signal over pass slots 0..7,
  checks t≥8, refractory ≥20, cap ≤6/pass, fire evaluated PRE-PICK → clear
  qkCount + blind K=10 from blindRng `G.makeRng(53900+seed*104729+55+armCode)`
  (weight-blind, no fallback ever), then exploit):**
  - senMax (121, BURST-ELEVATION): slot signal = MAX over 6 candidates of r.s
    (a single spiking candidate survives averaging — the failure mode of U64e's
    mean). Fire iff trailing-4 mean > 2×B0 AND trailing-4 MIN > B0.
  - senPick (122, CHOICE-SURPRISE): slot signal = picked element's r.s (wrongness
    concentrates in the choice post-switch: exploit keeps picking old-hot).
    Same doubling rule on its own burn-in.
  - senMargin (123, MARGIN-COLLAPSE): slot signal = top1−top2 gap of s*n (old-hot
    vs new-hot competition collapses the margin). Fire iff trailing-4 mean <
    0.5×B0 AND trailing-4 MAX < B0 (mirror rule, same principled constants).
- **Controls:**
  - orTrig (124, oracle trigger, POSITIVE CONTROL for Gate 2): true-boundary
    trigger + same K=10 blind (blindRng same construction). Response identical
    to sensor arms — isolates the TRIGGER as the only difference.
  - dice: FILED U64b W1 dice ledgers, same seeds (never recomputed; rec1–3
    available for the rec1≈dice diagnostic).
- **No randTiming arm** (filed reason: timing-insensitivity already bounded by
  U64e RAND 11/20 <15; re-testing wastes cover; reds need not flag).
- **Ledger per (arm,seed):** {arm, seed, accRec, rec1, rec2, rec3, triggers,
  nTriggers, hits ([b,b+20], same window as U64e), falseAlarms, detectRate
  (windows with ≥1 hit / 3), B0, signalMeans per window (diagnostic), blindHit,
  blindPicks, rule, stackHash, examHash, driverHash, wallMs}. Full vector.
- **PIN:** stackHash literal on all 80 ledgers; rule-ID vs filed U64 rules.

## Bars (quorum 15/20; TWO-GATE — Gate 1 MUST pass before Gate 2 is interpretable)
- **Gate 1 — SENSOR-VALID(X)** (reads trigger logs ONLY + filed rules; stated here
  so reds need not cry firewall — the sensor gate is ABOUT triggers, unlike a win
  bar): #{s: detectRate_s ≥ 2/3} ≥ 15/20 AND mean falseAlarms ≤ 3/pass.
  (2/3 = catches the majority of switches per seed; FA cap = U64e F4 complement;
  both filed, no calibrated constants.)
- **Gate 2 — LOOP-S(X):** X.accRec ≥ dice.accRec+0.03 @quorum (X ∈ {senMax,
  senPick, senMargin}). **LOOP-O:** orTrig ≥ dice+0.03 @quorum (expected MET —
  proves the response works when the trigger is valid).
- **D-graded (diagnostic, never a bar):** detectRate/latency split by switch
  magnitude — full (0 shared keys, n=7 filed) vs partial (1 shared key, n=33).
  7 full switches are too thin for quorum; tracking is reported, not gated.
  v1.3 enrichment (K5): report per-switch latency (first trigger step − b[w]) and
  per-sensor precision (hits/nTriggers) by overlap class AND as a descriptive
  scatter over all 40 switches. No quorum, no test.
- **D-K6 (diagnostic, never a bar):** rival prediction that senMargin's collapse
  rule is inverted (winner-take-all raises gaps post-switch): report per-sensor
  precision against the chance baseline 63/150 = 0.42 (hit-window coverage —
  random firing hits 42% of the time). senMargin precision ≈ 0.42 with
  boundary-avoiding triggers while elevation sensors (if valid) concentrate near
  boundaries → K6 vindicated (concept dead, not miscalibrated). Checkable
  in-ledger, no new data.
- **D-rec1 (diagnostic):** per-arm mean rec1/rec2/rec3 margins vs dice (live arms
  rec1≈dice predicted, same D1 logic as U64e).
- **FLOOR:** max-arm accRec <0.40 on ≥6/20 → INCONCLUSIVE (same exam → same floor;
  sensitivity 0.35/0.40/0.45 at verdict time, disagreement → AMBIGUOUS-FLOOR).
- **Firewall:** Gate 2 reads ONLY {accRec, stackHash} + filed {dice.accRec,
  dice.rec1..3}. Gate 1 reads trigger logs + filed rules (sensor validity is
  definitionally about triggers). D-graded/D-rec1 never gate.

## Waves (COMPLETE-gated)
- **W0:** PIN + determinism twins (same trunk twice per sensor arm, incl monitor
  state) + trigger unit checks (canned vectors → filed expected fires per sensor;
  static, pre-run, on CANNED CONSTANT INPUTS — never exam data; v1.2 phase gloss:
  run-time burn-in/doubling runs on live exam slots in a separate phase and cannot
  interact with W0 vectors) + flat-line check (v1.1: constant-m vector → assert
  zero fires for all three sensors, else HALT) + burn-in margins (min b[0]−8 over
  20, logged) + crash-test + examHash COMPUTE-then-FILE + dry-run timing. n=3
  thin — gate only. Canned-vector + flat-line checks cover the three SENSOR
  trigger functions (121/122/123); orTrig has no signal function (positional
  trigger t∈{0,50,100} by construction — twin + crash-test cover it).
- **W1:** 80 re-evals (4 arms × 20) + verdict `d-newai-self-u64h-verdict.json`.

## Verdicts (machine-readable `verdict` field; sensor-validity prerequisite ENFORCED)
Order (v1.1 sentence, no behavior change): PIN-FAIL → HALT (examHash mismatch or
W0-gate failure: run abort, pre-verdict, never a verdict) → INCONCLUSIVE (floor)
→ Gate 1 → Gate 2; LINE-HALT checked on H-history (empty on gen 2 → impossible).
Recording (v1.2 gloss, documents implemented behavior): HALT/PIN-FAIL outcomes
live in the wave log (and CHATLOG); the verdict file is written only when a run
completes. The machine-readable enforcement covers outcome labels.
- **CLOSED-LOOP-WORKS** (SENSOR-VALID(X) && LOOP-S(X) for some X — sensor named in
  detail): the sensor is valid AND its triggers buy accuracy. The win condition.
- **SENSOR-ONLY** (SENSOR-VALID(X) && !LOOP-S(X) && LOOP-O): valid sensor, working
  response, no gain when sensor-triggered → precision/timing gap; follow-up =
  placement variant (own prereg + battery + countersign).
- **ORACLE-ONLY** (!SENSOR-VALID(any) && LOOP-O): mechanism works when told — same
  label as U64e, line continues. Downstream success NEVER promotes past this
  without a valid sensor (enforcement: the verdict field, not prose).
- **SENSOR-DEAD + shape** (!SENSOR-VALID(any) && !LOOP-O): H1 threshold-misfire
  (mean triggers ≥3/pass AND mean hits <1 — v1.2 exactness, was "~0": fires are
  noise) > H2 signal-absent (mean triggers <1/pass → nothing to threshold; new
  signal family needed) > H3
  calibration-gap (fires with some hits, quorum missed → revised principled
  threshold in a new prereg; post-data sweeps forbidden). First match fires.
- **INCONCLUSIVE** (floor) / **PIN-FAIL** / **HALT** / **LINE-HALT**.
- Generation g=2 (cites U64e F4; U64e was g=1); W0 asserts 2 ≤ 6 else HALT.
  H-line history empty → LINE-HALT impossible on gen 2 (filed).

## Filed expectations (Hypothesis, not bars)
- At least one burst sensor validates: the 1–2 slot post-switch evidence exists in
  max/pick/margin signals even though the 8-slot mean dilutes it.
- orTrig LOOP-O MET (response continuity with U64e orBlind).
- Full switches (0 shared) detect earlier/more often than partial (1 shared) —
  tracking diagnostic, direction filed.

## Falsifiers
- Stream-base changes, K/threshold/refractory/cap/sensor-set moves post-data, E2
  added post-data, bar moves post-data, Gate-1/Gate-2 reordering post-data → new
  version + battery + countersign.
