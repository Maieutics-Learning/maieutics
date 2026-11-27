# Latest-review reconciliation (2026-11-27) — implementation audit intake

Source: `src/evidence/synthesis/latest-review-transcript-and-ai-notes.docx` (+ `-extract.txt`,
software-inflated verbatim, CRC-OK on document.xml). The review covers the post-push-`09b73ac7`
tree; its line citations (u70-neural.js 152-153, 457-459) match the current working tree, so the
audit below verifies against current files, not memory. No code changed by this memo; every fix
needs its own prereg + battery + countersign per standing rules. Status: ADJUDICATED, UNPUSHED.

## Verification (agent-checked against the current tree, 2026-11-27)

- **C1 ST forward — VERIFIED.** u70-neural.js:152-153 builds `zoh[zi]=1` then adds the full
  posterior `q` (`zoh[k] += q[k]`), so the forward value is onehot+q, not one-hot. The inline
  comment claims the backward is handled "via qd copy" — the forward impurity stands regardless
  of the gradient path. ACCEPTED as a blocking issue for "discrete latent does the work" readings
  of F2/F4/F10. Pooled metric values are unaffected as measured-as-run numbers; what changes is
  what they mean (graded carrier, not categorical bottleneck).
- **C2 z-shuffle partial — VERIFIED.** u70-neural.js:403 rebuilds `zoh = zdet(shuffled) + q(original)`,
  and the recurrence pass (lines 390-395) runs entirely on clean z, so the shuffled eval permutes
  only the hard category at the final Wc read while original-trial posterior still reaches the head.
  ACCEPTED: the gap metric measures robustness to hard-category permutation with posterior
  retained, not full latent intervention.
- **C3 ECE fixed-reference — VERIFIED twice.** Neural (u70-neural.js:458) compares bin accuracy
  against fixed 0.95; oracle (u70-oracle.js:115, `k/n - 1 + 0.05`) does the same. ACCEPTED: neither
  quantity is expected calibration error; G1's ECE<=0.12 gate is uninterpretable as calibration.
  Context-accuracy lanes are untouched. Recomputation needs per-trial confidences, which standard
  rows do not log (only `pTrueTrace`/trace modes) — a re-eval (reads-only) is owed before any
  calibration claim is cited again.
- **C4 train/eval same trajectories — VERIFIED.** `runU70Neural` generates one path+obs per seed
  (u70-neural.js:503) and uses it for all 200 epochs AND all evals (lines 511, 516, 520). ACCEPTED:
  every U70 neural verdict is training-trajectory performance; generalization is untested. The base
  prereg's seeds-20..39 held-out replication (u70-prereg-proposal v1.0/v1.1 line 7) was gated on
  PROCEED, which never fired — correctly never run, still owed before any generalization claim.
- **C5 arch/spec mismatch — VERIFIED.** Spec (u70-minimal-arch.md:10) requires
  `h_t = GRU(64; input (+) z_{t-1})`; the implementation's recurrent candidate (u70-neural.js:134-138)
  uses only current input + previous hidden state (z enters only the encoder + readouts, never the
  recurrence). ACCEPTED: as-run, the system is a recurrent model with a stochastic-bottleneck
  readout, not the specified recurrent-latent loop. Fix the code or revise the spec with justification.
- **C6 F10 +0.164 cross-head — VERIFIED structure.** The vote aggregates context-head predictions
  (u70-neural.js:440 `traceCtx.push(guess)`, :541 majority over `trace.ctx`), while F4's probe is the
  detached z-only probe (Wq). ACCEPTED: +0.164 is not a like-for-like ensemble gain. The
  like-for-like arithmetic is consistent as stated (voteProbe 0.8832 - F4 ctx 0.8795 = +0.0037);
  the quoted CI [-0.0027,+0.0100] is TAKEN AS FILED pending Level-2 recompute from ledgers — do
  not cite it as independently confirmed. F10 FIXED stands ONLY under the suggested status
  language (vote-level thresholds on evaluated trajectories; filed in the review's section F and
  adopted here as the citation form).
- **C7 z-only diagnostic — VERIFIED from the filed ledger.** d-u70-neural-f10-wave1.json: 60 member
  rows, probe mean 0.5854, 28/60 >= 0.70. Matches the review exactly; no adjudication needed beyond
  recording that the numbers are ledger-grounded, not review-supplied.
- **C8 bio/process framing — ACCEPTED as guidance.** Convergent with standing claim levels
  (functional/integrated/interpretation-supported) and with the filed F10 disagreement-negative
  result. "Vote, not single-model competence" is consistent with the closeout (member pool mean
  0.5854). The fresh-eyes blind-spot note is recorded as a process finding: batteries review
  documents, not implementation semantics — future load-bearing claims need a code-semantics audit
  lane (executable tests: one-hot forward values, posterior removal), not just another document round.

## Corrections to the review (minor, do not affect substance)

- "F5-F8 retained initialization sensitivity" compresses distinct manipulations (F5 rebirths,
  F7 warmup path, F8 tilt orientation); substance holds on all three (graves persist), wording only.
- The review's "preregistration's proposed fresh seeds 20-39" is the BASE prereg (v1.0/v1.1 line 7),
  gated on PROCEED — correctly unrun, not an oversight.

## Claim boundaries adopted (citation form)

- Supported: oracle ctx 0.9498 on the synthetic task; F10 vote met its preregistered vote-level
  thresholds on the evaluated trajectories; F10 member replication exact (maxDiff 0).
- Suggestive only: context-related features; complementary member errors; U70 as control substrate.
- Not established: reusable discrete latent representation; unseen-trajectory generalization;
  calibration; latent necessity; novelty detection; any biological equivalence.
- Required order (no reordering without owner arbitration): ST fix -> full-latent intervention +
  unit tests -> valid ECE + retained confidences -> independent train/test trajectories + weight +
  config hashes -> separate head metrics + causal ablations -> unfamiliar-context rejection test ->
  ACh/NE only after those gates pass.

## Owed (each needs own prereg + battery + countersign; nothing licensed by this memo)

1. ST-forward correction + shuffle-replaces-all + one-hot/posterior-removal unit tests.
2. Valid-ECE reimplementation (oracle + neural) + per-trial confidence retention.
3. Held-out trajectory split (train on seeds A, eval on never-trained seeds B; weights + hashes saved).
4. Causal ablation battery (no-latent / randomized-latent / full-shuffle vs recurrent-only vs ensemble).
5. Unfamiliar-context rejection probe. F10 FIXED keeps its filed meaning meanwhile; do not extend it.
