# Wave 274 note (execution; backlog-W233 survival frontier, sandbox)

STOP RULE: stopped after 54-cell grid (pf{.01,.02,.03} x PL{2,4} x S{4,6,8} x
{window,decrement,consec}, misleading phantoms, 300 trials). 1 direct + 1
tangential below. Spend: 0 search, 0 fetch (vendored w216 rig verbatim).
Clock: R43 1/5. Pre-reg scored: (a) CONFIRMED (b) REJECTED-as-stated (c)
CONFIRMED (d) CONFIRMED.

## Direct: the frontier is phantom-length, not rate or patience

Survival map (bounded counters, cov≥.9): S4 survives 18/18 (all 1.0). S6 survives
18/18 (worst .99). S8 survives 8/12 — dying ONLY at PL4 × pf{.02,.03}
(.883/.877/.70/.683); at PL2 S8 holds ≥.97 even at pf.03. (a) CONFIRMED (frontier
in-grid with room); (b) REJECTED-as-stated (S8 dies in 4 cells, not "everywhere
at pf≥.02" — PL2 saves it throughout; rate alone never kills).

(c) Mid-patience survives everywhere S8 dies: S4/S6 ≥.99 in all 4 S8-death cells
(4/4, bar was 3) ✓. The answer to "does mid-patience survive where S8 dies" is
yes, unanimously — patience S≤6 is survivable at every pressure in-grid.

(d) consec never best ✓ — strictly worst in all 18 cells (S8-consec collapses
.863→.353 across the grid; S4/S6-consec survive but always below bounded).
W253's ordering (decrement≈window>clock>consec) holds on the finer grid.

Mechanism: phantom LENGTH is the killer, not rate — long phantoms + slow veto =
burned serve budget (covers=1 fake signals keep resetting stall during mislead;
CAP=120 exhausts before coverage). S8 costs ~2× serves even where it survives
(52–65 vs 94–117) — the frontier has a cost gradient under the cliff. W253's "no
survival at pf≥.05" scoped: at pf.02–.03 survival is the NORM for S≤6; S8's
death needs long phantoms too.

Verdict: USED-strong (frontier mapped + PL-mechanism + W253 scoped + ordering
held). No precursor, no conflict.

## Tangential: the axis you didn't sweep is the map's title (0-spend, reasoning)

W253 swept rate × length-coarse and concluded "patience doesn't survive"; this
wave swept rate × length-fine and the map is titled by LENGTH. The frontier was
always PL — the coarser grid just couldn't resolve it. Grids conclude in the
axes they sweep; the missing axis writes the correction. Rule: every "X doesn't
survive" verdict ships the unswept axes beside it (here: finer PL, bigger CAP).
Spawned W250 accordingly (CAP-doubling = budget-vs-veto adjudication + PL8
extension).

## Spend / queue

- Spend: 0 + 0 + 54 cells x 300 trials (floor). Consumed backlog-W233 removed;
  spawned W250 to BACK. Backlog 17. Synthesis R43 clock: 1/5.
- W250 (C, sandbox): budget-vs-veto — CAP{120,240} x S8 x PL{4} x pf{.02,.03}
  (does doubled budget rescue S8: exhaustion vs veto-failure?); PL{8} x S{4,8}
  x pf{.02} (frontier extends in PL?).
