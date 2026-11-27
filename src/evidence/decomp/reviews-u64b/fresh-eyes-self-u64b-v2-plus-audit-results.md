# Fresh-eyes U64b v1.1 round-2 (10 fresh barrage + 3 staff audit, sealed parallel)

**Premise:** `reviews-u64b/premise-u64b-v1.1.md`. **Replies verbatim:**
`reviews-u64b/barrage-v1.1-1..10.md`, `audit-math/impl/rival-v1.1-*.md`.
**Versions:** v1.0 → v1.1 (round-1: 6 findings → 6 adoptions, all partial-or-full).

## Round-2 verdicts
- Barrage: 7 IMPLEMENTABLE (B3 streams, B5 E2-exactness, B6 firewall-robust, B7 NONE-FOUND,
  B8 ledger, B9 rival-contained+seed-chain, B10 anti-tuning-frozen-clause) / 3 NEEDS-PATCH
  (B1 floor-table + fallback-bias + hash-monotonicity; B2 correlation-Type-I + frozen-undefined;
  B4 orF-ceiling + fallback).
- Audit: MATH NEEDS-PATCH (noise-dominance; floor-without-constants; worst-threshold E1-edge;
  null-calibration hardest test) / IMPL IMPLEMENTABLE (ENFORCEABLE, weakest check named:
  examHash assert) / RIVAL IMPLEMENTABLE with buried patch demand (permute novelCandidates
  before fallback).

## Adjudication
- ADOPTED (1): audit-(b) → v1.2 FLOOR-ANCHOR paragraph (never-adapt null sketch 0.06–0.44 by
  overlap; floor guards exam validity not arm quality; assumptions labeled; W1 dice anchors
  empirically; overlap-dependence filed not re-voted). v1.2 = v1.1 + this paragraph only.
- REJECTED with derivations (filed here so the next reader need not re-derive):
  - B1(a) p-hacking-by-table: table never moves the verdict (frozen clause) — corroborated
    by fellow reviewer B10-v1.1 ("frozen clause prohibits abuse"). Theater requires agency;
    the table has none by construction.
  - B1(b)/B4.2/audit-rival-permute (fallback bias): the novel set is ARM-INVARIANT (e2Data
    shared across arms) → any selection quirk cancels in EVERY edge comparison; plus
    P(fallback) = (4/6)^20 ≈ 0.0003/seed (both remaining sets always satisfy ≠hotSeq[3]
    since exclusion ⊃ difference). Permuting an unreachable-then-irrelevant path is theater.
  - B1(c) hash monotonicity: meaningless for content hashes; twins assert exact equality.
  - B2(a) correlation inflates Type I: backwards. P(A∪B) ≤ P(A)+P(B) = 0.042 ALWAYS
    (union bound, assumption-free); positive correlation LOWERS the union. Bonferroni IS
    the union bound — already applied. Fellow reviewer B10-v1.1: "0.041 conservative."
  - B2(b) frozen/undefined: frozen is intentional (standing append-only rule); verdict is
    defined (follows 0.40). B2-hardest-test describes filed EITHER-logic working as
    designed — a design dispute, not a bug (needs a new prereg, not a patch).
  - B4(a) orF ceiling: orF is oracle (perfect info, correct from slot 1), not an adapter —
    misreads the filed arm definition. No imperfect-adapter ceiling can compress orF−dice.
  - audit-(a) noise dominance: backwards. Quorum-over-20 is a tail test: under null p=0.5,
    P(≥15/20)=0.0207 EXACT (no asymptotics) — per-seed SE governs per-seed pass rate, which
    the binomial already prices. Under a real effect (P(pass)=0.8/seed) power ≈0.63. The
    reviewer's "Binom(20,0.5) high variance" is precisely what makes 15/20 stringent.
    Null-calibration hardest test: considered, declined — exact test filed, nothing
    asymptotic to calibrate; logged here as the receipt.
  - audit-(c): follows rejected (a); no independent standing.
- B3/B5/B6/B7/B8/B9-v1.1/B10-v1.1/AUDIT-IMPL: confirmed clean (no buried findings on
  re-read; the one buried demand — rival-permute — rejected above).
- Score: 13 reviews → 1 adoption (narrow paragraph); 12 stand-downs with derivations.
  Diminishing returns evident (round-1: 6 adoptions; round-2: 1) — red-team close next.

## Output
Patched → `self-u64b-exam-prereg.md` v1.2 (FLOOR-ANCHOR only). Proceeding to red-team closer
on v1.2: barren red (no adoptable finding) CLOSES the battery per loop-closure convention;
any adoption → v1.3 + re-close.
