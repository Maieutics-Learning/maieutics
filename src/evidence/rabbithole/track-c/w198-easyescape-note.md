# Wave 198 note — backlog-W170 easy-fixed-escape + delay-price (calculator, executed)

STOP RULE: stopped after ledger-cell calculator + E-sensitivity sweep (no world rebuilt — the bound attempt failed honestly on microstructure grounds; rebuild spawned, not built). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (cells are ledger data W157/W178; computation is the map grid + sensitivity sweep). Clock: R30 3/5. Tag note: backlog says sandbox; delivered calculator — the simulation it would run needs the lost microstructure (see bound section).

## Direct: 2D policy map; the easy conditional closes via insensitivity

Cost model (escape numeraire): cost = esc + r*fq + d*delay (r = falseQ price in escape units — validated: framing reproduces W178's r* .571/.20/.708 EXACTLY). Script: scratch/track-c/w170-policymap.js.
- EASY: seq(t.5) wins iff d*5.7 > (.002-E) + .03*r. Breakeven d* ~.0053*r/wait (≈ 1 falseQ per 190 waits), nearly independent of E AND r-shape: E in [0,.002] moves d* by <=.0004 absolute (E=0: .00561, E=.002: .00526 at r=1). THE MISSING CELL IS DECISION-IRRELEVANT — the conditional closes without measuring E. Map: fixed wins only at d~=0 (any r) or r>=1 & d<=.005; everywhere else sequential.
- MED: t5 everywhere except high-r/low-d corner (r>=.708@ d=0 expanding with r; r=5 fixed until d=.05). r*=.708 vertical at d=0 ✓.
- HARD: three regions — t55 at low-r/low-d (r<=.2, d<=.005), t5 middle + high-d everywhere, fixed high-r/low-d (r>=.708@d=0; r=5@d<=.02). At r=5,d=.05 delays dominate (.8 vs .135) and t5 wins despite the fq bill — sensible.
- Breakeven lines (exact): med d = -.0142+.02r (t5 dominates for d>=0 when r<.708); hard lines in script output.

The bound attempt (recorded, FAILED honestly): tried "fixed uses 8 samples vs sequential ~2.3 ⇒ E <= .002". Direction depends on LOST microstructure: expanding-window running mean ⇒ sequential had 6 extra chances ⇒ E >= .002 (INVERTED); trailing-window ⇒ E <= .002. Cannot bound without the rule. Transient-shift loophole compounds it (fixed's late window can miss recoveries sequential catches). So: closure via INSENSITIVITY (E-robust over an order of magnitude: even E=.01 gives d*=.0039 vs .0053 — same decision), not via bound. The failed bound stays in the trail so nobody re-tries it blind.

Verdict: USED (map + validated framing + two-way closure). No precursor, no conflict.

## Tangential: close conditionals by sensitivity before measurement (0-spend, reasoning only)

The missing E cell looked load-bearing (W178: "justify iff E-.002 > r*.03") but the sensitivity sweep shows the decision never comes within an order of magnitude of needing it. Generalize: before funding a measurement, sweep the decision over the parameter's PLAUSIBLE RANGE — if the argmin doesn't move, the cell is trivia, not debt. The ledger's open measurements should each carry a value-of-information note (how much would the answer have to surprise us to flip anything?). W176/W177/W181 (pending replications) pass this audit trivially (they gate adoptions); E failed it. Price the question, not just the answer.

## Spend / queue

- Spend: 0 + 0 + 1 calculator grid (floor; no simulation). Consumed backlog-W170 removed; spawned W187 to BACK. Backlog 17. Synthesis R30 clock: 3/5.
- W187 (C, sandbox): tripwire-world rebuild — persistent-vs-transient shift microstructure matching ALL W157 cells (delay-2.3 + falseQ-.03 + escape cells simultaneously); measure E; test bound direction; re-derive map if cells shift (they won't — calculator stands, world is for the NEXT tripwire question).
