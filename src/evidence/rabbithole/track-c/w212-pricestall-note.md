# Wave 212 note — backlog-W182 price-frontier + false stalls (sandbox, executed)

STOP RULE: stopped after false-stall grid (14 cells x 500 trials) + trickle-sufficiency matrix (6 cells x 500; no phantom-pressure sweep / misleading-signal phantoms — spawned W199, not built). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (worker sandbox; w182-falsestall.js + w182-trickle.js). Clock: R32 5/5 FULL. Pre-registered predictions scored: (a) FAILED (b) FAILED (c) CONFIRMED (d) CONFIRMED-exact.

## Direct: dead time favors the fast; stuck-at-K2 constructed exactly

False-stall world (W192 v2 + phantom episodes: PF=.05/serve, PL=8 dead serves, attempts billed, counter runs):
- (a) FAILED: S-ranking did NOT flip — S2C0Doff serves 33.1/att 137 vs S8 103.2/397 (W192: 34.6/120 vs 105.2/380). Phantoms hurt all S ~proportionally and S8 eats 3x more phantom serves (31.6 vs 9.7) — per-serve phantoms scale with trial length, AMPLIFYING S-dominance. Mechanism: weather-phantoms accelerate CORRECT escalation (the climb was right anyway); they mislead nothing, so patience buys nothing. The patience premium needs misleading signals, not dead time.
- (b) FAILED: cooldown worse — S2C3 att 194 vs C0 137 (+41%). Suspending escalation after phantom-triggered climbs delays the correct response. Cooldown's value stays at exactly zero in this world; bigger loss than W192's.
- (c) CONFIRMED: bill-named winners in the false-stall world — Don takes serves-bill (31.7<33.1, 53.6<59.1, 93<103.2) and compute-bill (580<587, 651<678, 815<846); Doff takes attempts-bill (137<174, 228<267, 397<444) and wall-bill at S2/S4 (60.5<66.4, 104.7<106.9). Wall FLIPS at S8 (181.8 Don < 182.6 Doff by 0.8 — fragile, owned: one seed's noise). Pareto + flip bills, extended (compute@50 still Don — nUp barely differs, so up-pricing can't flip it; noted for bill designers).
- (d) CONFIRMED-EXACT — trickle-sufficiency construction (variant world: need=3 all targets so K=2 resists forever + deterministic background cover every g serves): stuck2 = 500/500 ONLY in g7/S8 (serves 120 cap, pCover 0, finalK 2, ZERO ups); S4 escapes same g (36.2 serves, finalK 4 — perverse-S: the patient sticks, the hasty finishes); g9/S8 escalates out (48.2, finalK 4); g5 finishes by background in both S (S8: 100 serves, finalK 2, zero ups — the tortoise that still wins). Every cell of the 2x2 predicted pattern landed.
- Mechanism gem: Bernoulli trickle can NEVER stick (variance escalates — some 8-window always comes up clean... precisely: steady Bernoulli either finishes or escalates; stuck needs max-gap<S AND total<budget, i.e. REGULARITY). W172's 3 stuck trials imply their lottery stalls were quasi-regular — a Lea\nd on their world's microstructure, not just a reproduction.

Verdict: USED (trickle-sufficiency receipt + patience-premium boundary mapped negatively with mechanism + Pareto flip bills). No precursor, no conflict.

## Tangential: failed instantiations are boundary data, not wasted waves (0-spend, reasoning only)

(a)/(b) didn't "fail to find" the patience premium — they proved weather-phantoms can't instantiate it (dead time is a tax on time; the patient pay more). A failed instantiation plus its mechanism is a boundary stone: the next construction (misleading-signal phantoms — fake covers that reset the counter AND misdirect escalation) starts INSIDE the boundary instead of re-discovering it. Report the boundary, not the disappointment. (W199 owns the next instantiation.)

## Spend / queue

- Spend: 0 + 0 + 2 sandbox grids (20 cells x 500 trials; floor). Consumed backlog-W182 removed; spawned W199 to BACK. Backlog 17. Synthesis R32 clock: 5/5 FULL → next R33 synthesis (Wave 213, queue-jump).
- W199 (C, sandbox): phantom-pressure map — pf x PL sweep incl PL>S regimes; find the phantom pressure where S8/big-S earns if anywhere; does urgency ever lose; misleading-signal phantoms (fake covers resetting the counter AND misdirecting) vs dead-time phantoms; same world.
