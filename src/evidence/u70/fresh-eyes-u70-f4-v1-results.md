# U70-F4 battery barrage results (CLOSED 10/10 NEEDS-PATCH, 2026-11-27)

Premise: `premise-u70-f4-v1.0.md`. Verbatims: `f4-battery/r1..r10`.

## Convergent finding (10/10, different words)
Weight-soundness / stability / attribution: ctxw 1.0→3.0 raises total loss magnitude → effective-LR shift; dense teacher into shared backbone → trajectory shift, not linear sharpening; without LR/clip change risks dominance/interference with L_pred/L_dyn; clean-attribution claim overstated. R6p3 / R10p3 add under-spec: state explicitly that forcing cut applies during L_ctx training (not eval-only). R8p3 notes verdict gloss: probe-pass + gap-fail = PARTIAL already caps, but cost should be reported descriptively. R7p2 (float precision) is non-blocking trivia. No reviewer defends 3.0 as-is; none demands a different number, only guardrails/clarity.

## Proposed adjudication (for owner arbitration)
Adopt ONE patch group into v1.1 (no number change, no second variable):
1. Clarify forcing-during-training (Wc←z-onehot in forward + backward, training and eval identical head rule).
2. Stability/attribution gloss: Adam 3e-4 + global clip 1.0 UNCHANGED (clip already bounds total-norm; no per-head clip to avoid 2nd variable); log grad norms; INVALID on non-finite; paired same-seed design isolates the constant as cause — trajectory divergence IS the effect under test, total-magnitude shift is mechanism not confound.
3. Cost reporting: paired dProbe/dGap/dCtx + CI, descriptive; PARTIAL caps at MIXED-equivalent (no FIXED on degraded gap); no bar moves.
Reject: LR retune, loss-rescale, per-head clip, extra heads/schedules (all 2nd variables); float-precision lock (deterministic CPU JS, filed seeds suffice).

Re-close needed (fresh reviewers on v1.1), then countersign, then execute.
