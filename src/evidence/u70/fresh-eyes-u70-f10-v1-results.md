# U70-F10 battery barrage results (10/10 NEEDS-PATCH, 2026-11-27)

Premise: `premise-u70-f10-v1.0.md`. Verbatims: `f10-battery/r1..r10`.

## Convergent charges (ADOPTED)
1. **M unjustified (all 10):** 3-2-split "granularity" is descriptive preference, not structural necessity. No power analysis, no M=3-insufficient baseline → disguised sweep.
2. **Verdict smuggling via descriptives (r1/r2/r4/r6/r7/r8):** rescue table + disagreement readout create implicit secondary verdicts that can rescue a PERSISTS qualitatively.
3. **Vote-gap undefined (r9):** no mathematical definition of the vote gap vs baselines.
4. **Independence/determinism (r3/r4/r6):** novel linear initBase offsets risk correlated births; shared-state across members unstated.
5. **Variance-reduction confound (r8):** vote success indistinguishable from generic noise-averaging without a discriminating read.
6. **PARTIAL softens failure (r9/r10):** gap-pass + probe-fail should not read PARTIAL (competence-first violated).

## Adjudication (→ v1.1)
- **M=3, births = filed F5 bases (90000/94000/98000).** Kills charge 1 outright (minimum odd majority, zero granularity claim; 60 rows, F5 scale) AND charge 4 (bases are filed precedent, not novel offsets). Bonus: **replication gate** — member rows must match filed F5 k0/k1/k2 ledgers exactly (F5-k0 replication was exact max-diff 0.0000), else HALT. Fresh `u70nInitModel` per member per seed (filed driver path); smoke verifies replication on 1 seed × 3 members.
- **Vote-gap locked:** per trial, ctx_vote = majority member ctx-argmax; act_vote = majority member actions. voteActionAcc = act_vote vs true; voteCueAcc = stream cue-following accuracy (member-independent, identical streams); voteShufAcc = majority vote of member actions under per-member z-shuffle (eval RNG 73000+seed+m, pre-registered offsets). voteGap = voteActionAcc − max(voteCueAcc, voteShufAcc). Bars apply to pooled vote-probe (vote-ctx vs true ctx) and voteGap.
- **PARTIAL = probe passes AND gap fails** (competence without transfer — the F2 shape). Probe-fail → PERSISTS regardless of gap. No softening.
- **Rescue-shape discriminator (descriptive, pre-registered):** grave list locked in advance (F4: 2,6,7,8 + F9b-new: 12,13,14,16). Uniform lift across all seeds → variance reduction. Grave-specific un-graving (graves → ≥0.70) with healthy-seed vote-mean ≥ member-mean (no robbing) → decorrelated rescue. Shape distinguishes the hypotheses (answers r8) without touching verdicts.
- **No-upgrade clause:** rescue/disagreement tables CANNOT upgrade a verdict; on PERSISTS they file as mechanism notes for the next prereg only.
