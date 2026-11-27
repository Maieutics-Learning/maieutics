# Fresh-eyes U64c v1.3 red-team closer (10 sealed kill-shots, parallel)

**Premise:** U64c v1.3. **Replies verbatim:** `reviews-u64c/red-v1.3-1..10.md`. R4/R5 explicitly
BAREN (no cross-track gate; no stream collision).

## The kill that landed (R3 — explore-tax vs bar, ADOPTED AS TRACK-KILLER)
R3's framing ("deadlock") is dramatic but its arithmetic is REAL and fatal:
- detT pays 10 uniform explore slots per switch inside the 50-slot adapt window. Uniform picks
  score ~0.5 in-window (2-hot of 4) vs exploit ~0.95 → detT.adapt ≈ (10×0.5 + 40×0.95)/50
  ≈ 0.86 (optimistic; realistic exploit ramp → ~0.82).
- RESP-ADAPT demands detT.adapt ≥ dice.adapt+0.10 → passes only where dice ≤ ~0.76:
  s1(0.61), s6(0.75), s13(0.77), s14(0.73), s17(0.77), s19(0.77) ≈ 6 of the 15 live seeds.
  Needs 15/15. DEAD with near-certainty REGARDLESS of mechanism.
- RESP-EDGE under the washed-out old exam (B3-banked: all arms 0.25–0.52, orF managed 4/20
  WITH perfect info) is a coin flip at best for an arm that pays explore tax in training.
- Conclusion: U64c's verdict is knowable pre-compute (RESPONSE-DEAD by construction, not by
  nature). A track with a vacuous verdict must not spend 20 trains. The battery did its
  finest-hour job: killed a doomed track BEFORE compute.
- Consequence: the response question is UNMEASURABLE under the old exam — it lives ONLY
  where recovery is scored (U64d's punishing exam). U64d must train detT itself (fold the
  20 detT trains into U64d W1; trunks no longer "filed U64c" but "U64d W1 artifacts").

## Other rulings
- R9 (AMBIGUOUS-MECH (a)/(b) rule): ADOPTED as mechanical rule, adopted-into-U64d-spec
  (U64c frozen pending cancellation): (b) iff orT−det clears the bar rulers (0.03 outcome /
  0.10 adapt, quorum-free diagnostic) AND detT−det does not; else (a). No judgment call.
- R1 (ADAPT-ONLY transition undefined): REJECT — diagnostics never feed verdicts; WORKS
  needs both bars mechanically. Invented machinery.
- R2 (revealed-effect circular): REJECT — K is fixed, never inferred; the diagnostic
  interprets mechanism, and "moot" is determinate, not circular. (7-word precision noted
  for U64d's copy: sufficiency = corroborated, not proved.)
- R4/R5: BAREN recorded. R6 (FP-vs-drag category error): REJECT — epsilon and effect size
  are different jobs. R7 (detT = f(filed)): REJECT — determinism ≠ redundancy; new policy
  + new stream = new data. R8 (v1.3 ungated): REJECT as kill (enforcement point = verdict
  script, firewall-declared); NOTE as program-level backlog (verdict-label consistency
  assert for ALL verdict scripts — cheap, generic, not this prereg).
- R10 (EDGE-ONLY noise-sink): REJECT with binomial — per-seed SE is priced by quorum:
  under null p≈0.2/seed, P(≥15/20) ≈ 1e-7. Labels fire at quorum, where noise is negligible.
  Hardest test kept as closeout watch-item.

## Status: U64c battery CLOSED — RECOMMEND TRACK CANCELLED PRE-COMPUTE (user to confirm)
- U64c-RESPONSE STANDS v1.3 as a reviewed design AND its battery proved the design cannot
  measure what it asks under the old exam. Recommendation: U64c compute CANCELLED (0 trains
  spent — the win), response question transferred to U64d (which gains detT training in W1).
- This is a battery verdict (track unviable), not a verdict about the world (response may
  still matter — U64d will say). Awaiting user confirm: (i) confirm cancellation → U64d v1.1
  (fold-in) + U64d battery; (ii) override → U64c runs as filed (20 trains) under countersign.
- Compute everywhere remains UNLICENSED. Nothing spent anywhere this session (all findings
  pre-compute — pool labor only).
