# R6 — scope discipline (F13 v1.0 barrage, 2026-11-27)

VERDICT: STANDS

1. **Falsifier**: A side-by-side hash comparison of the `u70-neural.js` runtime environment and weight tensors between the F12-eval (seeds 0..19) and F13-eval (seeds 20..39).
2. **Reason**: Any divergence in the binary state of the model or the global environment during the transition from training-eval to held-out-eval constitutes a smuggled variable, invalidating the isolation of generalization.
