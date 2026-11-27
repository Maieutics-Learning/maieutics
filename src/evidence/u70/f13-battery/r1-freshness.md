# R1 — held-out freshness (F13 v1.0 barrage, 2026-11-27)

VERDICT: NEEDS-PATCH

(1) Cross-seed contamination audit: grep the entire codebase, including hidden config files, environment variables, and hardcoded arrays, for any occurrence of integers 20–39.

(2) If these seeds appear in any previous "smoke test," "hyperparameter sweep," or "sanity check" (even as non-training inputs), the "freshness" is compromised, turning a generalization test into a retrieval test.
