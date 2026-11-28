# F15 re-close re2 — hidden-reset (verbatim, 2026-11-28)

Angle: hidden-reset gloss vs periodicity: does hidden reset each epoch kill the slot-memory rival

**Verdict: NEEDS-PATCH**

1. **Hidden-Reset Ambiguity:** The "gloss" fails to technically decouple the hidden state reset from the trajectory switch. If `hidden_reset` occurs at the epoch boundary regardless of whether the trajectory changes, the "periodicity" is a side-effect of the loop, not a controlled variable. You cannot claim to isolate the distribution effect while conflating it with a state-wipe.
2. **Step-Count Validation:** T9(d) asserts 1200 updates, but without a verified trace of the `e-mod-8` logic, the "identical total steps" claim is an assertion, not a proof.
3. **Blocking Factor:** The interaction between the round-robin schedule and the hidden-reset mechanism creates a confounding variable. You are testing "multi-trajectory training" and "periodic state-clearing" simultaneously. To STAND, you must decouple the reset trigger from the trajectory index.
