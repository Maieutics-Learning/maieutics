# Wave 312 note (execution; backlog-W265 dead-man reset, sandbox)

STOP RULE: stopped after dead-man K-grid (hybrid-triggered receipt +
dm400/dm700/dm1000 pure scheduled, 6 seeds, 24 runs; receipt maxDiff 0 vs
w231-hybrid). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch
(vendored w248 verbatim + 1 added branch). Clock: R49 4/5. Pre-reg scored:
(a) CONFIRMED-stronger (b) CONFIRMED-stronger (c) CONFIRMED (d)
REJECTED-as-stated, REFINED-honestly.

## Direct: scheduled amnesia beats the trigger; K=700 is the interior optimum

A2 excess means: hybrid 2.345, dm400 0.76, dm700 0.465, dm1000 1.467.
Dead-man wins A2 on 6/6 seeds at K=400 (a) and wins TOTAL on 6/6 (b) —
the A1 needless-reset cost is real but tiny (dm400 mean exA1 0.45 vs hybrid
0.353: +0.1), and dead-man even helps in B (dm400 exB 3.04 vs 3.99:
flushing stale A1 estimates right after D1 pays immediately). Interior
optimum (c): dm700 best-total on 4/6 seeds, dm400 on 2/6, dm1000 never —
K=1000 is too sparse (B blows to 4.91, transients on 2/6) and K=400
over-resets; K=700 sits in the valley. (d) as stated is REJECTED: dm400's
5 scheduled resets are NOT sparser than hybrid's ~1.2 alarms (0/6). The
honest refinement: scheduled resets are not false alarms — they are
budgeted. Dead-man A1-phase needless resets are deterministic {1,1,0} for
K={400,700,1000} vs the range-gate's stochastic A1 FAs (s22 fires in A1);
dm700 matches the trigger's A1 count (1=1) while cutting A2 by 5x. Price
tag: +1 scheduled A1 reset buys -1.9 A2 excess. Own the exception: dm700
s66 exB=8.25 + transient — the t=700 reset lands exactly on the D1 drift
boundary, re-estimating on a split-phase window; boundary-phased resets
can backfire inside the drift they bracket.

Verdict: USED-strong (6/6 A2 + 6/6 total + interior optimum + honest (d)
inversion + boundary exception owned + receipt). No precursor, no conflict.

## Tangential: the gain is amnesia, not convergence (0-spend)

settleA2 (first audit at oracle-post cfg) is null on 22/24 runs — dead-man
wins A2 WITHOUT ever reaching the oracle-post config. The mechanism is not
"faster convergence to the right answer" but "periodic amnesia prevents
stale-config lock-in": the estimator after D2 sits in a B-phase local
optimum, and only memory destruction moves it. Rule: when the failure mode
is lock-in rather than slowness, budget forgetting, not learning speed.
W282 tests scheduled+triggered (does adding the range-gate on top of dm700
catch the s66-B boundary blowup, or does the trigger just add FAs back).
Spawned W282 (combo guard: dm700 + range-gate x seeds{11..66}; A2 vs pure
dm700; s66-B retest; FA-count vs dm700-scheduled; does the gate earn its
alarms or merely spend them).
