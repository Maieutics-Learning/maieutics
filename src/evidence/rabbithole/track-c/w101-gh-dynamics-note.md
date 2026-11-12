# W101exec — GH-factor training dynamics (A; backlog-W89)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + sandbox toy, floor)
- Dynamics (scalar recurrence, both tasks × both init signs): neg/init−0.9 → −0.69 ✓; neg/init+0.9 → +0.58 (STUCK positive); pos/init−0.9 → −0.83 (stuck negative); pos/init+0.9 → +0.88 ✓. Init sign PERSISTS — the optimizer never flips it (basin capture).
- Two consequences: (1) extended-range init is NECESSARY — neg-tasks from positive init are doomed before step one (explains W80-v1's failure: positive-init seeds never had a chance); (2) it is SAFE — negativity survives training when present at init (no collapse-to-positive).
- Rule: sign-aware init — a<0 for flip/parity/Dyck probes, a>0 for accumulation tasks; record init sign in every probe report. Spawned W106 (bench init protocol).
- Verdict USED (basin-capture table). No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- Basin capture generalizes W80's capacity moral: CAN (representational) is decided at init, FIND (optimization) only tunes within the basin. Probes that randomize init sign and average are mixing capable and doomed runs — stratify by sign or stop reporting means.

## Spend / queue
- Spend: 0 + 0 + toy (floor). Consumed backlog-W89 removed; spawned W106 to BACK. Backlog 17. Synthesis R14 clock: 2/5.
