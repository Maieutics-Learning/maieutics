# Fresh-eyes intrinsic-A2 battery (2 rounds, 3 sealed parallel each, pre-compute) + adjudications

Spec frozen v1.0 at round 1; v1.1 at round 2 (confirmatory). Pool use: generateText reviewer labor only (6 short calls); no training signal, labels, items, or capacity. Raw raws disposable in scratch/a2-battery1.json + scratch/a2-battery2.json.

## Round 1 raw R1 (math auditor)
1. **FAIL**
2. **Symmetry collapse.** With $N=20$ and only $B_{reh}=2$ rehearsals on the same trunk, the "own" arm's voting mechanism (top-2 disagree) lacks sufficient sample diversity to maintain a $\ge 0.05$ gain over "rand" (rank-then-discard) as load increases. The $\text{FLOOR} \ge 0.35$ is a deceptive safety net; the $\text{SHUFFLE}$ tolerance ($|shuf-rand| \le 0.03$) will break first. High load pushes "shuf" toward "rand" noise, but the specific "killer" rank-then-random-2 logic creates a divergence exceeding 0.03 before the floor is hit.
3. **The SHUFFLE bar.** It is the most fragile constraint; any load-induced variance in the rank-random-2 pipeline will trigger COMPUTE-ONLY, nullifying the preregistered gain claims.

## Round 1 raw R2 (implementation auditor)
1. **NEEDS-PATCH**. The prereg is a technical mess. "Identical-target twin-matching" is an objective, not an implementation detail. You cannot "enforce" matching in the driver unless the driver handles the seed-synchronization and sequence-injection across arms. If the driver only accepts `nObs/bReh`, the "twin" requirement is external and unverifiable via the provided options.

2. **Gaps**:
- **Seed Provenance**: No mechanism to ensure $R=3$ seeds are identical across arms.
- **MLP Prototype**: "Learned forget" is undefined; no architecture/activation specified.
- **Oracle Logic**: "Incorrect-first, ceiling" is ambiguous—does the ceiling apply to the error rate or the rank?

3. **Hardest Falsifier**: `SHUFFLE |shuf-rand|<=0.03`. A simple rank-shuffle of a high-variance dataset will easily mask the "killer" effect, allowing a failing model to pass as `COMPUTE-ONLY`.

## Round 1 raw R3 (alternative-explanation)
1. **Verdict**: REJECTED. High risk of "Oracle Paradox." If `oracle < own` in A1, the ceiling is soft; the gap between `own` and `none` is likely noise-driven by the small $N=20$ sample size.
2. **Rival**: *Stochastic Leakage*. High overlap ($\sim0.10$) suggests the "delayed cue-only query" is not sufficiently decoupled from the rehearsal trunk, meaning `own` is merely recalling a leaked trace, not demonstrating intrinsic ability.
3. **Killer**: *Shuffle-Symmetry*. If `shuf` (rank-then-random) is not statistically indistinguishable from `rand`, the ranking mechanism is a phantom.
4. **Containment**: NO. The `C0.35` floor is too low to prevent "Void" results from being cherry-picked.

## Round 1 adjudication (owner: agent) — spec v1.1
- R1 → PARTIAL. Load-variance warning kept as reporting (per-seed + range; SHUFFLE firing under load is informative, not a bug). Rejected FAIL-before-running (A1 enrich was perfect 4.0; ranking op scales). No threshold move.
- R2 → ACCEPT wording patch. Twin-matching is code (arm-independent targetRng + seed-only testRng/targetRng; ledger tags are the seed map); learned forget = sigmoid gate (inForward/inBackward); oracle = incorrect-first then highest loss, ceiling only.
- R3 → PARTIAL. Leakage adopted as filed refutation (cue-only inQueryLine; leakage predicts none≈own≈rand). Shuffle-symmetry IS the shuf bar. Floor stands with VOID guard. (Reviewer confuses N_OBS=20 with eval N; evals are N=200 in A1, N=400 in A2 — filed.)
- Score: 1 accepted, 2 partial. Amendment spec-only.

