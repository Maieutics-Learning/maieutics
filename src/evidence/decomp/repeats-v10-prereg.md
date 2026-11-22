# Repeats v1.0: re-roll the close calls (user-ordered 2026-11-22; agent approval: this file)

## What do I want to find out
User: "run each probe multiple times — lower the chance a bad roll gets us."
Every filed probe battery is ONE roll of lines per (arm, model-seed). Which
verdicts survive three rolls? Target the close calls; confirm-or-flag each.

## Research check
In-repo only (filed tutors; pure re-evals, no training). Proceeding.

## Design
R=3 rolls per (battery, arm, seed), fresh streams (offsets +500/+1000 from the
filed stream), same N as filed. One rollup ledger per (battery, arm, seed)
with per-roll + mean + spread; bars re-scored on MEANS.
COVERAGE (close calls first):
- probe-v10 (streams 17000+s+r*500, N=240): C2 |occStep1−base|<=0.10 (s0 margin
  0.012!); promotion numbers base/decoyQ; occSrc sanity.
- probe-v11 (17100+s+r*500, N=400): D1 halves (occNon<=0.35: s1 margin 0.034),
  D2 baseNon>0.40 (s2 margin 0.007!).
- asm11 (16900+s+r*500, N=240): H0/H1 (decisive, expect CONFIRMED).
OUT OF SCOPE (filed reason): pin-v11 repeats need retraining (models unsaved;
only metrics filed) — margins there are comfortable (B3 s0 0.46 vs 0.35,
SE~0.035). Earlier programs' verdicts rest on 0/3 or quorum-unreachable
margins; no bar is within a roll of flipping (novel B3 s0 0.335 vs 0.35 needs
quorum it cannot reach: s1/s2 at 0.19/0.23).
RULE: a flag fires iff a roll-MEAN crosses a bar opposite to the filed verdict
on a quorum-relevant arm (→ amendment owed). Else CONFIRMED (even if single
rolls wobble — wobble is reported as spread, the verdict stands on means).
VERDICT ledger: d-repeats-verdict.json {per-call: rolls, mean, spread,
status: CONFIRMED/FLAGGED}.

## Expectation (scored at verdict)
All CONFIRMED (patterns replicate; s0-C2 and s2-D2 means stay on the filed
side with spread reported). 70%.

## Pre-mortem
Strongest objection: a flag fires on D2 or C2 (means cross) — answered: that
IS the system working (user's bad-roll insurance pays out); file the
amendment, revoke/soften the verdict line, say so plainly.
Most likely outcome: spreads ~±0.03-0.05, means track filed numbers, no flags.

## Nearest-failure
probe-v11 (differs: one roll per cell; here the roll itself is replicated).

## Cost
27 rollup batteries ~ 33k forwards (h48) ~ 20-30 min, resume-safe.

## Ledgers
src/evidence/decomp/d-{probe,probe11,asm11}-R-{arm}-s{s}.json,
d-repeats-verdict.json. Driver: assembly-driver.js (runProbeEvalR,
runProbe11EvalR, runAsm11EvalR).
