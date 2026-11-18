# Fresh-eyes v4.2 r4 (2026-11-18) — readable battery, FULL raw in fresh-eyes-v42-r4-raw.json (8653B)
Snapshot: src/gameplan-snapshots/2026-11-18-pre-v42-r4-battery.md

## Adjudication
- Mechanism REJECT-as-kill: trunk-domination + bucket-oscillation is speculative without numbers; v0.6 dual-head ran without instant HALT; keep as tuning risk (lambda 0.2 + x0.5 + AND-gate probe), not design kill. Null-c flaw PARTIAL: already patched to synthetic equal-length buckets (structure without signal).
- Stats quorum/power: ACCEPT as known-thin (n=3 disclosed, per-pair + 95% Wilson reported). Null-trap REJECT: conjunctive bars + demote-to-scoped IS the teeth; false-positive risk is why we report per-pair.
- Implementation PASS: ACCEPT. DIALECT-black-box ACCEPT as correct reading (descriptive 0/12, never a gate). RNG-distributed-sampling ACCEPT as driver assert (disjointness check in provenance gate).
- Rival length-proxy: ACCEPT as covered (Null c exists for exactly this). FAIL verdict REJECT (no evidence yet — null decides). Provenance-mess REJECT (explicit RNG list is reproducibility, not bureaucracy).

## Patch (wording/asserts only, no substance)
- Power disclosure line kept: quorum 2/3 thin, Wilson per-pair, no pooled claim.
- Driver asserts: RNG-disjointness check + bucket-threshold constants + probe AND-gate + bundle-only import guard + 3 nulls.
- No spec version bump needed for countersign; v4.2 stands.
