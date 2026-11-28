# F16 v1.2 confirm dc2 (CONSISTENT)

**Verdict: CONSISTENT (battery may close)**

1. **Enforceability:** v1.2 is a closed-loop specification. The "smoke" phase (T10a-f) acts as a hard gate for structural integrity (flag isolation, step-count, weight-hash stability) before any metrics are recorded.
2. **Isolation:** The "Four Arm" design (A0, A1, A2, B) prevents scope creep. Attribution is preserved via separate arms; interaction is captured via the folded arm (B), but explicitly relegated to a "descriptive" readout, preventing verdict contamination.
3. **Verification:** The use of `u70nF14ConfigSpec()` as the A0 baseline and the requirement for identical step counts (200/1200) across all arms ensures physical plausibility.
4. **Extras:** Unfamiliar/ablation/calibration metrics are strictly read-only on frozen weights (T10e), ensuring they remain descriptive and cannot shift the primary F14-verbatim bars.
