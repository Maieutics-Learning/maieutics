# Premise artifact U64b v1.0 (frozen 2026-11-27; handed verbatim to all reviewers round 1)

1. Project: tiny CPU-simulation brain (H48 carry trunk + qk-count voting); rule-switch diet
   (rule changes 3×/run); U64 tested perfect-cheater vs dumb-dice. Scale: bench h48, NOT
   large models (scope label).
2. Scope (user-confirmed): three INDEPENDENT tracks (user-ordered 2026-11-27) — U64b exam
   alone (this doc), U64c oracle-response alone (old exam), U64d both together. No track's
   verdict gates on another's (verbatim independence clause in each prereg). 20 seeds per
   verdict (Try-20 rule, quorum 15/20); n=3 Wave-0 checks are gates only.
3. Verified claims (Observed; sources): U64 verdict INCONCLUSIVE
   (`src/evidence/decomp/d-newai-self-u64-verdict.json`): ORACLE-EDGE-outcome 4/20 FAIL
   (passes s1/s3/s5/s13; per-seed margins in
   `src/evidence/decomp/fresh-eyes-self-u64-wave2-10x-results.md`); ORACLE-ADAPT 15/20 MET
   (`src/evidence/decomp/d-newai-self-u64-verdict-correction1.md`; filed 0/20 irreproducible;
   orF adaptEarly=1.0 ×20, dice 0.61–0.97); FLOOR trips 11/20 (all arms outcome 0.25–0.52);
   TIMING-DIAG orT−shT mean −0.028; PIN 20/20 eval + 100/100 train; RULE-ID 20/20. Closeout:
   `src/evidence/decomp/self-u64-closeout.md`. Full review replies (verbatim, durable):
   `src/evidence/decomp/reviews-u64/`.
4. Done/Next: U64b prereg v1.0 (`src/evidence/decomp/self-u64b-exam-prereg.md`) — re-eval 100
   filed trunks under punishing exam (E1 recovery windows + E2 novel-rule transfer), zero new
   trains. Next: battery → countersign → Wave 0 → Wave 1. U64c/U64d preregs filed in
   parallel; their compute is separately unlicensed.
5. The ask: Hammer this premise. State IMPLEMENTABLE | NEEDS-PATCH + single hardest
   test/falsifier. <=150 words, numbered. No ELI5. Point at: confounds, numbers that don't
   prove what the author thinks, missing controls, threshold soundness at n=20, anything a
   driver cannot enforce from the text, any verdict-dependence between tracks you can find.
6. Anti-bias: name the central claim, the evidence for it, contradictory/missing evidence,
   unverified assumptions, and which conclusions depend on which assumptions. One-line
   derivation beats bare numbers: chance rate for 15/20 at p=0.5 is ~0.021 (sum
   C(20,k)/2^20, k=15..20) — grade whether the bar clears chance, don't assume it.
