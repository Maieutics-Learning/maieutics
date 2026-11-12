# W144exec — debt-floor validation (A; backlog-W125)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 sandbox analysis, floor)
- Reconstruction: the floor is a 2-point extrapolation — W83 anchor f(0.6)=0.3^(1/3)=0.6694 plus the fixed point f(1)=1 (full mastery, no penalty). Linear through them: 0.1736 ≈ 0.175 ✓. The floor was never measured; it is the intercept the family implies.
- Family spread (all through both points): sqrt-family floor −0.47 (invalid — needs clipping, concave families can't fit without going negative); linear 0.17; exponential 0.37; quadratic 0.48. The data + f(1)=1 CANNOT pick the floor — it is pure family choice, disagreeing 3× across admissible families.
- Anchor fragility: W83's 0.3 ± 0.05 → linear floor ∈ [0.075, 0.262]. Point estimate 0.175 sits inside an interval 2× wider than itself under modest anchor noise.
- Answer: 0.175 is consistent-but-unvalidated — the linear family's value, fragile to anchor noise, invisible to the data that fixed it. The decisive test is a LOW-m anchor (advance at window-mastery ≈0.3, measure the penalty; families predict 0.42/0.48/0.55/0.66 — maximally separated there), bench/G-series scale.
- Verdict USED (floor bounded, credibility priced: consistent, fragile, family-chosen). No precursor, no conflict. Low-m debt anchor (advance at m≈0.3; discriminates families where they maximally disagree) spawned W142.

## Tangential (reasoning, 0 spend)
- An intercept is where the data isn't: every extrapolation wears its family's clothes, and the wardrobe choice dwarfs the measurement. Two points fix a line but the world isn't a line — the floor's error bar is a family reunion, not a standard error.

## Spend / queue
- Spend: 0 + 0 + 1 analysis (floor). Consumed backlog-W125 removed; spawned W142 to BACK. Backlog 17. Synthesis R21 clock: 3/5.
