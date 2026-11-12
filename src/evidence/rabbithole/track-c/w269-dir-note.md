# Wave 269 note (execution; backlog-W229 directional-validity confirmation, sandbox)

STOP RULE: stopped after 32-cell paired directional grid (2 substrates x 2 timings
x 4 deltas x {obf2dir,fut1.0dir}, N=20000, same banks + same seedBases as W248 —
paired vs w212-grid.json two-sided baselines). 1 direct + 1 tangential below.
Spend: 0 search, 0 fetch. Clock: R42 2/5. Pre-reg scored: (a) CONFIRMED (b)
CONFIRMED-identical (c) CONFIRMED (d) CONFIRMED.

## Direct: directionality is free where it matters, ~2% where it doesn't

Null claims (a): directional claim rates .0059–.0131 across all 4 substrate ×
timing cells (≤.03 ✓) — the positive side holds on-policy, confirming W248's
.007–.028 off-policy reading with the actual rule running.

Power (b): claim rates IDENTICAL to two-sided to 4 decimals at every δ≥.5 cell
(.1857=.1857, .8274, 1.0, ...) — directionality costs exactly nothing where
reverse ≈ 0, which is everywhere a real effect lives. The adoption loses no
power by construction, verified paired.

E[n] cost (c): null E[n] rises +0.6–1.1 absolute (+1–3%) vs two-sided (23.99 vs
23.37; 48 vs 46.92; ...) — accounted to the trial: revCont × (2nf−2ni) matches
the delta exactly (e.g. .0522×12=.63 ≈ +.62). Continuing reverse excursions is
the whole price, and it is small. Continued reverses mostly resolve as nulls
(final rev .1176 < two-sided .1469 — interim reverses that continue usually
fail to re-cross −B2).

Futility interplay (d): fut1.0-dir saves 28–32% n at null vs obf2-dir (17.19 vs
23.99; 33.02 vs 48; ...) — savings survive directionality intact; fut rates
identical to two-sided (.566/.624/.602/.633 — futility behavior unchanged);
futility stops claim nothing structurally (the stop branch has no claim path).

Cheapest statement of the scoped adoption (deliverable): claim iff the positive
OBF bound crosses (interim 2.797, final 1.977); stop-and-accept iff |z₁|<1.0 at
interim; reverse excursions continue, unclaimed. Null claim ≤.013, saves ~30% n,
power identical to two-sided at δ≥.5σ, directionality surcharge ~1–3% n at null.

Verdict: USED-strong (paired identicals + priced surcharge + adoption statement).
No precursor, no conflict.

## Tangential: price the continuer, not just the claimer (0-spend, reasoning only)

The wave's only new number is the cost of the trials two-sided would have
stopped-as-reverse and directional continues (+.6–1.1 n). Every rule change
moves some trials across a stopping boundary; the price of the rule IS the moved
trials' extra n, countable exactly (revCont × remaining-n). Rules should ship
their moved-trial accounting the way estimates ship ses. Spawned W246
accordingly (continue-vs-accept on interim reverse: is continuation pure cost,
or do continued reverses ever convert?).

## Spend / queue

- Spend: 0 + 0 + 32 cells x 20000 (floor). Consumed backlog-W229 removed;
  spawned W246 to BACK. Backlog 17. Synthesis R42 clock: 2/5.
- W246 (C, sandbox, zero new sims on w229 grid): reverse-handling — continue
  (this wave) vs stop-accept on interim reverse (counterfactual on saved
  revCont trials: power/E[n] delta); P(final claim | interim reverse) (do
  continued reverses ever convert, or is continuation pure cost?).
