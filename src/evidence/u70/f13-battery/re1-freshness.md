# RE1 — freshness + T5a re-close (F13 v1.1, 2026-11-27)

VERDICT: STANDS

1. **T5a Freshness:** Fully answered. v1.1 implements a mandatory pre-smoke `grep` over codebase and filed ledgers for seeds 20..39. Any hit triggers a `HALT` gate, ensuring the held-out set is uncontaminated before execution.
2. **Residual Weight:** Negligible. The "ceiling-shift qualifier" (R3/R8) correctly converts a potential bar-move into a descriptive qualifier, preventing the smuggling of reviewer-driven threshold adjustments into the verdict weight. The "gap-bar derivation" (R7) is a gloss, not a variable change. The queued swap-PRNG is explicitly excluded from this wave.
