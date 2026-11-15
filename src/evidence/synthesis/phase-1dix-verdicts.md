# Phase 1.d.ix verdict: PILOT-FAIL (ix dies at pilot, no full-96)

Prereg: `phase-1dix-prereg.md` v1.5 COUNTERSIGNED FROZEN 2026-11-14. Ledger: `scratch/ix-pilot.json` (+ partials, 48 brain blobs, 5 probe seeds). Driver: `scratch/ix-pilot.js`.

## Bars (all filed, all read mechanically)

- Variance guardrail: killHd range across pilot brains = 138 lines (62–200) ≥ 15 → PASS. Plenty to learn from.
- Signal bar, half 1: pooled held-out probe doubt AUC = **0.4936** (need ≥ 0.60) → MISS. Chance.
- Signal bar, half 2: within-brain win-rate vs own-brain loudness = **0/8** (need ≥ 5/8) → MISS. Not one brain.
- Determinism spot-check: seed 5001 retrained twice → bit-exact → PASS.
- `bars.all = false` → **PILOT-FAIL. ix dies at pilot. No full-96.** Per prereg W clause.

## Supporting numbers (disclosure, no kill power)

- Loudness pooled on identical held-out lines: **0.8598**, wins all 8 brains (per-brain 0.69–1.00). The signal is in the forward pass, not in the weights-as-data.
- Probe train AUC (15 train brains): **0.809** — admitted-memorization budget (30 epochs, MLP-64, raw 30k-dim inputs) underfit; the ≈1.00 the prereg expected never materialized.
- Trivial baseline (train-mean constant): 0.5000. Probe (0.4936) fails to beat even the constant.
- Shuffled-weights null control: 0.4493, below loudness — the demotion teeth never engage (nothing to demote), and the rival "global-stats proxy" account dies with it: the probe learned no spatial structure either.
- Calibration: all 1600 held-out P(correct) predictions collapse into one bin [0.4, 0.6] (mean 0.55 vs empirical accuracy 0.79) — the probe sat on the prior, underconfident everywhere.
- Per-brain probe AUCs: 0.60/0.13/0.47/0.37/0.12/0.15/null/0.45 — three brains (5018, 5021, 5022) systematically ANTI-predicted (AUC ≈ 0.12–0.15). Whatever the probe learned from 15 train brains points the wrong way on new brains: the fingerprint story in the strong form.
- Secondary fortune-telling (EXPLORATORY, gate-firewalled, computed only at verdict): rank-corr init-mean vs held-out acc = 0.64, n = 8, trivial statistic. Quarantined observation, rescues nothing: global stats weakly track quality, legibility still zero.
- Dropped: seed 5001 (killA 0.995 = 199/200, verified with engine evaluator; filed guardrail requires exactly 1.00). Dropped with documentation per prereg. Train set 15 brains, test set 8.
- Test-set degeneracy check: held-out killHd counts 142/157/119/115/199/193/200/146 — spread, not degenerate. 5023 all-correct (null AUCs both sides) noted, not cut (split never re-cut, per disclosure rule).

## Post-mortem (owed by prereg W clause)

1. **Fingerprints don't travel — confirmed in the strong form.** Held-out 0.49, win-rate 0/8, shuffled 0.45: a full weight vector from a new init teaches nothing about that brain's per-line fate, not even via global statistics.
2. **The failure is worse than the pre-mortem's expected split.** Pre-mortem predicted train ≈ 1.00 / held-out ≈ chance. Actual: train 0.809 — the probe didn't even memorize. 30 epochs of full-batch Adam on raw 30k-dim inputs underfit; the user's volume bet ("too many numbers to memorize") cut against the probe itself.
3. **Loudness travels; weights-as-data don't.** Same lines, same brains: readout confidence 0.86 pooled. Legibility lives in the forward computation, not in the parameter vector as an object.
4. **No rescue from anywhere in the ledger.** Calibration collapsed to the prior; shuffled control dead; secondary is a quarantined n=8 hint. There is no reading under which this pilot is close.
5. **Cost accounting:** brains 24 × ~4–6 min + determinism re-run; probe 5 seeds × 30 epochs ≈ 4 h wall across windows (the v1.5 corrected estimate held). Full-96 would have cost ≈18 h for a verdict this pilot already delivers: the staging gate did its job.

## Why it fails (W1 + W3 quarantined diagnostics, filed 2026-11-15 — verdict unaffected)

- **W1 (frozen probe, novel lines of SEEN brains):** killHu 0.763 (killHd sanity 0.809). The probe genuinely reads seen fingerprints on lines it never trained on. Readout, representation, and optimization are all adequate — the failure is purely cross-init generalization. (killA unusable as held-out lines: kept brains ace it by guardrail, zero error lines.)
- **W3 (same frozen recipe, inputs = final − init deltas):** pooled 0.4606, train 0.8132, win-rate 1/8, shuffled 0.4086. Removing init noise changes nothing: train fits identically, transfer still chance. The mask hypothesis is dead — the mapping init→fate itself doesn't transfer.
- **Remaining shape of the failure:** per-brain AUCs are bimodal-ish, not centered noise — W3: 0.93 / 0.03 / 0.62 / 0.10 / 0.16 / 0.54 / null / 0.42 (raw: 0.60/0.13/0.47/0.37/0.12/0.16/null/0.45). The probe seems to find a real doubt axis in weight space, but each new brain lands on either sign — consistent with mirrored basins (sign/permutation symmetries of the init), untested. The concrete next test would be weight-space alignment (Git Re-Basin style: align test brains to train basins, then probe) — needs its own mini-design, not run here.
- Bottom line for the paper: whole-brain legibility fails at cross-init transfer, not at readout. Loudness (same lines, same brains, 0.86) reads the forward computation; nothing in the parameter vector — raw or delta — predicts a new init's fate.

## Integrity footnotes

- Mid-run driver bug found and fixed (ledger-correcting, design-untouched): the `argmax` helper compared value > index, so every brain initially "guessed" class #1 (variance counts filed as uniform 50s). Root-caused via independent recompute, fixed to value > value, poisoned probe weights (P1/P2 on garbage labels) deleted, probe retrained from scratch, variance recomputed (138). Brain blobs, guardrails, and determinism never touched the helper — unaffected.
- vii cross-check: `scratch/vii-full.js` verdict code uses correct inline comparisons (verified by grep); the same helper typo exists there but only in quarantined U-arm errSet selection on logits, never in confirmatory AUCs. vii FULL-FAIL stands, untouched.
- Drivers sliced across parallel workers (IX_ONLY/IX_PARTIAL) resumed via done-markers; test seeds never entered any weight update (asserted structurally + by set-disjointness check).

## Feeds

- 1.e methods: probe outcome (either way) — file as the negative legibility result: whole-brain weight vectors do not predict per-line fate on held-out inits; loudness remains the doubt instrument that travels.
- F-new: the anti-prediction pattern (0.12–0.15 AUCs) + calibration collapse are the honest details for the paper's negative-result paragraph.
- ix verdict PILOT-FAIL frozen (no full-96); why-diagnostics W1+W3 filed above. No revival of the confirmatory claim without a new prereg version. Gameplan v20 (PILOT-FAIL + why-diagnostics).
