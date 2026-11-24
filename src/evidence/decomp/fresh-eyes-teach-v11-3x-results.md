# Fresh-eyes teach-v11 battery (3 sealed, pre-compute) + adjudication

Spec frozen: teach-v11-prereg.md (v11.0 at review time). Briefs sealed, parallel, <=150 words, return shape verdict + hardest test.

## Raw R1 (math auditor)
1. **Bars:** Failed. $N=200$ with $R=3$ (replicates) is insufficient for the stated thresholds.
2. **SE:** $\\text{SE}$ for $0.60$ floor is $\\approx 0.03$ (assuming binomial $\\sqrt{pq/n}$). A $+0.05$ dose delta is within $2\\text{SE}$, rendering the V4-V1 delta statistically insignificant.
3. **Threshold:** The $0.60$ demotion threshold misbehaves; noise floor exceeds the delta.
4. **Comparison:** Invalid. V3 vs E2 utilizes different seeds and filed references; no control for stochastic variance.
5. **Verdict:** REJECT. Results are descriptive, not inferential.
**Hardest Falsifier:** Bootstrapped confidence interval for the V4-V1 delta. If $\\text{CI}_{95}$ includes $0$, the "dose delta" is a fluke.

## Raw R2 (implementation auditor)
1. **Enforcement**: No. Artifact describes "pure-hard" distillation and "vhat" targets, but lacks a masking layer or gradient-stop mechanism to physically prevent reads of `e.y/e.v` on the train path. It is a logical constraint, not a code-level enforcement.
2. **Reviewability**: No. `posOut[8]` is an observation, not a traceable tensor operation. Without a defined computation graph for `pos-8`, KL/CE divergence is a black-box metric, not reviewable.
3. **Isolation**: Unenforceable. "Only pos-8 source varies" in one loop implies a shared state or sequential processing. True isolation requires parallel independent forwards or explicit masking.
**Gaps**: No defined loss function for `vhat-soft`; missing gradient flow specification for `aux8`.
**Verdict**: **FAIL**. Logical constraints are treated as physical ones.
**Hardest Falsifier**: Gradient check on `posOut[8]`—if $\abla_{T1} \text{posOut}[8] \neq 0$, isolation is breached.

## Raw R3 (alternative-explanation)
1. **Rival Mechanism**: Gradient leakage via aux-head over-parameterization. The "distillation" is likely just a high-capacity auxiliary head memorizing teacher-specific noise patterns rather than transferring conceptual retrieval logic.
2. **Cheapest Killer**: Zero-init/frozen aux-weights with random-seed teacher-vhat. If performance holds, it's a signal-processing artifact, not distillation.
3. **Design Check**: No. Artifact lacks a control for frozen teacher-logits during V-series training.
4. **Verdict**: Unproven. High $\hat{v}$ correlation is likely a byproduct of the $\text{aux}8$ capacity acting as a lookup table for teacher-specific biases.
5. **Falsifier**: Cross-teacher validation. Test V1-V4 on a teacher $\text{vhat}_{alt}$ (correlated to ground truth but uncorrelated to original teacher). If $\text{scr} < 0.40$, the model learned the teacher's quirk, not the retrieval mechanism.

## Adjudication (owner: agent, 2026-11-23)
- R1 (SE/thresholds/comparison) -> PARTIAL. SE~0.03 agrees with v10.1 note (~0.035): V4 +0.05 is ~1.5 SE = marginal, filed as descriptive-leaning limitation (same standing as T2 bar). V1 0.60 floor stands: gap vs T1 0.29-0.315 is ~0.30 ≈ 9 SE, not noise; S1 teeth is an ABSOLUTE 0.60 bar (perm must reach it), not a delta — the "noise exceeds delta" objection misreads which bar. V3-vs-E2: ACCEPT the fix — E2 ran same seeds 0,1,2, so V3 read uses SAME-SEED deltas (V3s−E2s), never filed-mean comparison. Reject N increase and bootstrap CI (bench precedent: effect-size gates + per-seed + range).
- R2 (enforcement/reviewability/isolation/gaps) -> ACCEPT pins, REJECT impossibility. Firewall goes PHYSICAL: pure-arm diet lines are built x-ONLY (y/v deleted at diet build; train loop receives no labels to read — reads impossible, not avoided); V3 hybrid diet keeps e.y openly (filed impurity). Reviewability: posOut[8] loss = v10 teachAuxFor recipe exactly (softmaxCE on cache.posOut[t].logits, dlogits /(B*x.length), ×auxW) for hard; vhat-soft = KL(pt||ps) via softOf/dSoftmax on posOut[8] 4-class distributions (novel distillStep recipe, same as answer-KL). aux8 flow = dlogits ×8 (v10 precedent). Isolation is ACROSS-RUNS (separate trains/ledgers/diets per arm), not within one loop — clarified. Gradient-check falsifier adopted as code-review step (train body grep: pure arms contain no `.y`/`.v`).
- R3 (aux-memorization/teacher-quirk) -> PARTIAL, contained without new arms. Zero-init/frozen-aux killer REJECTED as new work (S1 perm teeth already kills substrate-memory: label-ignoring students score under perm; genuine label-followers fall to chance). Cross-teacher quirk READ exists: harness compose with filed ADD4 requires TRUE vhat (quirks don't compose — filed T7 logic), so V-harness is the quirk-killer; plus E4 precedent (k3aux-teacher == cb-teacher on the dead channel). No 6th arm; report V-harness + S1 jointly.
- Score: 1 partial (stats + same-seed fix) + pins accepted + rival contained. Amendment is spec-only (v11.1 below); zero train/eval changes.
