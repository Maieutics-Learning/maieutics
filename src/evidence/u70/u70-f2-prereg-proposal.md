# U70-F2 prereg PROPOSAL v1.0 (NOT licensed; needs battery + countersign)

Chain: Wave 1 (h-bypass proven) → F1 (gate open, nothing pushes through; PERSISTS both arms). F2 removes the bypass; then tests whether factorization transfers.

Base: F1a settings (floor 0.05, repw fixed 0.1) + ONE structural cut. Everything else v1.1 EXACT (BPTT-50, clip 1.0, 1 restart, init 90000+s, sampling 91000+s, streams, 200 epochs, Adam 3e-4, argmax eval, paired V4 shuffle).

## Phase 1 — forcing (trained, 20 seeds)
- Cut: context head reads **z-onehot ONLY** (Wc input 68→4). The policy posterior IS the z-probe — representation and use unified. h still drives q, recon, rho-head. V2-control (h-only, no z) retrained fresh on the same 20 seeds, same discipline.
- Rationale: decoration becomes impossible. z-constant → action ~chance < cue-following (gap negative). Gap now measures whether training CAN put context into z.
- Gates (adapted; battery to ratify): ctxAcc ≥0.80 (sanity floor — bottleneck cost acknowledged, below Wave-1 0.927) AND probe ≥0.70 (unchanged) AND gap = F2act − max(cueAct, F2-V4act) ≥0.05 (unchanged, paired). G5 usage ≥50% unchanged; KL raw reported.
- Verdicts: **F2-FIXED** (probe+gap pass) / **F2-PARTIAL** (probe pass, gap fail) / **F2-PERSISTS** (probe fail). Accuracy-floor trip filed separately, never silently pooled.

## Phase 2 — novelty transfer (frozen weights, eval-only, fresh seeds 100+s, 20/regime)
Frozen F2-V3 ×20 + frozen V2 ×20 (same-seed pairs) transferred with NO retraining to:
- N1 fast-switch: p_sw 0.05, dwell 15. N2 heavy-mask: eps 0.25. N3 novel-rho: rho ∈ {0.5, 0.65, 0.9} (3-way head keeps OLD labels; rho metrics descriptive only, context/action gated). N4 weak-contingency: payoffs 0.7/0.3.
- Metrics per regime: ctxAcc, actionAcc vs cueActAcc (paired per-seed).
- Bar (pre-hoc): F2 ctxAcc ≥ V2 ctxAcc in ≥3/4 regimes AND F2 action-advantage (act−cue) ≥ V2's in ≥3/4 regimes (direction count + CIs).
- Label: **N2-TRANSFER** (≥3/4 both) / **N2-MIXED** (split) / **N2-NONE**.

## Overall
**PROCEED** iff Phase-1 F2-FIXED AND Phase-2 ≥ MIXED (battery to ratify the conjunction). No Phase-E claims. TOTAL cap + halt-levels per U64e conventions. F3 (detection-speed) stays queued.
