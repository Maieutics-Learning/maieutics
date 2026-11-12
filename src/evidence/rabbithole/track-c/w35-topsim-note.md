# W35 — emlangkit topsim.py source (Group A)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (queue-jump by agent's call; 0 scouts + 2 primaries incl. 1 varied retry)
- Wrong slug `florianstrumpf/emlangkit` 404'd (failed attempt, logged) → varied retry via GitHub API listing `olipinski/emlangkit/contents/emlangkit/metrics` (200, 9.5KB JSON) → `topsim.py` raw (200, 1.7KB, read whole). Dumps in `scratch/track-c/w35-*`. URLs are durable refs.
- Source (whole): `compute_topographic_similarity(messages, observations, obs_metric="hamming", msg_metric="editdistance")` → normalized editdistance `editdistance.eval(x,y)/mean-len` else pass-through metric; `scipy.spatial.distance.pdist` both sides; `scipy.stats.spearmanr(..., nan_policy="raise")` → (topsim, pvalue). Lineage Brighton & Kirby 2006 via EGG/Kucinski (per W23).
- Verdict USED source-level: pins F-new spec numbers (no reimplementation). No precursor, no conflict.
- Honest note: `spearmanr` pvalue is analytic, not Mantel-permutation; small-n attenuates (W23 toy 0.329/-0.119 needs 40+ items for stable estimates); `nan_policy="raise"` means constant-vector probes fail loudly — handle in F-new.

## Tangential (reasoning, 0 spend)
- Length-normalized message distance = the W26 hint-budget idea inside the metric itself (count/length, not raw strength). F-new should normalize the same way.

## Spend / queue
- Spend: 0 scouts + 2 primaries (API listing as varied retry + topsim.py; 404 attempt logged, not charged as second retry).
- Consumed backlog-W35 removed (queue-jump ahead of W34 collapse chain by agent's call, logged); spawned W49 (Mantel-permutation + 40-item stability) to BACK. Backlog 15. Synthesis R3 clock: 2/5.
