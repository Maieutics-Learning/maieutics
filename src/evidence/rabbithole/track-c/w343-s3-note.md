# Wave 343 (execution; backlog-W291 s3-dissenter autopsy, sandbox) 2026-11-12
STOP RULE: stopped after s3 extension (4 seeds x 6 cells tapes + s3 to 16000
same stream; 48-cell ladder replay receipt 0; s3 N16000 ladders + crossing +
bisection). 1 direct + 1 tangential below. Spend: 0 + 0 + run. Script
scratch/track-c/w291-s3.js (+ w291-body.txt vendored block); grid
scratch/track-c/w291-grid.json.

## Direct: the dissent dies at 15516 — same address, slower resolution

- RECEIPT: 48/48 ladders bit-identical vs w274-grid res (pA + zone) — incl
  s3|8000 narrow.0009 .582. The dissenter is stream-truth (same tapes, same
  bootstrap, same .582), not bootstrap luck: worth autopsying, and autopsied.
- (b) DIES: narrow.0009 atKink .582 → .056 at N16000 (resolves toward
  above-winner, same direction as seed0's resolutions). The flip was a
  small-N mirage on a slow stream, not a second regime.
- (c) SPLIT-HONEST: crossing ADDRESSES agree (s3 vs s0@8000: −3.036/−3.104,
  −2.251/−2.190, −2.643/−2.636, −2.506/−2.549 — all within .07, mixed signs).
  "Different address" rejected; "slower" confirmed — but the slowness lives in
  N*, not in the crossing: the kink sits at the same lambda, s3 just needs
  more trials to call it.
- (d) N* on s3 (B=500, [500,16000]): 10188/500/15516/3958 vs seed0's
  5570/6155/6008/5071 — all ≤16000 (dies within extension ✓), but NOT
  uniformly slower: mid.0071 resolves at 500 on s3 (vs 6155 on s0!), while
  narrow.0009 needs 15516 (vs 6008). N* is (kink × stream)-addressed; the
  4-stream resolving budget rises to max-N* = 15516 (replaces 6155; +152%
  over seed0's max, still 3% under 16000).
- Verdict: USED-strong (w343-s3-note.md is this file). 3.5/4 pre-reg (crossing
  refined: address same, N* carries the slowness) + full receipt + priced
  N* ladder. Dissenter closed with mechanism. Spawned W308 (N*-ladder across
  seeds: is N* stream-addressed, does 15516 stand as the budget).

## Tangential: slowness has addresses too — don't average it away (0-spend)

"Needs more N" is as addressable as "sits elsewhere": narrow.0009 needs 2.6x
seed0's budget on s3 while mid.0071 needs 0.08x. A single "s3 is slower"
would average a 30x spread into mush; the (kink × stream) table keeps both
extremes invoiceable. Rule: when a stream dissents, price the dissent per
kink (N* ladder), not per stream (mean) — the budget that covers all kinks
on all streams (15516) is the product, and it only exists at full resolution.
W308 completes the table (N* × s0–s3: which cells set the budget).
