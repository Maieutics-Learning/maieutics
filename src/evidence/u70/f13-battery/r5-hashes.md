# R5 — hash sufficiency (F13 v1.0 barrage, 2026-11-27)

VERDICT: NEEDS-PATCH

1. **Hardest Test:** Cross-verify weight hashes against a trusted third-party build (not the agent's own `u70-neural.js` output) using a different hashing algorithm (e.g., SHA-256 vs. custom) to ensure no "magic constants" or hidden state are baked into the binary.

2. **Reason:** Weight/config hashes prove *identity* of the file, not *integrity* of the process; without a witnessed build pipeline, the agent could hash-match a "fixed" model that was actually tuned on seeds 20..39.
