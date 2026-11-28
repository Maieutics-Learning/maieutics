# F16 v1.2 confirm dc1 (CONSISTENT)

**Verdict: CONSISTENT**

1. **Hardening (re4):** G4 (RNG index/fan/scale logging) and T10e (pre/post-extra weight hash parity) provide sufficient mechanistic verification of "eval-only" and "isolation" without expanding the training scope or altering the baseline.
2. **Symext Rejection (re2):** Rejection is correct. Zero-padding as an initialization bias is a structural change; treating it as a neutral extension is mathematically unsound.
3. **Forced Patches:** None. The v1.2 micro-patches are checkable assertions, not design changes.
4. **Scope:** Training arms (A0, A1, A2, B) are isolated. Eval-only extras are bounded to frozen weights. Oracle disjointness (seeds 2000+) is pre-registered.

**Battery may close.**
