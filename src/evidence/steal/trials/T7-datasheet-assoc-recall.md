### Datasheet: assoc-recall v1
**Owner:** bench (src/tinynn/tasks.js) · **Created:** 2026-11-08 · **License:** repo-internal synthetic
**1. Motivation** — test addressable lookup (bind key->value, retrieve at query) across gap lengths; separates lookup (attention) from memorization (RNN).
**2. Composition** — instance = [k1,v1,...,kp,vp,q,Q] token string; keys 0..3, values 4..7; train p=1..3, hard p=4, kill p=6 (2x max). Splits: in-dist, hard-4pair, kill (target-first long-gap), gap-sweeps, novFam/famNov cheat-proof 2x2. No PII (synthetic digits).
**3. Collection** — generated in-code ( seeded RNG pending T3 eval above); sampling uniform over combos. Imbalance: train never shows 4+ pairs (by design — the OOD test).
**4. Preprocessing** — none; tokenized by char. Labels: bind (per-value key) + selection (final-step weight) + gist/query-head variants.
**5. Recommended uses & limits** — USE: lookup-circuit tests, supervision ablations. DO NOT USE: claims about language/scale (one synthetic family, h<=96); kill-split numbers are mismatch-era unless re-run on fair homework.
**6. Distribution** — in-repo, no access control needed. **7. Maintenance** — owner bench; errors filed in CHATLOG; version with tasks.js.
Quality checks: consent N/A (synthetic, stated); skews quantified (train<=3 pairs); "do not use" concrete; labels versioned with code.
