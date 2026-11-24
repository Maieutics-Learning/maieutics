# Fresh-eyes teach-v10 battery (3 sealed, pre-compute) + adjudication

Spec frozen: teach-v10-prereg.md (v10.0 at review time). Briefs sealed, parallel, <=150 words, return shape verdict + hardest test.

## Raw R1 (math auditor)
1. **Meaningfulness:** No. $N=200$ is insufficient for stability in high-variance retrieval tasks. $R=3$ is a joke; confidence intervals are meaningless.
2. **Variance:** Pooled variance is ignored. With $R=3$, a single outlier seed tanks the quorum (2/3), rendering the "harness" statistically fragile.
3. **Thresholds:** 0.60 is arbitrary. 0.05/0.10/0.15 are too tight for $N=200$; noise will trigger "INERT" or "DECAYS" classifications erroneously.
4. **Misbehavior:** T3 (Chain second hop). 0.10 threshold against T1 is too narrow for stochastic retrieval; it will flag "DECAYS" due to sampling noise, not model failure.
5. **Verdict:** FAIL. Underpowered sample size for the complexity of the distilled student.
6. **Falsifier:** E1 (SHUF-teeth). If permuted teacher probs still yield >= 0.60, the student is a pattern-matcher, not a learner. The current $N=200$ cannot distinguish this from noise.

## Raw R2 (implementation auditor)
1. **Enforceability**: Partial. KL W=4 and auxW 8.0 are static hyperparams, but "T3 within 0.10 of T1" requires runtime state tracking across disparate test phases.
2. **Reviewability**: Low. No explicit seed-matching logic or gated resume mechanisms defined. Driver cannot verify if `T2-T1` delta is a genuine signal or noise without raw trace logs.
3. **Firewall**: Impossible. E1 (SHUF-teeth) requires the student to distinguish permuted teacher probs from data; this is an implicit judgment call on the loss landscape, not a hard-coded firewall.
4. **Gaps**: Missing weight-decay specs; no definition of `T7 logic` mapping to `ADD4`; `COMPLETE-gated resume` not specified in the loop.
5. **Verdict**: **FAIL**.
6. **Hardest Falsifier**: E1 SHUF-teeth. If student achieves >= 0.60 on permuted probs, the "distill" claim is falsified as the model is merely memorizing the substrate.

## Raw R3 (alternative-explanation)
1. **Rival Mechanism:** Data-only leakage. The student is likely overfitting the specific distribution of the "filed cb retriever" (teacher) rather than inheriting the general logic of T7.
2. **Cheapest Killer Test:** E1 (SHUF-teeth). If permuting teacher probabilities maintains >= 0.60 accuracy, the mechanism is merely statistical pattern matching on the data substrate, not knowledge distillation.
3. **Design Inclusion:** Yes (E1).
4. **Verdict:** Inconclusive. The narrow gap between T1 and T7 suggests a "capacity-limited mirror" rather than an earned logic transfer.
5. **Hardest Falsifier:** E8 (FQ reverse). If the student fails basic reversal of the chain-hop logic while the teacher succeeds, the "distillation" is actually just memorization of the teacher's specific failure modes/biases.

## Adjudication (owner: agent, 2026-11-23)
- R1 (N=200/R=3 thin, thresholds tight) -> PARTIAL. Standing convention: N=200 evals + R=3 quorum 2/3 + per-seed values + range (effect-size gates, not p-values). SE at p=0.6/N=200 ~0.035: T2 0.05 is ~1.4 SE = marginal (filed as limitation, report delta + range); T3 0.10 ~2.9 SE and T1-T7 0.15 ~4 SE stand. Reject N increase (bench budget; precedent batch/R programs all N=200). Adopt: stats note + per-seed reporting in spec.
- R2 (enforceability/reviewability/firewall/gaps) -> ACCEPT pins, REJECT impossibility. KL W=4 = novel-driver distillStep recipe (KL(pt||ps), grad *-pt/(ps+eps) via dSoftmax, scaled W/B); aux = lane-driver scratchLabelsT (train-only gradients, zero at eval); T7 logic = runHarnessT7 with m1:=taught student (pass-1 posOut[8] vhat on dummy, pass-2 filed ADD4 on flat+[qk,k,vhat,8]); seed-matching = frozen tests 52400/52500+seed, trainSeed 56000+seed*13, rngs 56100/56200/56300+seed; COMPLETE-gated resume = try-read ledger, if verdict COMPLETE skip (all drivers precedent); no weight-decay (Adam 5e-3 default, filed precedent — omission is a pin, not a gap). E1 is hard-coded pi=[2,0,3,1] perm, no judgment. Adopt all pins into v10.1.
- R3 (data-only rival) -> ACCEPT, already contained. E1 teeth stays the killer (perm >= 0.60 => DEMOTE to data-only artifact, program-wide). E2 supervised control stays the teacher-delta read (T1-E2 reported descriptively). E8 FQ adopted as memorization-vs-logic falsifier (already in extras as descriptive). No new arms.
- Score: 1 partial (stats note) + pins accepted + rival contained. Amendment is spec-only (v10.1 below); zero train/eval changes.
