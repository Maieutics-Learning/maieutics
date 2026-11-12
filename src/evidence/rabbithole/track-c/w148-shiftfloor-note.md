# W148exec — shift-sensitivity floor (B; backlog-W128)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 sandbox floor-map, floor)
- Toy (documented rebuild — W127 script lost): 12 probe families, old cohort 40 vs new cohort N ∈ {20, 10, 5}, 10% record noise, majority-vs-majority disagreement, alarm on >0.5 twice running; shift strength p (flipped fraction) ∈ {0, .05, .1, .2, .3, .5, 1}, 500 trials/cell.
- The floor is a WALL, not a slope: P(detect) = 0.000 for every p ≤ 0.3 at every cohort size; 0.13–0.16 at p=0.5; 1.000 at p=1.0. The majority vote quantizes the shift signal away — a 30% rule change never flips a family majority, so the detector sees exactly nothing until ~half the records turn.
- N-independence: 5-record cohorts detect (or miss) identically to 20-record ones — the wall is in p, not N. Small cohorts are free; partial shifts are invisible. Specificity intact throughout (false alarms 0.000 in all 21 null cells).
- Mechanism verdict: majority-vote detection buys noise-robustness (W127's 10%-noise result) by spending ALL partial-shift sensitivity — W127's tangential, quantified. A record-level detector would see p directly but eat the noise; the knob is now priced on both ends.
- Verdict USED (wall located ∈ (0.3, 0.5], N-independent, specificity intact). No precursor, no conflict. Record-level detector (sees p directly; price the noise-robustness it surrenders) spawned W145.

## Tangential (reasoning, 0 spend)
- Majority vote is a low-pass filter with a lie in its passband: it reports "no shift" with full confidence right up to the wall. Filters don't degrade gracefully — they silence, then they scream. Any detector whose output is 0-or-1 should be suspected of a wall exactly like this one.

## Spend / queue
- Spend: 0 + 0 + 1 floor-map (floor). Consumed backlog-W128 removed; spawned W145 to BACK. Backlog 17. Synthesis R22 clock: 1/5.
