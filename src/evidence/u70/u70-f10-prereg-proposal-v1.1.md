# U70-F10 prereg PROPOSAL v1.1 (NOT licensed — needs re-close + fresh countersign)

Track: U70-CTX de-lottery #5 (ensemble-as-inventory). Base: F4 EXACT per member (forcing Wc←z-onehot train+eval, ctxw 3.0, floor 0.05, repw 0.1, GRU64/Cat4-ST, BPTT-50 carry-over, clip 1.0, 200 epochs, Adam FLAT 3e-4 — no warmup, no tilt, initscale 1.0).

## Diagnosis
F5: grave sets barely overlap across births (k0 {2,6,7,8} / k1 9 graves / k2 9 graves; k0∩k2 EMPTY) — errors are birth-specific, the exact condition ensembles need (old ENS caution was correlated errors; here they decorrelate). F9: 2/4 graves scale-proof (6,8 persist across ±scale) → different draws, not different volumes. Read-only green light filed (f5-crossbirth-table.json): failures move with the dice.

## Change (ONE structural fact; everything else F4 EXACT)
- **M=3 members** per stream-seed, births = filed F5 initBases (90000/94000/98000 — precedent, not novel offsets). Same 20 seeds/streams (paired vs filed F4/F5; ONLY the birth dice differ across members). N = 3×20 = 60 rows (F5 scale).
- Why 3, pre-registered: minimum odd M for clean majority (ties impossible); zero granularity claim — 2-1 splits are still splits for the descriptive disagreement readout. No M-sweep (one M, no selection).
- Per trial: ctx_vote = majority of member ctx predictions; act_vote = majority of member actions. Ties impossible at M=3.

## Design
- Members train as independent F4 runs (no weight sharing, no joint loss — pure vote, no new machinery). Fresh `u70nInitModel` per member per seed (filed driver path, no cross-member state). **Replication gate:** each member reruns the IDENTICAL computation as its filed F5 counterpart (member m=0/base 90000 vs filed k0, m=1/94000 vs k1, m=2/98000 vs k2) and must match that ledger exactly (F5-k0 precedent: max-diff 0.0000 — determinism is filed fact, not aspiration), else HALT. The gate compares member-to-own-filed-ledger (deterministic rerun), never member-to-member.
- Exclusions/stopping/firewall verbatim. No selection. Smoke: 1 seed × 3 members (locked: filed, bugs-only, no tweaks).
- Driver change (post-battery, pre-countersign): `U70N_NMEMB` (default 1; F10 = 3) + vote/disagreement logging. Smoke first.

## Outcomes (bars UNCHANGED, applied to the VOTE)
- Vote math (locked): per trial ctx_vote = majority member ctx-argmax; act_vote = majority member actions. voteActionAcc = act_vote vs true ctx-action; voteCueAcc = stream cue-following accuracy (member-independent); voteShufAcc = majority vote of member actions under per-member z-shuffle (eval RNG 73000+seed+m). voteGap = voteActionAcc − max(voteCueAcc, voteShufAcc). Primary: pooled vote-probe (vote-ctx vs true ctx) ≥0.70 AND voteGap ≥0.05. Paired vote−F4 dProbe/dGap/dCtx + CI.
- Verdicts locked: FIXED (both bars on the vote) / PARTIAL (probe passes AND gap fails — competence without transfer, the F2 shape) / PERSISTS (probe-fail regardless of gap, F2 rule). Near-misses do not move bars. No Phase-2 in this wave.
- Descriptive ONLY with no-upgrade AND no-downgrade clauses (moves the verdict in NEITHER direction; on any verdict files as mechanism notes for the next prereg): rescue-shape table against LOCKED grave list (F4: 2,6,7,8 + F9b-new: 12,13,14,16) — uniform lift = variance reduction; grave-specific un-graving (→ ≥0.70) with healthy vote-mean ≥ member-mean (no robbing) = decorrelated rescue. Disagreement rate + split-vote share on grave vs healthy trials (novelty-signal check, reported, never gated).

## Reporting
Per-member ledger (60 rows) + per-seed vote ledger (20 rows) + paired diffs + CI + rescue/disagreement tables, configs + hashes, verdict. GRU-128 ruling-out stays queued behind this.
