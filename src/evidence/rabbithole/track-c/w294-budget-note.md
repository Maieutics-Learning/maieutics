# Wave 294 (execution; backlog-W250 budget-vs-veto, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).

- DIRECT: vendored w233-frontier.js runTrial+cell verbatim, CAP parameterized (const->let).
  Grid: CAP{120,240} x S{8} x PL{4} x pf{.02,.03} + PL{8} x S{4,8} x pf{.02}, x 3 counters
  (window/decrement/consec), 300 trials/cell, seeds paired with W233 (seed0 ignores PL and CAP).
  24 cells in scratch/track-c/w250-grid.json (script w250-budget.js).
- HARNESS CHECK (d): all six CAP120 S8/PL4 cells reproduce W233 EXACTLY
  (.883/.877/.547 @pf.02; .700/.683/.353 @pf.03) — paired CAP240 comparison is clean. HOLDS.
- RESCUE (a): CAP240 takes ALL FOUR S8/PL4 cells to pCover=1.000 (.883->1, .877->1, .700->1, .683->1).
  S8's failure at CAP120 was pure budget EXHAUSTION, not veto-failure. HOLDS strongly.
- CONSEC (b): predicted unrestorable (structural veto-failure) — WRONG, informatively: consec goes
  .547->1.000 @pf.02 and .353->1.000 @pf.03 under CAP240. Even the worst counter's failure is exhaustion;
  at pf<=.03 NOTHING vetoes, everything just needs time (consec needs 119.9-127.3 serves — barely over
  the 120 budget, which is why it looked structural). Pre-reg FAILS in the collapsive direction: the
  exhaustion/veto distinction does not exist at these pressures.
- PL FRONTIER (c): at CAP120/PL8/pf.02, S4 = 1.000 in all 3 counters (61-70 serves, fast) where
  S8 = .627/.620/.350 — the frontier EXTENDS in PL (mid-patience survives longest phantoms where S8
  dies). At CAP240 everything is 1.000 (nUp=9 everywhere): budget moots patience entirely. HOLDS.
- PRICE OF RESCUE: wall 189-220 at CAP240 vs ~186-194 already spent failing at CAP120 — rescue costs
  only +2-15% wall over the failing spend (the failures had nearly finished; mean serves 106-117 of
  120). Consec's rescue is priciest (207-220 wall) but still modest. S8/PL8 rescue: wall 205-223.
- Verdict: USED-strong (w294-budget-note.md is this file). Spawned W267 (rescue price curve).
- TANGENTIAL (reasoning, 0 spend): resource-rationality reading — the S-knob (patience) only matters
  under scarcity; with budget >= ~130 serves the optimal-S question dissolves (all counters 1.000,
  nUp saturated at 9). The whole W233 frontier was a budget artifact, not a policy ordering: rank
  counters by what they do under scarcity, and the ranking inverts the moment scarcity lifts. Any
  downstream rule that bakes in "consec is worst" without conditioning on budget is overfit to CAP=120.
- Spend: 0 + 0. Clock: R46 4/5.
