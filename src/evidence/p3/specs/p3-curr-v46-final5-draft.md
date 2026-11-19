# Final-5 info-gathering pilots (2026-11-19) — COUNTERSIGNED ("countersigning everything"), info-only
Ear retired as instrument (v4.6) with cause (v46-WHY). These five do NOT revive it: one-pair
pilots (pair-0) mapping where doubt could live in the future. Promise criteria per pilot;
no expansion on miss. If all five miss, ear file closes until the conversation part with
addresses mapped, not a shrug.
Base: filed v44 quartile bundles (pair-0: c1/c2 + tEnt + cuts [2.0675,2.356,2.5368]) unless
a pilot names another base. Student inits 9850+pair, seeds 9903/9914. Pools 9770/9771/9810.

## F1 — competent-tutor regime (was it ever going to work here?)
Hypothesis: doubt helps only where competence exists; curriculum tutor (acc ~0.18) never
qualified. Procedure: ear pipeline behind a COMPETENT tutor — G-series champion blob
(killA 1.00; loader `T.gseries.loadModel`, arch-compat verified before compute; fallback:
fresh hinted-train 1200 steps with selection supervision if blobs incompatible — filed if used).
Same quartile cuts procedure (cuts from competent tutor's own entropy), head-only ear 800 steps,
student combined 200+replay on new F1 bundles (v44 lines reused, tEar recomputed).
Read (promise): tutor calibration gap >=0.15 AND student soft Spearman >=0.30 AND hard gap held.
Anything less => concept dead even in the good regime.

## F2 — tails-only (did boundaries eat it?)
Hypothesis: middle band near the median is unlearnable noise; extremes carry signal.
Procedure: binary median split; student WITH training with ear loss ONLY on tail positions
(buckets 0/3 kept, 1/2 masked to null aux — mouth loss all positions); eval tail agreement +
tail gap + tail calibration on shared-200 tails. Read (promise): tail agreement >=0.80 with
gap >=0.10 held while full-range sits ~0.45. Future address if hit: abstention gate.

## F3 — doubt as scheduler (order, not channel)
Hypothesis: doubt organizes materials; no ear head needed. Procedure: rank v44 bundle lines
(c1+c2, 200 lines) by filed mean tEnt per line; EASY-first = low-ent half then high-ent half,
HARD-first = reverse, MIXED = interleaved (all mouth-only S1+S2 200+200, same seeds, matched
steps; no ear loss anywhere — pure scaffold test). Read (promise): EASY-first S2-hard beats
MIXED by >=0.10. Distinguishes doubt-order from §8.2 length-order (already CUT).

## F4 — doubt as listener (abstain; eval-only, zero training)
Hypothesis: doubt belongs in a processor that abstains. Procedure: trained WITH student
(400-step rerun, same as T3); abstain on high-ear positions (bucket >=2); selective accuracy
vs raw accuracy + coverage on shared-200+tests. Read (promise): selective >> raw
(>=+0.10) at >=50% coverage. Future address if hit: conversation-part hedge/ask.

## F5 — doubt as editor (tutor curates itself)
Hypothesis: tutor's best use of doubt is filtering output (opposite of v4.6-T2 which picked
hard and tied). Procedure: from v44 c1+c2 lines (200), keep 100 most fluent (lowest mean
filed tEnt) vs 100 random (seed 9932); mouth-only S2 on each from same S1. Read (promise):
curated beats random by >=0.10. Future address if hit: bundle curation / P3 quality gate half.

## Package rules
One pair (pair-0) each; ~two v44-pairs total compute, F4 free. Each files its ledger +
promise verdict. No quorum (pilots, n=1 — labeled THIN by construction). No bar retires or
revives anything. Transcript + CHATLOG per wave (memory turn routine).
Pre-countersigned follow-up: 3 agent experiments (separate preregs, agent-approved, no user
input needed) after these five.

## Approval
COUNTERSIGNED 2026-11-19 (user "countersigning everything"). Any content change = new version.
