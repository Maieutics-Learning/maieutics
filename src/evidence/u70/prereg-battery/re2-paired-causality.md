# U70-prereg re-close 2 (paired-causality)

STANDS.

1. **Causal Rigor:** v1.1 correctly implements the "forced-use" or "z-shuffle" for V4, moving from a vague "causal-use control" to a precise paired intervention. This eliminates the risk of V4 being a separate training fluke.
2. **Ablation Gap:** The explicit requirement for `actionAcc(V3) - max(cueActAcc, actionAcc(V4)) ≥ 0.05` prevents the model from claiming functional latent use if the behavior is actually driven by the reactive cue-follow floor (V1).
3. **G5 Integration:** By gating G4 behind G5 (no-collapse), the patch prevents "lucky" accuracy gains from being misidentified as successful neural representation.

Prior reviews missed that v1.0’s G4 was an unbound comparison; v1.1 anchors it to the V4-shuffle.