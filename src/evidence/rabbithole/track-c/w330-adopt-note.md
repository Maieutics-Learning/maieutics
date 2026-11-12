# Wave 330 (execution; backlog-W280 adoption rollout, sandbox) 2026-11-12
STOP RULE: stopped after 64-cell amended-rule grid (32 separate-shape + 32 pooled-shape;
tax/ladder x I6/I12 x d{0,.5,1,2} x obf/fut, N=20000, w263 rig verbatim).
1 direct + 1 tangential below. Spend: 0 + 0 + 1.28M-trial run. Script
scratch/track-c/w280-adopt.js; grid scratch/track-c/w280-grid.json.

## Direct: v2 rolls out clean on separate banks; the .0131 bar is bank-scoped

- RECEIPT: 32/32 separate-shape cells bit-EXACT vs w263-grid.json (every field —
  the rollout substrate is the confirmation substrate; shipping it was safe).
- (b) MISSES-with-number (owned, printed exactly): the .0131 bound does NOT hold
  off-bank. Pooled-shape null claims run .0234–.0278 in all 8 null cells (tax I6
  .0278/.0241, tax I12 .0257/.0234, ladder I6 .0267/.0242, ladder I12 .0253/.0234;
  max tax-I6-obf .0278), ~2x the inscribed max, in a TIGHT band across substrates,
  timings, and policies — systematic inflation, not stream noise. The v2 statement
  needs a bank-scope amendment: null claim ≤.0131 on separate-shape (own-shape)
  banks; ≤.028 on pooled-shape banks. Mechanism candidate: pooling mixes the
  ceiling-pile and spread shapes into BOTH arms, fattening the positive tail the
  directional rule claims from. W212's breaker (.0525-vs-.151 two-sided) does not
  vanish under directional claiming — it SHRINKS and INVERTS RANK (pooled now
  worse than separate: .024–.028 vs .006–.013), because directional claiming
  amputated the reverse side where separate-shape inflation lived.
- Power rides the same inflation (pooled ≥ separate at every δ: tax-I6-d.5
  .3721 vs .1857, tax-I12-d.5 .4891 vs .3977; saturating together at δ≥1), so the
  pooled bank is a sensitivity shift, not just a validity threat — same test, more
  of everything. Futility savings INTACT on both nulls (pool tax-I6-fut 7.572 vs
  sep 6.794; pool tax-I12-fut 15.508 vs sep 14.975 — slightly larger absolute,
  same 31–32%).
- (c) NIL-AS-PREDICTED: futility × stop-accept interplay is zero on both nulls —
  revSave identical in structure across policies (pool tax-I6 .055/.057; remaining
  obf/fut revSave gaps, e.g. pool tax-I12 .050/.065, are stream noise: policies use
  different trial streams by seedBase construction, bands disjoint by
  construction |z1|<1 vs z1<−2.797, so no fut-eats-reverse is possible).
- (d) HOLDS: E[n] = base − futSave − revSave exact to rounding in all 64 cells
  (worst gap .001, e.g. sep-tax-I6-fut 23.986−6.794−.618=16.574 vs en 16.573).
- Verdict: USED with teeth (w330-adopt-note.md is this file). v2 ships with a
  bank-scope: quote the bar WITH the bank (own-shape .0131 / pooled .028).
  Spawned W297 (mixing-curve probe).

## Tangential: validity numbers are bank-relative, so print the bank (0-spend, reasoning)

Three wraps now: permutation assumed exchangeability away (.0525 vs .151); v2's
.0131 assumed own-shape banks (.006–.013 vs .023–.028). Every inscribed number
smuggles its bank in. Rule: a validity claim ships as (number, bank, rule) —
the bar is meaningless without the bank it was measured on, and a rollout onto a
new bank re-opens the number while keeping the rule. W280 kept the rule
(stop-accept + directional claiming + futility all replicate) and re-opened the
number (.0131 → bank-scoped .0131/.028). W297 maps the bank between the scopes.
