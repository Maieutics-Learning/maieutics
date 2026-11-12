# Wave 192 note — backlog-W165 steering-threshold tuning (sandbox, executed)

STOP RULE: stopped after v1 grid + v2 recalibrated grid (one calibration trip; no third world-variant — false-stall/trickle worlds spawned, not built). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (in-page sandbox; W172's script lost, mechanics rebuilt from note — rebuild divergences owned below). Clock: R29 3/5.

## Direct: S dominates, cooldown loses, the discriminator reorders (does not select)

World (rebuild v2): 20 targets (12 easy need=2 e=8, 6 med need=6 e=3, 2 hard need=12 e=1.5); serve with (K,bias): K attempts, each on random uncovered target; K<need -> observable RESIST; else hit w.p. min(.95, bias*e) covers (H=1). Bills recorded BOTH ways: serves (W172's bill) and attempts (priced view). Cap 120 serves (W172's "120-serve scale" read as budget). Controller: S zero-cover serves -> escalate; Doff = W172 order (bias x2 cap .8, then K+=2 cap 12); Don = resist-gated (recent resist-rate>.3 -> K+=2 else bias x2); C = post-escalation suspension. 500 trials/cell.

v1 kill (owned): first grid (weak e, cap 400, serves-only bill) showed K unpriced and ladder always maxing — recalibrated, kept as caution (unpriced levers always read "more is better").

Results (v2, serves bill / attempts bill):
- TRIGGER SENSITIVITY DOMINATES: Doff/C0 serves 34.6 (S2) -> 59.3 (S4) -> 105.2 (S8); attempts 120 -> 208 -> 380. 3x across S. Smaller S always wins HERE (escalation helps, waiting wastes) — caveat: no false stalls in this world; big-S protection untested (W182).
- COOLDOWN PURE LOSS: C=3 at S2: serves +10.2 (34.6->44.8 Doff; 29.5->33.9 Don), attempts +51/+34. ~neutral at S4/S8 (nothing left to delay — ladder already slow). No value when escalation is never wrong.
- DISCRIMINATOR = REORDERING, NOT SELECTION: kupN identical (2500 = 5x500 every cell — every trial does all 5 K-ups regardless of D). Don saves serves (-5.1/-10.1/-21.7 across S) but SPENDS attempts (+43/+48/+26): Don 163 vs Doff 120 at S2; 406 vs 380 at S8. Don K-ups happen at LOWER resist-rate (.52-.9 vs .64-.94) with near-zero bias-ups (0.01-1.98 vs 4.0): Don is K-FIRST/IMPATIENT, Doff bias-first/thorough. Precision framing REJECTED; speed framing adopted: D moves along a serves-vs-attempts Pareto frontier and THE BILL PICKS THE WINNER (serves-bill: Don wins; attempts-bill: Doff wins at every S).
- W172-Q1 (3 stuck-at-K2): NOT reproduced (finalK=12 everywhere; only S8Doff cracks: {8:1,10:4}, pCover .984 — cap bites at the TOP). Mechanism identified by construction: stuck-at-K2 needs sub-stall-rate trickle (covers every <S serves, so the counter never fires) x budget expiry (trickle x 120 < 20 targets). My world trickles too fast (~.5/serve at K=2) to starve any S<=8. W172's 3 stuck trials imply THEIR world had slow-trickle lottery stalls — consistent with bias-first order keeping trickle alive without K movement. Empirical reproduction (trickle construction) deferred to W182.
- CALIBRATION DIVERGENCE (owned): fixed arms miss W172's levels (mine: ramp 53.6 serves/327att, const-12 8.6/97att; W172: 39.8/41.8). My world is trivially easy at K=12 (ceiling compresses fixed-vs-adaptive gaps). All tuning claims are WITHIN-WORLD deltas; absolute serves don't transfer.

Verdict: USED (S-dominance + cooldown loss + D-as-Pareto-move + stuck-2 mechanism + owned calibration gap). No precursor, no conflict.

## Tangential: unpriced levers always read "more is better" (0-spend, reasoning only)

v1's lesson generalizes the siren ledger (W151 gate-meter, W153 subsidy, W155 confirm-2, W190 memory): every unpriced quantity in an experiment reads as free, and the controller/schedule then spends it to the cap and looks brilliant doing it. v1's S=2 "win" was an artifact of free K. The fix isn't sophistication — it's billing every lever before comparing policies (attempts-bill flipped Don/Doff!). Audit question for any tuning wave: which lever in my rig is unbilled? If one is, the winner is predetermined.

## Spend / queue

- Spend: 0 + 0 + 2 sandbox grids (v1 killed by missing price; v2 full SxCxD + 2 fixed). Consumed backlog-W165 removed; spawned W182 to BACK. Backlog 17. Synthesis R29 clock: 3/5.
- W182 (C, sandbox): price-frontier + false stalls — attempts-billed world (K costs per attempt, serves free-ish); false-stall injection (phantom zero-cover runs resolving WITHOUT escalation — where big-S/cooldown earn); trickle-stall construction (slow q, S>trickle gap) to reproduce stuck-at-K2 empirically; same SxCxD grid; draw serves-vs-attempts Pareto + pick bills (compute-price, wallclock-price) that flip the winner.
