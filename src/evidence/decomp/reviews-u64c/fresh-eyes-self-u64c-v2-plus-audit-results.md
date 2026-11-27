# Fresh-eyes U64c v1.1 round-2 (10 fresh barrage + 3 staff audit, sealed parallel)

**Premise:** `reviews-u64c/premise-u64c-v1.1.md`. **Replies verbatim:** `reviews-u64c/barrage-v1.1-1..10.md`,
`audit-{math,impl,rival}-v1.1-*.md`.

## Round-2 verdicts
- Barrage: 3 IMPLEMENTABLE (B6 independence, B8 logging-leaning-clean, B9 rival-contained) /
  7 NEEDS-PATCH (B1 coupon-under-diet, B2 DIAG-conflation + orT-ceiling, B3 K-miss-rate +
  ghost-EDGE, B4 det-control ambiguity, B5 explore-drag variance, B7 trigger-logs,
  B10 stream-accounting).
- Audit: MATH NEEDS-PATCH (E≈12 recompute; drag negligible-agree; 5 dead seeds s0/s2/s9/
  s12/s18 → needs 15/15 of rest) / IMPL IMPLEMENTABLE (ENFORCEABLE) / RIVAL IMPLEMENTABLE
  (regularization-rival noted; random-trigger arm absence filed as the hole — see ruling).

## Adjudication (all 8 ruled; derivations filed)
- B1+B3+audit(a) K-coverage: ADOPT corrected framing — coupon target was wrong (draws
  observed ≠ picks made). Correct: uniform PICKS over 4 qk, 10 picks → full-sweep
  P ≈ 0.78 (diet-independent); diet-mix governs which pairs are SHOWN, not picked.
  Rationale corrected to dilution-not-saturation (lock-in breaks without full sweep);
  K=10 KEPT with honest 0.78 coverage. B3's K≥20 demand rejected (saturation not required);
  audit's "reset-loop failure" rejected (no such mechanism — K fixed, exploit follows).
- B3 ghost-EDGE: ADOPT ENDPOINT-RATIONALE — ADAPT is the primary endpoint for a response
  claim (response acts in time; old exam measures final memory); EDGE secondary/
  confirmatory. One-legged WORKS = "response buys recovery speed, not final memory",
  honestly labeled. No bar change.
- B2+B4 DIAG: ADOPT DIAG-EXPLORE v2 — report orT−det (reset effect, filed−filed, no new
  compute) + detT−orT (explore effect; OUTCOME only — orT adapt saturates ≈1.0, ceiling
  noted) + detT−det (joint; adapt-half informative here). B4's det-reset arm demand
  rejected: det-reset ≡ orT (reset + immediate exploit — the arm EXISTS, filed). B2's
  det-vs-orT hardest test CONTAINED (filed−filed, reported in diagnostic).
- B5 drag: PARTIAL — scout's locus wrong (explore cost is training-time; two is
  frozen-eval; 30 slots = 3.75% of updates, second-order) but quantification habit right;
  filed as locus-corrected bound. Hardest test (20-seed EDGE check) is the verdict itself.
- B7 trigger-logs: PARTIAL — reconstruction is EXACT from (filed rule, K) (triggers =
  b+1..b+10; reset zeroes by construction), not probabilistic; twin determinism covers it.
  Adopted the cheap completeness item: exploreSlots (30 ints, derived) logged per ledger.
- B10 streams: PARTIAL — matched-trajectory framing rejected (cross-arm draw alignment was
  never claimed; armCodes differ by design; twins are within-arm). Real gap adopted:
  explore PICKS need a dedicated stream (else diet-draw consumption conflates with policy) →
  exploreRng = G.makeRng(53400+seed) filed (diet sampling policy-independent, twin-
  deterministic).
- audit(c) dead-seeds: ADOPTED as pre-registered analysis — s0/s2/s9/s12/s18 unpassable
  for RESP-ADAPT even at detT.adapt=1.0 (verified against filed dice adaptEarly:
  0.9733/0.96/0.9533/0.9267/0.96 → need +0.10 over each, impossible); quorum needs 15/15
  of the rest. Bar UNCHANGED (shape inherited from U64 deliberately); closeout reads a
  margin-count fail as designed-stringency. Zero-margin fragility disclosed, not tuned.
- audit-rival regularization (random-trigger arm hole): REJECTED as out-of-scope for U64c
  (random-trigger = shT-analog for the response track = U64d-adjacent question; filed in
  U64d's TIMING-analog slot if needed — no new arm here). Noted, not adopted.
- Score: 8 findings → 6 filed additions + 2 principled rejections. v1.2 = analysis/wording
  only (K kept, bars kept, trains kept).

## Output
Patched → `self-u64c-response-prereg.md` v1.2 (changelog in file). Round-3: fresh barrage
on v1.2 + 1 math-auditor (verify dead-seed list + coverage arithmetic), then red-team close.
