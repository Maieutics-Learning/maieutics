# Wave 233 note — backlog-W199 phantom-pressure map (sandbox, executed)

STOP RULE: stopped after 76-cell grid (pf{0,.02,.05,.1} x PL{4,8,16} x {dead,mislead} x S{2,4,8} x 300 trials + C3 probes). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (w182 rig + misleading arm). Clock: R36 2/5.

## Direct: fake progress paralyzes patience; urgency survives

Dead-time (pre-reg (a) ✓): S-rank never flips on any bill; S8 attempts-deficit widens with pressure (380→453 at pf.1/PL16 vs S2 120→173); S8 coverage sags at high pressure (.977→.89) while S2/S4 hold 1.0. W212's mechanism stands (phantoms scale with trial length).
- Misleading (fake covers: counter resets, no progress, resist-signal diluted): S8 COLLAPSES — coverage .977→.53 (pf.02/PL4) → .007 (pf.05/PL16) → 0.0 (pf.1/PL16+), nUp 9→1.2, serves cap out at 120. S8's counter never fills: every phantom episode erases up to 7 stalls with one fake cover, so the patient arm under-escalates into cap-out. S2 holds (coverage 1.0→.997→.763, nUp 8–9 — its 2-window refills between episodes and it climbs THROUGH the noise to K=12).
- Pre-reg (b) REJECTED-inverted: S8 attempts DO fall below S2's at high pressure (259 vs 232) — but via cap-out/halting, not efficiency. There is no patience premium; there is an URGENCY premium under fake progress (S2 dominates every bill + coverage at pf.05/PL16: wall 110 vs 172, cov .997 vs .007). Pre-reg (c) REJECTED (urgency wins, doesn't lose). Symmetry with W212: dead time taxes everyone (patient pay more); fake progress kills the patient and spares the urgent.
- Cooldown (d) REJECTED everywhere: C3 hurts S2 in both worlds (dead 235 vs 158; mislead 308 vs 232 — suspends correct escalation), neutral on capped S8. Cooldown's value remains exactly zero in all 4 worlds tested to date. Stop pricing it; consider the ban.
- PL>S regimes: PL=16 outlasts every window — S8's collapse is already total at PL=4/pf.02 (cov .53); pressure steepens through pf, PL matters less than existence (any fake-cover stream breaks consecutive-counting).

Verdict: USED with teeth (inversion + urgency premium + cooldown-zero-fourth-sighting). No precursor, no conflict.

## Tangential: single resets are the vulnerability (0-spend, reasoning only)

One fake cover erases seven real stalls — the counter's reset rule (covers>0 → stall=0) gives a single observation infinite veto power. Consecutive-counting is fragile to ANY false-positive progress signal, not just phantoms (lucky covers, mislabeled serves). Robust counters must bound one observation's veto (decrement-not-zero, covers-per-window threshold, serves-since-up clock). Audit every counter in the trail for infinite-veto resets — W216 builds the bounded one.

## Spend / queue

- Spend: 0 + 0 + 1 grid (76 cells x 300; floor). Consumed backlog-W199 removed; spawned W216 to BACK. Backlog 17. Synthesis R36 clock: 2/5.
- W216 (C, sandbox): phantom-proof counters — bounded-reset rules (decrement, per-window threshold, serves-since-up clock) vs consecutive-counting under misleading phantoms; re-test S8 (does any counter let patience survive fake progress); false-positive-progress audit of trail counters.
