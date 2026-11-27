# Fresh-eyes U64h v1.2 red-team results (10 sealed kill-shots, parallel)

**Premise:** `reviews-u64h/premise-u64h-v1.2.md` (frozen 2026-11-27). **Replies verbatim:**
`reviews-u64h/red-v1.2-1-5.md`, `red-v1.2-6-10.md`. **Method:** format red-team;
sealed, one Promise.all.

## Round-3 verdicts: 10 claimed kills → 2 adoptions (diagnostics), 8 rejected
- K1 burst untestable (SNR≈1 by construction).
- K2 disjoint-gate ambiguity (non-localizable error term).
- K3 orTrig proves nothing (shared blind-K response; LOOP-O guaranteed).
- K4 H-tree unreachable (orTrig always delivers LOOP-O).
- K5 D-graded too thin for step 4 (observability gap).
- K6 senMargin inverted (winner-take-all raises gaps; fires on calm).
- K7 disjoint streams void cross-gate comparison (apples-to-oranges).
- K8 burn-in bias makes bars unpassable (true-zero reference proposed).
- K9 blind windows delete tracking evidence (causal paradox).
- K10 gen-2 fiction (U64e verdict lacks generation counter).

## Adjudication
**ADOPTED → v1.3 (2, diagnostics only, no bars/behavior change):**
- D1 continuous-tracking enrichment (K5): D-graded reports per-switch latency
  (first trigger step − b[w]) and per-sensor precision (hits/nTriggers) by overlap
  class AND as a descriptive scatter over all 40 switches — not just the
  full/partial split. No quorum, no test; the thinness is still filed.
- D2 K6 rival-prediction check (K6): report per-sensor precision against the
  chance baseline 63/150 = 0.42 (hit-window coverage: random firing hits 42% of
  the time). If senMargin precision ≈ 0.42 while elevation sensors (if valid)
  exceed it with boundary-concentrated triggers, K6 is vindicated (concept dead,
  not miscalibrated) — checkable in-ledger, no new data.
**REJECTED with reasons:**
- K1 untestable (the separation of bursts from noise IS Gate 1 @quorum + FA cap;
  demanding pre-proof of what the experiment measures mistakes the hypothesis
  for a flaw; min-condition + quorum + FA cap are the filed SNR machinery).
- K2 ambiguity (the four combos valid/invalid × gain/nogain ARE the filed
  attribution table — SENSOR-ONLY vs ORACLE-ONLY vs CLOSED-LOOP-WORKS vs
  SENSOR-DEAD; formalism over a decision table).
- K3 guaranteed control (LOOP-O is MEASURED, not guaranteed — U64e orReset 16/20
  not 20/20, s9 counter-case filed; sharing the response is what MAKES it a
  control: response constant, trigger varies).
- K4 dead letter ("always" is unfiled certainty under new 53700 streams;
  SENSOR-DEAD reachable if orTrig fails; the COMMON case routes to ORACLE-ONLY,
  which is filed — expected-value confusion).
- K6 as kill (a hypothesis about unmeasured winner-take-all dynamics cannot kill
  a test of those dynamics; D2 keeps it as a checkable rival prediction).
- K7 streams (repeat of round-1 R4 without saying what v1.2 missed → STALE;
  draws per-arm disjoint by reads-only-validity precedent, weights shared by
  policy-comparison design).
- K8 true-zero (no absolute zero-point for surprise exists — that absence is WHY
  thresholds are relative; direction is conservative for elevation sensors;
  loop covers miscalibration via H2/H3 + follow-up).
- K9 paradox (triggers recorded PRE-PICK; monitoring passive during blind —
  U64e C2 lineage; the blind counter is deterministic, not signal-detected;
  nothing is deleted).
- K10 fiction (factually false: `d-newai-self-u64e-verdict.json` carries
  `"generation": 1` — filed and re-verified this round; W0 asserts against it).
**Score:** 2 diagnostics → 2 adoptions. 8 rejected (1 stale, 1 factually false,
rest answered).

## Output
- v1.3 patch (below) → premise v1.3 → focused re-close (6 fresh scouts; barren
  closes per loop-closure) → STANDS → countersign. Compute UNLICENSED throughout.
