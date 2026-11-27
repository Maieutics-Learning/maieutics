# Fresh-eyes U64b v1.0 barrage (10 sealed, disjoint angles, parallel)

**Premise:** `reviews-u64b/premise-u64b-v1.0.md` (frozen 2026-11-27; U64 numbers with sources,
chance note 15/20 p=0.5 ≈ 0.021). **Replies verbatim:** `reviews-u64b/barrage-v1-1..10.md`.
**Method:** format-3 barrage (skill formats cheapest-first #3); sealed, one Promise.all,
no cross-talk; ≤150 words each; return shape enforced.

## Round-1 verdicts
- B1 floor-math: NEEDS-PATCH (0.40 tuning-by-proxy; replacement: dice-relative floor).
- B2 verdict-logic: NEEDS-PATCH (two bites ≈0.041 joint; "fishing for a fluke"; floor too permissive).
- B3 reads-only-validity: IMPLEMENTABLE (streams disjoint, E2 novelty holds, collision ≈0).
- B4 E1-construction: NEEDS-PATCH (75%-familiar confound; demands 0%-familiar probe).
- B5 E2-enforceability: NEEDS-PATCH ("continuation" + "first-remaining" ambiguous; exact replacements given).
- B6 firewall: NEEDS-PATCH (examHash ungated + HALT unlisted; novelHot/rule mining risk; floor-weak loop risk; W0 no hard-stop).
- B7 independence: IMPLEMENTABLE (NONE-FOUND; strongest hostile misreading named + answered).
- B8 logging: IMPLEMENTABLE with omissions listed (driver pin, scr/orc heads, per-window dice, novelHot inputs).
- B9 rival: NEEDS-PATCH (freshness artifact; demands shuffled-slot E1).
- B10 anti-tuning: IMPLEMENTABLE with smell named (floor 0.40 + edge 0.03); deodorization: pre-committed sensitivity analysis.

## Adjudication (ACCEPT / REJECT / PARTIAL per point)
- ACCEPTED → v1.1 patch: B1-floor-deodorize (as Hypothesis + sensitivity diagnostic, NOT
  B1's dice-relative replacement); B2-joint-bound (file 0.041 conservative bound; gate
  unchanged); B5-exactness (single-ruleRng-instance + verbatim Wave-0 replay + logged
  ruleDrawCount + lowest-pair-index rule); B6.1-HALT (HALT verdict listed; examHash in
  firewall asserts); B8-all-four (driverHash, scr/orc heads both exams, novelCandidates +
  ruleDrawCount, per-window values already per-arm); B10-sensitivity (floors 0.35/0.40/0.45
  diagnostic table, verdict follows filed 0.40, disagreement → AMBIGUOUS-FLOOR note).
- REJECTED with reasons: B1-replacement (dice-relative floor conflates floor with edge;
  absolute floor + sensitivity instead). B2-inversion (reviewer inverted chance logic: a
  0.041 fluke-rate bar is stringent, not "fishing"; floor-holding never licenses PROCEED —
  an edge @quorum does). B4-confound-direction (backwards: stuck arms MISS familiar draws,
  adapters hit them — familiar fraction AMPLIFIES the E1 accuracy gap; filed as clarification;
  0%-familiar probe measures OOD robustness, not recovery — rejected by design, reason
  filed in prereg). B6.2 (answered by filed firewall declaration). B6.4 (W0 COMPLETE-gated
  IS the hard stop — filed). B9-rival-collapses (fresh-count reset IS the filed mechanism of
  recovery, not a rival to it; shuffled-slot test destroys the temporal measurand itself).
- Score: 6 findings → 6 adoptions (all partial-or-full with modification); 4 clean.
  Staff-audit roles covered by angle (math: B1/B2; implementation: B5; alternative: B9).

## Output
Patched in one pass → `self-u64b-exam-prereg.md` v1.1 (changelog in file). Re-running battery
on v1.1 (fresh reviewers) + staff audit + red-team close next.
