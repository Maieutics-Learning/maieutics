# W167exec — sequential reprobe policy (B; backlog-W144)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 sandbox sequential trial, floor)
- Rules: precommit n=32 (|t|>2) vs naive-sequential (stop at |t|>2 from n=4, cap 64) vs conservative (|t|>2.8, cap 64); scenarios null / W130-small / W150-large; 2000 sims.
- Null: FPR 0.05 / 0.341 / 0.102. Naive monitoring FABRICATES separations 1/3 of the time — its "power" (0.99 on small effects) is counterfeit, bought with the same mechanism. Continuous peeking at p<0.05 is not thrift, it's a fabrication machine with a lab coat.
- Conservative boundary holds FPR ≈0.10 with real savings: large effects stop at 4.9 (vs 32 — 7× saved, W139's 495 wasted runs would have been ~5); small effects 27.3 with power 0.93 (vs 32/0.79 — cheaper AND stronger).
- Adopted: conservative sequential as default (bound 2.8, min-n 4, cap = precommit n from the W146 rule); naive |t|>2 BANNED; sequential power never reported without its null-FPR beside it. Verdict USED (policy + fabrication proof + adoption). No precursor, no conflict. Group-sequential design (proper alpha-spending, Pocock/O'Brien-Fleming; expensive-look schedules) spawned W161.

## Tangential (reasoning, 0 spend)
- Every peeking rule is a deal with the null: it offers to stop early when you're right, and charges false declarations when you're wrong. Read the price before signing — 0.34 is not a discount, it's a different experiment than the one you think you're running.

## Spend / queue
- Spend: 0 + 0 + 1 sequential trial (floor). Consumed backlog-W144 removed; spawned W161 to BACK. Backlog 17. Synthesis R25 clock: 2/5.
