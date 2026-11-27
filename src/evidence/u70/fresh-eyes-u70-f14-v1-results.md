# Fresh-eyes U70-F14 v1 battery results (2026-11-27)

Barrage 10 on premise v1.0: 8 NEEDS-PATCH / 2 STANDS (r1 STANDS, r7 STANDS).

## Adjudication

- ADOPT functional: r2 T8b independent recompute (strict === vs ziShuf+Wc/bc reference, no helper/branch) + T7 reads metric-path head inputs; r9 per-seed early-HALT ordering (train→clean→check before shuffled/heldout, first mismatch HALTs).
- ADOPT glosses (no design change): r3 read-point boundary vs trajectory-rewrite (owed z-recurrence); r4 TRUE-gap direction (removing +q lowers shuffled ⇒ bar ≥0.05 conservative; no bar move — tuning-to-reviewers); r5 dual-verdict independence; r6 no-learning-at-eval (frozen argmax eval; held-out-void rejected as reviewer error); r8 256-bit FNV hash provenance (replication sanity IS the weight comparison; SHA churn rejected).
- REJECT arms (scope): r3 trajectory-rewrite, r5 inverted-shuffle, r10 seeds 40-60 + zero-ablation (queued tracks). REJECT bar re-derivation (r4).
- Patched v1.1 (`u70-f14-prereg-proposal-v1.1.md`, premise v1.1 pinned).

Re-close 4 on v1.1: 4 NEEDS-PATCH, all rejected with derivation (re1 z-orthogonality = category error vs locked read-point boundary; re2 early-HALT is first-mismatch hard rule, not discretionary; re3 byte-diff = execution receipt, T8b runtime check stronger; re4 held-out-void repeats r6 error and concedes T8b kills the leak). Confirm 2/2 CONSISTENT (dc1 category-error ruling, dc2 first-mismatch + held-out-void reviewer-error rulings).

Battery CLOSED STANDS v1.1. AWAITING owner countersign on exact v1.1 before any driver edit/compute. NO PUSH without order.
