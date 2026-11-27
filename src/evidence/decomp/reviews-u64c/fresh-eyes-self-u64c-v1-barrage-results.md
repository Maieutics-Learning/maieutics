# Fresh-eyes U64c v1.0 barrage (10 sealed, parallel)

**Premise:** `reviews-u64c/premise-u64c-v1.0.md`. **Replies verbatim:** `reviews-u64c/barrage-v1-1..10.md`.

## Round-1 verdicts
- C1 K-arbitrary: NEEDS-PATCH (K=10 unjustified; bracket or derive or sensitivity).
- C4 orT-redundancy: NEEDS-PATCH (detT vs dice hides whether explore adds over reset;
  missing detT-vs-orT isolation).
- C6 firewall: SOUND (shape non-compliant, substance IMPLEMENTABLE — dice reuse valid,
  exam verbatim, no state transition; counted CLEAN).
- CLEAN: C2 (with FP-drift note), C3, C5 (with cold-start note), C7, C8, C9 (with
  reset-disabled hardest test), C10.

## Adjudication
- ADOPTED → v1.1: (a) K-DERIVATION (coupon-collector: E[slots to observe all 4 qk under
  uniform explore] = 4·H4 ≈ 8.33 → K=10 covers one full observation sweep per trigger +
  margin; filed, no new trains — answers C1 and C5's cold-start note). (b) DIAG-EXPLORE
  diagnostic (no quorum, verdict-time only): detT−orT margins (isolates explore over reset)
  AND detT−det margins (filed det = reset-disabled control — C9's killer test CONTAINED:
  if detT ≈ det, reset is inert) on outcome+adapt; filed interpretation (positive = explore
  adds; ~0 = reset does all the work — constraint for U66). (c) FP-DRIFT sentence (same-driver
  twins; cross-run drift ~1e-7 is 5 orders below +0.03 edge margin — cannot flip any bar;
  answers C2).
- REJECTED: none fully — C2/C5/C9 notes all converted to filed text above. C6 shape
  non-compliance noted (not counted against).
- Score: 2 findings → 3 filed additions (derivation + diagnostic + sentence). Re-running
  battery on v1.1 (fresh reviewers) + staff audit + red-team close next.