## Round 2 raw R1 (math auditor, confirmatory on v1.1)
1. VERDICT: NEEDS-PATCH.

2. POINT: The "shuf rank-then-random-2" baseline is logically decoupled from the "rand rank-then-discard random-2" baseline, yet the quorum requires $|shuf-rand| \le 0.03$. Because $N=20$ is a low-sample regime, the stochastic variance between two different random-selection mechanisms will frequently exceed 0.03, triggering COMPUTE-ONLY regardless of model performance.

3. HARDEST FALSIFIER: A high-performing model that clears all other bars but fails the $|shuf-rand|$ parity check due to sampling noise at $N=20$. This collapses the "Intrinsic" result into a "COMPUTE-ONLY" state, effectively nullifying the $B_{reh}$ rehearsal gain by forcing the outcome to the A1 precedent.

## Round 2 raw R2 (implementation auditor, confirmatory)
1. **Verdict: BLOCKED**

2. **Gaps:**
*   **Spatial Validity/Collision:** `B_reh=2` (rehearse) and `N=20` (observes) share the *same trunk*. Since the `oracle` targets "incorrect-first" then "highest loss," the rehearsal set (B_reh) creates a deterministic bias in the loss ceiling. You cannot isolate "new" faults if the rehearsal samples are indistinguishable from the observation pool within the same trunk; they act as a hidden prior.
*   **Unenforceable Step:** `|shuf-rand|<=0.03` as a condition for `COMPUTE-ONLY` is a floating-point trap. Given `rand rank-then-discard random-2`, the variance is stochastic. A fixed threshold of 0.03 on a random-draw distribution is an arbitrary gate that cannot be pre-registered as a stable validator.

3. **Hardest Falsifier:** The `oracle` ceiling. If `none` predicts `own` (per leakage file), the "highest loss" ceiling collapses, rendering the "incorrect-first" priority a null op.

## Round 2 raw R3 (red-team, confirmatory)
1. **Verdict**: VULNERABLE.
2. **Shot**: Oracle-induced Gradient Bias. The "incorrect-first then highest loss" oracle creates a non-random, adversarial sampling bias that correlates specifically with high-variance weights. Since the oracle is used to determine the "incorrect" set, the model doesn't just learn the task; it learns to optimize against the oracle's specific selection criteria, effectively turning the "oracle" into a latent feature of the training set.
3. **Killer Test**: Replace the "incorrect-first" oracle with a truly random selection of incorrects. If performance drops significantly or the `none` baseline shifts, the model was overfitting to the oracle's selection bias rather than the intrinsic task.C.O.M.P.U.T.E-ONLY.

## Round 2 adjudication (owner: agent) — spec v1.2 + driver fix, bars UNCHANGED
- R1/R2 noise point ACCEPTED as code fix (not a bar move): |shuf−rand|<=0.03 sat at ~1 SE under N=200 evals (SE≈0.031); A2 evals go N=400 (SE≈0.022; bar ≈ 1.4 SE, quorum decides). Same fix exposed the real bug: A1 train init+data streams were arm-confounded (armOff + tag.length) — A2 twin-matches them in code (init/data/target seed-only; ONLY selRng carries the arm code) and pairs eval selection (shared seed-only selRng). A1 confound filed as limitation (A1 ledgers COMPLETE, untouched; evals were clean).
- R2 trunk-conflation REJECTED (rehearsal = extra 0.3-weighted grad steps vs 0.1 observes — distinguishable by construction). Oracle-conditional REJECTED as gate (taxonomy handles it). R3 oracle-bias REJECTED with reason (each model trains only on its own policy; random-incorrects variant is scope creep).
- Score: 1 accepted (noise + twin-fix), 2 partial-with-reasons. Bars UNCHANGED per standing rule (file the math, don't tune to reviewers).
- Stop: two rounds done; round 2's accepted point is fixed in code; no third round (diminishing returns — round 2 repeated round 1's shuffle theme with the SE math that settled it).
