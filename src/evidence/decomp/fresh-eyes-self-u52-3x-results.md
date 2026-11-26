# Fresh-eyes battery: U52 bioreview (3x barrage + discussion) — CLOSED

**Artifact (frozen):** `self-u52-bioreview-synthesis.md` v1.0 + `papers/brief-14..20` + 7 verified PubMed abstracts (past Per shared pool? No — reviewers are contextless `generateText` calls; "paper access" = full synthesis + all 7 briefs fetched in-page + all 7 abstracts pasted verbatim + angle-relevant ledger rows). No pool spend before this turn; this battery runs under the user's "yes please."
**Round 1 (sealed, parallel, 3 angles):** A = P1 + U50 ledger recheck; B = P2/P3 + replacement justification; C = P5 + triage/ordering. Enforced shape: verdict + hardest test + analogy-as-evidence quotes, ≤200 words.

## Raws (verbatim, exact strings)

**R1 (angle A):** "1) verdict: NEEDS-PATCH - P1: Needs non-degenerate detector for E-NE1/E-UNC1/E-ACh1. - P5: Needs verification that "retrieval stopping" differs from simple gating. 2) The "outcome-without-adaptation" gap in U50 is a correlation, not causation; you cannot claim neuromodulation works if the detector is a scalar zero (E2c). The system may simply be absorbing noise without any actual state-dependent gain shift. 3) "extinction recruits retrieval stopping" (stated as thesis/proposal, not verified fact)."

**R2 (angle B):** "1) verdict: NEEDS-PATCH - P1: E-UNC1 requires non-degenerate detector implementation before E-NE1/E-ACh1. - P2: E-CLS1 must be explicitly sequenced after E-UNC1 novelty score is verified. 2) The "outcome-without-adaptation" gap in U50: if the system doesn't detect change (E2c failure), the benefit of STOCH/RES replay is likely just noise-driven regularization rather than an active "adaptation" mechanism. 3) "E-EXT1... reuses U38 machinery" (Mapping a failure-prone gate to a biological veto without proving the mechanism)."

**R3 (angle C):** "1) verdict: NEEDS-PATCH P1: Requires non-degenerate detector; current E2c is a scalar zero. P4: Avoidance; no action space/reward substrate for policy learning. 2) Killer objection: The "veto" in E-EXT1 is computationally trivial if GLOBAL can pass the bar via any non-zero gain; without a strict, independent "no-erasure" constraint, the Anderson & Floresco distinction collapses into simple gain modulation. 3) "extinction recruits retrieval stopping" (analogy filed as biological mechanism)."

## Discussion (strict ≤4-line format, shared owner note) — 3x CONFIRM-STANDS

**D1:** "CONFIRM synthesis-STANDS. Owner addresses (A) via brief-20, (B) via STOCH-constant, and (C) via GLOBAL construction. Sequence and detector-blocker patches already integrated. Reviewer points absorbed by existing synthesis/notes."
**D2:** "CONFIRM synthesis-STANDS. Owner addressed A via brief-20 labels; B via STOCH control. C's GLOBAL/P4 constraints are structurally inherent. Patch: Explicitly cross-reference STOCH-constant and brief-20 in final response."
**D3:** "CONFIRM synthesis-STANDS. Reviewer concerns (A, B, C) are addressed by existing controls (STOCH-constant arm, context-bar construction) and explicit labeling in brief-20. The requested sequence and detector-blocker updates are already integrated into the synthesis. No further patches required."

## Adjudication (owner, per point)

1. Detector-blocker (R1/R2/R3 unanimous): ACCEPT as filed — already the synthesis's core constraint; no change needed (reviewers confirm the blocker is load-bearing, not a gap).
2. Noise-regularization rival (R2-hardest): ACCEPT with teeth — STOCH-constant arms are the matched-entropy null by construction (filed as P1a pin). If triggered/moded ≈ constant, verdict = "pure diversity."
3. Proposal-labeling (R1/R3 point 3): ACCEPT as pointer (P1b) — brief-20 already marks the thesis as authors' proposal; arbitration notes R3's "filed as mechanism" misreads the brief (the separation statement excludes it from biological evidence).
4. Veto triviality (R3-hardest): ACCEPT — no-erasure bar quantified to ±0.02 of frozen checkpoint; GLOBAL separation-by-construction stated (P1c pin in synthesis + brief-20 note).
5. E-CLS1/E-UNC1 sequencing (R2): ACCEPT clarification (P1d) — E-CLS1 needs no novelty score; only E-SLEEP1's gated arm waits on E-UNC1.
6. P4-unpark now (R3): REJECT — no action substrate exists; unpark trigger already filed in synthesis.
7. "U38 machinery reuse" objection (R2 point 3): REJECT with reason — the context input IS the mechanism change under test, GLOBAL is its control; reusing the driver is discipline, not inheritance of the failure.

**Score:** 5 accepts (4 doc-pins + 1 control-clarification), 2 rejects with reasons. Diminishing: discussion unanimous CONFIRM, no second round needed. Synthesis → v1.1 (pins only).
