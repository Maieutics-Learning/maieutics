# W65exec — hint-library cache format (Group B; backlog-W59, from W44 micro-line)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries, floor — design wave)
- Record: `{id, levels[K], source: api|local|distilled, posterior: {alpha[K], beta[K]}, skill_sig, version, ttl, cost}`. Write path: API/local labels → dedupe by (skill_sig, levels-hash) → insert with posterior from priors (W60) → version++. Read path: query by failing skill signature → top-k by posterior mean → serve as hints (hot-swap reader, W47). TTL + quarantine (posterior below bar → excluded, W47) keep it fresh; eviction policy spawned (W76).
- Unifies W44 (rent→own), W46 (posteriors), W47 (swap/version), W60 (priors). Verdict USED (design). No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- The cache is the generational memory made explicit: every generation's teaching becomes retrievable data for the next. Winner-promotion picks the tutor; the cache keeps what the tutor knew.

## Spend / queue
- Spend: 0 + 0 (floor). Consumed backlog-W59 removed; spawned W76 to BACK. Backlog 17. Synthesis R8 clock: 2/5.
