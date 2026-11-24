# Fresh-eyes battery: self U5 nonlinear/scrub head (3x sealed, parallel via root.generateText)

Goal line carried in every prompt.

## R1 — NEEDS-PATCH
1. Dual-LR instability: slow gate locks on untrained head noise. Fix: head warmup, gate lr 0 first 100st.
2. HEAD gap 0.5-0.7 undefined vs U4 0.47/0.57 precision. Fix: tighten (≥0.65 / <0.60 + MARGINAL).
3. Sponge effect: tiny MLP overfits frozen quirks at 5e-3. Fix: weight decay λ=0.01 on head.
4. 800st insufficient for non-convex MLP. Fix: 1500st or LR decay.

## R2 — NEEDS-PATCH
1. Convergence lag (same as R1.1). Fix: gate frozen first 100st.
2. Underfitting risk. Fix: 1200st or dead-neuron monitor.
3. 0.7 too lenient vs 0.57 linear. Fix: raise to ≥0.85, 0.6-0.8 = PARTIAL-SCRUB.
4. Healthy assumption: head can only ignore poison. Fix: baseline-symmetry vs U4-linear-open, delta <0.15 = hypothesis failure.

## R3 — NEEDS-PATCH
1. Gate saturates before MLP converges. Fix: freeze gate 100-200st.
2. Convergence risk. Fix: 1200st or cosine decay from 600st.
3. h2 variance shocks fresh MLP. Fix: LayerNorm before MLP.
4. 0.7 optimistic if collapse not shift. Fix: linear probe on 24-dim hidden.

## Adjudication: 3 NEEDS-PATCH → v1.1 PINS (no new arms, no budget change)
- ADOPT: head warmup 100st (gate lr 0, head-only on mixed diet) then joint 800st head 5e-3 / RP 1e-3 (R1.1/R2.1/R3.1 unanimous; same warmup pattern as U6 critic-warmup).
- ADOPT (pin): HEAD band clarified — ≥0.7 NONLINEAR-SUFFICES, <0.5 HEAD-FAILS, 0.5-0.7 PARTIAL-SCRUB (R1.2/R2.3 compromise; no MARGINAL re-eval, logged as band).
- ADOPT (eval-only): baseline-symmetry — report U5-open minus U4-linear-open delta per seed (R2.4; hypothesis check, no new train).
- REJECT: 1200/1500st + LR decay (budget fixed 800st throughout U-series; convergence risk logged, if warmup+800 fails it is a finding); weight decay (unproven in this stack, changes loss); LayerNorm (arch change → U5b); dead-neuron abort, ≥0.85 bar, hidden probe (diagnostics parked U5b).
- Raw replies inline in tool result (no scratch raw).
