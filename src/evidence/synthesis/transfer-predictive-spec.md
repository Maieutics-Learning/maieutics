# Transfer-predictive teaching — 3-arm spec + verdict v1.1 (2026-11-13)

Reconciliation §7 + paper §8.7. Paired seeds 7–14. Identical compute: 1200-step
hinted recipe (HINTED), 200-step blocks, cap 1200. Battery v2 = REBUILD
(original scratch builder wiped): Xmid (target mid-line), Xgap12 (killMatrix
nFill=12), Xperm (swap 0<->1, 2<->3 on keys+values); A/Hd variants, r=4, 200ex.
Internal A/B/C comparison ONLY — never numeric vs xfer-results.json.

Arms: A fixed-mixed control. B competence-gated (advance ≥0.95, bridge <0.60
diag-long, else stay; rebuilt v2, no aux). C same with held-out-combo
(DIAG-target) rung probes. Bar (pre-reg): C beats A by ≥2/8 with transfer
held, or CUT.

Smoke 2026-11-12 (page, local, 0 pool): A7–A8 2/2.
Full 2026-11-13 (execute_js worker, bit-exact vs page B7 Hd 0.52 + trace —
harness validated before batch; 0 pool spend throughout):

- A 7/8 (95% CI 0.53–0.97): 0.965/0.775/0.77/0.38✗/0.71/0.975/0.78/0.61
- B 3/8 (95% CI 0.14–0.69): 0.52✗/0.085✗/0.585✓/0.525✗/0.605✓/0.33✗/0.565✓/0.44✗
- C 0/8 (95% CI 0.00–0.32): killA 0.015–0.32 everywhere; Hd 0–0.84

VERDICT: CUT (CIs non-overlapping). Mechanism: C gate never advances past R1
in any seed (diag probes 0.08–0.69, never ≥0.95); bridge fires 4–5×/seed on
diag-long lines → installs echo-the-novel-key: killA collapses while Hd
inflates (C12 0.04/0.84 full inversion; C11 0.26/0.00 double collapse).
The cure is poison — bridge-training on held-out combos teaches the shortcut
the kill suite punishes. C's XHd (e.g. C12 0.73–0.88) is inversion artifact,
not transfer. B reproduces its signature (R0 instant advance every seed, R1
stall, memorize-lean/collapse shapes) — calibration verdict-level (3/8 vs
historical 1/8; rebuild v2, no aux — number-level mismatch owned).
Records: src/evidence/gseries-v2/xfer3-results.json (24/24 + tally).
Pool: 0 spend — Kaggle 49s/108000 (refresh 2026-11-14), OR 50/50, Gemini 0.
