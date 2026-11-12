# Wave 234 note — backlog-W200 two-windows test (bench, executed)

STOP RULE: stopped after 30-run grid (5 arms x 6 seeds, 400 steps, 7-pt trajs). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (w183 rig + start-delay schedules; live-page TinyNN). Clock: R36 3/5.

## Direct: either window suffices, confirmed both directions; s10 flags aux-toxicity

- A late-only (OFF 0-150, ON 150+): 6/6, mean .992 — ignition support ALONE suffices, setup window entirely skipped; flat ~.5 to 200, jump at 250. s10 ignites (.9867). Setup is sufficient, not necessary. ✓
- B withdraw (ON 0-250, OFF 250+): 6/6, mean .937 — holds to 400 (worst s10 .87, s7 .8933; erosion mild). Ignition support need is TRANSITORY; presence can lapse after the window. ✓
- E G-replicate: 6/6, mean .969 — bit-exact mean replication of W214 (.969). The rig is sound; everything else is signal.
- D earlyRestore (OFF 50-100, ON 100+): 5/6, mean .971 — only s10 fails (.8333: ignites .9767 at 200, then ERODES below threshold under CONTINUOUS aux).
- C gap-only (ON 100-150 only): 4/6, mean .88 — s7 (.61) + s11 (.7567) fail; s10 IGNITES (.9733, holds after withdrawal).
- Two-windows verdict: setup-only 6/6 (W214) + ignition-only 6/6 (A here) — either suffices, confirmed both directions. Neither-neither softened: partial window (100-150) partially works (4/6) — sufficiency is graded, not binary.
- s10-aux-toxicity FLAG (single seed, not trumpeted): s10 ignites under late-only, gap-only, G, withdraw — fails ONLY under continuous-aux-from-100 (D). Pattern with W214 (s10 fails strong-aux-never): s10 needs aux in (100,150], harmed by aux outside it. n=1 — flagged for W217 adjudication, no mechanism claimed.

Verdict: USED with teeth (both-directions confirmation + graded-sufficiency nuance + exact replication + s10 flag). No precursor, no conflict.

## Tangential: flags compound — the same rule, second application (0-spend, reasoning only)

W232's flag rule (noisy result ships its adjudication) fires again unprompted: s10-toxicity is one seed in one arm — trumpet it and it's lottery-storytelling (cf W204's seed15/16 reshuffle lesson). The flag format — effect, n, adjudication design, no mechanism — is now used twice (prefix-AUC, s10-toxicity). Rules that fire twice unprompted graduate from practice to discipline: single-seed maximal surprises ALWAYS ship as flags.

## Spend / queue

- Spend: 0 + 0 + 1 grid (30 runs; floor). Consumed backlog-W200 removed; spawned W217 to BACK. Backlog 17. Synthesis R36 clock: 3/5.
- W217 (A, bench): s10-aux-toxicity adjudication — s10 x aux-duration {100-150, 100-200, 100+} x auxW {.5,1,2} (is more-aux worse for the setup-slow seed?); generality across seeds (toxicity s10-only?); flag resolves to mechanism or lottery.
