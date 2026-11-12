# W67exec — hint-index versioning + rollback (Group B; backlog-W61)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + sandbox toy, floor)
- Records: {id, skill_sig, levels[], source, posterior(α,β), version, parent_version, status: active/quarantined/rolled-back, ttl}. Writes never overwrite: new hint = parent+1; readers pin a version (default latest active). Keep last K versions per id; older compact to deltas.
- Bad-hint detection: per-active-version sliding window (12 uses); quarantine when window mean < 0.55 (posterior-decay tripwire). Quarantined versions are tombstoned, never deleted (forensics). Readers fall back to best non-quarantined ancestor (parent first, best-rate wins).
- Rollback triggers: (a) automatic via tripwire; (b) manual on promotion-gate failure (winner-promotion rejects a generation taught with the hint → quarantine that version).
- Toy (worker, seeded): planted bad v3 (rate 0.25) quarantined after exactly one full window (12 serves); good v1/v2/v4 untouched; fallback selects best ancestor. Verdict USED (design + toy). Rollback-calibration (tripwire threshold vs detection-lag tradeoff) spawned W78. No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- Versioning is generational memory at hint granularity: generations version students, versions version hints. The version chain IS the accumulated dataset — DAgger never-replace (W54) and Gerstgrasser accumulate (W36) at the hint level.

## Spend / queue
- Spend: 0 + 0 + toy (floor). Consumed backlog-W61 removed; spawned W78 to BACK. Backlog 17. Synthesis R8 clock: 4/5.
