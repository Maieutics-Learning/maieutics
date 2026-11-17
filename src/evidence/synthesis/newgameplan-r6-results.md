# Round 6 raw — red-team closer on v4 (T1-T4, unopposed)

## T1

1. VERDICT: BREAK

2. KILL: The "no-feedback" enforcement relies on a separate-process scoring API, yet the plan allows the tutor to "operate the harness" in P4, creating a logical loop where the tutor/model could influence the scoring process or data selection via the harness API.

3. CHANGE: ADD a cryptographic commit of the scoring logic and a strict one-way data diode between the scoring process and the tutor/student weights to prevent leakage.

4. HARDEST TEST: A "leakage-probe" run where the tutor is given access to the harness's internal ledger but not the weights; if the tutor can predict the student's specific failure patterns on recombined lines better than chance, the "no-feedback" isolation is physically compromised.

---

## T2

1. VERDICT: BREAK

2. KILL: The "no-feedback" enforcement is logically flawed because the student's learning mechanism—imitation loss on tutor outputs—is itself a high-bandwidth feedback loop that bypasses the scoring API restriction.

3. CHANGE: ADD a "blind-tutor" control where the student distills a tutor with identical weights but different random seeds/initialization to decouple architectural priors from actual transmission.

4. HARDEST TEST: Compare student agreement on "recombined" lines against a "shuffled-tutor" baseline (where the tutor's labels are randomly permuted before distillation); if the student still performs $\ge 0.20$ above chance, the "transmission" is merely a shared bias toward the vocabulary's marginal distribution.

---

## T3

1. VERDICT: PARTIAL

2. KILL: The "round-trip" gate (blind re-label $\ge 0.50$) is vulnerable to label-leakage or structural priors if the tutor-generated noise preserves the same token-distribution marginals as the original noise, rendering the $0.25$ chance baseline invalid.

3. CHANGE: ADD a requirement for the "blind re-label" to be performed by a separate, frozen model instance that has not seen the tutor's specific generation seeds.

4. HARDEST TEST: Run P3 generation; perform a permutation test where labels are shuffled *before* the blind re-label; if the "blind" tutor still scores $\ge 0.50$, the result is a structural artifact, not a learned pattern.

---

## T4

1. VERDICT: BREAK

2. KILL: The "no-feedback" enforcement is a logical fallacy; if the student is trained via imitation loss on tutor outputs, the tutor's labels *are* the feedback, rendering the "separate-process scoring" a superficial shell that does not prevent gradient-based signal leakage.

3. CHANGE: ADD a strict "zero-overlap" requirement where the tutor and student are trained on disjoint data subsets, or the student is frozen during the evaluation of transmission.

4. HARDEST TEST: Run the P2 "recombined" test using a student trained on a tutor that has only seen random noise; if the student shows $\ge 0.20$ agreement over permuted baseline, the "transmission" is actually a systemic bias in the recombination recipe or the architecture's prior.

---

