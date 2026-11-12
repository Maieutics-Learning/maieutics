# Wave 407 (execution; backlog-W344 decline-floor + dimple-width, bench) 2026-11-12
STOP RULE: stopped after 4-cell x 40-seed grid + 4 anchor runs (3 slices;
receipts exact). 1 direct + 1 tangential below. Spend: 0 + 0 + 8 runs-worth
(4x40 + 4x20). Script scratch/track-c/w344-floor.js (rig 74/74 line-verified
from w327-dimple.js); grid scratch/track-c/w344-grid.json. WIND-DOWN: no
spawn (backlog drains 7->6).

## Direct: the decline floors at .20-.23, the dimple is one-B wide — with one below-bar NaN

- RECEIPT (three-legged): LR.15/B24 20-seed exact vs w293 (0/9/11/0/0);
  LR.12/B32 20-seed exact vs w293 (0/7/13/0/0); LR.12/B40 second-20
  (8/12) + first-20 (4/16) = 12/28, reproducing W327's 40-seed counts
  exactly. The bench is the bench at every B touched.
- (a) PASS: decline floors — B48 .20, B64 .225 (strands 32/31 take over;
  settle never returns). B24→B40 fell .769→.30; B40→B64 goes .30→.20→.225:
  flat within .1, floor right of B40 confirmed (pending question closed).
- (b) PASS: dimple one-B wide — B22 .85, B26 .70 (exactly on the bar),
  gaps +.25/+.10 over B24's .60. The V holds at ±2 resolution: dip only
  at exactly 24, high both sides.
- (d) FAIL narrow: NaN 0 at B22, B20-class elsewhere — except ONE NaN at
  B26 (T=.0294, below the bar). The bar-top rule (NaN only above T≈.032)
  gains a hairline exception: 1/40 below-bar. Geography holds with one
  trespasser.
- Verdict: USED with teeth. Floored decline + one-B V + triple receipt +
  one trespasser NaN logged. NO SPAWN (wind-down).

## Tangential: exceptions get counted, not averaged away (0-spend)

One NaN in 240 below-bar runs doesn't move any fate count, and it would
be easy to round to zero. Rule: log the trespasser with its address
(B26, T=.0294, 1/40) — a future wave that sees two will know whether it's
weather. Rare events are data at n=1 only if written down. (Receipt
family: the log is the receipt for what didn't replicate.)
