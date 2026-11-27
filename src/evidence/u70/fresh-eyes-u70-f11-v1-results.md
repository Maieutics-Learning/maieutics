# Fresh-eyes U70-F11 v1.0 battery results (2026-11-27, 10 scouts)

Target: `premise-u70-f11-v1.0.md` (proposal `u70-f11-prereg-proposal.md` v1.0). Ask: verdict +
single hardest test/falsifier, <=150 words. Score: 9 NEEDS-PATCH / 1 STANDS (R6 scope).

## Convergent thrust (R1,R2,R3,R5,R8,R9,R10 — same objection, seven angles)

"Forward-only repair changes the optimized surface, so same-seed pairing confounds leak-removal
with discretization/regularization effects; gradient coupling must be proven, not asserted."
Two separable sub-claims: (a) the backward might not implement ST once forward changes (reviewers
assume an autograd framework); (b) paired deltas cannot isolate the leak even if (a) holds.

## Adjudication (owner of verdict: agent)

- **(a) PARTIAL accept, rebutted in the artifact, adopted in the gate.** This codebase has no
  autograd: the backward never differentiates through the forward op — it routes head-grads `dz`
  through the analytic softmax jacobian of `q` (u70-neural.js:273-277), which does not reference the
  forward `zoh` value at all. The NaN/zero-grad failure mode is reviewer-imported, and the premise
  must say so explicitly (it now does). The valid residue: T2 must be a HALT gate, not a log line.
  ADOPTED: T2 finite-difference identity (1e-6) gates smoke; fail = HALT, no wave.
- **(b) PARTIAL accept, fixed by firewall, not by new arms.** Correct: corrected training optimizes a
  different surface, so paired deltas are descriptive only. The primary verdict never needed pairing
  (absolute corrected bars). ADOPTED: verdict reads ONLY absolute corrected bars; paired delta +
  leak-size + loss-path are strictly descriptive and can never move a verdict (stated in v1.1).
  REJECTED as verdict requirements / new compute: R5's null-repair control (+20 trains), R7's
  permutation null gate (p<0.01 smuggles a new bar), R3's gradient-variance gate (filed F4 ledgers
  carry no grad norms or loss checkpoints — row keys verified: final metrics only — so cross-wave
  variance comparison is impossible; F11 logs epoch-50/100/150/200 losses for within-wave sanity
  instead, stated honestly as such).
- **R4 convergence-parity:** covered by the firewall; final-loss distribution comparison is
  descriptive. REJECTED as a verdict condition.
- **R6 STANDS:** recorded; its symmetry-breakdown hard test is already the REGRESSED reading.
- **R10 ablated-noise baseline:** REJECTED as scope creep (a third arm answering a different
  question — training stability under noise regimes — while F11 asks whether the filed wins survive
  correction). The REGRESSED verdict already prices "correction destroys performance" openly.

## Patch list -> v1.1 (one pass)

1. Manual-coupling fact stated (no autograd; backward references analytic `q`, not the forward op).
2. T2 promoted to pre-smoke HALT gate (1e-6 finite-difference identity).
3. Verdict firewall: absolute corrected bars ONLY; paired/leak-size/loss-path descriptive, never
   verdict-moving.
4. F11 ledger adds epoch-50/100/150/200 losses + T1-T4 logs (within-wave sanity; no cross-wave loss
   comparison claimed).
5. No new arms, no new bars, no LR/optimizer/scale touch.

Adoptions: 3 (T2-gate + firewall + ledger-loss-logging, one of them a rebuttal-with-adoption).
Rejections with derivations: null-repair arm, permutation gate, variance gate, noise baseline.

## Re-close on v1.1 (4/4 STANDS — battery CLOSED 2026-11-27)
- RE1 STANDS (manual-coupling + T2-gate answers coupling; phantom-convergence note = the QUALIFIED/REGRESSED readings already price irrelevance honestly).
- RE2 STANDS (backward-only hypothesis = T2's exact job pre-smoke; landscape-shift reading = the filed firewall limitation).
- RE3 STANDS (boundary-mismatch collapse risk = T2 gate + INVALID firewall; catastrophic collapse files as REGRESSED, not silent).
- RE4 STANDS conditional on firewall (gradient-mismatch divergence files as REGRESSED — optimization failure priced openly, not misread as leak evidence).
- No new patch (all four residuals are already-priced readings or T2's job). F11 STANDS v1.1. Owed: FRESH execution countersign on exact v1.1, then driver edit (2 lines + T1-T4) + smoke + 20 paired retrains. NO compute yet. NO PUSH without order.
