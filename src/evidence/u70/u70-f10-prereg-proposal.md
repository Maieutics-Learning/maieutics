# U70-F10 prereg PROPOSAL v1.0 (NOT licensed — needs battery + countersign)

Track: U70-CTX de-lottery #5 (ensemble-as-inventory). Base: F4 EXACT per member (forcing Wc←z-onehot train+eval, ctxw 3.0, floor 0.05, repw 0.1, GRU64/Cat4-ST, BPTT-50 carry-over, clip 1.0, 200 epochs, Adam FLAT 3e-4 — no warmup, no tilt, initscale 1.0).

## Diagnosis
F5: grave sets barely overlap across births (k0 {2,6,7,8} / k1 9 graves / k2 9 graves; k0∩k2 EMPTY) — errors are birth-specific, the exact condition ensembles need (old ENS caution was correlated errors; here they decorrelate). F9: 2/4 graves scale-proof (6,8 persist across ±scale) → different draws, not different volumes. Read-only green light filed (f5-crossbirth-table.json): failures move with the dice.

## Change (ONE structural fact; everything else F4 EXACT)
- **M=5 members** per stream-seed, births from distinct initBases (90000 + m*4000, F5 spacing precedent: 90000/94000/98000 + 102000/106000). Same 20 seeds/streams (paired vs filed F4; ONLY the birth dice differ across members). N = 5×20 = 100 rows.
- Why 5, pre-registered: odd M for clean majority; 5 (not 3) for vote-split granularity — 3-2 splits are the interesting disagreement readout, M=3 gives only 3-0/2-1. No M-sweep (one M, no selection).
- Per trial: ctx_vote = majority of member ctx predictions; act_vote = majority of member actions. Ties impossible at M=5.

## Design
- Members train as independent F4 runs (no weight sharing, no joint loss — pure vote, no new machinery).
- Exclusions/stopping/firewall verbatim. No selection. Smoke: 1 seed × 5 members (locked: filed, bugs-only, no tweaks).
- Driver change (post-battery, pre-countersign): `U70N_NMEMB` (default 1; F10 = 5) + vote/disagreement logging. Smoke first.

## Outcomes (bars UNCHANGED, applied to the VOTE)
- Primary: ensemble-vote probe ≥0.70 (pooled, vote-ctx vs true ctx) AND vote gap ≥0.05 (vote-action vs cue-following). Paired vote−F4 dProbe/dGap/dCtx + CI.
- Verdicts locked: FIXED (both bars on the vote) / PARTIAL (exactly one bar) / PERSISTS (probe-fail, F2 rule). Near-misses do not move bars. No Phase-2 in this wave.
- Descriptive ONLY (no verdict weight): rescue table (F4/F9 graves fixed by vote?), disagreement rate + its separation (split-vote share on grave trials vs healthy trials — the novelty-signal check, reported, never gated).

## Reporting
Per-member ledger (100 rows) + per-seed vote ledger (20 rows) + paired diffs + CI + rescue/disagreement tables, configs + hashes, verdict. GRU-128 ruling-out stays queued behind this.
