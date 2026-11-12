# Wave 384 (execution; backlog-W325 s1/s2 tape extension, sandbox) 2026-11-12
STOP RULE: stopped after s1/s2 N16000 extension + 2 bisections (48/48
receipt exact). 1 direct + 1 tangential below. Spend: 0 + 0 + run. Script
scratch/track-c/w325-tape.js (rig 102/102 line-verified from w291-s3.js);
grid scratch/track-c/w325-grid.json.

## Direct: s1 dies slow and pinned, s2-mid.0071 escapes the window

- RECEIPT: full 48-cell ladder replay exact (recMax 0) vs w274-grid res —
  same tapes, same order, same brng(240001); the extension builds on the
  confirmed body, doesn't rebuild it.
- (a) SPLIT: s1-narrow.0009 dies by 16000 (atKink .037 → max .963 ≥ .93 —
  A loses decisively, same direction as s3's .582→.056); s2-mid.0071 does
  NOT die (atKink .238 → max .762 < .93 — contested at the window edge,
  leaning Bp). Death is kink-x-stream, confirmed again: s1's other three
  kinks all read 0–.048 (dead), s2's other three 0–.054 (dead) — exactly
  one survivor per... no: one survivor TOTAL (s2-mid.0071), the rest
  unanimous zeros.
- (b) REJECTED: the 4-stream budget does NOT land ≤16000 — s2-mid.0071 N*
  is ">16000" (never reaches .93 in-window), so budget = ">16000". The
  budget-holder changed hands: s3-narrow.0009's 15516 stood one round, now
  an unpinned escapee holds it. The finding is the escapee's address
  (s2, mid-regime, adaptK2-vs-adaptK15), not the number.
- (c) PASS: s1-dissenter-kink confirms SLOW — N* = 10583 > 8000 (resolves
  only past the old window; the extension was necessary, same moral as
  s3's 15516). Slow-death ranking now: s2-mid.0071 (>16000) > s3-narrow.0009
  (15516) > s1-narrow.0009 (10583) — the dissenter is mid-pack, not slowest.
- Verdict: USED with teeth (w384-tape-note.md is this file). 48/48 receipt
  + split death + budget blown with address + slow confirmed and ranked.
  Spawned W342 (s2-mid pursuit, sandbox: extend s2 tapes to N64000 same
  stream + bisect mid.0071 on [16000,64000] — pin the escapee; does it die
  ≤64000; receipt s2@16000 atKink vs w325-grid).

## Tangential: a budget with an unpinned member is a direction, not a number

- ">16000" is not a budget, it is a pointer (s2, mid.0071, .238 and
  leaning Bp). Rule: whenever the max over a set is unpinned on one
  member, report the set as (pinned-max, escapee-address) — the pinned max
  (15516) is the number, the escapee is the next wave. Don't average a
  pointer with numbers.
