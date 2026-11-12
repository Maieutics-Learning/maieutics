# Wave 271 note (execution; backlog-W231 double-drift A->B->A, sandbox)

STOP RULE: stopped after 18-arm double-drift grid (D1=700/D2=1400, frozen-(30,.15)
vs hybrid vs range x 6 seeds, T=2000, phase-bill buckets + alarm times + per-phase
settle). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (vendored w214
online() + second drift). Clock: R42 4/5. Pre-reg scored: (a) CONFIRMED-hugely
(b) REJECTED (c) REJECTED.

## Direct: the return trip defeats every adaptive arm; the freezer wins by never moving

(a) Hedge-becomes-anchor CONFIRMED massively: frozen exB ≈ 0 (−0.1..0.16, wins
phase B outright) → exA2 ≈ 2.5–2.7 (ratio ~∞; exA2 ≈ exA1 to the decimal — frozen
never adapts, A2 = A1 exactly, finalCfg stuck 16,0.02 through all of A2). The
anchor is visible in the config, not just the bill.

(b)(c) REJECTED, with the mechanism: hybrid alarms exactly ONCE (5/6 seeds @800,
first audit into B; s22 false-alarms @500 then @1200) and NEVER at/after the
1400 return — no seed resets twice. Without the second reset, hybrid rots in
B-config through A2 (exA2 0.77–2.92 ≈ frozen's 2.5–2.7; (c) no hybrid advantage:
means ~2.5 vs ~2.45). Worse: hybrid LOSES phase B it was built for (exB 2.1–8.3
vs frozen ~0) — the 800 reset wipes A-memory, relearning is slow (settleB 2–5 vs
frozen 1–3 which starts at truth), and s22's pre-drift false alarm is the worst
cell in the grid (exB 8.29). Transients 0/18 everywhere (still nobody trips the
R>60/b>1 flag — owned non-finding).

Mechanism: the range gate goes blind on the return. Post-800-reset audits
accumulate B-volatility (relearning bills swing), widening the [lo,hi] band until
the B→A bill-drop hides inside it. The detector adapts to the very volatility
that should trigger it — band-adaptation blindness. One seed (s66 hybrid, no
second reset) re-settles via wLS forgetting alone (settleA2=4, exA2 0.77) —
slow leak beats no detector, once in six.

Inversion ledger: under single drift (W251) hybrid ≥ frozen; under double drift
frozen ≥ hybrid in BOTH post-first phases (B: ~0 vs 2–8; A2: tie ~2.6). Returning
worlds favor the never-mover: transition costs dominate when every adaptation
gets unmade. The fragile freezer is the robust policy iff the world comes back.

Verdict: USED-strong (anchor-collapse + unanimous non-detection + inversion with
mechanism). No precursor, no conflict.

## Tangential: detectors owe their miss rate, not just their hit rate (0-spend, reasoning only)

Every W-trail detector story counts alarms (hits); this wave's story is six
identical MISSES at 1400. A detector validated only on hits is half-specified —
the miss at the return is structural (band widens into the drop), not noise, and
no hit-count would have caught it. Rule: every adopted detector ships its miss
ledger beside its alarm count (which transitions it cannot see, and why).
Spawned W248 accordingly (return-blindness autopsy on audit trails: band-width
vs drop-size per audit; which rule WOULD have fired).

## Spend / queue

- Spend: 0 + 0 + 18 arms x 2000 windows (floor). Consumed backlog-W231 removed;
  spawned W248 to BACK. Backlog 17. Synthesis R42 clock: 4/5.
- W248 (C, sandbox): return-blindness autopsy — same 18 arms + per-audit
  bill/cfg trails (reproduction with trails, not new conditions): band-width vs
  B→A drop-size per audit at 1400; threshold sweep on saved trails (which rule
  fires: narrower band, CUSUM, level-trigger?).
