# Fresh-eyes battery: attention multi-head prereg (3x sealed, parallel via root.generateText)

Goal line carried in every prompt: final goal teaching AI to learn (self-learning machine);
everything so far DIRECTED (prompt still required); prescribe what newly trained AI needs + best way.

## R1 — IMPLEMENTABLE
1. State Persistence Gap: artifact focuses on retrieval delta; self-learning requires a persistent
   state buffer (memory) to track "what was learned" across sessions (prevent catastrophic
   forgetting during self-triggering). 2. Objective Function: vote->mean lacks intrinsic reward
   signal; replace mean-pooling with contrastive loss (InfoNCE) so the AI distinguishes
   signal/noise without prompts. 3. Verification Loop: add a Critic head to the MH architecture
   for the self-triggered verify.
→ Adjudication: REJECT as scope. Persistence/critic/InfoNCE are mechanism changes beyond the
head-count question; goal-line flavor, not a hole in the pre-registered test. Vote→mean stays
(the tested aggregation).

## R2 — IMPLEMENTABLE
1. Credit Assignment Gap: vote->mean blurs distinct head signals; implement gating or
   softmax-weighted sum to preserve specialized retrieval paths. 2. Overfitting Risk: 1→5 heads
   on H48 trunk grows params vs data; apply weight decay/dropout to Wq/Wk/Wv. 3. Bootstrap
   Validation: per-head bootstrap aux needs strict orthogonality constraint so heads don't
   collapse into clones of the single-head baseline.
→ Adjudication: PARTIAL. Gating/decay/orthogonality-loss REJECTED as new mechanisms (single-axis
head-count test must not grow new machinery; decay confounds head-count with regularization).
Clone concern ADOPTED as measurement: report inter-head vote-disagree + full-agreement fraction.

## R3 — IMPLEMENTABLE
1. Stability Risk: 1→5 heads without normalization (LayerNorm) may spike variance in mean-vote
   aggregation. 2. Overfitting: 5 independent Wq/Wk/Wv sets on H48 may memorize the 6 flat slots;
   weight decay/dropout. 3. Verification Gap: vote→mean lacks confidence metric; add variance
   check across heads for low-confidence self-learning trigger.
→ Adjudication: PARTIAL. LayerNorm/decay REJECTED (new mechanisms/confounds). Variance-check
ADOPTED as measurement (same head-disagree readout as R2).

## v1.1 pins-only (no spec change, reporting only)
5-head mean-vote exactly as specced + report headDisagree + headCloneFrac; no gating, LayerNorm,
decay, InfoNCE, or orthogonality loss. Capacity note: ~3k att params vs ~20k trunk.
Driver newai-att2-driver.js implements exactly this (grad-checked exact).
