# U70-F11 prereg PROPOSAL v1.0 (NOT licensed — needs battery + countersign)

Track: U70-CTX implementation repair #1 (straight-through forward + full-latent intervention +
executable tests). Base: F4 EXACT (forcing Wc<-z-onehot train+eval, ctxw 3.0, floor 0.05, repw 0.1,
GRU64/Cat4-ST, BPTT-50 carry-over, clip 1.0, 1 restart init 90000+s, sampling 91000+s, streams,
200 epochs, Adam FLAT 3e-4, argmax eval). Verified against the current tree 2026-11-27 (review
line refs 152-153 / 457-459 match; outside-edit notice on F2/F4 files noted, verification done
post-change).

## Diagnosis (all three verified in-tree, see reconciliation `latest-review-reconciliation-2026-11-27.md`)

1. **ST forward leaks posterior.** u70-neural.js:152-153 builds `zoh = onehot(argmax(q)) + q`.
   Correct straight-through is forward-exact one-hot with gradient-as-if-continuous. As-run, every
   head reads a graded carrier, so "the discrete latent does the work" was never tested — only
   "a q-flavored carrier does the work."
2. **Shuffle intervenes partially.** u70-neural.js:403 rebuilds `zoh = onehot(shuffled) + q(original)`,
   and the recurrence pass (:390-395) always runs on clean z. The gap metric therefore measures
   robustness to hard-category permutation with the original posterior still reaching the head —
   not removal of latent information.
3. **No executable guard.** Nothing asserts forward one-hotness, ST gradient identity, or
   intervention isolation, which is how two document batteries (F4, F10) passed without noticing.

Out of scope for F11 (separate owed tracks, unchanged): valid-ECE reimplementation, held-out
trajectories, z_{t-1} recurrence wiring, unfamiliar-context probe. F11 changes the two lines above
and adds the missing tests; everything else stays F4-exact so the paired F11-F4 delta isolates the
repair.

## Change (THREE coupled edits, one track — split only in the unit tests, not in training)

- **(a) Forward:** `zoh[k] = (k === zi ? 1 : 0)` exactly (delete the `+q` accumulation). The manual
  backward is UNCHANGED: `dqlog = dqrep*repw + dz*(1-UNIF)` through the softmax jacobian (:273-277)
  already implements dz/dq = 1, i.e. the ST surrogate. So the repair is forward-only; the gradient
  path it relies on already exists and is already grad-relevant in filed runs.
- **(b) Shuffle:** in `u70nEval` with zShuffle, `zoh[k] = zdet[k]` (pure shuffled one-hot, no `+q`).
  Documented boundary: the recurrence history stays clean-z (intervention at the read point, not a
  trajectory rewrite) — the claim tested is "the read carries no original-trial latent information,"
  and the unit test enforces exactly that. A trajectory-level rewrite is NOT smuggled in.
- **(c) Unit tests** (run pre-smoke, must all pass or HALT; filed beside the driver):
  T1 forward one-hotness: over 200 random (h,x) draws, every `zoh` is exactly one 1.0 and rest 0.0
  (strict equality), sum 1.0.
  T2 ST gradient identity: finite-difference check that dL/d(elog) through the head path equals the
  analytic `dz`-through-jacobian term to 1e-6 (same forward, perturbed logits) — proves the surrogate
  survived the forward edit.
  T3 intervention isolation: in shuffled eval, `sfeat`'s z-part is exactly one-hot AND shares no
  floating value with the trial's `q` (bitwise: no element of sfeat equals any element of c.q
  unless that value is exactly 0.0/1.0) — proves the original posterior cannot reach the head.
  T4 shuffle determinism: same seed+offset twice gives identical `shuffled` order (guards the
  F10 vote-gap RNG convention, unchanged: 73000+seed+m).

## Design

- Smoke (locked, bugs-only): 1 seed (s0), corrected code: T1-T4 pass logged, loss finite, gap computed
  under corrected shuffle. Filed, no tweaks.
- Wave: retrain corrected-F4 on the SAME 20 seeds (same inits 90000+s, same streams/draws — paired
  vs filed F4; ONLY (a) differs in training; eval uses (b)). N=20. Exclusions/stopping/firewall:
  F4 v1.1 verbatim (Adam/clip unchanged, INVALID on non-finite, no selection, 1 restart). No sweep.
- Driver change (post-battery, pre-countersign): two-line forward/shuffle edit + T1-T4 test block.
  Nothing else (no LR/retune/rescale — second variables stay out).

## Outcomes (bars UNCHANGED, applied to corrected numbers)

- Primary: detached probe >= 0.70 (pooled) AND corrected-shuffle gap >= 0.05. Paired corrected-F4
  vs filed-F4: dProbe/dGap/dCtx + CI (same-seed, same streams — isolates the repair).
- Leak-size read (DESCRIPTIVE, the point of the exercise): corrected gap vs filed gap per seed —
  how much of the filed 0.1362 was posterior leak-through vs hard-category use. No verdict weight.
- Verdicts locked: REPAIRED (both bars on corrected code — F4 FIXED survives the repair) /
  QUALIFIED (probe passes AND gap fails, F2 shape — use without competence) / REGRESSED (probe
  fail — the filed FIXED does not survive correction; the win was leak-powered). Near-miss bars
  do not move. No Phase-2 in this wave.

## Reporting

Per-seed ledger (20 rows) + paired diffs + CI + T1-T4 logs + configs + hashes, verdict. Whatever the
verdict, F11 re-labels F4/F10 readings in one place (which figures were leak-flavored) without
rewriting history (filed numbers stay as measured-as-run).
