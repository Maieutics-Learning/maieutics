# U42-ARMB prereg v1.1 — neutralize-collapse probe (Lippl 09 decider; measurement only)
Battery: 3x NEEDS-PATCH → pins P1a–P1c applied (difficulty guard, c0-divergence
veto, family-grace two-trunk rule). Full battery in
src/evidence/decomp/fresh-eyes-self-u42-armb-3x-results.md.
Rejected: continuous-gradient redefine (scope creep on adjudicated binary Arm-B),
miner-identity interaction add-on (A7 already tested boot flag), c0 hard-void
(overstrong), threshold rewrite (tight bars defended; guard handles noise).

Cause: U39 left 09 MIXED (B6 COMPRESSION 3/3 + A7 CLEAN: compression without an
identified single-feature leak). The debate-09 adjudication requires the
neutralize arm: if neutralizing the top shortcut candidate collapses compose,
architecture track is FORCED; if accuracy is invariant, kernel/shortcut theory
is FALSIFIED for this bench (failure = binding-dynamics, U37-style).
A7's top candidates: qk==k overlap flag (and qk/k/v identity). Neutralize =
force qk!=k (overlap-off) vs force qk==k (overlap-on), y-balanced.

Filed inputs (read-only): best u34 trunk u34-c2-s0 P (+ c0-s0 control P), stack
pin 258d2f06. CPU/in-worker. NO training, NO opt, forward reads only. NO PUSH.

## Probes (R=3 row-gen seeds; trunks T1 = u34-c2-s0 (B4 pick), T2 = best-accTwo
u34-c1 seed, C0 = u34-c0-s0; y-balanced 250x4 O + 250x4 N each)
For each trunk: gen rows via inSeqGenShift; split O (qk==k) / N (qk!=k); per
y-class first 250 each. Round-2 accuracy per condition (vhat round-1, x2m,
mean-logits pick-max) + round-1 scr per condition (difficulty covariate).
New ledgers d-newai-self-u42-armb-{t1,t2,c0}-s{seed}.json (full trunk path in ledger).

## Bars (pre-filed; quorum 2/3 row-seeds per trunk; P1a-P1c)
- Per trunk: D = accO - accN. IRRELEVANT if |D| <= 0.03; LOAD-BEARING if N worse
  by D > 0.10; else gray.
- P1a difficulty guard: |scrO - scrN| > 0.05 -> that trunk
  DIFFICULTY-CONFOUNDED (excluded from decision).
- Decision (T1 primary): T1 LOAD-BEARING -> PROVISIONAL-FORCED; T2
  LOAD-BEARING -> FORCED (incentive family dies); else PROVISIONAL (family
  gated-shut, new instrument owed). T1 IRRELEVANT + C0 IRRELEVANT -> FALSIFIED
  (kernel theory out; T2 LOAD-BEARING instead -> DIVERGENT -> INCONCLUSIVE).
  T1 IRRELEVANT + C0 LOAD-BEARING -> CONTROL-DIVERGENT -> INCONCLUSIVE.
  T1 gray, or T1 excluded -> FINAL-INCONCLUSIVE (filed, no re-sample;
  different-instrument re-probe allowed).

## Verdict d-newai-self-u42-verdict.json: per-trunk outcomes + 09-RESOLVED
(FALSIFIED / FORCED / INCONCLUSIVE) + license update for the 12-arm table.
