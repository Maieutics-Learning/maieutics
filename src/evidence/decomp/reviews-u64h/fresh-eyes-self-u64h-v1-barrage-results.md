# Fresh-eyes U64h v1.0 barrage results (10 sealed, disjoint angles, parallel)

**Premise:** `reviews-u64h/premise-u64h-v1.0.md` (frozen 2026-11-27). **Replies verbatim:**
`reviews-u64h/barrage-v1-1..10.md` (saved below from live replies R1–R10).
**Method:** format-3 barrage; sealed, one Promise.all; ≤150 words each.

## Round-1 verdicts: 10/10 NEEDS-PATCH (3 gloss adoptions, 7 rejected with derivations)
- R1 trailing-4 = smuggled calibration; flat-line killer test proposed.
- R2 Gate 1 soft-filter; log-inflation bypass; SENS-DEAD + orTrig test proposed.
- R3 senPick unimplementable on frozen weights (static lookup charge).
- R4 shared trunks correlate oracle with sensors; disjoint-seed fix proposed.
- R5 LINE-HALT/HALT missing from H-tree; burn-in halt transition question.
- R6 quorum collapse (thin full-switch + blind-drag noise floor); FA-cap-to-1 fix.
- R7 trailing-4 tuned to U64e dataset; 3-slot-jump scale-step test proposed.
- R8 pass/operation-order ambiguity; parity-check test proposed.
- R9 count-inflation rival; jitter-sieve + disjoint-slice fix proposed.
- R10 orTrig leaks into quorum; sensor-zeroed killer test proposed.

## Adjudication
**ADOPTED → v1.1 (3, all gloss/driver-level, no behavior change):**
- B1 burst-derivation gloss (R1+R7): 4 slots = measured burst (1–2 slots post-switch
  evidence) + minimal context for the min/max-condition to bite; 8 dilutes a burst
  (U64e measured), ≤2 cannot host a min/max-condition at all; relative-to-burn-in
  forced by filed B0 range (0.755–1.266). A-priori reasoning, nothing fit to
  outcomes (no U64h outcomes exist to tune to). H3 calibration-gap remains the
  honest loop if the scale is wrong.
- B2 flat-line W0 check (R1's killer test, converted): constant-m vector →
  assert zero fires for all three sensors (elevation: c > 2c false; collapse:
  c < 0.5c false; zeros: 0 > 0 / 0 < 0 false). Static, pre-run, alongside the
  per-sensor canned vectors. If a sensor fires on flat input, W0 HALTs.
- B3 verdict-order sentence (R5's question): order is PIN-FAIL → HALT (run abort,
  pre-verdict) → INCONCLUSIVE (floor) → Gate 1 → Gate 2; LINE-HALT checked on
  H-history (empty on gen 2, impossible — filed). A halt during W0/burn-in is a
  run abort, never a verdict (W0 gates, nothing filed).
**REJECTED with reasons:**
- R2 bypass (driver checks Gate 1 FIRST on the same arm; CLOSED-LOOP-WORKS needs
  SENSOR-VALID(X) && LOOP-S(X) conjunctively — high FA kills SENSOR-VALID, so a
  leaky sensor cannot promote; "log entries mimicking events" confuses the ledger
  (data) with the verdict rule (code)).
- R3 static lookup (r.s varies per slot because CANDIDATES vary per slot — diet
  draws differ each draw; surprise is draw-conditional under frozen weights, and
  post-switch draws come from a new hot. The policy-dependence (exploit picks
  old-hot) is filed in the sensor definition).
- R4 shared stream (draws are per-arm DISJOINT streams 53700+armCode; only WEIGHTS
  are shared — by filed design, since exam-time policy comparison requires
  identical weights. The charge misstates the design).
- R6 quorum (D-graded never gates — stated, thin by filed rule counts 7/33 which
  no reads-only design can change; blind-drag is a margin diagnostic, not a
  detection noise floor; FA-cap-to-1 is a bar move without derivation).
- R8 ambiguity (the NORMATIVE document defines pass/slots/pre-pick: 150-slot E1
  pass, slots 0..149, burn-in 0..7, checks t≥8, fire pre-pick; premise compression
  is by design — drivers implement the prereg, and the W0 twin + unit checks
  enforce identical interpretation).
- R9 count-inflation (hits must DISTRIBUTE: ≥2/3 of windows hit per seed — a
  single-window burst cannot satisfy detectRate; ±1 jitter cannot move a 21-wide
  [b,b+20] window).
- R10 oracle leak (sensors-zeroed + orTrig-alive returns ORACLE-ONLY — the CORRECT
  filed output and a labeled NON-WIN. R10 mistakes the enforcement for the leak:
  that is exactly the sensor-validity prerequisite working).
**Score:** 3 clarity findings → 3 adoptions (2 gloss + 1 W0 check). 7 rejected.

## Output
- v1.1 patch (below) → premise v1.1 → round-2 (fresh barrage + math/impl/rival
  audit) → red close → countersign. Compute UNLICENSED throughout.
