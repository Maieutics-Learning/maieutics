# Fresh-eyes U64h v1.1 round-2 results (10 fresh barrage + 3 staff audit, parallel)

**Premise:** `reviews-u64h/premise-u64h-v1.1.md` (frozen 2026-11-27). **Replies verbatim:**
`reviews-u64h/barrage-v1.1-r2-B1-B5.md`, `barrage-v1.1-r2-B6-B10.md`,
`barrage-v1.1-r2-AUDIT.md` (MATH/IMPL/RIVAL). **Method:** format-3 barrage (10
new reviewers) + staff audit triple; sealed, one Promise.all.

## Round-2 verdicts: 13/13 NEEDS-PATCH (4 minor exactness adoptions, rest answered)
Two pileups (6 scouts on W0-vs-runtime phases; 4 on HALT-as-abort-vs-label) plus
one staff auditor who wrote their own pseudocode and then reviewed it.

## Adjudication
**ADOPTED → v1.2 (4, all minor clarifications, no behavior change):**
- C1 W0-vs-runtime phase gloss (B1/B2/B4/B5/B6/B7/MATH pileup): W0 checks
  (canned vectors + flat-line) run on CANNED CONSTANT INPUTS, never on exam data;
  run-time burn-in/doubling runs on live exam slots. Different inputs, different
  phases — they cannot interact. Six independent misreads of one sentence = the
  sentence was genuinely misleading; fixed.
- C2 HALT/PIN-FAIL recording gloss (B3/B6/B7/B9/B10 pileup): HALT and PIN-FAIL are
  run-abort OUTCOMES recorded in the wave log (and CHATLOG); the `d-*-verdict.json`
  file is written only when a run completes. The machine-readable enforcement
  covers outcome labels. This documents universal implemented behavior (all
  drivers throw on HALT/PIN-FAIL; no verdict file exists for aborted runs).
- C3 H1 exactness (IMPL gap 2): H1 iff mean triggers ≥3/pass AND mean hits <1
  (was "~0"); H2 iff mean triggers <1/pass; else H3. Same intent, now exact.
- C4 orTrig unit-check scope (IMPL finding 2): canned-vector + flat-line checks
  cover the three SENSOR trigger functions (121/122/123); orTrig has no signal
  function (positional trigger t∈{0,50,100} by construction — twin + crash-test
  cover it).
**REJECTED with reasons:**
- W0/burn-in interaction as kill (C1 answers it; premise already said "static,
  pre-run" — the pileup was real but the content was filed).
- Refractory-vs-cap (B3.1/B6.2/B8.2: refractory = min gap, cap = max total per
  150-slot pass; 20 « ~150 inter-boundary gaps; U64e ran this regime fine).
- Leaky-bucket rival (alternative throttle, same guard; throttle shape is nearly
  unobservable with ≤6 fires — contained, not distinguishing).
- Gate-1 laxity (B4.1: bar move without derivation; joint stringency is per-seed
  2/3 AND 15/20 quorum AND FA cap — same accepted structure as U64e).
- Gate-1 passive-logger (B5.2/B8.1: SENSOR-VALID IS the filed transition rule on
  trigger logs; sequential filtering over different inputs is exactly what
  sequential means).
- Burn-in contamination (B9.1: burn-in sits 1–8 slots post-switch; the transient
  decays in 1–2 slots per filed measurement so the 8-mean dilutes it; direction
  is conservative for elevation sensors; placement inherited from U64e unchanged
  — moving it on argument alone would be tuning-by-reasoning).
- Quorum collision (MATH.1: category error — 2/3 is PER-SEED over 3 windows,
  15/20 is ACROSS seeds; hierarchical bars, no collision).
- Weight-drift rival (MATH-rival: weights are FROZEN — drift is physically
  impossible in this design; incoherent).
- Window-slippage rival (single cluster cannot satisfy the DISTRIBUTED-hits
  requirement — ≥2 of 3 windows; ±1 jitter cannot cross a 21-wide window INTO a
  second window).
- IMPL invented-structure (auditor's pseudocode is their own invention —
  `hit_dist`, `val`, `W0_flatline` appear nowhere in the premise; the filed
  inequalities ARE the boolean mapping; H-thresholds now exact per C3).
- IMPL doubling-missing (premise compresses; normative prereg states exact
  inequalities — senMax in premise v1.1's design line; drivers implement the
  prereg and W0 twin+units enforce identical interpretation).
**Score:** 4 minor findings → 4 adoptions (2 gloss + 2 exactness). 9 rejected
(2 pileups answered, 1 incoherent rival, rest misreadings with pointers).

## Output
- v1.2 patch (below) → premise v1.2 → RED-TEAM closer on v1.2 (red closes loops)
  → barren closes → countersign. Compute UNLICENSED throughout.
