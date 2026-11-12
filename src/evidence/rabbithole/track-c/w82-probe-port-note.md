# W82exec — flip-flop + bounded-Dyck probe port (A; backlog-W73)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + sandbox toy, floor)
- Port (from Sarrof W61): two probe tasks with generators + scorers + baselines, banked for tinynn —
  (1) Flip-flop latch: ops {write 0/1, ignore, read}; read must equal last write across distractors. Last-token baseline 0.67 vs latch 1.0 (313 queries, seeded) — discriminative.
  (2) Bounded-Dyck-2: open/close, depth ≤ 2; scorer = valid-next-token set from running depth. Exact counter 1.0 (100 trials) — calibrates the ceiling; memoryless models must fail it.
- Scoring: flip-flop = read accuracy vs distractor distance (ladder next); Dyck = valid-set exact-match rate. Both run BEFORE any training claim (capacity discipline, W80).
- Verdict USED (port + discriminative toy). Difficulty ladder (distractor distance, depth/length scaling) spawned W90. No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- A probe is a contract: generator promises the task needs exactly one capability (latch; counting), scorer promises to measure only that, baseline promises the floor. Three promises, all kept here — most benchmarks keep at most two.

## Spend / queue
- Spend: 0 + 0 + toy (floor). Consumed backlog-W73 removed; spawned W90 to BACK. Backlog 17. Synthesis R11 clock: 1/5.
