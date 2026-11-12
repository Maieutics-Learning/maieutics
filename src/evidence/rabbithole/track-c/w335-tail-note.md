# Wave 335 (execution; backlog-W284 serves-tail anatomy, sandbox) 2026-11-12
STOP RULE: stopped after tail anatomy on saved seeds (9 failing cells x 300
trials: CAP=2000 serves_needed + CAP=150 probe + capped-150+retry walls;
receipt 0 vs w267). 1 direct + 1 tangential below. Spend: 0 + 0 + run.
Script scratch/track-c/w284-tail.js; grid scratch/track-c/w284-grid.json.

## Direct: the tail is 100% need-12-starved, and retry pays the climb twice

- RECEIPT: serves_needed p50/p90/p99/max reproduce w267-grid det exactly (0).
- (a) CONFIRMED-STRONGER: 100% of >150 trials (96/96 across 7 cells; 2 cells
  have no tail) hold BOTH need-12 targets uncovered at serve 150 — samples
  unanimous n12=2 n6=0 n2=0 (one n12=2 n6=6). The tail is not a mixture; it is
  one address: the two e=1.5 need-12 targets, which need K≥12 plus high bias
  while phantoms eat serves blind. Bar (≥70%) cleared at 100%.
- (b) CONFIRMED: corr(phantomShare, serves_needed) = .032–.076 — phantoms tax,
  never tail. Mean phantom share EQUALS the blind rate cell by cell
  (.082/.078/.079 vs .02×4=.08; .112/.113/.108 vs .03×4=.12; .152/.143/.146
  vs .02×8=.16): uniform salt, no clustering, no interaction with the tail.
- (c) REJECTED-WITH-MECHANISM: capped-150+retry wall LOSES to full-budget wall
  in all 7 tail cells (+1.1 to +29.1; worst consec 252.3 vs 223.2) and ties the
  2 tailless cells. Retry discards the cure: escalation (K, bias) is
  cumulative within a run, and the need-12s finish BECAUSE the run climbed to
  K≥12 — restarting at K=2/bias=.05 re-pays the whole climb for a fresh world
  with the same two hard targets. The tail is structural starvation the run is
  already fixing, not bad luck a re-draw would dodge.
- SCOPE-AMENDMENT to W315's tangential rule: "cap-and-retry the rest" holds
  only when progress is memoryless. With cumulative escalation, capping
  destroys the accumulated fix — budget the 99th percentile and let it run.
  The .99 table (136–177) stands as the product; the retry column is struck.
- Verdict: USED with teeth (w335-tail-note.md is this file). Spawned W301
  (escalation-carryover retry: keep K/bias across the cap — is the retry loss
  all re-escalation, and what does carryover cost where escalation overshoots).

## Tangential: restarts are a bet on memorylessness — price the memory first (0-spend)

Every retry policy smuggles a model of what a fresh start keeps. Capped-retry
bets the run's state is worthless (re-draw beats resume); here the state IS the
product (escalated K/bias aimed at known-hard targets), so the bet loses by
exactly the re-climb. Rule: before pricing cap-and-retry, name what the cap
throws away — if the run accumulates anything aimed at the tail (estimates,
escalations, caches, warmup), the retry wall owes a re-accumulation term, and
that term usually exceeds the tail it was meant to cut. W301 measures the term
directly (carryover retry: same caps, kept K/bias — the difference is the
price of the climb).
