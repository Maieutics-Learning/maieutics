# W140exec — volatility crossover (A; backlog-W122)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 2 sandbox toys, floor)
- Toy: N=8 bindings, T=50 presentations, delta (η=1 overwrite) vs Hebbian (η=0.5 superpose), delayed uniform recall, 200 trials/cell, volatility sweep. (W120's script lost → documented rebuild with a MORE realistic recall protocol: bindings must survive presentation gaps.)
- Variant A (revaluation world — flips change the truth): delta 0.982→0.556, hebb 0.936→0.518 across v=0.002→0.5; delta ≥ hebb EVERYWHERE. No interior crossover (v*=0, degenerate). W120's "delta 1.00 flat" does not reproduce under delayed recall — it was the immediate-test protocol talking, not the rule.
- Variant B (noise world — flips corrupt observations, truth fixed): hebb ≥ delta everywhere (0.996 vs 0.941 at v=0.05; 0.844 vs 0.697 at v=0.3; both →chance at 0.5). Superpose averages out lies; overwrite chases them.
- Dissolution: there is no v* on one axis — there are two volatility TYPES, and the type picks the winner at every rate. Match-memory-to-world upgraded: match the RULE to the volatility type (revaluing→overwrite, noisy→average), not to a rate threshold. The 0.01–0.10 crossover band was a measurement artifact of immediate-test recall.
- Verdict USED (crossover dissolved + two-type typology). No precursor, no conflict. Mixed world (revaluation + noise jointly; 2D boundary; mixed/tracer rule) spawned W139.

## Tangential (reasoning, 0 spend)
- A crossover that lives in the protocol will not survive the protocol changing. When the parameter you are bisecting stops mattering, check whether you are standing on the right axis — rates bow to types here.

## Spend / queue
- Spend: 0 + 0 + 2 toys (floor). Consumed backlog-W122 removed; spawned W139 to BACK. Backlog 17. Synthesis R20 clock: 5/5 FULL.
