# Hard assembly v1.1 (user-countersigned 2026-11-22; agent approval: this file)

## What do I want to find out
v10 verdict: FRAGMENT-FAIL — B-only's one-pass forward already bridges both
hops (DIRECT 0.53-0.61), so stepping is redundant and S1 cannot pass. The flat
circuit likely keys on the single doubled token (salience, query-blind per v10
diag sens ~0.27). If the flat gets K doubled tokens and only the QUERY picks
the true chain, salience dies — and stepping becomes REQUIRED, not redundant.
Do the composed fragments (A=step-1, B=step-2, both present-but-degraded in AB
weights) recover the answer via DECOMP-1 where the flat fails?

## Research check
In-repo only (assoc stack, REUSES v10 train ledgers d-asm-train-{a,b,ab}-s{s}
— no retraining; new eval battery only). Proceeding.

## Design
HARD LINES (N=240 fresh/seed, rng 16900+s; 3 chains + optional plain pair):
true (a->m, m->4+e); decoy1 (c1->d1, d1->4+f1); decoy2 (c2->d2, d2->4+f2);
[50% plain (g,4+h)]. Query a, answer e. Query-key a appears as pair-key exactly
once (sub1 well-defined 1-hop lookup); mid m appears as pair-key exactly once.
Decoy di may collide with other keys (accepted symmetric noise, filed; chance
stays 0.25 since e uniform). 6-7 pairs/line (longer than v10's 4-5 — harder in
the intended direction; length hits all arms equally).
ARMS: none new — evaluate filed v10 tutors (a/b/ab x s0-2) on hard lines:
DIRECT / DECOMP-1 / sub1==mid / oracle-m1 follow (same cores as v10).
BARS (preregistered):
- H0 (flat blocked): B-only DIRECT <= 0.35, quorum 2/3 (validates hardness —
  the v10 flat circuit dies among decoys).
- H1 (stepping required + works): AB DECOMP-1 > 0.40 AND AB DECOMP-1 >
  max(singles DECOMP-1) + 0.15, quorum 2/3.
Descriptive: A-only sub1 on hard lines (predict stays ~0.9 — query unique, so
step-1 survives decoys); B-only oracle (predict stays ~0.8); query-sensitivity
(predict RISES above v10's 0.27 — the query now disambiguates; if it stays low
while H1 passes, the composition is still query-blind and the mechanism needs
re-thinking — filed tripwire on the interpretation, not the bar).
VERDICT: ASSEMBLES (both) / FLAT-SURVIVES (H0 fail — salience scales, stepping
moot) / STEPS-FAIL (H0 pass, H1 fail — even required stepping doesn't compose).

## Expectation (scored at verdict)
H0 PASS (3 doubled tokens kill the salience heuristic). H1 PASS (AB steps
through: A-skill resolves a->m among decoys, B-skill follows m->e; DIRECT stays
low — the dissociation v10 failed to produce). Honest 50% on H1: v10 says
stepping adds nothing, but v10 never REQUIRED it.

## Pre-mortem
Strongest objection: decoys also kill sub1 (A-skill degrades under 6-7-pair
lines — length OOD, never trained past 3 pairs) — answered: H1 fail with
A-only sub1 collapsed = length bound, not composition failure (filed as such;
B1 long-regime 0.78-0.83 says mild degradation, not collapse).
Most likely failure: FLAT-SURVIVES (the circuit is already query-conditional
2-hop, not salience — that would PROMOTE the flat circuit from heuristic to
real compiled 2-hop, a finding, not a null).

## Nearest-failure
assembly-v10 (differs: single doubled token, flat sufficient; here decoys force
query-dependence. Same tutors, new battery — pure isolation of the hardness
variable).

## Cost
9 evals on filed tutors (~min), resume-safe.

## Ledgers
src/evidence/decomp/d-asm11-eval-{a,b,ab}-s{s}.json, d-asm11-verdict.json.
Driver: assembly-driver.js (genHardLine, runAsm11Eval).
