# U70-F2 prereg PROPOSAL v1.1 (battery-patched; NOT licensed — needs re-close + countersign)

Battery: barrage v1.0 10/10 NEEDS-PATCH. Base F1a settings + ONE structural cut (Wc input 68→4; policy posterior = z-probe). Everything else v1.1 EXACT.

## Patches (adjudicated)
1. **Baseline (R1-control point ACCEPTED, R1-smuggling REJECTED):** the action path IS provably z-only (driver: Wc reads z_oh; h reaches action only through the sampled z — that is the forced path, not a bypass). But the primary comparison changes: F2 vs **filed F1a-V3 rows, same-seed paired deltas** (identical except head input — the cleanest attribution). V2 relegated to floor reference. NO fresh V2 training in Phase 1 (R5 moot there).
2. **Floor (R2 ACCEPTED):** ctxAcc bar restored to **≥0.85** (v1.1 value). Forcing cost reported as paired F2−F1a accuracy delta (descriptive); a large cost is data, not a moved bar.
3. **Transfer framing (R3/R4/R6/R8/R9/R10 core ACCEPTED, confusions REJECTED):** Phase 2 compares two ARCHITECTURES (factored vs unfactored) under shift — labeled as such. REJECTED with derivation: V2 ctxAcc is well-defined (h-derived ctx-head; Wave-1 filed 0.928) — the "undefined/triviality" claims (R8/R10) are false. R6's "no-arch-changes" objection to N3 rejected (frozen-head-under-shift is the test; no change made).
4. **Transfer bars (R3/R4/R6/R7/R9 ACCEPTED):** per-regime paired mean difference + 95% CI (no bare direction counts). **N2-TRANSFER** = F2−V2 ctxAcc CI excludes 0 in the F2 direction in ≥3/4 regimes AND action-advantage diff likewise AND ctxAcc ≥0.70 in ALL 4 regimes (no catastrophic failure anywhere — masking objection answered). Else MIXED/NONE by rule. N3: ctx/action gated like the rest (denominator stays 4); rho metrics descriptive in ALL Phase-2 regimes.
5. **Sequencing lock (R7/R10 ACCEPTED):** Phase 2 executes IFF Phase-1 probe passes (FIXED or PARTIAL). PERSISTS → halt, no transfer runs, verdict F2-PERSISTS.

## Phase 1 — forcing (trained, 20 seeds; F2-V3 only — V2 baseline is filed)
Cut: Wc←z-onehot only. Base F1a (floor 0.05, repw 0.1). Gates: ctxAcc ≥0.85 AND probe ≥0.70 AND gap = F2act−max(cueAct,F2-V4act) ≥0.05 (paired). G5 usage ≥50%; KL raw reported. Primary deltas: F2−F1a same-seed (probe/gap/ctx). Verdicts: FIXED / PARTIAL (probe pass, gap fail) / PERSISTS (probe fail).

## Phase 2 — novelty transfer (frozen F2-V3 from Phase 1 + freshly retrained frozen V2 — weights were not persisted in Wave 1, retraining is the only option; same seeds, same discipline, 200 epochs to convergence; paired + CI handles seed luck)
Regimes (fresh seeds 100+s, 20/regime): N1 fast-switch (p_sw 0.05, dwell 15); N2 heavy-mask (eps 0.25); N3 novel-rho ({0.5,0.65,0.9}); N4 weak-contingency (0.7/0.3). Metrics: ctxAcc, act−cue advantage, paired per-seed. Label per §Transfer bars above.

## Overall
PROCEED iff Phase-1 FIXED AND Phase-2 TRANSFER (conjunction unchanged; battery to re-ratify). Phase-1 PARTIAL caps overall at MIXED regardless of transfer. No Phase-E claims.
