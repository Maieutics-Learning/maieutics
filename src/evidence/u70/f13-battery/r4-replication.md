# R4 — replication sanity (F13 v1.0 barrage, 2026-11-27)

VERDICT: NEEDS-PATCH

1. **Hardest Test:** A bit-wise comparison of the `mulberry32` output stream across different JS engine versions (V8 vs SpiderMonkey) or different CPU architectures (x86_64 vs ARM64) during a long-trajectory run.
2. **Reason:** "Expect-exactly-0" fails if any floating-point operation (even in "hand-rolled" CPU logic) triggers different rounding modes or precision handling across environments, rendering the "deterministic" baseline a lie.
