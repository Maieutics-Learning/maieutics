# Wave 284 note (execution; backlog-W242 strand-mechanics, sandbox)

STOP RULE: stopped after 180-run strand grid (SGD-pow2 LR{.05,.1,.15,.2}[+.2-clip]
+ Adam-pow3 LR{.01,.05,.1,.2}, 20 seeds each, W225 seeds; per-step approach-step
+ NaN-onset + 4 exemplar trajectories). 1 direct + 1 tangential below. Spend: 0
search, 0 fetch. Clock: R44 FULL (5/5 — synthesis next). Pre-reg scored: (a)
CONFIRMED (b) PARTIAL (c) CONFIRMED (d) CONFIRMED (e) REJECTED-replaced.

## Direct: the trap is temperature, not speed

Receipts (a): A replicates W225 exactly (flip 20/20, 16 diverged, 2 collapsed
= W225's "strand 2", 2 settled) — including W225's s=9 artifact, owned: that
20th "flip" is a= -Infinity typed at the REC sample (overflow, not crossing).
One of W225's 20 flips was never a flip. (b) PARTIAL: NaN-onset post-flip
15/16 (median 700, range 8–1255); the exception is the fastest diverger
(pre-flip blowup at step 8) — speed kills before crossing, once.

Rescue (c) CONFIRMED-clean: grad-clip turns LR.2 from 16-casualty chaos into
20/20 crossed-settled, 0 NaN — arrivals pinned at the clip bound (.2 all
runs). Creep (d) CONFIRMED: Adam-pow3@.01 strands 20/20 arriving at .0025
(LR/4 — normalization with inconsistent micro-signs creeps quarter-speed).

Speed gate (e) REJECTED (AUC .781, overlap both sides): the killer evidence
is graded, not marginal — Dsgd05 dies arriving at .06 while Dsgd15 crosses
20/20 arriving as low as .004; and Dadam05 splits 8/12 at a FIXED arrival
band (.023–.035). Same entry speed, opposite fates, twice over. Replacement:
temperature. Post-entry LR-noise decides — LR.05 settles INTO the trap and
dies, LR.15 kicks THROUGH it (18 settled + 2 collapsed, 0 NaN), LR.2 mostly
blows up after crossing. Arrival speed is neither necessary nor sufficient;
escape energy is. The zero-trap reads like depth, behaves like temperature.

Verdict: USED-strong (exact replication + artifact owned + clean rescue +
creep measured + speed hypothesis killed with graded replacement). No
precursor, no conflict.

## Tangential: within-cell splits beat between-cell ladders (0-spend)

The ladder (LR.05 vs .15) suggests temperature; the Dadam05 8/12 split at
fixed arrival PROVES speed insufficient — no cross-cell confound available
(same opt, LR, mode, arrival band; only post-entry noise differs). A
hypothesis dies fastest to variance it cannot see inside its own cell.
Rule: when a ladder supports a mechanism, check the within-cell split first
— if fate varies where the mechanism's variable doesn't, the variable is
wrong and the ladder was circumstantial. W259 varies the actual variable
(noise at fixed LR).
