# W121exec — sign-aware init protocol (A; backlog-W106)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + sandbox toy, floor)
- Protocol: (1) classify probe by sign need — flip/parity/Dyck → a<0; accumulation/sum → a>0; unknown → split cohort 50/50; (2) init accordingly; (3) REPORT init sign with every result; (4) never average across signs (stratify, W101).
- Toy (100 probes, matched 0.9 / mismatched 0.1 solvability): protocol 0.84 vs naive 0.47. The naive cohort wastes half its seeds on doomed runs and then averages the corpses in.
- Sign-need classifier (unknown-sign handling) spawned W123.
- Verdict USED (protocol + table). No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- Randomization is not a virtue when the variable decides the outcome: randomizing init sign across a mixed battery is randomizing solvability and calling it rigor. Stratify what matters, randomize the rest — the protocol tells which is which.

## Spend / queue
- Spend: 0 + 0 + toy (floor). Consumed backlog-W106 removed; spawned W123 to BACK. Backlog 17. Synthesis R17 clock: 4/5.
