# Fresh-eyes U64c v1.2 round-3 (10 fresh barrage + 1 math-audit, sealed parallel)

**Premise:** `reviews-u64c/premise-u64c-v1.2.md`. **Replies verbatim:** `reviews-u64c/barrage-v1.2-1..10.md`,
`audit-math-v1.2-11.md`.

## Round-3 verdicts
- Barrage: 6 IMPLEMENTABLE (B3 washout-graded, B4 det-control, B5 explore-policy, B7 logging,
  B8 trigger-audit, B9 rival) / 4 NEEDS-PATCH (B1 K-coverage-0.95-demand, B2 verdict-name,
  B6 drag-derivation + misc, B10 K-post-hoc).
- Audit-math: IMPLEMENTABLE with verified numbers AND one arithmetic error of its own —
  dead-seed list CONFIRMED (each listed seed needs >1.0: s0 0.9733→1.0733, s2 0.96→1.06,
  s9 0.9533→1.0533, s12 0.9267→1.0267, s18 0.96→1.06; no missed seed ≤0.90); coverage
  RECOMPUTED WRONG by the auditor (wrote minus signs throughout: (1048576−59049−6144−4) —
  correct inclusion-exclusion is (4^10 − 4·3^10 + 6·2^10 − 4)/4^10 = 818520/1048576 ≈ 0.7806;
  0.78 stands EXACT, auditor's 0.93 rejected — reviewer errors are data, corrected here).

## Adjudication
- B1 (K≥15/20 demand): REJECT demand, ADOPT data-adjudication — full sweep is sufficient,
  not necessary (reset breaks lock-in; explore seeds uniformly); the "coverage must exceed
  0.95 for quorum stability" link is asserted, never derived. Filed instead: the diagnostic
  adjudicates K-sufficiency BY REVEALED EFFECT (pre-committed): detT−orT outcome > 0 ⇒
  explore contributed (coverage adequate); detT−orT ≈ 0 with detT−det > 0 ⇒ reset sufficed
  and K's value is moot. Stronger than a robustness note — the data answers.
- B2 (verdict-name split): ADOPT — RESPONSE-WORKS (both bars @quorum) / RESPONSE-ADAPT-ONLY /
  RESPONSE-EDGE-ONLY / RESPONSE-DEAD (neither). Bars unchanged (finer labels, same gates);
  one-legged outcomes can no longer read as full wins downstream. (Also corrects B2's
  s18 figure: s18 dice = 0.96, not 0.9267 — that value is s12's.)
- B6 (drag): PARTIAL — scout's own linear bound (0.01875 < 0.03) supports the filed claim;
  endpoint confusion noted (explore cost is ADAPT-window, not two). Filed: explore slots
  score ~0.5 in-window (uniform picks, 2-hot of 4) → ~0.08 adapt drag per window → the +0.10
  bar is CONSERVATIVE for detT (must clear despite self-imposed cost); a pass is stronger
  evidence. "UNLICENSED compliance risk" rejected (licensing is procedural, pending
  countersign — not a prereg flaw).
- B10 (post-hoc): answered by B1 ruling (revealed-effect adjudication pre-committed — data
  judges K, not derivation). "P-hacking via K-selection" rejected (one value filed
  pre-data; no sweep exists to select from).
- Score: 4 findings → 3 filed additions (name-split, revealed-effect sentence, drag
  sentence) + 1 auditor correction. v1.3 = analysis/wording only.

## Output
Patched → `self-u64c-response-prereg.md` v1.3 (changelog in file). Red-team closer on v1.3
next; barren red closes the battery.
